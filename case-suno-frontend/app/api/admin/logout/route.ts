import { adminToken, destroySession } from "@/lib/auth";
import { backendFetch } from "@/lib/backend";
import { ok } from "@/lib/http";

export async function POST() {
  const token = await adminToken();
  if (token) await backendFetch("admin/logout/", { method: "POST", body: {}, token });
  await destroySession();
  return ok();
}
