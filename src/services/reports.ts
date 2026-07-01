const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Trigger a monthly growth report email (rendered to PDF server-side and
 * delivered via Resend). No-ops in demo mode.
 */
export async function emailMonthlyReport(businessId: string, to: string) {
  if (!apiBase) {
    console.info('[reports] demo mode — would email report to:', to)
    return { demo: true }
  }
  await fetch(`${apiBase}/send-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId, to }),
  })
  return { demo: false }
}
