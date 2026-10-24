import { adminProxy } from "@/lib/adminProxy";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return adminProxy(req, `admin/enquiries/${encodeURIComponent(id)}/`, "PATCH");
}
