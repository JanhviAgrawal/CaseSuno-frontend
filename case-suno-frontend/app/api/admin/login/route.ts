import { createSession } from "@/lib/auth";
import { backendFetch, clientIpFrom, readBody, relay } from "@/lib/backend";
import { ok } from "@/lib/http";

export async function POST(req: Request) {
  const body = (await readBody(req)) as { email?: unknown; password?: unknown } | undefined;
  const result = await backendFetch<{ token?: string; maxAge?: number }>("admin/login/", {
    method: "POST",
    body: {
      email: typeof body?.email === "string" ? body.email : "",
      password: typeof body?.password === "string" ? body.password : "",
    },
    clientIp: clientIpFrom(req),
  });
  if (result.status >= 400 || !result.data.token) return relay(result.status >= 400 ? result : { status: 502, data: { error: "Login failed" } });

  await createSession(result.data.token, Number(result.data.maxAge) || undefined);
  return ok();
}
