import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Stagger, StaggerItem, Reveal, Counter } from '@/components/common/Motion'
import { pricingTiers } from '@/data/mock'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Do I need a credit card to start?',
    a: 'No. Run your first AI audit free — you only pay when you upgrade for tracking and automation.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes, upgrade or downgrade at any time. Changes are prorated automatically via Stripe.',
  },
  {
    q: 'Which industries do you support?',
    a: 'We’re optimized for local service trades — HVAC, roofing, plumbing, electrical, landscaping — plus dentists, lawyers, and more.',
  },
]

export function PricingPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-app">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">Pricing</Badge>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-ink-900">
            Simple plans that pay for themselves
          </h1>
          <p className="mt-4 text-lg text-ink-600">
            Start free. Upgrade when you’re ready to outrank competitors and
            automate lead capture.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <StaggerItem key={tier.id} className="h-full">
            <Card
              className={cn(
                'flex h-full flex-col p-6',
                tier.highlighted &&
                  'ring-2 ring-gold-400 shadow-lg lg:-translate-y-2',
              )}
            >
              {tier.highlighted && (
                <Badge tone="gold" className="mb-3 w-fit">
                  Most popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-ink-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{tier.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <Counter
                  value={tier.price}
                  prefix="$"
                  className="font-mono text-4xl font-semibold tabular-nums text-ink-900"
                />
                <span className="text-ink-500">{tier.cadence}</span>
              </div>
              <Button
                to="/signup"
                variant={tier.highlighted ? 'cta' : 'secondary'}
                className="mt-6 w-full"
              >
                Get started
              </Button>
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-ink-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Enterprise strip */}
        <div className="glass-card mx-auto mt-8 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl p-6 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold text-ink-900">Enterprise</h3>
            <p className="text-sm text-ink-500">
              Multi-location, agency white-label, and partner network — custom
              pricing.
            </p>
          </div>
          <Button to="/signup" variant="outline">
            Talk to sales <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <Reveal>
            <h2 className="text-center font-display text-2xl text-ink-900">
              Frequently asked questions
            </h2>
          </Reveal>
          <Stagger className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <StaggerItem key={faq.q}>
                <Card className="p-6">
                  <h3 className="font-semibold text-ink-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-ink-600">{faq.a}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  )
}
