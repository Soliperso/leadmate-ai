import type { ReactNode } from 'react'
import { Quote, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/common/Logo'

/** Two-column shell for login/signup: form on the left, brand panel on the right. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <div className="mt-10">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900 lg:block">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-6 text-white">
          <Quote className="h-10 w-10 text-brand-200" />
          <p className="text-2xl font-semibold leading-snug">
            “LeadMate showed us we were losing 15 leads a month to a missing
            booking button. Fixed it in a day.”
          </p>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-semibold">
              SP
            </span>
            <div>
              <p className="font-semibold">Sam Porter</p>
              <p className="text-sm text-brand-200">Owner, Summit Peak HVAC</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-100">
            <ShieldCheck className="h-4 w-4" /> Trusted by 1,000+ local
            businesses
          </div>
        </div>
      </div>
    </div>
  )
}
