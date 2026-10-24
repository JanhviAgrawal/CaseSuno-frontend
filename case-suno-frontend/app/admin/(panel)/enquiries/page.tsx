import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { adminApi } from "@/lib/auth";
import { STATUSES, STATUS_META, type Status } from "@/lib/status";
import { Card, PriorityBadge, StatusBadge, formatDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

type SP = Promise<{ status?: string; q?: string; page?: string }>;

export default async function EnquiriesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as Status) ? (sp.status as Status) : undefined;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const d = await adminApi<{
    items: {
      id: string;
      reference: string;
      fullName: string;
      phone: string;
      category: string;
      description: string;
      status: string;
      priority: string;
      createdAt: string;
      unread: number;
    }[];
    count: number;
    pageSize: number;
    statusCounts: Record<string, number>;
  }>("admin/enquiries/", { query: { status, q, page } });

  const items = d.items.map((e) => ({ ...e, _count: { messages: e.unread } }));
  const count = d.count;
  const statusCounts = Object.entries(d.statusCounts).map(([s, n]) => ({ status: s, _count: { _all: n } }));

  const totalAll = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const href = (params: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    const merged = { status, q: q || undefined, ...params };
    Object.entries(merged).forEach(([k, v]) => v && u.set(k, v));
    const s = u.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Client requests</h1>
          <p className="mt-1 text-[13px] text-[#6B655B]">{count} result{count === 1 ? "" : "s"}</p>
        </div>
        <form className="relative w-full lg:w-[380px]" action="/admin/enquiries">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8479]" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, reference, category…"
            className="w-full rounded-full border border-[#DCD6C9] bg-white py-2.5 pl-10 pr-4 text-[13.5px] outline-none transition-all focus:border-[#1F5C50]/50 focus:ring-4 focus:ring-[#1F5C50]/10"
          />
        </form>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        <Link
          href={href({ status: undefined, page: undefined })}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
            !status ? "bg-[#1F1E1B] text-white" : "bg-white text-[#4A4742] ring-1 ring-[#E8E4DB] hover:ring-[#1F5C50]"
          }`}
        >
          All <span className="ml-1 opacity-70">{totalAll}</span>
        </Link>
        {STATUSES.map((s) => {
          const c = statusCounts.find((x) => x.status === s)?._count._all ?? 0;
          return (
            <Link
              key={s}
              href={href({ status: s, page: undefined })}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                status === s ? "bg-[#1F5C50] text-white" : "bg-white text-[#4A4742] ring-1 ring-[#E8E4DB] hover:ring-[#1F5C50]"
              }`}
            >
              {STATUS_META[s].label} <span className="ml-1 opacity-70">{c}</span>
            </Link>
          );
        })}
      </div>

      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#8C8479]">
              <tr>
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {items.map((e) => (
                <tr key={e.id} className="group transition-colors hover:bg-[#FAF9F6]">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/enquiries/${e.id}`} className="font-mono text-[12.5px] font-semibold text-[#1F5C50] group-hover:underline">
                      {e.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/enquiries/${e.id}`} className="block">
                      <p className="flex items-center gap-1.5 font-semibold">
                        {e.fullName}
                        {e._count.messages > 0 && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#F05A22] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            <MessageCircle className="h-3 w-3" /> {e._count.messages}
                          </span>
                        )}
                      </p>
                      <p className="text-[11.5px] text-[#8C8479]">{e.phone}</p>
                    </Link>
                  </td>
                  <td className="max-w-[220px] px-5 py-3.5">
                    <p className="truncate">{e.category}</p>
                    <p className="truncate text-[11.5px] text-[#8C8479]">{e.description}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <PriorityBadge priority={e.priority} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[#6B655B]">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-[13px] text-[#8C8479]">
                    No requests match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={href({ page: String(page - 1) })} className="rounded-full bg-white px-4 py-1.5 text-[12.5px] ring-1 ring-[#E8E4DB] hover:ring-[#1F5C50]">
              ← Previous
            </Link>
          )}
          <span className="text-[12.5px] text-[#6B655B]">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link href={href({ page: String(page + 1) })} className="rounded-full bg-white px-4 py-1.5 text-[12.5px] ring-1 ring-[#E8E4DB] hover:ring-[#1F5C50]">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}