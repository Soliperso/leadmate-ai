import {
  ArrowRight,
  Search,
  Users,
  Sparkles,
  Star,
  Zap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { IconTile } from '@/components/common/IconTile'
import {
  Stagger,
  StaggerItem,
  Reveal,
  Counter,
  Parallax,
  Tilt,
  Magnetic,
} from '@/components/common/Motion'
import { LocalMap } from '@/components/marketing/LocalMap'
import { TradesStrip } from '@/components/marketing/TradesStrip'
import { CompareBand } from '@/components/marketing/CompareBand'
import { Testimonials } from '@/components/marketing/Testimonials'
import { HowItWorks } from '@/components/marketing/HowItWorks'

const features: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Search,
    title: 'AI Business Audit',
    body: 'Score your website, SEO, reputation, conversion, and visibility in seconds.',
  },
  {
    icon: Users,
    title: 'Competitor Intelligence',
    body: 'See exactly why competitors win the customers you are losing.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Opportunity Scanner',
    body: 'Detect missing booking, forms, and slow pages — with lost-revenue estimates.',
  },
  {
    icon: Sparkles,
    title: 'AI Growth Advisor',
    body: 'Chat your way to an SEO, review, and advertising plan tailored to your trade.',
  },
  {
    icon: Star,
    title: 'Review Monitoring',
    body: 'Track new reviews and get AI-drafted responses that protect your reputation.',
  },
  {
    icon: Zap,
    title: 'AI Lead Capture',
    body: 'A website widget that answers questions, qualifies leads, and books jobs 24/7.',
  },
]

const stats: {
  prefix?: string
  value: number
  decimals?: number
  suffix?: string
  label: string
}[] = [
  { value: 1000, suffix: '+', label: 'Businesses audited' },
  { value: 5, label: 'Growth scores tracked' },
  { prefix: '$', value: 18, suffix: 'k', label: 'Avg. revenue recovered' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Owner rating' },
]

export function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        {/* Faint dot grid for depth; masked so it fades toward the edges. */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.4] [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(30,58,138,0.16) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-app grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge tone="brand">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              Local growth intelligence
            </Badge>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Own your area.{' '}
              <span className="text-gradient-gold">
                Outrank the rivals stealing your leads.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-600">
              LeadMate AI maps every competitor in your service area, shows
              exactly why they outrank you, and hands you the plan to take the
              territory back — built for HVAC, roofing, and plumbing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Magnetic>
                <Button to="/signup" size="lg" variant="cta">
                  See who’s beating you — free <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
              <Button to="/pricing" variant="secondary" size="lg">
                View pricing
              </Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              No credit card required · Results in under a minute
            </p>
          </div>

          {/* Hero visual — local dominance map */}
          <div className="relative">
            <Parallax speed={-26}>
              <Tilt>
                <LocalMap />
              </Tilt>
            </Parallax>
            <div className="pointer-events-none absolute -right-4 -top-5 hidden rounded-2xl bg-white p-3 shadow-xl ring-1 ring-ink-900/5 sm:block">
              <p className="text-xs text-ink-500">Leads lost / month</p>
              <p className="font-mono text-2xl font-semibold tabular-nums text-rose-600">
                15
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trades trust strip */}
      <TradesStrip />

      {/* Social proof strip */}
      <section className="border-y border-white/50 bg-white/50 backdrop-blur-sm">
        <Stagger className="container-app grid grid-cols-2 gap-6 py-8 text-center sm:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <Counter
                value={s.value}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
                className="block font-mono text-2xl font-semibold tabular-nums text-ink-900"
              />
              <p className="text-sm text-ink-500">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container-app">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">Everything you need to grow</Badge>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
              One platform. Every growth lever.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Stop guessing what to fix. LeadMate AI continuously audits your
              presence and tells you exactly what moves revenue.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <Card className="glass-card-hover h-full p-6">
                  <IconTile icon={f.icon} size="lg" />
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600">{f.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* You vs. the rival next door */}
      <CompareBand />

      {/* How it works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center sm:px-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              See what you’re losing — free.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Run your first AI audit in under a minute. No credit card, no
              commitment.
            </p>
            <div className="mt-8 flex justify-center">
              <Button to="/signup" size="lg" variant="cta">
                Start free audit <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
