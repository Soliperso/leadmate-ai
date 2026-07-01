import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileSearch,
  Users,
  Sparkles,
  Star,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { currentBusiness } from '@/data/mock'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Audit Report', to: '/app/audit', icon: FileSearch },
  { label: 'Competitors', to: '/app/competitors', icon: Users },
  { label: 'Growth Advisor', to: '/app/advisor', icon: Sparkles },
  { label: 'Reviews', to: '/app/reviews', icon: Star },
  { label: 'Billing', to: '/app/billing', icon: CreditCard },
  { label: 'Settings', to: '/app/settings', icon: Settings },
]

/** Authenticated shell: fixed sidebar + top bar with an <Outlet /> for pages. */
export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-200 bg-white lg:flex">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <button
              className="absolute right-3 top-3 rounded-lg p-2 text-ink-500 hover:bg-ink-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              pathname={location.pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-ink-200 glass">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {currentBusiness.name}
              </p>
              <p className="truncate text-xs text-ink-500">
                {currentBusiness.industry} · {currentBusiness.location}
              </p>
            </div>

            <button
              className="relative rounded-lg p-2 text-ink-600 hover:bg-ink-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: currentBusiness.logoColor }}
            >
              {currentBusiness.name.charAt(0)}
            </span>
          </div>
        </header>

        <main className="container-app py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="flex h-16 items-center border-b border-ink-200 px-5">
        <Logo to="/app" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active =
            item.to === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-ink-200 p-3">
        <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <p className="text-sm font-semibold">On the Starter plan</p>
          <p className="mt-1 text-xs text-brand-100">
            Unlock competitor tracking & lead capture.
          </p>
          <Link
            to="/app/billing"
            className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </>
  )
}
