import { adminToken } from "./auth";
import { backendFetch, readBody, relay } from "./backend";
import { fail } from "./http";

/** Forward an admin action from the browser to the API with the session token */
export async function adminProxy(req: Request, path: string, method: "POST" | "PATCH") {
  const token = await adminToken();
  if (!token) return fail(401, "Unauthorized");
  return relay(await backendFetch(path, { method, body: (await readBody(req)) ?? {}, token }));
}
