import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BackendError, backendFetch, backendJson, type BackendOptions } from "./backend";

/**
 * Admin sessions are issued by the CASE SUNO API. The website keeps the opaque
 * session token in an httpOnly cookie on casesuno.in and forwards it server-side.
 */
const COOKIE = "cs_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours (matches the API session lifetime)

export async function adminToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE)?.value || null;
}

export async function createSession(token: string, maxAge = MAX_AGE) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export interface AdminSession {
  email: string;
  name: string;
  unread: number;
}

/** Validates the cookie with the API (once per request) */
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const token = await adminToken();
  if (!token) return null;
  const { status, data } = await backendFetch<AdminSession>("admin/me/", { token });
  if (status !== 200) return null;
  return { email: String(data.email ?? ""), name: String(data.name ?? ""), unread: Number(data.unread ?? 0) };
});

/** For server pages: redirects to login when not signed in */
export async function requireAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Admin data for server pages — redirects to login if the session has expired */
export async function adminApi<T>(path: string, opts: Omit<BackendOptions, "token"> = {}) {
  const token = await adminToken();
  if (!token) redirect("/admin/login");
  try {
    return await backendJson<T>(path, { ...opts, token });
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) redirect("/admin/login");
    throw err;
  }
}
