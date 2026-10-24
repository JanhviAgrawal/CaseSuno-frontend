"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Card } from "./ui";

export interface LawyerRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialization: string;
  city: string | null;
  active: boolean;
  cases: number;
}

const input =
  "w-full rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] px-3 py-2.5 text-sm outline-none transition-all placeholder:text-[#9C9588] focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10";

export function LawyersManager({ lawyers }: { lawyers: LawyerRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", phone: "", email: "", specialization: "", city: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/lawyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add lawyer");
      setForm({ name: "", phone: "", email: "", specialization: "", city: "" });
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add lawyer");
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/lawyers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    startTransition(() => router.refresh());
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <Card title="Add a lawyer / professional" icon={<Plus className="h-4 w-4 text-[#1F5C50]" />} className="xl:order-2 h-fit">
        <form onSubmit={submit} className="space-y-2.5">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name *" className={input} />
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp *" className={input} />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={input} />
          <input required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization * (e.g. Property, Family, Cyber, CA)" className={input} />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={input} />
          {error && <p className="text-[12.5px] text-rose-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F1E1B] px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#1F5C50] disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> {busy ? "Adding…" : "Add lawyer"}
          </button>
        </form>
      </Card>

      <Card title={`Network (${lawyers.length})`} className="xl:col-span-2 xl:order-1" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#8C8479]">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Specialization</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Cases</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {lawyers.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-[#FAF9F6]">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{l.name}</p>
                    {l.city && <p className="text-[11.5px] text-[#8C8479]">{l.city}</p>}
                  </td>
                  <td className="px-5 py-3">{l.specialization}</td>
                  <td className="px-5 py-3">
                    <p>{l.phone}</p>
                    {l.email && <p className="text-[11.5px] text-[#8C8479]">{l.email}</p>}
                  </td>
                  <td className="px-5 py-3 tabular-nums">{l.cases}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggle(l.id, !l.active)}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ring-1 ring-inset transition-colors cursor-pointer ${
                        l.active ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100" : "bg-stone-100 text-stone-500 ring-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {l.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
              {lawyers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[#8C8479]">
                    No lawyers added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}