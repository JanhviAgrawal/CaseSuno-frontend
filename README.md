# CASE SUNO — Website (casesuno.in)

Next.js 16 website + admin panel (`/admin`). All data lives in the **CASE SUNO API** (Django on Render);
this app has no database of its own. The website server talks to the API server-to-server, so the
browser never sees the API key or admin tokens.

## Environment variables

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://casesuno.in` |
| `BACKEND_API_URL` | `https://casesuno-api.onrender.com` (or `https://api.casesuno.in`) — no trailing slash |
| `WEBSITE_API_KEY` | exactly the same value as `WEBSITE_API_KEY` on Render |
| `BACKEND_TIMEOUT_MS` | optional, default `60000` |

Admin login for `/admin` = `ADMIN_EMAIL` / `ADMIN_PASSWORD` configured on the Render backend.

## Run locally

```bash
npm install
cp .env.example .env.local     # BACKEND_API_URL=http://127.0.0.1:8000 while the API runs locally
npm run dev                    # http://localhost:3000
```

## Deploy + connect casesuno.in (Hostinger domain)

The site needs a **Node.js server** (it has dynamic pages and API routes), so plain shared/static
hosting is not enough. Pick one:

### Option A — Vercel (free, simplest for Next.js)
1. Push this folder to GitHub → vercel.com → **Add New Project** → import it (framework auto-detected).
2. Add the environment variables above → Deploy.
3. Vercel → Project → Settings → Domains → add `casesuno.in` and `www.casesuno.in`.
4. Hostinger → **Domains → casesuno.in → DNS / Nameservers → DNS records**:
   * `A    @    76.76.21.21`  (remove any other `A`/`AAAA` record for `@`)
   * `CNAME www  cname.vercel-dns.com`
   (Use the exact values Vercel shows on the Domains page if they differ.)

### Option B — Hostinger Node.js Web App (Business / Cloud plans)
hPanel → **Websites → Add website → Node.js Apps** → connect the GitHub repo (or upload this zip),
framework *Next.js*, build `npm run build`, start `npm start`, Node 20+, add the environment variables,
and attach the domain `casesuno.in`.

### Option C — Render (next to the API)
New → Web Service → this repo · Runtime Node · Build `npm install && npm run build` · Start `npm start`
· add the environment variables · Settings → Custom Domains → `casesuno.in` and follow the DNS records Render shows
(add them in Hostinger's DNS zone).

### After deploying
* Open `https://casesuno.in`, submit a test enquiry, then sign in at `https://casesuno.in/admin`.
* Razorpay webhook should point to the API: `https://<render-service>/api/payments/webhooks/payment/`
  (`https://casesuno.in/api/payments/webhook` also works — it relays to the API).

## How the pieces connect

| Browser calls (unchanged) | Website server forwards to API |
|---|---|
| `POST /api/enquiries` | `POST /api/web/enquiries/` |
| `POST /api/track-lookup` | `POST /api/web/track-lookup/` |
| `/track/[token]` page | `GET /api/web/track/<token>/` |
| `POST /api/track/[token]/messages` | `POST /api/web/track/<token>/messages/` |
| `POST /api/payments/create-order`, `/verify` | `POST /api/web/payments/…` |
| `POST /api/admin/login` / `logout` | `POST /api/web/admin/login|logout/` (token kept in an httpOnly cookie) |
| `/admin/*` pages and actions | `/api/web/admin/…` |

Code: `lib/backend.ts` (API client), `lib/auth.ts` (admin session), `app/api/**` (thin proxies).
