import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { IconTile } from '@/components/common/IconTile'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import type { Industry } from '@/types'

const industries: Industry[] = [
  'HVAC',
  'Roofing',
  'Electrician',
  'Plumbing',
  'Landscaping',
  'Dental',
  'Legal',
  'Accounting',
  'Insurance',
  'Other',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [analyzing, setAnalyzing] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setAnalyzing(true)
    // Simulate the audit engine running, then land on the dashboard.
    setTimeout(() => navigate('/app'), 1600)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass border-b border-white/40">
        <div className="container-app flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg p-8">
          <IconTile icon={Sparkles} size="lg" />
          <h1 className="mt-4 text-2xl font-bold text-ink-900">
            Add your business
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            We’ll scan your online presence and generate your first AI audit.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="biz-name">Business name</Label>
              <Input id="biz-name" placeholder="Summit Peak HVAC" required />
            </div>
            <div>
              <Label htmlFor="biz-url">Website URL</Label>
              <Input
                id="biz-url"
                type="url"
                placeholder="https://summitpeakhvac.com"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="biz-industry">Industry</Label>
                <Select id="biz-industry" defaultValue="HVAC">
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="biz-location">Location</Label>
                <Input id="biz-location" placeholder="Denver, CO" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Running your
                  audit…
                </>
              ) : (
                <>
                  Run my free audit <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
