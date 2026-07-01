import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  to?: string
  className?: string
  /** Use light text for dark backgrounds. */
  inverted?: boolean
}

export function Logo({ to = '/', className, inverted }: LogoProps) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <Sparkles className="h-5 w-5" />
      </span>
      <span
        className={cn(
          'text-lg font-bold tracking-tight',
          inverted ? 'text-white' : 'text-ink-900',
        )}
      >
        LeadMate<span className="text-brand-500"> AI</span>
      </span>
    </Link>
  )
}
