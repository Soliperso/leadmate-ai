# LeadMate AI — Database Schema (v1)

**Status:** finalized · **Last updated:** 2026-07-01
**Migration:** `supabase/migrations/0001_init.sql`

Postgres on Supabase. Every user-owned table has **Row Level Security** enabled and
scoped to the authenticated owner. Enums mirror `src/types/index.ts` exactly so the
frontend and database never drift.

---

## Entity-relationship overview

```
auth.users ─1:1─ profiles
                    │ 1:N
                    ├──────────────► businesses ──1:N──► audits ──1:N──► opportunities
                    │                    │
                    │                    ├──1:N──► competitors
                    │                    ├──1:N──► reviews
                    │                    └──1:N──► advisor_conversations ──1:N──► advisor_messages
                    │ 1:1
                    └──────────────► subscriptions  (mirrors Stripe)
```

## Enums

| Enum             | Values                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `industry`       | HVAC, Roofing, Electrician, Plumbing, Landscaping, Dental, Legal, Accounting, Insurance, Other |
| `impact_level`   | high, medium, low                                                     |
| `score_category` | website, seo, reputation, conversion, visibility                     |
| `review_source`  | Google, Yelp, Facebook                                               |
| `chat_role`      | user, assistant                                                     |
| `plan_tier`      | starter, growth, pro                                                |
| `sub_status`     | trialing, active, past_due, canceled, incomplete                    |

## Tables

### `profiles` — 1:1 with `auth.users`
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | → `auth.users.id`, cascade delete |
| email | text | copied from auth on signup |
| full_name | text | from signup metadata |
| created_at / updated_at | timestamptz | |

Auto-created by the `on_auth_user_created` trigger. RLS: owner may select/update
own row.

### `businesses`
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| owner_id | uuid | → `profiles.id`, cascade |
| name | text | required |
| website | text | |
| industry | industry enum | default `Other` |
| location | text | |
| logo_color | text | default `#4f46e5` |
| is_public | boolean | default false — surfaces in public directory |
| created_at / updated_at | timestamptz | |

RLS: owner has full access; anyone may `select` rows where `is_public = true`
(powers the public Directory page). Indexed on `owner_id`.

### `audits`
Scores stored as columns (not JSON) so they're queryable for trend charts.
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| business_id | uuid | → `businesses.id`, cascade |
| overall | smallint 0–100 | weighted composite |
| score_website / score_seo / score_reputation / score_conversion / score_visibility | smallint 0–100 | the five dimensions |
| estimated_lost_leads | integer | |
| estimated_lost_revenue | integer | dollars/month |
| created_at | timestamptz | |

RLS: select if the owning business belongs to `auth.uid()`. Writes via service
role (audit engine). Indexed `(business_id, created_at desc)`.

### `opportunities`
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| audit_id | uuid | → `audits.id`, cascade |
| title | text | |
| description | text | |
| impact | impact_level | |
| category | score_category | |

RLS: select via audit → business → owner chain. Written by the audit engine.

### `competitors`
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| business_id | uuid | → `businesses.id`, cascade |
| name | text | |
| rating | numeric(2,1) 0–5 | |
| reviews | integer | |
| website_score / domain_authority / social_engagement | smallint 0–100 | |

RLS: select via owning business. Growth+ feature.

### `reviews`
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| business_id | uuid | → `businesses.id`, cascade |
| author | text | |
| rating | smallint 1–5 | |
| body | text | |
| source | review_source | Google/Yelp/Facebook |
| responded | boolean | default false |
| reviewed_at | date | |

RLS: select via owning business; owner may `update` (to flag responded). Indexed
`(business_id, reviewed_at desc)`.

### `advisor_conversations` + `advisor_messages`
Persist the AI Growth Advisor chat.
- `advisor_conversations`: id, business_id → businesses, title, created_at.
- `advisor_messages`: id, conversation_id → conversations, role (`chat_role`),
  content, created_at.

RLS: full access via the business → owner chain (users may create/read their own
threads). Messages also written by the `growth-advisor` edge function.

### `subscriptions` — mirror of Stripe
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid PK | |
| owner_id | uuid | → `profiles.id`, unique (one sub per user) |
| stripe_customer_id | text unique | |
| stripe_subscription_id | text unique | |
| plan | plan_tier | default `starter` |
| status | sub_status | default `trialing` |
| current_period_end | timestamptz | |
| created_at / updated_at | timestamptz | |

RLS: owner may `select`. Written **only** by the `stripe-webhook` edge function
(service role) — the source of truth for feature gating.

## Conventions

- **UUID PKs** via `gen_random_uuid()` (pgcrypto).
- **`updated_at`** maintained by the `set_updated_at()` trigger on mutable tables.
- **Cascade deletes** down ownership chains (delete a business → its audits,
  competitors, reviews, conversations go with it).
- **Default-deny RLS:** no policy = no access. Server writes use the service role,
  which bypasses RLS by design.

## Frontend ⇄ DB mapping

The mock objects in `src/data/mock.ts` are the row shapes the UI expects. Live mode
returns identical shapes from Supabase — note snake_case (DB) vs camelCase (TS):
map at the service boundary (e.g. `estimated_lost_revenue` → `estimatedLostRevenue`).

## Migration workflow

1. Local: `supabase start`, edit migration, `supabase db reset` to re-apply.
2. Generate types: `supabase gen types typescript --local > src/types/supabase.ts`.
3. Deploy: `supabase db push` to the linked project.
4. After any schema change, run `get_advisors` and resolve security/perf warnings.
