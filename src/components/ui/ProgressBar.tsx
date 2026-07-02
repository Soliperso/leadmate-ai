import { motion, useReducedMotion } from 'framer-motion'
import { cn, scoreTone } from '@/lib/utils'

const toneClass: Record<'good' | 'warn' | 'bad', string> = {
  good: 'from-emerald-400 to-emerald-600',
  warn: 'from-amber-400 to-amber-500',
  bad: 'from-rose-400 to-rose-600',
}

interface ProgressBarProps {
  value: number
  className?: string
}

/** Thin horizontal bar for a 0-100 value; fills in when scrolled into view. */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const reduce = useReducedMotion()
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn(
        'h-2.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06]',
        className,
      )}
    >
      <motion.div
        className={cn(
          'h-full rounded-full bg-gradient-to-r shadow-sm',
          toneClass[scoreTone(value)],
        )}
        initial={reduce ? false : { width: 0 }}
        whileInView={reduce ? undefined : { width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={reduce ? { width: `${pct}%` } : undefined}
      />
    </div>
  )
}
