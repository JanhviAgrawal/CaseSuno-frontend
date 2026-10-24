import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · CASE SUNO", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminPage();
  const unread = session.unread;

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#1E1D1A] lg:flex">
      <AdminNav email={session.email} unread={unread} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}