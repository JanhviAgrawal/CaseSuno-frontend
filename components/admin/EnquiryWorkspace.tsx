"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  ExternalLink,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Send,
  StickyNote,
  UserRound,
} from "lucide-react";
import {
  EVENT_LABELS,
  PRIORITIES,
  PRIORITY_META,
  STATUSES,
  STATUS_META,
  formatINR,
  waLink,
} from "@/lib/status";
import { Card, PriorityBadge, StatusBadge, formatDate } from "./ui";

export interface WorkspaceLawyer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialization: string;
  city: string | null;
  active: boolean;
}

export interface WorkspaceData {
  id: string;
  reference: string;
  category: string;
  description: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  language: string;
  status: string;
  priority: string;
  handling: string;
  feeAmount: number | null;
  feeNote: string | null;
  lawyerId: string | null;
  shareLawyerWithClient: boolean;
  createdAt: string;
  trackUrl: string;
  messages: { id: string; sender: string; body: string; createdAt: string }[];
  notes: { id: string; body: string; createdAt: string }[];
  events: { id: string; type: string; detail: string | null; createdAt: string }[];
  payments: {
    id: string;
    amount: number;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    createdAt: string;
    paidAt: string | null;
  }[];
}

const input =
  "w-full rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] px-3 py-2.5 text-sm text-[#1E1D1A] outline-none transition-all placeholder:text-[#9C9588] focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F1E1B] px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#1F5C50] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCD6C9] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#2C2A26] transition-all hover:border-[#1F5C50] hover:text-[#1F5C50] active:scale-[0.98] cursor-pointer";

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data: { error?: string } = {};
  try {
    data = JSON.parse(text);
  } catch {
    /* not JSON (e.g. a 404 or crash page) */
  }
  if (!res.ok) {
    if (res.status === 404 && !data.error) {
      throw new Error(`API route not found (404): ${method} ${url} — check the file exists in app/api/...`);
    }
    throw new Error(data.error || `Server error ${res.status} on ${method} ${url} — check the terminal running "npm run dev"`);
  }
  return data;
}

/** Open a tab synchronously (avoids popup blockers), navigate it after the API call succeeds */
function prepareTab(enabled: boolean) {
  const w = enabled ? window.open("about:blank", "_blank") : null;
  if (w) w.opener = null;
  return {
    go: (url: string) => {
      if (w) w.location.href = url;
    },
    cancel: () => w?.close(),
  };
}

function feeTemplate(lang: string, name: string, ref: string, amount: string) {
  if (lang === "hi")
    return `नमस्ते ${name}, CASE SUNO से संपर्क करने के लिए धन्यवाद। हमने आपके अनुरोध (${ref}) की समीक्षा कर ली है और अगले कदम में आपकी मदद कर सकते हैं। आगे बढ़ने के लिए कृपया CASE SUNO प्लेटफ़ॉर्म शुल्क ${amount} का भुगतान करें। यह शुल्क केवल हमारी केस समीक्षा और समन्वय के लिए है — वकील/पेशेवर की फीस आप और पेशेवर आपस में सीधे तय करेंगे।`;
  if (lang === "gu")
    return `નમસ્તે ${name}, CASE SUNO નો સંપર્ક કરવા બદલ આભાર. અમે તમારી વિનંતી (${ref}) ની સમીક્ષા કરી છે અને આગળના પગલામાં મદદ કરી શકીએ છીએ. આગળ વધવા માટે કૃપા કરીને CASE SUNO પ્લેટફોર્મ ફી ${amount} ચૂકવો. આ ફી ફક્ત અમારી કેસ સમીક્ષા અને સંકલન માટે છે — વકીલ/વ્યાવસાયિકની ફી તમે અને વ્યાવસાયિક સીધા નક્કી કરશો.`;
  return `Hello ${name}, thank you for reaching out to CASE SUNO. We have reviewed your request (${ref}) and can help you with the next step. To proceed, please pay the CASE SUNO platform fee of ${amount}. This fee covers our case review and coordination only — any lawyer/professional fees will be discussed directly between you and the professional.`;
}

const payLinkLine = (lang: string, url: string) =>
  lang === "hi" ? `सुरक्षित भुगतान और अपडेट के लिए: ${url}` : lang === "gu" ? `સુરક્ષિત ચુકવણી અને અપડેટ માટે: ${url}` : `Pay securely and view updates here: ${url}`;

const viewLinkLine = (lang: string, url: string) =>
  lang === "hi" ? `अपना अनुरोध यहाँ देखें: ${url}` : lang === "gu" ? `તમારી વિનંતી અહીં જુઓ: ${url}` : `View your request here: ${url}`;

export function EnquiryWorkspace({ data: e, lawyers }: { data: WorkspaceData; lawyers: WorkspaceLawyer[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [reply, setReply] = useState("");
  const [notifyReply, setNotifyReply] = useState(true);
  const [note, setNote] = useState("");

  const [amount, setAmount] = useState(e.feeAmount ? String(e.feeAmount / 100) : "");
  const [feeNote, setFeeNote] = useState(e.feeNote ?? "");
  const [payMsg, setPayMsg] = useState("");
  const [notifyPay, setNotifyPay] = useState(true);

  const [handling, setHandling] = useState(e.handling);
  const [lawyerId, setLawyerId] = useState(e.lawyerId ?? "");
  const [share, setShare] = useState(e.shareLawyerWithClient);

  const isPaid = e.payments.some((p) => p.status === "PAID");
  const paidPayment = e.payments.find((p) => p.status === "PAID");
  const assigned = lawyers.find((l) => l.id === e.lawyerId) ?? null;
  const amountNum = Number(amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError("");
    try {
      await fn();
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  const patch = (body: Record<string, unknown>) =>
    run("patch", async () => {
      await api(`/api/admin/enquiries/${e.id}`, "PATCH", body);
    });

  const sendReply = () => {
    if (!reply.trim()) return;
    const tab = prepareTab(notifyReply);
    run("reply", async () => {
      try {
        await api(`/api/admin/enquiries/${e.id}/messages`, "POST", { body: reply.trim() });
        tab.go(waLink(e.phone, `${reply.trim()}\n\n${viewLinkLine(e.language, e.trackUrl)}`));
        setReply("");
      } catch (err) {
        tab.cancel();
        throw err;
      }
    });
  };

  const requestPayment = () => {
    if (!amountValid || !payMsg.trim()) return;
    const tab = prepareTab(notifyPay);
    run("pay", async () => {
      try {
        await api(`/api/admin/enquiries/${e.id}/request-payment`, "POST", {
          amountRupees: amountNum,
          note: feeNote.trim() || undefined,
          message: payMsg.trim(),
        });
        tab.go(waLink(e.phone, `${payMsg.trim()}\n\n${payLinkLine(e.language, e.trackUrl)}`));
        setPayMsg("");
      } catch (err) {
        tab.cancel();
        throw err;
      }
    });
  };

  const addNote = () => {
    if (!note.trim()) return;
    run("note", async () => {
      await api(`/api/admin/enquiries/${e.id}/notes`, "POST", { body: note.trim() });
      setNote("");
    });
  };

  const saveHandling = () => {
    let status: string | undefined;
    if (isPaid && ["PAID", "IN_PROGRESS", "FORWARDED"].includes(e.status)) {
      if (handling === "IN_HOUSE") status = "IN_PROGRESS";
      if (handling === "LAWYER" && lawyerId) status = "FORWARDED";
    }
    patch({
      handling,
      lawyerId: handling === "LAWYER" ? lawyerId || null : null,
      shareLawyerWithClient: handling === "LAWYER" ? share : false,
      ...(status && status !== e.status ? { status } : {}),
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(e.trackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const referralText = (l: WorkspaceLawyer) =>
    [
      `CASE SUNO – Case referral`,
      `Ref: ${e.reference}`,
      `Category: ${e.category}`,
      `City: ${e.city || "-"}`,
      ``,
      `Summary:`,
      e.description,
      ``,
      e.shareLawyerWithClient
        ? `Client: ${e.fullName} · ${e.phone}${e.email ? ` · ${e.email}` : ""}`
        : `Client contact will be shared once you confirm you can take this matter.`,
      ``,
      `Hello ${l.name}, please reply to confirm your availability. Professional fees are to be agreed directly with the client.`,
    ].join("\n");

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      {/* ===== Top bar ===== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B655B] hover:text-[#1F5C50]">
            <ArrowLeft className="h-3.5 w-3.5" /> All requests
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="font-mono text-xl font-semibold tracking-tight">{e.reference}</h1>
            <StatusBadge status={e.status} />
            <PriorityBadge priority={e.priority} />
          </div>
          <p className="mt-1 text-[12.5px] text-[#8C8479]">
            {e.category} · Submitted {formatDate(e.createdAt)} · Language: {e.language.toUpperCase()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[11.5px] font-medium text-[#6B655B]">Status</label>
          <select
            value={e.status}
            disabled={busy === "patch"}
            onChange={(ev) => patch({ status: ev.target.value })}
            className="rounded-xl border border-[#DCD6C9] bg-white px-3 py-2 text-[13px] outline-none focus:ring-4 focus:ring-[#1F5C50]/10 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <label className="ml-2 text-[11.5px] font-medium text-[#6B655B]">Priority</label>
          <select
            value={e.priority}
            disabled={busy === "patch"}
            onChange={(ev) => patch({ priority: ev.target.value })}
            className="rounded-xl border border-[#DCD6C9] bg-white px-3 py-2 text-[13px] outline-none focus:ring-4 focus:ring-[#1F5C50]/10 cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="cs-slide-down rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="space-y-5 xl:col-span-2">
          {/* Request */}
          <Card title="Client request" icon={<MessageSquare className="h-4 w-4 text-[#1F5C50]" />}>
            <span className="inline-block rounded-full bg-[#E6EFEA] px-2.5 py-1 text-[11.5px] font-semibold text-[#1F5C50]">{e.category}</span>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[#2C2A26]">{e.description}</p>
          </Card>

          {/* Conversation */}
          <Card title="Conversation with client" icon={<Send className="h-4 w-4 text-[#1F5C50]" />} bodyClassName="p-0">
            <div className="max-h-[420px] space-y-3 overflow-y-auto px-5 py-4">
              {e.messages.length === 0 && (
                <p className="py-6 text-center text-[13px] text-[#8C8479]">No messages yet. Your reply will appear on the client&apos;s tracking page.</p>
              )}
              {e.messages.map((m) => {
                const mine = m.sender === "ADMIN";
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                        mine ? "rounded-tr-md bg-[#1F5C50] text-white" : "rounded-tl-md bg-[#F1EEE8] text-[#2C2A26]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p className={`mt-1 text-[10.5px] ${mine ? "text-white/70" : "text-[#8C8479]"}`}>
                        {mine ? "CASE SUNO" : e.fullName} · {formatDate(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#F0ECE4] p-4">
              <textarea
                value={reply}
                onChange={(ev) => setReply(ev.target.value)}
                rows={3}
                maxLength={4000}
                placeholder="Write a reply to the client (visible on their tracking page)…"
                className={`${input} resize-y`}
              />
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[12.5px] text-[#524E46] cursor-pointer">
                  <input type="checkbox" checked={notifyReply} onChange={(ev) => setNotifyReply(ev.target.checked)} className="h-4 w-4 accent-[#1F5C50]" />
                  Also open WhatsApp to notify the client
                </label>
                <button type="button" onClick={sendReply} disabled={!reply.trim() || busy === "reply"} className={primaryBtn}>
                  <Send className="h-4 w-4" /> {busy === "reply" ? "Sending…" : "Send reply"}
                </button>
              </div>
            </div>
          </Card>

          {/* Internal notes */}
          <Card title="Internal analysis & notes" icon={<StickyNote className="h-4 w-4 text-[#8A6A2E]" />} action={<span className="text-[11px] text-[#8C8479]">Never shown to client</span>}>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <textarea
                value={note}
                onChange={(ev) => setNote(ev.target.value)}
                rows={2}
                maxLength={4000}
                placeholder="e.g. Documents needed: sale deed, 7/12 extract. Likely civil matter — suggest property lawyer."
                className={`${input} resize-y`}
              />
              <button type="button" onClick={addNote} disabled={!note.trim() || busy === "note"} className={`${primaryBtn} sm:self-start`}>
                {busy === "note" ? "Saving…" : "Add note"}
              </button>
            </div>
            <ul className="mt-4 space-y-2.5">
              {e.notes.map((n) => (
                <li key={n.id} className="rounded-xl border border-[#F0E6CF] bg-[#FDF9F0] px-4 py-3">
                  <p className="whitespace-pre-wrap text-[13px] text-[#3F3A30]">{n.body}</p>
                  <p className="mt-1 text-[10.5px] text-[#9C8E6E]">{formatDate(n.createdAt)}</p>
                </li>
              ))}
              {e.notes.length === 0 && <li className="text-[12.5px] text-[#8C8479]">No notes yet.</li>}
            </ul>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-5">
          {/* Client */}
          <Card title="Client" icon={<UserRound className="h-4 w-4 text-[#1F5C50]" />}>
            <p className="text-[15px] font-semibold">{e.fullName}</p>
            <div className="mt-3 space-y-2 text-[13px] text-[#3F3F3B]">
              <a href={`tel:${e.phone}`} className="flex items-center gap-2 hover:text-[#1F5C50]">
                <Phone className="h-4 w-4 text-[#8C8479]" /> {e.phone}
              </a>
              {e.email && (
                <a href={`mailto:${e.email}`} className="flex items-center gap-2 break-all hover:text-[#1F5C50]">
                  <Mail className="h-4 w-4 shrink-0 text-[#8C8479]" /> {e.email}
                </a>
              )}
              {e.city && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#8C8479]" /> {e.city}
                </p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={waLink(e.phone, `Hello ${e.fullName}, this is CASE SUNO regarding your request ${e.reference}.`)} target="_blank" rel="noreferrer" className={ghostBtn}>
                WhatsApp
              </a>
              <a href={`tel:${e.phone}`} className={ghostBtn}>
                Call
              </a>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-[#DCD6C9] bg-[#FAF9F6] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8479]">Client tracking link</p>
              <p className="mt-1 truncate font-mono text-[11.5px] text-[#524E46]">{e.trackUrl}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={copyLink} className={ghostBtn}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                </button>
                <a href={e.trackUrl} target="_blank" rel="noreferrer" className={ghostBtn}>
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card title="Platform fee" icon={<IndianRupee className="h-4 w-4 text-[#1F5C50]" />}>
            {isPaid && paidPayment ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[13px] font-semibold text-emerald-800">Paid · {formatINR(paidPayment.amount)}</p>
                <p className="mt-1 text-[11.5px] text-emerald-700">
                  {paidPayment.paidAt && formatDate(paidPayment.paidAt)} · {paidPayment.razorpayPaymentId}
                </p>
              </div>
            ) : (
              <>
                {e.feeAmount && (
                  <p className="mb-3 rounded-xl bg-orange-50 px-3 py-2 text-[12.5px] text-orange-800">
                    Requested {formatINR(e.feeAmount)} — waiting for client payment.
                  </p>
                )}
                <div className="space-y-2.5">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8C8479]">₹</span>
                    <input
                      type="number"
                      min={1}
                      step="1"
                      inputMode="decimal"
                      value={amount}
                      onChange={(ev) => setAmount(ev.target.value)}
                      placeholder="Platform fee amount"
                      className={`${input} pl-7`}
                    />
                  </div>
                  <input value={feeNote} onChange={(ev) => setFeeNote(ev.target.value)} maxLength={300} placeholder="Internal fee note (optional)" className={input} />
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-[#8C8479]">Message to client</span>
                    <button
                      type="button"
                      onClick={() => setPayMsg(feeTemplate(e.language, e.fullName, e.reference, amountValid ? formatINR(amountNum * 100) : "₹___"))}
                      className="text-[11.5px] font-semibold text-[#1F5C50] hover:underline cursor-pointer"
                    >
                      Insert template ({e.language.toUpperCase()})
                    </button>
                  </div>
                  <textarea value={payMsg} onChange={(ev) => setPayMsg(ev.target.value)} rows={5} maxLength={4000} className={`${input} resize-y text-[12.5px]`} />
                  <label className="flex items-center gap-2 text-[12.5px] text-[#524E46] cursor-pointer">
                    <input type="checkbox" checked={notifyPay} onChange={(ev) => setNotifyPay(ev.target.checked)} className="h-4 w-4 accent-[#1F5C50]" />
                    Open WhatsApp with payment link
                  </label>
                  <button type="button" onClick={requestPayment} disabled={!amountValid || !payMsg.trim() || busy === "pay"} className={`${primaryBtn} w-full`}>
                    <IndianRupee className="h-4 w-4" /> {busy === "pay" ? "Sending…" : e.feeAmount ? "Update & resend request" : "Request payment"}
                  </button>
                </div>
              </>
            )}
            {e.payments.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-[#F0ECE4] pt-3">
                {e.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 text-[11.5px] text-[#6B655B]">
                    <span className="truncate font-mono">{p.razorpayOrderId}</span>
                    <span className={p.status === "PAID" ? "font-semibold text-emerald-700" : p.status === "FAILED" ? "text-rose-600" : ""}>
                      {formatINR(p.amount)} · {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Handling */}
          <Card title="Handling" icon={<Scale className="h-4 w-4 text-[#1F5C50]" />}>
            {!isPaid && (
              <p className="mb-3 rounded-xl bg-[#F5F1E8] px-3 py-2 text-[12px] text-[#6B655B]">
                Tip: forward the case after the platform fee is paid.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "IN_HOUSE", label: "Manage in-house" },
                { v: "LAWYER", label: "Forward to lawyer" },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setHandling(o.v)}
                  className={`rounded-xl border px-3 py-2.5 text-[12.5px] font-medium transition-all cursor-pointer ${
                    handling === o.v ? "border-[#1F5C50] bg-[#1F5C50] text-white" : "border-[#DCD6C9] bg-white text-[#2C2A26] hover:border-[#1F5C50]"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {handling === "LAWYER" && (
              <div className="mt-3 space-y-2.5">
                <select value={lawyerId} onChange={(ev) => setLawyerId(ev.target.value)} className={`${input} cursor-pointer`}>
                  <option value="">Select a lawyer…</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.specialization}
                      {l.city ? ` (${l.city})` : ""}
                      {!l.active ? " [inactive]" : ""}
                    </option>
                  ))}
                </select>
                {lawyers.length === 0 && (
                  <p className="text-[12px] text-[#8C8479]">
                    No lawyers yet.{" "}
                    <Link href="/admin/lawyers" className="font-semibold text-[#1F5C50] hover:underline">
                      Add lawyers
                    </Link>
                  </p>
                )}
                <label className="flex items-start gap-2 text-[12.5px] text-[#524E46] cursor-pointer">
                  <input type="checkbox" checked={share} onChange={(ev) => setShare(ev.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1F5C50]" />
                  Share lawyer&apos;s contact with the client (and client&apos;s contact in the referral)
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={saveHandling}
              disabled={busy === "patch" || handling === "UNDECIDED" || (handling === "LAWYER" && !lawyerId)}
              className={`${primaryBtn} mt-3 w-full`}
            >
              {busy === "patch" ? "Saving…" : "Save handling"}
            </button>

            {assigned && e.handling === "LAWYER" && (
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <p className="text-[12.5px] font-semibold text-indigo-900">{assigned.name}</p>
                <p className="text-[11.5px] text-indigo-700">
                  {assigned.specialization} · {assigned.phone}
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <a href={waLink(assigned.phone, referralText(assigned))} target="_blank" rel="noreferrer" className={ghostBtn}>
                    Send via WhatsApp
                  </a>
                  {assigned.email ? (
                    <a
                      href={`mailto:${assigned.email}?subject=${encodeURIComponent(`CASE SUNO referral ${e.reference}`)}&body=${encodeURIComponent(referralText(assigned))}`}
                      className={ghostBtn}
                    >
                      Send via email
                    </a>
                  ) : (
                    <span className="flex items-center justify-center text-[11px] text-[#8C8479]">No email</span>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card title="Timeline" icon={<Clock className="h-4 w-4 text-[#1F5C50]" />}>
            <ol className="relative space-y-3.5 border-l border-[#E8E4DB] pl-4">
              {e.events.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1F5C50] ring-1 ring-[#1F5C50]/30" />
                  <p className="text-[12.5px] font-medium text-[#1E1D1A]">{EVENT_LABELS[ev.type] ?? ev.type}</p>
                  {ev.detail && <p className="text-[11.5px] text-[#6B655B]">{ev.detail}</p>}
                  <p className="text-[10.5px] text-[#9C9588]">{formatDate(ev.createdAt)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}