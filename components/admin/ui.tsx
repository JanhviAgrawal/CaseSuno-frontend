import React from "react";
import { PRIORITY_META, STATUS_META, type Priority, type Status } from "@/lib/status";

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(
    new Date(value),
  );

export function Card({
  title,
  icon,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-2xl border border-[#E8E4DB] bg-white shadow-[0_1px_2px_rgba(31,30,27,0.04)] ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-[#F0ECE4] px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-[13.5px] font-semibold text-[#1E1D1A]">
            {icon}
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status as Status] ?? { label: status, className: "bg-stone-100 text-stone-600 ring-stone-200" };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset ${m.className}`}>
      {m.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const m = PRIORITY_META[priority as Priority] ?? PRIORITY_META.NORMAL;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${m.className}`}>
      {m.label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(31,30,27,0.35)] ${
        accent ? "border-[#1F5C50] bg-gradient-to-br from-[#1F5C50] to-[#174A41] text-white" : "border-[#E8E4DB] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`text-[12px] font-medium ${accent ? "text-white/80" : "text-[#6B655B]"}`}>{label}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent ? "bg-white/15 text-white" : "bg-[#E6EFEA] text-[#1F5C50]"
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      {hint && <div className={`mt-1 text-[11.5px] ${accent ? "text-white/70" : "text-[#8C8479]"}`}>{hint}</div>}
    </div>
  );
}