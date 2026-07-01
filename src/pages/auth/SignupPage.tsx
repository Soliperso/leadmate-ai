import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { AuthShell } from '@/components/layout/AuthShell'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'

const perks = [
  'Free AI audit — no credit card',
  'Five growth scores in under a minute',
  'Prioritized, revenue-ranked fix list',
]

export function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Demo mode: proceed to onboarding to add the first business.
    setTimeout(() => navigate('/onboarding'), 400)
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-ink-900">Start your free audit</h1>
      <p className="mt-1 text-sm text-ink-500">
        Create your account — it takes less than a minute.
      </p>

      <ul className="mt-5 space-y-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-ink-600">
            <Check className="h-4 w-4 text-emerald-600" /> {perk}
          </li>
        ))}
      </ul>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Sam Porter" required />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@business.com" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a password" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
