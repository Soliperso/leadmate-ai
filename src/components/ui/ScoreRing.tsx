import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Counter } from '@/components/common/Motion'
import { cn, scoreTone } from '@/lib/utils'

/** Gradient endpoints [from, to] per score tone. */
const toneGradient: Record<'good' | 'warn' | 'bad', [string, string]> = {
  good: ['#34d399', '#059669'],
  warn: ['#fbbf24', '#d97706'],
  bad: ['#fb7185', '#e11d48'],
}

interface ScoreRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

/** Circular progress ring for a 0-100 score; draws in when scrolled into view. */
export function ScoreRing({
  value,
  size = 120,
  strokeWidth = 12,
  label,
  className,
}: ScoreRingProps) {
  const gradientId = useId()
  const reduce = useReducedMotion()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const [from, to] = toneGradient[scoreTone(value)]

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(15, 23, 42, 0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={reduce ? false : { strokeDashoffset: circumference }}
          whileInView={reduce ? undefined : { strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          strokeDashoffset={reduce ? offset : undefined}
          style={{ filter: `drop-shadow(0 3px 6px ${to}55)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Counter
          value={value}
          duration={1}
          className="font-mono text-2xl font-semibold tabular-nums text-ink-900"
        />
        {label && (
          <span className="text-xs font-medium capitalize text-ink-500">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
