// AI Growth Advisor — proxies a chat question to OpenAI with business context.
// The OpenAI key lives only here (never in the browser).
// Contract matches src/services/advisor.ts:  POST { question, context } -> { answer }
import OpenAI from 'https://esm.sh/openai@4'
import { handlePreflight, json } from '../_shared/cors.ts'

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

const SYSTEM_PROMPT = `You are LeadMate AI's Growth Advisor for local service
businesses (HVAC, roofing, plumbing, electrical, etc.). Give concrete, prioritized,
revenue-focused advice across SEO, reviews/reputation, website conversion, and local
advertising. Be specific and actionable. Keep answers under 250 words.`

Deno.serve(async (req) => {
  const preflight = handlePreflight(req)
  if (preflight) return preflight
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { question, context } = await req.json()
    if (!question || typeof question !== 'string') {
      return json({ error: 'A "question" string is required.' }, 400)
    }

    const contextLine = [
      context?.industry ? `Industry: ${context.industry}.` : '',
      context?.location ? `Location: ${context.location}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: contextLine ? `${contextLine}\n\n${question}` : question,
        },
      ],
      max_tokens: 500,
    })

    const answer = completion.choices[0]?.message?.content ?? ''
    return json({ answer })
  } catch (err) {
    console.error('[growth-advisor]', err)
    return json({ error: 'Failed to generate advice.' }, 500)
  }
})
