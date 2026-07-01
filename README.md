# LeadMate AI

The **AI Growth Operating System** for local businesses. LeadMate AI audits a
business's online presence, tracks competitors, monitors reviews, and generates
an AI growth plan — helping HVAC, roofing, plumbing, and other local trades win
back leads they're losing.

This repo is the **frontend**. It ships with mock data and safe service stubs so
it runs end-to-end with **zero configuration**, then wires up to real backends as
you add env keys.

## Stack

| Concern        | Tool                          |
| -------------- | ----------------------------- |
| Framework      | React 19 + Vite + TypeScript  |
| Styling        | Tailwind CSS v4 (shadcn-style primitives) |
| Auth / DB      | Supabase                      |
| AI             | OpenAI (via backend edge function) |
| Payments       | Stripe                        |
| Analytics      | PostHog                       |
| Email          | Resend (via backend)          |
| Icons          | lucide-react                  |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

The app runs in **demo mode** out of the box (mock data, canned AI answers, no
checkout). To connect real services, copy `.env.example` → `.env.local` and fill
in the keys.

```bash
npm run build      # typecheck + production build
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/
    ui/         Reusable primitives (Button, Card, Badge, Input, ScoreRing…)
    common/     Shared pieces (Logo, PageHeader, StatCard, ScrollToTop)
    layout/     Shells: MarketingLayout, AppLayout, AuthShell
  pages/
    marketing/  Landing, Pricing, Directory
    auth/       Login, Signup
    app/        Onboarding, Dashboard, Audit, Competitors, Advisor,
                Reviews, Billing, Settings
  services/     Thin clients: supabase, analytics, billing, advisor, reports
  data/         Mock data powering demo mode
  types/        Domain types
  lib/          utils (cn, scoreTone, formatCurrency)
```

## Screens & routes

| Route              | Screen                    |
| ------------------ | ------------------------- |
| `/`                | Landing page              |
| `/pricing`         | Pricing & FAQ             |
| `/directory`       | Public trusted directory  |
| `/login`           | Log in                    |
| `/signup`          | Sign up                   |
| `/onboarding`      | Add business + run audit  |
| `/app`             | Dashboard                 |
| `/app/audit`       | AI Business Audit report  |
| `/app/competitors` | Competitor Intelligence   |
| `/app/advisor`     | AI Growth Advisor (chat)  |
| `/app/reviews`     | Review Monitoring         |
| `/app/billing`     | Billing & Plans           |
| `/app/settings`    | Settings                  |

### Try the flow

`/` → **Start free audit** → `/signup` → `/onboarding` → runs the audit →
`/app` dashboard → explore audit, competitors, advisor, reviews, billing.
