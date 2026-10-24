import { backendFetch, clientIpFrom, readBody, relay } from "@/lib/backend";

export async function POST(req: Request) {
  return relay(
    await backendFetch("payments/verify/", {
      method: "POST",
      body: (await readBody(req)) ?? {},
      clientIp: clientIpFrom(req),
    }),
  );
}
