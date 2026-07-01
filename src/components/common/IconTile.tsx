import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconTone = 'brand' | 'emerald' | 'amber' | 'rose' | 'ink'
type IconSize = 'sm' | 'md' | 'lg'

const toneClass: Record<IconTone, string> = {
  brand: 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/30',
  emerald: 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30',
  amber: 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30',
  rose: 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30',
  ink: 'bg-gradient-to-br from-ink-700 to-ink-900 shadow-ink-900/30',
}

const boxSize: Record<IconSize, string> = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-12 w-12 rounded-2xl',
}

const glyphSize: Record<IconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

interface IconTileProps {
  icon: LucideIcon
  tone?: IconTone
  size?: IconSize
  className?: string
}

/**
 * Gradient icon chip with a soft colored shadow — the shared visual for every
 * icon badge across the app (KPI tiles, banners, empty states).
 */
export function IconTile({
  icon: Icon,
  tone = 'brand',
  size = 'md',
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center text-white shadow-lg ring-1 ring-white/20',
        boxSize[size],
        toneClass[tone],
        className,
      )}
    >
      <Icon className={glyphSize[size]} />
    </span>
  )
}
