import { NextResponse } from "next/server";
import { backendBaseUrl } from "@/lib/backend";

/**
 * Razorpay webhook relay.
 * Preferably point the Razorpay webhook straight at the API:
 *   https://<your-render-service>/api/payments/webhooks/payment/
 * This route forwards the raw body + signature unchanged, so a webhook configured as
 *   https://casesuno.in/api/payments/webhook   also works.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  try {
    const res = await fetch(`${backendBaseUrl()}/api/payments/webhooks/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Razorpay-Signature": req.headers.get("x-razorpay-signature") ?? "",
      },
      body: raw,
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
    const text = await res.text();
    return new NextResponse(text || "{}", { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Webhook relay failed", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
