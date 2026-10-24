import Link from "next/link";
import { ArrowRight, BellRing, CircleDollarSign, Clock3, Inbox, Percent, Sparkles } from "lucide-react";
import { adminApi } from "@/lib/auth";
import { STATUS_META, STATUSES, formatINR, type Status } from "@/lib/status";
import { Card, PriorityBadge, StatCard, StatusBadge, formatDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export default async function DashboardPage() {
  const since = new Date(Date.now() - 13 * 86_400_000);
  since.setHours(0, 0, 0, 0);

  type Row = { id: string; reference: string; fullName: string; category: string; status: string; priority: string; createdAt: string };
  const d = await adminApi<{
    total: number;
    statusCounts: Record<string, number>;
    categories: { category: string; count: number }[];
    revenue: number;
    recent: Row[];
    lastDays: string[];
    unread: number;
    paidCount: number;
    requestedCount: number;
  }>("admin/dashboard/");

  const total = d.total;
  const byStatus = Object.entries(d.statusCounts).map(([status, n]) => ({ status, _count: { _all: n } }));
  const byCategory = d.categories.map((c) => ({ category: c.category, _count: { _all: c.count } }));
  const revenue = { _sum: { amount: d.revenue } };
  const recent = d.recent;
  const lastDays = d.lastDays.map((iso) => ({ createdAt: new Date(iso) }));
  const { unread, paidCount, requestedCount } = d;

  const statusCount = (s: Status) => byStatus.find((b) => b.status === s)?._count._all ?? 0;
  const conversion = requestedCount ? Math.round((paidCount / requestedCount) * 100) : 0;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since.getTime() + i * 86_400_000);
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }), count: 0 };
  });
  lastDays.forEach((e) => {
    const k = dayKey(e.createdAt);
    const day = days.find((d) => d.key === k);
    if (day) day.count++;
  });
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const maxCat = Math.max(1, ...byCategory.map((c) => c._count._all));

  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Dashboard</h1>
          <p className="mt-1 text-[13px] text-[#6B655B]">Overview of client requests, fees and referrals.</p>
        </div>
        <Link
          href="/admin/enquiries?status=NEW"
          className="inline-flex items-center gap-2 rounded-full bg-[#1F1E1B] px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-[#1F5C50]"
        >
          Review new requests <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total requests" value={total} icon={<Inbox className="h-4 w-4" />} />
        <StatCard label="New" value={statusCount("NEW")} hint="Needs review" icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Awaiting payment" value={statusCount("AWAITING_PAYMENT")} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Unread replies" value={unread} hint="From clients" icon={<BellRing className="h-4 w-4" />} />
        <StatCard label="Fee conversion" value={`${conversion}%`} hint={`${paidCount} of ${requestedCount} paid`} icon={<Percent className="h-4 w-4" />} />
        <StatCard accent label="Platform revenue" value={formatINR(revenue._sum.amount ?? 0)} hint="All time" icon={<CircleDollarSign className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Requests — last 14 days" className="xl:col-span-2">
          <div className="flex h-44 items-end gap-1.5">
            {days.map((d) => (
              <div key={d.key} className="group flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#1F5C50] opacity-0 transition-opacity group-hover:opacity-100">{d.count}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#1F5C50] to-[#3E8B76] transition-all duration-500 group-hover:from-[#C9A45C] group-hover:to-[#E3C88A]"
                  style={{ height: `${Math.max(4, (d.count / maxDay) * 140)}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            {days.map((d, i) => (
              <span key={d.key} className="flex-1 text-center text-[9.5px] text-[#9C9588]">
                {i % 2 === 0 ? d.label : ""}
              </span>
            ))}
          </div>
        </Card>

        <Card title="By status">
          <ul className="space-y-2">
            {STATUSES.map((s) => (
              <li key={s}>
                <Link href={`/admin/enquiries?status=${s}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-[#FAF9F6]">
                  <StatusBadge status={s} />
                  <span className="text-[13px] font-semibold tabular-nums">{statusCount(s)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Top categories">
          <ul className="space-y-3">
            {byCategory.map((c) => (
              <li key={c.category}>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="truncate pr-2">{c.category}</span>
                  <span className="font-semibold tabular-nums">{c._count._all}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F0ECE4]">
                  <div className="h-full rounded-full bg-[#1F5C50]" style={{ width: `${(c._count._all / maxCat) * 100}%` }} />
                </div>
              </li>
            ))}
            {byCategory.length === 0 && <li className="text-[12.5px] text-[#8C8479]">No data yet.</li>}
          </ul>
        </Card>

        <Card
          title="Latest requests"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Link href="/admin/enquiries" className="text-[12px] font-semibold text-[#1F5C50] hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-[#F0ECE4]">
            {recent.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAF9F6]">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">
                      {e.fullName} <span className="font-mono text-[11.5px] font-normal text-[#8C8479]">{e.reference}</span>
                    </p>
                    <p className="truncate text-[12px] text-[#6B655B]">
                      {e.category} · {formatDate(e.createdAt)}
                    </p>
                  </div>
                  <PriorityBadge priority={e.priority} />
                  <StatusBadge status={e.status} />
                </Link>
              </li>
            ))}
            {recent.length === 0 && <li className="px-5 py-10 text-center text-[13px] text-[#8C8479]">No requests yet.</li>}
          </ul>
        </Card>
      </div>

      <p className="text-[11px] text-[#9C9588]">Status labels: {Object.values(STATUS_META).map((m) => m.label).join(" · ")}</p>
    </div>
  );
}