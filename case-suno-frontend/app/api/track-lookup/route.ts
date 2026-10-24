import { backendFetch, clientIpFrom, readBody, relay } from "@/lib/backend";

export async function POST(req: Request) {
  const result = await backendFetch<{ token?: string }>("track-lookup/", {
    method: "POST",
    body: (await readBody(req)) ?? {},
    clientIp: clientIpFrom(req),
  });
  if (result.status >= 400) return relay(result);
  return relay(result, { token: undefined, path: `/track/${result.data.token}` });
}
