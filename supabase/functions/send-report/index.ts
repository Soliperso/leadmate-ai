// Emails a monthly growth report for a business via Resend.
// Contract matches src/services/reports.ts:  POST { businessId, to } -> 200
// v1 sends an HTML summary of the latest audit; PDF rendering can be added later.
import { Resend } from 'https://esm.sh/resend@4'
import { handlePreflight, json } from '../_shared/cors.ts'
import { getUser, supabaseAdmin } from '../_shared/supabaseAdmin.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const FROM = Deno.env.get('REPORT_FROM_EMAIL') ?? 'reports@leadmate.ai'

Deno.serve(async (req) => {
  const preflight = handlePreflight(req)
  if (preflight) return preflight
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const { businessId, to } = await req.json()
    if (!businessId || !to) {
      return json({ error: '"businessId" and "to" are required.' }, 400)
    }

    const db = supabaseAdmin()

    // Ownership check + latest audit in one round-trip each.
    const { data: business } = await db
      .from('businesses')
      .select('id, name, owner_id')
      .eq('id', businessId)
      .single()

    if (!business || business.owner_id !== user.id) {
      return json({ error: 'Business not found.' }, 404)
    }

    const { data: audit } = await db
      .from('audits')
      .select('overall, estimated_lost_revenue, created_at')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const html = `
      <h1>${business.name} — Monthly Growth Report</h1>
      ${
        audit
          ? `<p>Overall score: <strong>${audit.overall}/100</strong></p>
             <p>Estimated lost revenue: <strong>$${audit.estimated_lost_revenue.toLocaleString()}/mo</strong></p>`
          : `<p>No audit has been run yet.</p>`
      }
      <p>Log in to LeadMate AI to see your full report and recommendations.</p>
    `

    await resend.emails.send({
      from: FROM,
      to,
      subject: `${business.name} — your LeadMate AI growth report`,
      html,
    })

    return json({ ok: true })
  } catch (err) {
    console.error('[send-report]', err)
    return json({ error: 'Failed to send report.' }, 500)
  }
})
