import Link from "next/link";
import { adminApi } from "@/lib/auth";
import { formatINR } from "@/lib/status";
import { Card, formatDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const d = await adminApi<{
    payments: {
      id: string;
      amount: number;
      status: string;
      razorpayOrderId: string;
      razorpayPaymentId: string | null;
      createdAt: string;
      paidAt: string | null;
      enquiry: { id: string; reference: string; fullName: string };
    }[];
    paidSum: number;
    paidCount: number;
  }>("admin/payments/");
  const payments = d.payments;
  const paidSum = { _sum: { amount: d.paidSum }, _count: { _all: d.paidCount } };

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Payments</h1>
          <p className="mt-1 text-[13px] text-[#6B655B]">CASE SUNO platform fees (lawyer fees are not collected here).</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#1F5C50] to-[#174A41] px-5 py-3 text-white">
          <p className="text-[11.5px] text-white/75">{paidSum._count._all} paid</p>
          <p className="text-xl font-semibold tabular-nums">{formatINR(paidSum._sum.amount ?? 0)}</p>
        </div>
      </div>

      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#8C8479]">
              <tr>
                <th className="px-5 py-3 font-semibold">Request</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Razorpay IDs</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF9F6]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/enquiries/${p.enquiry.id}`} className="font-mono text-[12.5px] font-semibold text-[#1F5C50] hover:underline">
                      {p.enquiry.reference}
                    </Link>
                    <p className="text-[11.5px] text-[#8C8479]">{p.enquiry.fullName}</p>
                  </td>
                  <td className="px-5 py-3 font-semibold tabular-nums">{formatINR(p.amount)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset ${
                        p.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : p.status === "FAILED"
                            ? "bg-rose-50 text-rose-700 ring-rose-200"
                            : "bg-stone-100 text-stone-600 ring-stone-200"
                      }`}
                    >
                      {p.status === "CREATED" ? "Pending" : p.status === "PAID" ? "Paid" : "Failed"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] text-[#6B655B]">
                    <p>{p.razorpayOrderId}</p>
                    {p.razorpayPaymentId && <p>{p.razorpayPaymentId}</p>}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-[12px] text-[#6B655B]">{formatDate(p.paidAt ?? p.createdAt)}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-[13px] text-[#8C8479]">
                    No payments yet.
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