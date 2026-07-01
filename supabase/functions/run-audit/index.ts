// Audit engine — scores a business across the five dimensions, generates
// prioritized opportunities via OpenAI, and persists an `audits` row plus its
// `opportunities`. Returns the created audit id.
//   POST { business_id } -> { audit_id }
//
// v1 note: scoring uses a deterministic placeholder model. Live signals
// (PageSpeed, Places, review APIs) are planned for v1.2 — see docs/PRD.md.
import OpenAI from 'https://esm.sh/openai@4'
import { handlePreflight, json } from '../_shared/cors.ts'
import { getUser, supabaseAdmin } from '../_shared/supabaseAdmin.ts'

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

type Category = 'website' | 'seo' | 'reputation' | 'conversion' | 'visibility'

interface Opportunity {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: Category
}

/** Placeholder scorer — stable per business so scores don't jump each run. */
function scoreBusiness(seed: string) {
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const pick = (offset: number, lo = 40, hi = 90) =>
    lo + (((h >> offset) % 1000) / 1000) * (hi - lo)
  const scores = {
    website: Math.round(pick(0)),
    seo: Math.round(pick(3)),
    reputation: Math.round(pick(6)),
    conversion: Math.round(pick(9)),
    visibility: Math.round(pick(12)),
  }
  const overall = Math.round(
    (scores.website + scores.seo + scores.reputation + scores.conversion + scores.visibility) / 5,
  )
  const estimated_lost_leads = Math.round((100 - overall) * 0.4)
  const estimated_lost_revenue = estimated_lost_leads * 1200
  return { scores, overall, estimated_lost_leads, estimated_lost_revenue }
}

async function generateOpportunities(
  business: { name: string; industry: string; location: string | null },
  scores: Record<Category, number>,
): Promise<Opportunity[]> {
  if (!Deno.env.get('OPENAI_API_KEY')) return fallbackOpportunities(scores)
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an audit engine for local businesses. Return JSON: {"opportunities":[{"title","description","impact":"high|medium|low","category":"website|seo|reputation|conversion|visibility"}]}. 3-5 items, prioritized by revenue impact.',
        },
        {
          role: 'user',
          content: `Business: ${business.name} (${business.industry}${
            business.location ? `, ${business.location}` : ''
          }). Scores 0-100: ${JSON.stringify(scores)}. Focus on the weakest areas.`,
        },
      ],
    })
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? '{}')
    const items = parsed.opportunities
    return Array.isArray(items) && items.length ? items : fallbackOpportunities(scores)
  } catch (err) {
    console.error('[run-audit] opportunity generation failed', err)
    return fallbackOpportunities(scores)
  }
}

function fallbackOpportunities(scores: Record<Category, number>): Opportunity[] {
  return (Object.keys(scores) as Category[])
    .sort((a, b) => scores[a] - scores[b])
    .slice(0, 3)
    .map((category) => ({
      category,
      impact: scores[category] < 55 ? 'high' : 'medium',
      title: `Improve your ${category} score`,
      description: `Your ${category} score is ${scores[category]}/100 — one of your weakest areas. Addressing it should recover leads.`,
    }))
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req)
  if (preflight) return preflight
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const { business_id } = await req.json()
    if (!business_id) return json({ error: '"business_id" is required.' }, 400)

    const db = supabaseAdmin()

    const { data: business } = await db
      .from('businesses')
      .select('id, name, industry, location, owner_id')
      .eq('id', business_id)
      .single()

    if (!business || business.owner_id !== user.id) {
      return json({ error: 'Business not found.' }, 404)
    }

    const { scores, overall, estimated_lost_leads, estimated_lost_revenue } =
      scoreBusiness(business.id)

    const { data: audit, error: auditErr } = await db
      .from('audits')
      .insert({
        business_id: business.id,
        overall,
        score_website: scores.website,
        score_seo: scores.seo,
        score_reputation: scores.reputation,
        score_conversion: scores.conversion,
        score_visibility: scores.visibility,
        estimated_lost_leads,
        estimated_lost_revenue,
      })
      .select('id')
      .single()

    if (auditErr || !audit) throw auditErr ?? new Error('Audit insert failed')

    const opportunities = await generateOpportunities(business, scores)
    if (opportunities.length) {
      await db.from('opportunities').insert(
        opportunities.map((o) => ({ ...o, audit_id: audit.id })),
      )
    }

    return json({ audit_id: audit.id })
  } catch (err) {
    console.error('[run-audit]', err)
    return json({ error: 'Failed to run audit.' }, 500)
  }
})
