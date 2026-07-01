import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY
const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let initialized = false

/** Initialize PostHog once, only when a key is present. */
export function initAnalytics() {
  if (initialized || !key) return
  posthog.init(key, { api_host: host, capture_pageview: false })
  initialized = true
}

/** Safe capture that no-ops when analytics is not configured. */
export function track(event: string, props?: Record<string, unknown>) {
  if (!initialized) return
  posthog.capture(event, props)
}
