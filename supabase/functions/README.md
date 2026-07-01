# LeadMate AI — Edge Functions

Deno edge functions that hold all secret keys. The frontend calls them at
`${VITE_API_BASE_URL}/<function>`, where `VITE_API_BASE_URL` is
`https://kyislijifikuyfushdgi.supabase.co/functions/v1`.

| Function | Method | Contract | Frontend caller | Secrets |
| -------- | ------ | -------- | --------------- | ------- |
| `run-audit` | POST `{ business_id }` → `{ audit_id }` | audit engine | onboarding / dashboard | `OPENAI_API_KEY` |
| `growth-advisor` | POST `{ question, context }` → `{ answer }` | `services/advisor.ts` | `OPENAI_API_KEY` |
| `create-checkout-session` | POST `{ tierId }` → `{ url }` | `services/billing.ts` | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_*`, `APP_URL` |
| `stripe-webhook` | POST (Stripe event) | — | Stripe → us | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` |
| `send-report` | POST `{ businessId, to }` → `{ ok }` | `services/reports.ts` | `RESEND_API_KEY`, `REPORT_FROM_EMAIL` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by the
Supabase runtime — do not set them manually.

## Required function secrets

Set these once the corresponding accounts exist (Step 2 in `docs/BLUEPRINT.md`):

```bash
supabase secrets set \
  OPENAI_API_KEY=sk-... \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  STRIPE_PRICE_STARTER=price_... \
  STRIPE_PRICE_GROWTH=price_... \
  STRIPE_PRICE_PRO=price_... \
  RESEND_API_KEY=re_... \
  REPORT_FROM_EMAIL=reports@yourdomain.com \
  APP_URL=https://leadmate.ai \
  ALLOWED_ORIGIN=https://leadmate.ai
```

## Deploy

```bash
supabase link --project-ref kyislijifikuyfushdgi
supabase functions deploy run-audit growth-advisor \
  create-checkout-session stripe-webhook send-report
```

The webhook is called by Stripe (no user JWT), so deploy it with
`--no-verify-jwt`:

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

Then add a Stripe webhook endpoint pointing at the `stripe-webhook` URL and copy
its signing secret into `STRIPE_WEBHOOK_SECRET`.

## Local development

```bash
supabase functions serve --env-file supabase/functions/.env.local
```

> These functions cannot be deployed until the OpenAI / Stripe / Resend accounts
> exist and their secrets are set. The code is complete and ready — deployment is
> gated on Step 2 of the blueprint.
