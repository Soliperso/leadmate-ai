import { cn, scoreTone } from '@/lib/utils'

const toneClass: Record<'good' | 'warn' | 'bad', string> = {
  good: 'bg-emerald-500',
  warn: 'bg-amber-500',
  bad: 'bg-rose-500',
}

interface ProgressBarProps {
  value: number
  className?: string
}

/** Thin horizontal bar for a 0-100 value, colored by score tone. */
export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-ink-100', className)}>
      <div
        className={cn('h-full rounded-full transition-all', toneClass[scoreTone(value)])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
