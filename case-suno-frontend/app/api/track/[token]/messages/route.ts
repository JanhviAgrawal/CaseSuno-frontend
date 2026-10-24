import { backendFetch, clientIpFrom, readBody, relay } from "@/lib/backend";

type Ctx = { params: Promise<{ token: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { token } = await params;
  return relay(
    await backendFetch(`track/${encodeURIComponent(token)}/messages/`, {
      method: "POST",
      body: (await readBody(req)) ?? {},
      clientIp: clientIpFrom(req),
    }),
  );
}
