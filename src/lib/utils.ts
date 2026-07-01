import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names, de-duplicating Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Map a 0-100 score to a semantic color name. */
export function scoreTone(score: number): 'good' | 'warn' | 'bad' {
  if (score >= 75) return 'good'
  if (score >= 50) return 'warn'
  return 'bad'
}

/** Format a number as USD currency. */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
