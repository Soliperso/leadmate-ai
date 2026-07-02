import { Check, X, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/common/Motion'

/**
 * "You vs. the rival next door" band — the core LeadMate story shown as a
 * head-to-head. Left column is the status quo (leads bleeding out); right
 * column is the same business running LeadMate. Matches the design-system
 * "comparison" pattern that converts strongest for this product.
 */

const without = [
  'Guessing why the phone stopped ringing',
  'Competitors outranking you on Google',
  'Reviews going unanswered for weeks',
  'Slow site quietly losing booked jobs',
]

const withLeadMate = [
  'A ranked fix-list tied to real revenue',
  'A live map of who’s taking your area',
  'AI-drafted replies the moment a review lands',
  'A 24/7 widget that qualifies and books leads',
]

export function CompareBand() {
  return (
    <section className="py-20">
      <div className="container-app">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">You vs. the rival next door</Badge>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
            The gap isn’t your work. It’s your visibility.
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            Same trucks, same crews, same quality. The business that shows up
            first wins the call. Here’s the difference LeadMate makes.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {/* Without */}
          <Reveal className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white/60 p-7 backdrop-blur-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-200/30 blur-2xl" />
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <TrendingDown className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide text-rose-600">
                Without LeadMate
              </span>
            </div>
            <p className="mt-6 text-4xl font-semibold tabular-nums text-rose-600">
              −15 leads
            </p>
            <p className="text-sm text-ink-500">slipping to rivals every month</p>
            <ul className="mt-6 space-y-3">
              {without.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* With */}
          <Reveal className="glass-card relative overflow-hidden rounded-3xl p-7 ring-1 ring-brand-200/60">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/25 blur-2xl" />
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                With LeadMate
              </span>
            </div>
            <p className="mt-6 text-4xl font-semibold tabular-nums text-emerald-600">
              +$18k / mo
            </p>
            <p className="text-sm text-ink-500">in recovered, trackable revenue</p>
            <ul className="mt-6 space-y-3">
              {withLeadMate.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
