import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { backendFetch } from "@/lib/backend";
import { TrackView } from "@/components/TrackView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your request · CASE SUNO",
  robots: { index: false, follow: false },
};

type TrackData = Parameters<typeof TrackView>[0]["data"];

export default async function TrackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { status, data } = await backendFetch<Omit<TrackData, "token">>(`track/${encodeURIComponent(token)}/`);
  if (status === 404) notFound();
  if (status >= 400) throw new Error(data.error || "Could not load your request");

  return (
    <TrackView
      data={{
        token,
        reference: data.reference,
        category: data.category,
        fullName: data.fullName,
        status: data.status,
        feeAmount: data.feeAmount,
        createdAt: data.createdAt,
        paymentEnabled: data.paymentEnabled,
        paid: data.paid,
        lawyer: data.lawyer,
        messages: data.messages,
      }}
    />
  );
}
