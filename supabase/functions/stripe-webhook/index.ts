// Stripe webhook — verifies the signature and mirrors subscription state into
// the `subscriptions` table. This is the source of truth for feature gating.
// Configure the endpoint in Stripe to point at this function's URL and set
// STRIPE_WEBHOOK_SECRET.
import Stripe from 'https://esm.sh/stripe@17?target=deno'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

// Reverse map: Stripe Price ID -> plan tier.
const TIER_BY_PRICE: Record<string, 'starter' | 'growth' | 'pro'> = {
  [Deno.env.get('STRIPE_PRICE_STARTER') ?? '_starter']: 'starter',
  [Deno.env.get('STRIPE_PRICE_GROWTH') ?? '_growth']: 'growth',
  [Deno.env.get('STRIPE_PRICE_PRO') ?? '_pro']: 'pro',
}

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    const db = supabaseAdmin()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const ownerId = session.metadata?.owner_id ?? session.client_reference_id
        if (ownerId && session.customer) {
          await db.from('subscriptions').upsert(
            {
              owner_id: ownerId,
              stripe_customer_id: String(session.customer),
              stripe_subscription_id: session.subscription
                ? String(session.subscription)
                : null,
              status: 'active',
            },
            { onConflict: 'owner_id' },
          )
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price.id ?? ''
        await db
          .from('subscriptions')
          .update({
            stripe_subscription_id: sub.id,
            plan: TIER_BY_PRICE[priceId] ?? 'starter',
            status: sub.status as string,
            current_period_end: new Date(
              sub.current_period_end * 1000,
            ).toISOString(),
          })
          .eq('stripe_customer_id', String(sub.customer))
        break
      }
      default:
        // Unhandled event types are acknowledged but ignored.
        break
    }

    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('[stripe-webhook] handler error', err)
    return new Response('Handler error', { status: 500 })
  }
})
