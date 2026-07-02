import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react'

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
  className?: string
}

/**
 * Formatted number display. Renders the final value statically (no count-up
 * animation). Kept as a thin formatter so existing call sites and the
 * `prefix`/`suffix`/`decimals`/`format` options keep working.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  className,
}: CounterProps) {
  const text = format
    ? format(value)
    : `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`

  return <span className={className}>{text}</span>
}

interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Total travel in px across the scroll of the element (negative = up). */
  speed?: number
}

/**
 * Scroll-linked vertical parallax. Translates its content as the element moves
 * through the viewport. Static (no transform) under reduced-motion.
 */
export function Parallax({ children, className, speed = -60 }: ParallaxProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed])

  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

interface TiltProps {
  children: ReactNode
  className?: string
  /** Max rotation in degrees at the edges. */
  max?: number
}

/**
 * Pointer-reactive 3D tilt. Rotates toward the cursor with a spring, resets on
 * leave. Renders a plain wrapper under reduced-motion (no listeners, no tilt).
 */
export function Tilt({ children, className, max = 6 }: TiltProps) {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })

  if (reduce) return <div className={className}>{children}</div>

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  )
}

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the element is pulled toward the cursor, in px. */
  strength?: number
}

/**
 * Magnetic hover: nudges the element toward the cursor, springs back on leave.
 * Static under reduced-motion. Use on a wrapper around a button/CTA.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 })

  if (reduce)
    return <span className={className}>{children}</span>

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px * strength * 2)
    y.set(py * strength * 2)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  )
}
