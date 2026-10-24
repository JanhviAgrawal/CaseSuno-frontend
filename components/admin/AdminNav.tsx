"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { CreditCard, Inbox, LayoutDashboard, LogOut, Scale } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Requests", icon: Inbox },
  { href: "/admin/lawyers", label: "Lawyers", icon: Scale },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export function AdminNav({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const logout = async () => {
    setLeaving(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 z-30 border-b border-[#E8E4DB] bg-white/90 backdrop-blur-xl lg:h-screen lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:px-5 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CASE SUNO" className="h-8 w-auto" />
          <span className="rounded-full bg-[#1F5C50] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Admin</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DB] px-3 py-1.5 text-xs text-[#6B655B] hover:border-[#1F1E1B] hover:text-[#1F1E1B] lg:hidden cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0 [scrollbar-width:none]">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all ${
                active ? "bg-[#1F5C50] text-white shadow-[0_8px_20px_-12px_rgba(31,92,80,0.8)]" : "text-[#4A4742] hover:bg-[#F3F1EC] hover:text-[#1F1E1B]"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
              {label === "Requests" && unread > 0 && (
                <span className={`ml-auto rounded-full px-1.5 text-[10.5px] font-bold ${active ? "bg-white text-[#1F5C50]" : "bg-[#F05A22] text-white"}`}>
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute inset-x-0 bottom-0 hidden border-t border-[#F0ECE4] p-4 lg:block">
        <p className="truncate text-[11.5px] text-[#8C8479]">{email}</p>
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8E4DB] px-3 py-2 text-xs font-medium text-[#4A4742] transition-colors hover:border-[#1F1E1B] hover:text-[#1F1E1B] cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> {leaving ? "Signing out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}