"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { ArrowLeft, CheckCircle2, Lock, Mail, Phone, Send, ShieldCheck, UserRound, XCircle } from "lucide-react";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { CLIENT_STATUS, formatINR, type Status } from "@/lib/status";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

type L3 = Record<Language, string>;

const T = {
  title: { en: "Your request", hi: "आपका अनुरोध", gu: "તમારી વિનંતી" },
  reference: { en: "Reference", hi: "संदर्भ", gu: "સંદર્ભ" },
  submitted: { en: "Submitted", hi: "सबमिट", gu: "સબમિટ" },
  steps: [
    { en: "Submitted", hi: "सबमिट", gu: "સબમિટ" },
    { en: "Review", hi: "समीक्षा", gu: "સમીક્ષા" },
    { en: "Platform fee", hi: "प्लेटफ़ॉर्म शुल्क", gu: "પ્લેટફોર્મ ફી" },
    { en: "In progress", hi: "प्रगति पर", gu: "પ્રગતિમાં" },
    { en: "Resolved", hi: "हल", gu: "ઉકેલ" },
  ],
  messages: { en: "Messages from CASE SUNO", hi: "CASE SUNO के संदेश", gu: "CASE SUNO ના સંદેશા" },
  noMessages: {
    en: "No messages yet. Our coordinator will reply here soon.",
    hi: "अभी कोई संदेश नहीं। हमारे समन्वयक जल्द ही यहाँ उत्तर देंगे।",
    gu: "હજી કોઈ સંદેશ નથી. અમારા કોઓર્ડિનેટર ટૂંક સમયમાં અહીં જવાબ આપશે.",
  },
  fee: { en: "Platform fee", hi: "प्लेटफ़ॉर्म शुल्क", gu: "પ્લેટફોર્મ ફી" },
  feeInfo: {
    en: "This fee covers CASE SUNO's case review and coordination. Any lawyer/professional fees are discussed directly between you and the professional.",
    hi: "यह शुल्क CASE SUNO की केस समीक्षा और समन्वय के लिए है। वकील/पेशेवर की फीस आप और पेशेवर आपस में सीधे तय करेंगे।",
    gu: "આ ફી CASE SUNO ની કેસ સમીક્ષા અને સંકલન માટે છે. વકીલ/વ્યાવસાયિકની ફી તમે અને વ્યાવસાયિક સીધા નક્કી કરશો.",
  },
  pay: { en: "Pay securely", hi: "सुरक्षित भुगतान करें", gu: "સુરક્ષિત ચુકવણી કરો" },
  paying: { en: "Opening payment…", hi: "भुगतान खुल रहा है…", gu: "ચુકવણી ખુલી રહી છે…" },
  paid: { en: "Fee received — thank you!", hi: "शुल्क प्राप्त हुआ — धन्यवाद!", gu: "ફી પ્રાપ્ત થઈ — આભાર!" },
  payFailed: {
    en: "Payment could not be completed. Please try again.",
    hi: "भुगतान पूरा नहीं हो सका। कृपया फिर से प्रयास करें।",
    gu: "ચુકવણી પૂર્ણ થઈ શકી નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.",
  },
  payOff: {
    en: "Online payment is not available right now. Please contact us on WhatsApp.",
    hi: "ऑनलाइन भुगतान अभी उपलब्ध नहीं है। कृपया व्हाट्सएप पर संपर्क करें।",
    gu: "ઓનલાઇન ચુકવણી હાલમાં ઉપલબ્ધ નથી. કૃપા કરીને વોટ્સએપ પર સંપર્ક કરો.",
  },
  professional: { en: "Your assigned professional", hi: "आपके निर्धारित पेशेवर", gu: "તમારા નિયુક્ત વ્યાવસાયિક" },
  reply: { en: "Send a message", hi: "संदेश भेजें", gu: "સંદેશ મોકલો" },
  replyPh: { en: "Type your message…", hi: "अपना संदेश लिखें…", gu: "તમારો સંદેશ લખો…" },
  send: { en: "Send", hi: "भेजें", gu: "મોકલો" },
  back: { en: "Back to website", hi: "वेबसाइट पर वापस", gu: "વેબસાઇટ પર પાછા" },
  rejected: {
    en: "We're sorry — we're unable to assist with this request. Please see the message below.",
    hi: "क्षमा करें — हम इस अनुरोध में सहायता नहीं कर पा रहे हैं। कृपया नीचे संदेश देखें।",
    gu: "માફ કરશો — અમે આ વિનંતીમાં સહાય કરી શકતા નથી. કૃપા કરીને નીચેનો સંદેશ જુઓ.",
  },
  private: {
    en: "Keep this link private — anyone with it can view your request.",
    hi: "यह लिंक निजी रखें — जिसके पास यह लिंक है वह आपका अनुरोध देख सकता है।",
    gu: "આ લિંક ખાનગી રાખો — જેની પાસે આ લિંક હોય તે તમારી વિનંતી જોઈ શકે છે.",
  },
  you: { en: "You", hi: "आप", gu: "તમે" },
} satisfies Record<string, L3 | L3[]>;

interface TrackData {
  token: string;
  reference: string;
  category: string;
  fullName: string;
  status: string;
  feeAmount: number | null;
  createdAt: string;
  paymentEnabled: boolean;
  paid: { amount: number; paidAt: string } | null;
  lawyer: { name: string; phone: string; email: string | null; specialization: string } | null;
  messages: { id: string; sender: string; body: string; createdAt: string }[];
}

const stepIndex = (s: string) =>
  s === "NEW" ? 0 : s === "IN_REVIEW" ? 1 : s === "AWAITING_PAYMENT" ? 2 : ["PAID", "IN_PROGRESS", "FORWARDED"].includes(s) ? 3 : 4;

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export function TrackView({ data: d }: { data: TrackData }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { language, setLanguage } = useLanguage();
  const tr = (v: L3) => v[language];

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const locale = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-IN";
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso));

  const statusLabel = CLIENT_STATUS[d.status as Status]?.[language] ?? d.status;
  const current = stepIndex(d.status);
  const rejected = d.status === "REJECTED";
  const closedForReplies = d.status === "CLOSED" || rejected;

  const pay = async () => {
    setPayError("");
    setPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) throw new Error(tr(T.payFailed));

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: d.token }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || tr(T.payFailed));

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "CASE SUNO",
        description: `Platform fee · ${order.reference}`,
        prefill: order.prefill,
        theme: { color: "#1F5C50" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          if (!v.ok) setPayError(tr(T.payFailed));
          setPaying(false);
          startTransition(() => router.refresh());
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on("payment.failed", () => {
        setPayError(tr(T.payFailed));
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : tr(T.payFailed));
      setPaying(false);
    }
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/track/${d.token}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: msg.trim() }),
      });
      if (res.ok) {
        setMsg("");
        startTransition(() => router.refresh());
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F6F1E7] via-[#FAF9F6] to-[#EDE7DC] px-4 py-6 sm:py-10">
      <div aria-hidden="true" className="cs-blob pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#C9A45C]/15 blur-3xl" />
      <div aria-hidden="true" className="cs-blob pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#1F5C50]/12 blur-3xl" />

      <div className="relative mx-auto max-w-2xl space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#4A4742] hover:text-[#1F5C50]">
            <ArrowLeft className="h-4 w-4" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="CASE SUNO" className="h-8 w-auto" />
          </Link>
          <div className="flex rounded-full border border-white/70 bg-white/60 p-1 backdrop-blur-md">
            {(["en", "hi", "gu"] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-all cursor-pointer ${
                  language === l ? "bg-[#1F1E1B] text-white" : "text-[#4A4742] hover:bg-white"
                }`}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिं" : "ગુજ"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div className="cs-rise rounded-3xl border border-white/80 bg-white/85 p-5 sm:p-7 shadow-[0_24px_60px_-28px_rgba(31,30,27,0.4)] backdrop-blur-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8479]">{tr(T.title)}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <h1 className="font-mono text-xl font-semibold text-[#1E1D1A]">{d.reference}</h1>
            <span className="rounded-full bg-[#E6EFEA] px-3 py-1 text-[12px] font-semibold text-[#1F5C50]">{statusLabel}</span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#6B655B]">
            {d.category} · {tr(T.submitted)} {fmt(d.createdAt)}
          </p>

          {/* Progress */}
          {!rejected && (
            <ol className="mt-6 grid grid-cols-5 gap-1">
              {T.steps.map((s, i) => {
                const done = i < current || (i === current && ["RESOLVED", "CLOSED"].includes(d.status));
                const active = i === current && !done;
                return (
                  <li key={i} className="flex flex-col items-center text-center">
                    <div className="relative flex w-full items-center">
                      <span className={`h-[3px] flex-1 rounded-full ${i === 0 ? "opacity-0" : i <= current ? "bg-[#1F5C50]" : "bg-[#E2DDD3]"}`} />
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                          done ? "bg-[#1F5C50] text-white" : active ? "bg-white text-[#1F5C50] ring-2 ring-[#1F5C50] shadow-[0_0_0_6px_rgba(31,92,80,0.12)]" : "bg-[#F1EEE8] text-[#9C9588]"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className={`h-[3px] flex-1 rounded-full ${i === T.steps.length - 1 ? "opacity-0" : i < current ? "bg-[#1F5C50]" : "bg-[#E2DDD3]"}`} />
                    </div>
                    <span className={`mt-1.5 text-[10.5px] sm:text-[11.5px] leading-tight ${i <= current ? "font-semibold text-[#1E1D1A]" : "text-[#9C9588]"}`}>
                      {tr(s)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {rejected && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[13px] text-rose-800">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {tr(T.rejected)}
            </div>
          )}
        </div>

        {/* Payment */}
        {(d.status === "AWAITING_PAYMENT" || d.paid) && (
          <div className="cs-rise rounded-3xl border border-white/80 bg-white/85 p-5 sm:p-7 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(31,30,27,0.35)]" style={{ animationDelay: "80ms" }}>
            {d.paid ? (
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[#1E1D1A]">{tr(T.paid)}</p>
                  <p className="text-[12.5px] text-[#6B655B]">
                    {formatINR(d.paid.amount)} · {fmt(d.paid.paidAt)}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8479]">{tr(T.fee)}</p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-[#1E1D1A]">{d.feeAmount ? formatINR(d.feeAmount) : "—"}</p>
                  </div>
                  {d.paymentEnabled ? (
                    <button
                      type="button"
                      onClick={pay}
                      disabled={paying}
                      className="cs-shine cs-press relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#1F5C50] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(31,92,80,0.8)] hover:bg-[#174A41] disabled:opacity-60 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" /> {paying ? tr(T.paying) : tr(T.pay)}
                    </button>
                  ) : (
                    <p className="text-[12.5px] text-[#8C8479]">{tr(T.payOff)}</p>
                  )}
                </div>
                <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#6B655B]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1F5C50]" /> {tr(T.feeInfo)}
                </p>
                {payError && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{payError}</p>}
              </>
            )}
          </div>
        )}

        {/* Lawyer */}
        {d.lawyer && (
          <div className="cs-rise rounded-3xl border border-white/80 bg-white/85 p-5 sm:p-6 backdrop-blur-xl" style={{ animationDelay: "120ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8479]">{tr(T.professional)}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6EFEA] text-[#1F5C50]">
                <UserRound className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[#1E1D1A]">{d.lawyer.name}</p>
                <p className="text-[12.5px] text-[#6B655B]">{d.lawyer.specialization}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${d.lawyer.phone}`} className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD6C9] bg-white px-3.5 py-1.5 text-[12.5px] hover:border-[#1F5C50]">
                <Phone className="h-3.5 w-3.5" /> {d.lawyer.phone}
              </a>
              {d.lawyer.email && (
                <a href={`mailto:${d.lawyer.email}`} className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD6C9] bg-white px-3.5 py-1.5 text-[12.5px] hover:border-[#1F5C50]">
                  <Mail className="h-3.5 w-3.5" /> {d.lawyer.email}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="cs-rise rounded-3xl border border-white/80 bg-white/85 backdrop-blur-xl" style={{ animationDelay: "160ms" }}>
          <p className="border-b border-[#F0ECE4] px-5 sm:px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8479]">{tr(T.messages)}</p>
          <div className="space-y-3 px-5 sm:px-7 py-5">
            {d.messages.length === 0 && <p className="py-4 text-center text-[13px] text-[#8C8479]">{tr(T.noMessages)}</p>}
            {d.messages.map((m) => {
              const fromUs = m.sender === "ADMIN";
              return (
                <div key={m.id} className={`flex ${fromUs ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                      fromUs ? "rounded-tl-md bg-[#F1EEE8] text-[#2C2A26]" : "rounded-tr-md bg-[#1F5C50] text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className={`mt-1 text-[10.5px] ${fromUs ? "text-[#8C8479]" : "text-white/70"}`}>
                      {fromUs ? "CASE SUNO" : tr(T.you)} · {fmt(m.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!closedForReplies && (
            <div className="border-t border-[#F0ECE4] p-4 sm:px-7">
              <div className="flex items-end gap-2">
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={2}
                  maxLength={2000}
                  placeholder={tr(T.replyPh)}
                  aria-label={tr(T.reply)}
                  className="min-w-0 flex-1 resize-y rounded-2xl border border-[#DCD6C9] bg-[#FAF9F6] px-3.5 py-2.5 text-[16px] sm:text-[14px] outline-none transition-all focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!msg.trim() || sending}
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#1F1E1B] px-4 text-[13px] font-medium text-white transition-all hover:bg-[#1F5C50] disabled:opacity-40 cursor-pointer"
                >
                  <Send className="h-4 w-4" /> {tr(T.send)}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="flex items-center justify-center gap-1.5 pb-6 text-center text-[11.5px] text-[#8C8479]">
          <Lock className="h-3.5 w-3.5" /> {tr(T.private)}
        </p>
      </div>
    </div>
  );
}