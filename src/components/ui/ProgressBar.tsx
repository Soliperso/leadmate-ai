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

/** Thin horizontal bar for a 0-100 value, colored by score tone. */
export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        'h-2.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06]',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r shadow-sm transition-all duration-700 ease-out',
          toneClass[scoreTone(value)],
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
