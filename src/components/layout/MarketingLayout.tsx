import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Directory', to: '/directory' },
]

/** Public shell: top navigation + footer, used for landing / pricing / directory. */
export function MarketingLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-200/70 glass">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button to="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Button to="/signup" size="sm">
              Start free audit
            </Button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-ink-200 bg-white md:hidden">
            <div className="container-app flex flex-col gap-1 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <Button to="/login" variant="secondary" size="sm">
                  Log in
                </Button>
                <Button to="/signup" size="sm">
                  Start free audit
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-app grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            The AI Growth Operating System for local businesses.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { label: 'Features', to: '/#features' },
            { label: 'Pricing', to: '/pricing' },
            { label: 'Directory', to: '/directory' },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { label: 'Log in', to: '/login' },
            { label: 'Sign up', to: '/signup' },
            { label: 'Dashboard', to: '/app' },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: 'About', to: '/' },
            { label: 'Contact', to: '/' },
            { label: 'Privacy', to: '/' },
          ]}
        />
      </div>
      <div className="border-t border-ink-200">
        <div className="container-app py-5 text-sm text-ink-400">
          © {new Date().getFullYear()} LeadMate AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; to: string }[]
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <NavLink
              to={link.to}
              className={cn(
                'text-sm text-ink-500 transition-colors hover:text-brand-600',
              )}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
