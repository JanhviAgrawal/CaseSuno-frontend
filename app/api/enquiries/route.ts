import { backendFetch, clientIpFrom, readBody, relay } from "@/lib/backend";
import { siteOrigin } from "@/lib/http";

export async function POST(req: Request) {
  const body = await readBody(req);
  if (!body || typeof body !== "object") return relay({ status: 400, data: { error: "Please check the form details." } });

  const result = await backendFetch<{ reference?: string; token?: string }>("enquiries/", {
    method: "POST",
    body,
    clientIp: clientIpFrom(req),
  });
  if (result.status >= 400) return relay(result);

  const origin = siteOrigin(req);
  const { reference, token } = result.data;
  return relay(result, { reference, token: undefined, trackUrl: token ? `${origin}/track/${token}` : origin });
}
