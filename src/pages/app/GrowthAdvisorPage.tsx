import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { askAdvisor } from '@/services/advisor'
import { currentBusiness } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

const suggestions = [
  'How can I get more roofing leads?',
  'Write me a review response strategy',
  'What SEO fixes matter most?',
  'Draft a Google Ads plan on a $600 budget',
]

let idCounter = 0
const nextId = () => `msg_${idCounter++}`

export function GrowthAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: 'assistant',
      content: `Hi! I'm your AI Growth Advisor for ${currentBusiness.name}. Ask me anything about getting more leads — SEO, reviews, ads, or content.`,
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, thinking])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', content: trimmed },
    ])
    setInput('')
    setThinking(true)

    const answer = await askAdvisor(trimmed, {
      industry: currentBusiness.industry,
      location: currentBusiness.location,
    })

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'assistant', content: answer },
    ])
    setThinking(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <PageHeader
        title="AI Growth Advisor"
        subtitle="Chat your way to an SEO, review, and advertising plan."
      />

      <Card className="flex h-[calc(100vh-16rem)] min-h-[28rem] flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' && 'flex-row-reverse',
              )}
            >
              {msg.role === 'assistant' && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20">
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
              <div
                className={cn(
                  'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-ink-100 text-ink-800',
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl bg-ink-100 px-4 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-2 w-2 animate-bounce rounded-full bg-ink-400"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-600 shadow-sm ring-1 ring-ink-900/5 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-ink-900/5 p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your growth advisor…"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || thinking}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </>
  )
}
