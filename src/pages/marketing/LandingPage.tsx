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
import { Stagger, StaggerItem } from '@/components/common/Motion'
import { ScoreRing } from '@/components/ui/ScoreRing'

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

const steps = [
  { n: '1', title: 'Add your business', body: 'Name, website, industry, location — that’s it.' },
  { n: '2', title: 'Get your AI audit', body: 'Five scores and a prioritized fix list in under a minute.' },
  { n: '3', title: 'Win back leads', body: 'Follow the plan, track progress, outrank competitors.' },
]

export function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-app grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge tone="brand">
              <Sparkles className="h-3.5 w-3.5" /> AI Growth Operating System
            </Badge>
            <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight text-ink-900 sm:text-5xl">
              Know exactly why competitors get the customers{' '}
              <span className="text-brand-600">you’re losing.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-600">
              LeadMate AI audits your online presence, tracks competitors, and
              hands you a revenue plan — built for HVAC, roofing, plumbing, and
              other local trades.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/signup" size="lg">
                Start your free audit <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/pricing" variant="secondary" size="lg">
                View pricing
              </Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              No credit card required · Results in under a minute
            </p>
          </div>

          {/* Hero visual — a mock audit card */}
          <div className="relative">
            <Card className="p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">Overall Growth Score</p>
                  <p className="text-lg font-bold text-ink-900">
                    Summit Peak HVAC
                  </p>
                </div>
                <Badge tone="warn">Needs work</Badge>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <ScoreRing value={68} />
                <div className="flex-1 space-y-3">
                  {[
                    ['Website', 72],
                    ['SEO', 54],
                    ['Reputation', 81],
                    ['Conversion', 47],
                  ].map(([label, val]) => (
                    <div key={label as string}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-ink-500">{label}</span>
                        <span className="font-semibold text-ink-700">{val}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                          style={{ width: `${val as number}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                Est. <strong>15 leads / mo</strong> lost to missing online
                booking.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/50 bg-white/50 backdrop-blur-sm">
        <div className="container-app grid grid-cols-2 gap-6 py-8 text-center sm:grid-cols-4">
          {[
            ['1,000+', 'Businesses audited'],
            ['5', 'Growth scores tracked'],
            ['$18k', 'Avg. revenue recovered'],
            ['4.9/5', 'Owner rating'],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-ink-900">{stat}</p>
              <p className="text-sm text-ink-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">Everything you need to grow</Badge>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
              One platform. Every growth lever.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Stop guessing what to fix. LeadMate AI continuously audits your
              presence and tells you exactly what moves revenue.
            </p>
          </div>
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

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">How it works</Badge>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
              From audit to more leads in 3 steps
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-ink-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center sm:px-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              See what you’re losing — free.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Run your first AI audit in under a minute. No credit card, no
              commitment.
            </p>
            <div className="mt-8 flex justify-center">
              <Button to="/signup" size="lg" variant="secondary">
                Start free audit <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
