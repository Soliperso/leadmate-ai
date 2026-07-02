import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Reveal, Stagger, StaggerItem } from '@/components/common/Motion'

/**
 * Social proof before the final CTA. Owner name + trade + location + a concrete
 * result metric — the credibility signals the "Trust & Authority" pattern calls
 * for. Avatars are initials on a brand tint (no stock-photo faces to fake).
 */

interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
  metric: string
  metricLabel: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'I could finally see the three shops eating my calls. Two months later I’m the top HVAC result in my zip and booked solid.',
    name: 'Marcus Reyes',
    role: 'Reyes Heating & Air · Denver, CO',
    initials: 'MR',
    metric: '#1',
    metricLabel: 'local rank',
  },
  {
    quote:
      'The audit found a broken booking form we’d had for a year. Fixing that one thing paid for LeadMate for life.',
    name: 'Dana Whitfield',
    role: 'Whitfield Roofing · Austin, TX',
    initials: 'DW',
    metric: '+41%',
    metricLabel: 'booked jobs',
  },
  {
    quote:
      'The AI drafts my review replies in my own voice. I went from ignoring reviews to answering every one the same day.',
    name: 'Tony Calderon',
    role: 'Calderon Plumbing · Phoenix, AZ',
    initials: 'TC',
    metric: '4.9★',
    metricLabel: 'from 4.3',
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-app">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">Owners in the field</Badge>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
            Trades owners winning back their area
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="glass-card glass-card-hover flex h-full flex-col rounded-2xl p-6">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white ring-1 ring-white/20">
                    {t.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {t.name}
                    </p>
                    <p className="truncate text-xs text-ink-500">{t.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold tabular-nums text-emerald-600">
                      {t.metric}
                    </p>
                    <p className="text-[11px] text-ink-400">{t.metricLabel}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
