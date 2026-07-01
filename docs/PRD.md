# LeadMate AI — Product Requirements Document (v1)

**Status:** v1 — finalized · **Last updated:** 2026-07-01 · **Owner:** Founder

---

## 1. Summary

LeadMate AI is the **AI Growth Operating System for local businesses**. It audits
a business's online presence, quantifies the leads and revenue they are losing,
tracks competitors, monitors reviews, and generates an AI growth plan — so trades
like HVAC, roofing, plumbing, and electrical can win back the customers slipping
through the cracks.

The wedge is a **free AI audit** that produces an immediate, concrete "you're
losing ~$X/month" number. That insight converts to a paid subscription that keeps
the audit fresh, watches competitors and reviews, and hands the owner a monthly
plan of prioritized actions.

## 2. Problem

Local service businesses live and die on lead flow, but:

- They can't see **why** they lose leads (slow site, weak SEO, no online booking,
  ignored reviews, invisible in the map pack).
- Agencies are expensive, opaque, and sell effort rather than outcomes.
- Owners have no time to learn SEO/ads/reputation management.

There is no affordable tool that translates online-presence problems into a
**dollar-denominated, prioritized, do-this-next** plan.

## 3. Goals & non-goals

**Goals (v1)**
- Deliver a credible free audit across five dimensions with a lost-revenue estimate.
- Convert audits to subscriptions with a clear Starter → Growth → Pro ladder.
- Give paying users ongoing value: competitor tracking, review monitoring, an AI
  advisor chat, and monthly emailed reports.

**Non-goals (v1)**
- Executing changes on the customer's behalf (we recommend; we don't ship websites).
- Native mobile apps (responsive web only).
- Full CRM / invoicing / scheduling (integrations, not core).
- Team/multi-seat roles beyond a single owner account (Pro multi-location is data
  scoping, not RBAC).

## 4. Target users & personas

- **Owner-operator** (primary): 1–20 employees, runs the business and the phone.
  Wants more calls, hates jargon. Buys Starter/Growth.
- **Office manager / marketing lead**: at a larger local business. Buys Growth.
- **Local marketing agency** (secondary): manages many locations, wants white-label
  reports and agency tools. Buys Pro.

## 5. The five audit dimensions

Every audit scores 0–100 on each, plus a weighted `overall`, and derives
`estimatedLostLeads` and `estimatedLostRevenue`.

| Dimension    | What it measures                                              |
| ------------ | ------------------------------------------------------------ |
| Website      | Speed (Core Web Vitals), mobile UX, presence of CTAs/forms   |
| SEO          | Keyword rankings, local pages, technical SEO, GBP completeness |
| Reputation   | Review volume, average rating, response rate, recency         |
| Conversion   | Online booking, contact paths, lead capture, form coverage    |
| Visibility   | Map-pack presence, GBP posting cadence, directory listings    |

## 6. Features & scope by plan

| Capability                          | Starter ($29) | Growth ($99) | Pro ($299) |
| ----------------------------------- | :-----------: | :----------: | :--------: |
| AI business audit + lost-revenue    | ✅            | ✅           | ✅         |
| AI recommendations (opportunities)  | ✅            | ✅           | ✅         |
| Monthly PDF report (email)          | ✅            | ✅           | ✅         |
| AI Growth Advisor chat              | limited       | ✅           | ✅         |
| Competitor tracking                 | —             | ✅           | ✅         |
| Review monitoring                   | —             | ✅           | ✅         |
| Multiple locations / businesses     | —             | —            | ✅         |
| Agency tools + white-label reports  | —             | —            | ✅         |

## 7. Core user flows

1. **Acquire → audit:** Landing → *Start free audit* → Signup → Onboarding
   (add business: name, website, industry, location) → audit runs → Dashboard.
2. **Dashboard:** overall score, five sub-scores, lost-revenue headline, score
   trend over time, top opportunities.
3. **Audit report:** full breakdown by dimension with prioritized opportunities.
4. **Competitors:** side-by-side rating/reviews/website/domain/social vs. tracked
   rivals.
5. **Growth Advisor:** chat that answers "how do I get more X" with a concrete plan.
6. **Reviews:** unified feed across Google/Yelp/Facebook; mark responded; nudge
   for unanswered.
7. **Billing:** choose plan → Stripe Checkout → manage via customer portal.
8. **Directory:** public, SEO-friendly page of opted-in "trusted" businesses.

## 8. Functional requirements

- **Auth:** email/password via Supabase; a `profiles` row is auto-created on signup.
- **Demo mode:** with no backend env keys the app runs fully on mock data (audits,
  competitors, reviews, canned advisor answers, no-op checkout). This is a hard
  requirement — the repo must run end-to-end with zero configuration.
- **Audit engine:** an edge function scores the five dimensions and persists an
  `audits` row + `opportunities`. AI narrative via OpenAI, called server-side only.
- **Advisor:** `POST /growth-advisor` edge function; OpenAI key never in the browser.
- **Billing:** `POST /create-checkout-session` edge function; Stripe webhook mirrors
  subscription state into `subscriptions`.
- **Reports:** `POST /send-report` renders a monthly PDF and delivers via Resend.
- **Analytics:** PostHog, initialized only when a key is present; safe no-op otherwise.

## 9. Non-functional requirements

- **Security:** all secret keys server-side; Row Level Security on every user table;
  browser only ever holds the Supabase anon key and Stripe publishable key.
- **Performance:** landing LCP < 2.5s; audit result < 30s perceived (async with
  progress). App is a Vite SPA served from CDN.
- **Responsive:** mobile-first; every screen usable at 375px width.
- **Quality:** TypeScript strict, `oxlint` clean, `npm run build` typechecks.
- **Design:** professional, neat, consistent — shared design tokens and reusable
  primitives (Button, Card, Badge, Input, ScoreRing, StatCard, PageHeader).

## 10. Success metrics (first 90 days post-launch)

- **Activation:** % of signups that complete an audit (target ≥ 70%).
- **Aha:** % of audited users who view ≥ 2 opportunity details (target ≥ 50%).
- **Conversion:** free → paid within 14 days (target ≥ 6%).
- **Retention:** month-2 logo retention (target ≥ 80%).
- **Revenue:** MRR and blended ARPA across tiers.

## 11. Release plan

- **v1.0 (this blueprint):** all screens live on real data; auth, audit, advisor,
  competitors, reviews, billing, reports, analytics wired to real backends.
- **v1.1:** scheduled monthly re-audits + report emails (cron edge function).
- **v1.2:** live data sources (PageSpeed, Google Places, review APIs) replacing
  seeded competitor/review data.
- **v1.3:** Pro agency tools + white-label report theming.

## 12. Open questions / risks

- Sourcing live competitor & review data compliantly (API limits, ToS) — biggest
  external dependency; v1 seeds this data, v1.2 automates it.
- Audit scoring credibility — needs a defensible, documented rubric per dimension.
- OpenAI cost per advisor message at scale — cache + rate-limit per plan.
