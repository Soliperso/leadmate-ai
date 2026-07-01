import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/components/layout/AuthShell'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Demo mode: no real auth — go straight to the dashboard.
    setTimeout(() => navigate('/app'), 400)
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-500">
        Log in to your LeadMate AI dashboard.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@business.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/login" className="text-xs font-medium text-brand-600">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to LeadMate?{' '}
        <Link to="/signup" className="font-semibold text-brand-600">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
