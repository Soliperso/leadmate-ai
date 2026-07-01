import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/common/IconTile'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  delta?: string
  deltaTone?: 'good' | 'bad'
  tone?: IconTone
}

/** Compact KPI tile used on the dashboard. */
export function StatCard({
  icon,
  label,
  value,
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
      <p className="mt-4 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-sm text-ink-500">{label}</p>
    </Card>
  )
}
