# LeadMate AI — Project Blueprint

**The single source of truth for building LeadMate AI to a fully functional website.**
Last updated: 2026-07-01

LeadMate AI is the AI Growth Operating System for local businesses: a free AI audit
that quantifies lost revenue, plus subscription tooling (competitor tracking, review
monitoring, an AI growth advisor, monthly reports) to win those leads back.

## Documents

| Doc | What's in it |
| --- | ------------ |
| [PRD.md](./PRD.md) | Product requirements v1 — problem, personas, features by plan, flows, metrics |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design — SPA + Supabase + edge functions, the demo/live service seam, security |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Tables, enums, RLS, ER diagram |
| `../supabase/migrations/0001_init.sql` | Runnable initial schema with RLS |
| [../README.md](../README.md) | Dev quickstart, structure, routes |

## Stack at a glance

React 19 + Vite + TypeScript · Tailwind v4 (shadcn-style) · Supabase (Auth/DB/Edge
Functions) · OpenAI · Stripe · PostHog · Resend. The frontend runs in **demo mode**
with zero config and upgrades to **live mode** as keys are added.

---

## Task tracker

| # | Task | Owner | Status |
| - | ---- | ----- | ------ |
| 1 | Create GitHub repository | You (+ me) | ✅ Pushed to `Soliperso/leadmate-ai` (`main`) |
| 2 | Create Supabase project | You (+ me) | ✅ Provisioned `leadmate-ai` (`kyislijifikuyfushdgi`, us-west-1); schema pushed, advisors clean |
| 3 | Create OpenAI account | You | ○ Account/keys require your signup |
| 4 | Create Stripe account | You | ○ Account/keys require your signup |
| 5 | Create PostHog account | You | ○ Account/keys require your signup |
| 6 | Create Resend account | You | ○ Account/keys require your signup |
| 7 | Finalize PRD v1 | Me | ✅ `docs/PRD.md` |
| 8 | Finalize architecture | Me | ✅ `docs/ARCHITECTURE.md` |
| 9 | Finalize database schema | Me | ✅ `docs/DATABASE_SCHEMA.md` + migration |
| 10 | Complete project blueprint | Me | ✅ this document |

Legend: ✅ done · ◐ partially done · ○ blocked on your action

> The account tasks (2–6) each require **your** signup and billing details — I can't
> create accounts on your behalf. The checklist below makes each one a 5-minute,
> copy-the-key-into-`.env.local` step. I can automate the Supabase schema push once
> the project exists.

---

## Account setup checklist

Copy `.env.example` → `.env.local` first, then fill in as you go. The app keeps
working in demo mode until each key is present.

### 1. GitHub  →  code hosting
- [ ] Create a repo `leadmate-ai` at https://github.com/new (private).
- [ ] Install GitHub CLI (`brew install gh`) **or** add the remote manually.
- [ ] Then I can push: `git remote add origin …` → `git push -u origin main`.
- Local git is already initialized on branch `main`.

### 2. Supabase  →  auth + database  ✅ DONE
- [x] Project `leadmate-ai` provisioned in org `edchebli` (ref
      `kyislijifikuyfushdgi`, region us-west-1, free tier).
- [x] Schema pushed (`0001_init.sql` + `0002_harden_functions.sql`); all 9 tables
      have RLS enabled; security advisors report **0 issues**.
- [x] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` written to `.env.local`
      (publishable key — safe for the browser).
- [ ] Remaining (needed for edge functions, Phase 2): grab the **service-role key**
      and set `VITE_API_BASE_URL` (functions URL) as **function secrets** — never
      in the browser bundle.
- Dashboard: https://supabase.com/dashboard/project/kyislijifikuyfushdgi

### 3. OpenAI  →  AI audit + advisor
- [ ] Create an account at https://platform.openai.com, add billing.
- [ ] Create a secret API key.
- Set as an **edge-function secret**: `OPENAI_API_KEY` (never in the frontend).

### 4. Stripe  →  payments
- [ ] Create an account at https://stripe.com (start in **test mode**).
- [ ] Create 3 products/prices: Starter $29, Growth $99, Pro $299 (monthly).
- [ ] Get the **publishable** and **secret** keys; add a webhook to the
      `stripe-webhook` function URL and copy the signing secret.
- `.env.local`: `VITE_STRIPE_PUBLISHABLE_KEY`
- Function secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs.

### 5. PostHog  →  analytics
- [ ] Create an account at https://posthog.com (US or EU cloud).
- [ ] Copy the **Project API key** and host.
- `.env.local`: `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`

### 6. Resend  →  transactional + report email
- [ ] Create an account at https://resend.com, verify a sending domain.
- [ ] Create an API key.
- Function secret: `RESEND_API_KEY`.

---

## Roadmap to a fully functional website

**Phase 0 — Blueprint (done)**
Docs, schema, git initialized.

**Phase 1 — Accounts & secrets (you)**
Complete the checklist above; drop keys into `.env.local` and function secrets.

**Phase 2 — Backend live** *(in progress)*
- ✅ Provisioned Supabase, pushed `0001`/`0002`, advisors clean.
- ✅ Real Supabase Auth wired into Signup/Login + protected routes
  (`src/lib/auth.tsx`, `RequireAuth`), with demo-mode fallback. Verified
  end-to-end: signup → `profiles` row via trigger → cascade cleanup.
- ✅ All five edge functions scaffolded in `supabase/functions/` (code complete;
  deploy is gated on the OpenAI/Stripe/Resend accounts — see the functions README).
- ◐ Remaining: deploy functions once secrets exist; wire Onboarding to `run-audit`.

**Phase 3 — Data flows live**
- Onboarding writes a real `businesses` row and triggers `run-audit`.
- Dashboard/Audit/Competitors/Reviews read from Supabase (RLS-scoped) instead of
  `mock.ts`, mapping snake_case → camelCase at the service boundary.
- Advisor chat + report email hit their functions.

**Phase 4 — Payments & gating**
- Stripe Checkout + customer portal; webhook fills `subscriptions`; features gate
  on `plan`/`status`.

**Phase 5 — Launch hardening**
- Run Supabase security advisors; CI (`oxlint` + `npm run build`); deploy SPA to
  CDN + connect prod Supabase/Stripe live; verify LCP and responsive targets.

**Phase 6 — v1.1+**
Scheduled re-audits & report emails; live competitor/review data sources; Pro
agency tools + white-label reports.

---

## How I can help next (autonomously, once accounts exist)

- Provision the Supabase project and push the schema (Supabase tool).
- Scaffold the five edge functions with the demo/live seam already in the frontend.
- Replace `mock.ts` reads with Supabase queries screen by screen.
- Set up CI and the deploy config.
- Add the GitHub remote and push once `gh` is installed / you've created the repo.
