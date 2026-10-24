/**
 * Server-side client for the CASE SUNO API (Django, hosted on Render).
 *
 * Only used from Route Handlers and Server Components — never shipped to the browser,
 * so WEBSITE_API_KEY stays secret and admin tokens never leave the server.
 */
import { NextResponse } from "next/server";

const BASE_URL = (process.env.BACKEND_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const WEBSITE_KEY = process.env.WEBSITE_API_KEY || "";

/** Render's free plan can take ~30-50s to wake up, so allow a generous timeout */
const TIMEOUT_MS = Number(process.env.BACKEND_TIMEOUT_MS || 60_000);

export type BackendData = { ok?: boolean; error?: string; detail?: string; [key: string]: unknown };

export interface BackendResult<T = BackendData> {
  status: number;
  data: T & BackendData;
}

export interface BackendOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Admin session token (from the cs_admin cookie) */
  token?: string | null;
  /** Real visitor IP, used by the API for per-visitor rate limits */
  clientIp?: string;
  query?: Record<string, string | number | undefined | null>;
}

export class BackendError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const UNAVAILABLE = "Our service is temporarily unavailable. Please try again in a minute.";

export async function backendFetch<T = BackendData>(path: string, opts: BackendOptions = {}): Promise<BackendResult<T>> {
  const url = new URL(`${BASE_URL}/api/web/${path.replace(/^\/+/, "")}`);
  Object.entries(opts.query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (WEBSITE_KEY) headers["X-Website-Key"] = WEBSITE_KEY;
  if (opts.clientIp) headers["X-Client-IP"] = opts.clientIp;
  if (opts.token) headers.Authorization = `AdminSession ${opts.token}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? (opts.body === undefined ? "GET" : "POST"),
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`[backend] ${opts.method ?? "GET"} ${url.pathname} failed:`, err);
    return { status: 503, data: { ok: false, error: UNAVAILABLE } as T & BackendData };
  }

  const text = await res.text();
  let data: BackendData = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.error(`[backend] ${url.pathname} returned non-JSON (${res.status}):`, text.slice(0, 300));
    data = { ok: false, error: res.status >= 500 ? UNAVAILABLE : "Unexpected response from server" };
  }

  if (!res.ok) {
    if (typeof data.error !== "string") data.error = typeof data.detail === "string" ? data.detail : res.status >= 500 ? UNAVAILABLE : "Request failed";
    data.ok = false;
    if (res.status >= 500) console.error(`[backend] ${url.pathname} -> ${res.status}: ${data.error}`);
  }

  return { status: res.status, data: data as T & BackendData };
}

/** Throws BackendError on any non-2xx response */
export async function backendJson<T = BackendData>(path: string, opts: BackendOptions = {}): Promise<T & BackendData> {
  const { status, data } = await backendFetch<T>(path, opts);
  if (status >= 400) throw new BackendError(status, data.error || "Request failed");
  return data;
}

/** Return the API result to the browser unchanged (same JSON + status code) */
export function relay(result: BackendResult, extra?: Record<string, unknown>) {
  const body = result.status < 400 ? { ...result.data, ...extra, ok: true } : { ok: false, error: result.data.error };
  return NextResponse.json(body, { status: result.status });
}

export function clientIpFrom(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
}

export async function readBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

export const backendBaseUrl = () => BASE_URL;
