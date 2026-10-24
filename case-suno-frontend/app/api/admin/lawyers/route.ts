import { adminProxy } from "@/lib/adminProxy";

export async function POST(req: Request) {
  return adminProxy(req, "admin/lawyers/", "POST");
}
