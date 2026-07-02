import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-ink-100 text-ink-600',
        brand: 'bg-brand-100 text-brand-700',
        gold: 'bg-gold-100 text-gold-700',
        good: 'bg-emerald-100 text-emerald-700',
        warn: 'bg-amber-100 text-amber-700',
        bad: 'bg-rose-100 text-rose-700',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
