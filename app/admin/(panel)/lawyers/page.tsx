import { adminApi } from "@/lib/auth";
import { LawyersManager, type LawyerRow } from "@/components/admin/LawyersManager";

export const dynamic = "force-dynamic";

export default async function LawyersPage() {
  const { lawyers } = await adminApi<{ lawyers: LawyerRow[] }>("admin/lawyers/");

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">Lawyers & professionals</h1>
        <p className="mt-1 text-[13px] text-[#6B655B]">Your verified network for case referrals.</p>
      </div>
      <LawyersManager
        lawyers={lawyers}
      />
    </div>
  );
}