import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  delta?: string
  deltaTone?: 'good' | 'bad'
}

/** Compact KPI tile used on the dashboard. */
export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaTone = 'good',
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        {delta && (
          <span
            className={cn(
              'text-xs font-semibold',
              deltaTone === 'good' ? 'text-emerald-600' : 'text-rose-600',
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
