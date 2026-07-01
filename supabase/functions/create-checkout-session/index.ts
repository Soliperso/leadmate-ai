// Creates a Stripe Checkout Session for a pricing tier and returns its hosted URL.
// Contract matches src/services/billing.ts:  POST { tierId } -> { url }
import Stripe from 'https://esm.sh/stripe@17?target=deno'
import { handlePreflight, json } from '../_shared/cors.ts'
import { getUser, supabaseAdmin } from '../_shared/supabaseAdmin.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

// Map plan tiers -> Stripe Price IDs (set these as function secrets).
const PRICE_BY_TIER: Record<string, string | undefined> = {
  starter: Deno.env.get('STRIPE_PRICE_STARTER'),
  growth: Deno.env.get('STRIPE_PRICE_GROWTH'),
  pro: Deno.env.get('STRIPE_PRICE_PRO'),
}

const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:5173'

Deno.serve(async (req) => {
  const preflight = handlePreflight(req)
  if (preflight) return preflight
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const { tierId } = await req.json()
    const price = PRICE_BY_TIER[tierId]
    if (!price) return json({ error: `Unknown tier: ${tierId}` }, 400)

    // Reuse an existing Stripe customer for this user if we have one.
    const { data: sub } = await supabaseAdmin()
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('owner_id', user.id)
      .maybeSingle()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      customer: sub?.stripe_customer_id ?? undefined,
      customer_email: sub?.stripe_customer_id ? undefined : user.email,
      client_reference_id: user.id,
      metadata: { owner_id: user.id, tier: tierId },
      success_url: `${APP_URL}/app/billing?checkout=success`,
      cancel_url: `${APP_URL}/app/billing?checkout=cancel`,
    })

    return json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout-session]', err)
    return json({ error: 'Failed to create checkout session.' }, 500)
  }
})
