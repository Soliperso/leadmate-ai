import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Motion toolkit for LeadMate AI. Every primitive honors prefers-reduced-motion
 * by rendering final/static markup (no layout shift), and scroll-triggered
 * effects fire once via `whileInView` so nothing re-animates on scroll.
 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

interface MotionProps {
  children: ReactNode
  className?: string
}

/** Container that staggers its <StaggerItem> children when scrolled into view. */
export function Stagger({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

/** A single staggered child. Becomes a plain wrapper under reduced-motion. */
export function StaggerItem({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

/** Scroll-triggered fade + rise for a single block/section. Fires once. */
export function Reveal({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Interactive hover-lift + tap-scale wrapper for clickable cards/CTAs. */
export function Pressable({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Gentle page-level entrance, replayed on every route change (keyed by path).
 * Wrap a layout's <Outlet /> with this. Static under reduced-motion.
 */
export function PageTransition({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      key={pathname}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

interface CounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  format?: (n: number) => string
  duration?: number
  className?: string
}

/**
 * Count-up number that animates from 0 to `value` when scrolled into view.
 * Renders the final value immediately under reduced-motion. Pair with
 * `tabular-nums` so the width doesn't reflow while counting.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  duration = 1.2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (reduce) {
      setDisplay(value)
      return
    }
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, reduce, duration])

  const text = format
    ? format(display)
    : `${prefix}${display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
