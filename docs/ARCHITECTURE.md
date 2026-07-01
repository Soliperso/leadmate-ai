# LeadMate AI — Architecture (v1)

**Status:** finalized · **Last updated:** 2026-07-01

---

## 1. System overview

LeadMate AI is a **Vite React SPA** talking to **Supabase** (Postgres, Auth, Edge
Functions) with third-party services reached *only* from the server side. The
frontend ships with mock data + service stubs so it runs with zero configuration;
each stub upgrades to a real call when its env keys are present ("demo mode" →
"live mode").

```
                         ┌──────────────────────────────────────────┐
                         │            Browser (Vite SPA)            │
                         │  React 19 · Router · Tailwind v4 · shadcn│
                         │                                          │
                         │  services/  supabase  analytics          │
                         │             advisor  billing  reports    │
                         └───────┬───────────────┬──────────────────┘
              anon key / auth    │               │  fetch(VITE_API_BASE_URL/*)
                                 ▼               ▼
                 ┌───────────────────────┐   ┌───────────────────────────┐
                 │   Supabase Auth + DB   │   │   Supabase Edge Functions │
                 │  Postgres + RLS        │   │  (Deno, service role)     │
                 │  profiles, businesses, │   │  • growth-advisor         │
                 │  audits, opportunities,│◄──┤  • run-audit              │
                 │  competitors, reviews, │   │  • create-checkout-session│
                 │  advisor_*, subs       │   │  • stripe-webhook         │
                 └───────────────────────┘   │  • send-report            │
                                             └───────┬───────────────────┘
                                                     │ secret keys
                        ┌────────────┬───────────────┼───────────────┬────────────┐
                        ▼            ▼               ▼               ▼            ▼
                     OpenAI       Stripe          Resend        PostHog     (data APIs
                   (AI text)    (payments)       (email)      (analytics)    v1.2+)
```

## 2. Frontend

- **React 19 + Vite + TypeScript (strict).** SPA, client-side routing via
  `react-router-dom` v7.
- **Styling:** Tailwind CSS v4 with shadcn-style primitives. Shared design tokens;
  reusable UI in `components/ui`, shared pieces in `components/common`, shells in
  `components/layout` (MarketingLayout, AppLayout, AuthShell).
- **State:** local component state + service modules; no global store needed in v1.
  Server data is fetched per screen; React Query can be added if caching grows.
- **Structure** (see `README.md`):
  - `pages/marketing` · `pages/auth` · `pages/app`
  - `services/` — thin clients, each demo-safe
  - `data/mock.ts` — powers demo mode
  - `types/` — domain types (single source of truth mirrored by the DB enums)
  - `lib/utils.ts` — `cn`, `scoreTone`, `formatCurrency`

### Service layer (the seam)

Each service checks for its env keys and degrades to a safe no-op / mock:

| Service        | Live dependency                         | Demo-mode behavior            |
| -------------- | --------------------------------------- | ----------------------------- |
| `supabase.ts`  | `VITE_SUPABASE_URL` + anon key          | client is `null`; mock data   |
| `advisor.ts`   | `POST {API_BASE}/growth-advisor`        | canned growth plan            |
| `billing.ts`   | Stripe pub key + `create-checkout-session` | logs + no-op                |
| `reports.ts`   | `POST {API_BASE}/send-report`           | logs "would email"            |
| `analytics.ts` | `VITE_POSTHOG_KEY`                      | `track()` no-ops              |

This is the single most important architectural rule: **the UI never branches on
"is this configured"; the service does.** Screens call the service and get either
live or mock data transparently.

## 3. Backend — Supabase

- **Auth:** email/password. A trigger on `auth.users` creates a `profiles` row.
- **Database:** Postgres with **Row Level Security on every user-owned table**
  (see `docs/DATABASE_SCHEMA.md` and `supabase/migrations/0001_init.sql`). Users
  read only rows scoped to businesses they own; the public directory exposes only
  `businesses.is_public = true`.
- **Edge Functions (Deno):** hold all secret keys via the service-role client.
  - `run-audit` — scores the five dimensions, writes `audits` + `opportunities`,
    generates narrative via OpenAI.
  - `growth-advisor` — proxies advisor chat to OpenAI (system prompt + business
    context), persists messages.
  - `create-checkout-session` — creates a Stripe Checkout Session for a plan.
  - `stripe-webhook` — verifies signature, upserts `subscriptions`.
  - `send-report` — renders monthly PDF, sends via Resend.

## 4. Third-party services & where keys live

| Service   | Purpose            | Public key (browser)         | Secret key (server only)     |
| --------- | ------------------ | ---------------------------- | ---------------------------- |
| Supabase  | Auth + DB          | `VITE_SUPABASE_ANON_KEY`     | service-role key             |
| OpenAI    | AI audit + advisor | —                            | `OPENAI_API_KEY`             |
| Stripe    | Payments           | `VITE_STRIPE_PUBLISHABLE_KEY`| `STRIPE_SECRET_KEY`, webhook |
| Resend    | Email/PDF delivery | —                            | `RESEND_API_KEY`             |
| PostHog   | Product analytics  | `VITE_POSTHOG_KEY`           | —                            |

**Rule:** no secret ever ships to the browser. Anything with a secret goes through
an edge function.

## 5. Data flow examples

**Run an audit**
1. Onboarding submits business details → insert into `businesses` (RLS: owner).
2. Client calls `run-audit` edge function with `business_id`.
3. Function scores dimensions, calls OpenAI for narrative, inserts `audits` +
   `opportunities` (service role).
4. Client reads the new audit via Supabase (RLS-scoped) → Dashboard/Report render.

**Subscribe**
1. Billing page → `create-checkout-session` → redirect to Stripe hosted Checkout.
2. Stripe fires webhook → `stripe-webhook` upserts `subscriptions`.
3. App reads plan/status from `subscriptions` (RLS: owner) to gate features.

**Advisor chat**
1. User sends a question → `growth-advisor` with business context.
2. Function calls OpenAI, returns the answer, persists both messages.

## 6. Environments & deploy

- **Local:** `npm run dev` (demo mode with no `.env.local`, live mode with keys).
  Supabase local stack (`supabase start`) for backend work.
- **Preview:** per-PR deploy (Vercel/Netlify) with staging Supabase + Stripe test.
- **Production:** static SPA on CDN; Supabase prod project; Stripe live; secrets in
  the host's env / Supabase function secrets — never in the repo.
- **CI:** on push/PR — `npm ci`, `oxlint`, `npm run build` (typecheck). Deploy on
  merge to `main`.

## 7. Security posture

- RLS default-deny; explicit per-table owner policies; service role only in
  functions.
- Secrets in env/secret manager; `.env.local` gitignored; `.env.example` documents
  names only.
- Stripe webhook signature verified; OpenAI/Resend never called from the browser.
- Supabase security advisors reviewed before launch (`get_advisors`).

## 8. Scaling & future (v1.2+)

- Replace seeded competitor/review data with live sources (Google PageSpeed,
  Places, review APIs) behind the same service seam — screens don't change.
- Scheduled re-audits + report emails via cron-triggered edge functions.
- Add React Query for cache/invalidation once multi-screen shared data grows.
- Rate-limit + cache OpenAI calls per plan to control cost.
