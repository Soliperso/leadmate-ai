const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Ask the AI Growth Advisor a question.
 * OpenAI is called from a server/edge function (never the browser) to keep the
 * key secret. Without a configured backend we fall back to a canned response so
 * the chat UI is fully explorable in demo mode.
 */
export async function askAdvisor(
  question: string,
  context?: { industry?: string; location?: string },
): Promise<string> {
  if (!apiBase) {
    return demoAnswer(question, context)
  }

  const res = await fetch(`${apiBase}/growth-advisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context }),
  })
  const data = await res.json()
  return data.answer as string
}

function demoAnswer(
  question: string,
  context?: { industry?: string; location?: string },
): string {
  const industry = context?.industry ?? 'your industry'
  const where = context?.location ? ` in ${context.location}` : ''
  return [
    `Here's a growth plan for "${question.trim() || 'more leads'}"${where}:`,
    '',
    `1. SEO — Publish 2 location pages targeting "${industry} near me" and fix Core Web Vitals to lift page speed.`,
    '2. Reviews — Send a review request SMS after every completed job; aim for +8 reviews this month.',
    '3. Advertising — Run a $600/mo Google Local Services campaign focused on emergency keywords.',
    '4. Content — Publish 1 "cost guide" article; these rank well and convert bottom-of-funnel visitors.',
    '',
    'Connect an OpenAI key on the backend to get fully personalized, live recommendations.',
  ].join('\n')
}
