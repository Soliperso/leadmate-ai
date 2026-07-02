import { Wind, Home, Wrench, Zap, Trees, Bug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/common/Motion'

/**
 * Quiet credibility strip under the hero: the trades LeadMate is tuned for.
 * Icon + label instead of borrowed brand logos we can't legitimately show.
 */

const trades: { icon: LucideIcon; label: string }[] = [
  { icon: Wind, label: 'HVAC' },
  { icon: Home, label: 'Roofing' },
  { icon: Wrench, label: 'Plumbing' },
  { icon: Zap, label: 'Electrical' },
  { icon: Trees, label: 'Landscaping' },
  { icon: Bug, label: 'Pest Control' },
]

export function TradesStrip() {
  return (
    <section className="border-y border-white/50 bg-white/40 backdrop-blur-sm">
      <div className="container-app py-7">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
          Purpose-built for local service trades
        </p>
        <Stagger className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {trades.map((t) => (
            <StaggerItem key={t.label}>
              <span className="flex items-center gap-2 text-ink-500 transition-colors duration-200 hover:text-ink-800">
                <t.icon className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-tight">
                  {t.label}
                </span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
