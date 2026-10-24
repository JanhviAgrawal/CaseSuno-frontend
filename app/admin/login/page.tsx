"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F6F1E7] via-[#FAF9F6] to-[#EDE7DC] p-4">
      <div aria-hidden="true" className="cs-blob pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#C9A45C]/15 blur-3xl" />
      <div aria-hidden="true" className="cs-blob pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#1F5C50]/15 blur-3xl" />

      <form
        onSubmit={submit}
        className="cs-modal-panel relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/80 p-7 shadow-[0_30px_80px_-30px_rgba(31,30,27,0.4)] backdrop-blur-xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="CASE SUNO" className="h-10 w-auto" />
        <h1 className="mt-6 font-serif text-2xl font-medium text-[#1E1D1A]">Admin sign in</h1>
        <p className="mt-1 text-[13px] text-[#6B655B]">Manage client requests, payments and referrals.</p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] px-3.5 py-3 text-[15px] outline-none transition-all focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] px-3.5 py-3 text-[15px] outline-none transition-all focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10"
          />
        </div>

        {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="cs-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F1E1B] px-4 py-3 text-[14px] font-medium text-white hover:bg-[#1F5C50] disabled:opacity-60 cursor-pointer"
        >
          <Lock className="h-4 w-4" /> {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}