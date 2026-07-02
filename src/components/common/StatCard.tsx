import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/common/IconTile'
import { Counter } from '@/components/common/Motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  /** Static value (used when `to` is not provided). */
  value?: string
  /** Animated count-up target. Takes precedence over `value`. */
  to?: number
  format?: (n: number) => string
  prefix?: string
  suffix?: string
  decimals?: number
  delta?: string
  deltaTone?: 'good' | 'bad'
  tone?: IconTone
}

const numberClass = 'mt-4 block font-mono text-2xl font-semibold tabular-nums text-ink-900'

/** Compact KPI tile used on the dashboard. */
export function StatCard({
  icon,
  label,
  value,
  to,
  format,
  prefix,
  suffix,
  decimals,
  delta,
  deltaTone = 'good',
  tone = 'brand',
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <IconTile icon={icon} tone={tone} />
        {delta && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              deltaTone === 'good'
                ? 'bg-emerald-100/70 text-emerald-700'
                : 'bg-rose-100/70 text-rose-700',
            )}
          >
            {delta}
          </span>
        )}
      </div>
      {to !== undefined ? (
        <Counter
          value={to}
          format={format}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className={numberClass}
        />
      ) : (
        <p className={numberClass}>{value}</p>
      )}
      <p className="text-sm text-ink-500">{label}</p>
    </Card>
  )
}
