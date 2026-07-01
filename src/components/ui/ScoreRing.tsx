import { cn, scoreTone } from '@/lib/utils'

const toneColor: Record<'good' | 'warn' | 'bad', string> = {
  good: '#059669',
  warn: '#d97706',
  bad: '#e11d48',
}

interface ScoreRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

/** Circular progress ring for displaying a 0-100 score. */
export function ScoreRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = toneColor[scoreTone(value)]

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-ink-900">{value}</span>
        {label && (
          <span className="text-xs font-medium text-ink-500">{label}</span>
        )}
      </div>
    </div>
  )
}
