import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Subtle entrance motion, per the design-system MASTER (staggered fade-in,
 * Y:12→0 + opacity). Honors prefers-reduced-motion by rendering static markup,
 * and keeps motion restrained (short, ease-out) to avoid over-animating.
 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

interface MotionProps {
  children: ReactNode
  className?: string
}

/** Grid/flex container that staggers its <StaggerItem> children on mount. */
export function Stagger({ children, className }: MotionProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
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
