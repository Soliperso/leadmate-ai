const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Kick off Stripe Checkout for a pricing tier.
 * The secret key lives server-side; we ask the backend (Supabase edge function)
 * to create a Checkout Session and return its hosted URL, then redirect.
 * In demo mode (no keys configured) this resolves to a no-op.
 */
export async function startCheckout(tierId: string) {
  if (!publishableKey || !apiBase) {
    console.info('[billing] demo mode — checkout skipped for tier:', tierId)
    return { demo: true }
  }

  const res = await fetch(`${apiBase}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tierId }),
  })
  const { url } = await res.json()
  if (url) window.location.assign(url)
  return { demo: false }
}
