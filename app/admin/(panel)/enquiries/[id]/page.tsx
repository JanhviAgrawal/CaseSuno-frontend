import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { adminToken } from "@/lib/auth";
import { backendFetch } from "@/lib/backend";
import { EnquiryWorkspace, type WorkspaceData, type WorkspaceLawyer } from "@/components/admin/EnquiryWorkspace";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await adminToken();
  if (!token) redirect("/admin/login");

  // The API also marks the client's replies as read when a request is opened
  const { status, data } = await backendFetch<{
    enquiry: Omit<WorkspaceData, "trackUrl"> & { accessToken: string };
    lawyers: WorkspaceLawyer[];
  }>(`admin/enquiries/${encodeURIComponent(id)}/`, { token });

  if (status === 401) redirect("/admin/login");
  if (status === 404) notFound();
  if (status >= 400) throw new Error(data.error || "Could not load this request");

  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;

  const { accessToken, ...e } = data.enquiry;

  return <EnquiryWorkspace data={{ ...e, trackUrl: `${origin}/track/${accessToken}` }} lawyers={data.lawyers} />;
}
