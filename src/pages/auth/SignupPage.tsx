import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/layout/AuthShell'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'

const perks = [
  'Free AI audit — no credit card',
  'Five growth scores in under a minute',
  'Prioritized, revenue-ranked fix list',
]

export function SignupPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error, needsConfirmation } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    if (needsConfirmation) {
      setConfirmSent(true)
      return
    }
    navigate('/onboarding')
  }

  if (confirmSent) {
    return (
      <AuthShell>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <MailCheck className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Confirm your email</h1>
        <p className="mt-1 text-sm text-ink-500">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then log in to run your first audit.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex font-semibold text-brand-600"
        >
          Go to log in
        </Link>
      </AuthShell>
    )
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
          <Input
            id="name"
            placeholder="Sam Porter"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

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
