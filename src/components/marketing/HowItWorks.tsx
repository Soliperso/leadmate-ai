import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Reveal, Stagger, StaggerItem } from '@/components/common/Motion'

const steps = [
  { n: '1', title: 'Add your business', body: 'Name, website, industry, location — that’s it.' },
  { n: '2', title: 'Get your AI audit', body: 'Five scores and a prioritized fix list in under a minute.' },
  { n: '3', title: 'Win back leads', body: 'Follow the plan, track progress, outrank competitors.' },
]

/**
 * "How it works" with a scroll-linked connecting line that draws from navy to
 * gold as the section scrolls into view. The line sits behind the (relatively
 * positioned) step circles. Under reduced-motion the line renders fully drawn.
 */
export function HowItWorks() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 65%'],
  })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="bg-white/80 py-20 backdrop-blur-sm">
      <div className="container-app">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">How it works</Badge>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
            From audit to more leads in 3 steps
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-12">
          {/* Connecting line (desktop only) — track + scroll-drawn fill */}
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden sm:block">
            <div className="mx-auto h-0.5 w-2/3 overflow-hidden rounded-full bg-ink-100">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-brand-500 to-gold-500"
                style={{ scaleX: reduce ? 1 : scaleX }}
              />
            </div>
          </div>

          <Stagger className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <StaggerItem key={s.n} className="text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-lg shadow-brand-600/30 ring-4 ring-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-ink-600">{s.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
