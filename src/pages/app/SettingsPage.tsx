import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { currentBusiness } from '@/data/mock'
import { useAuth } from '@/lib/auth'
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

const toggles = [
  { label: 'New review alerts', desc: 'Email me when a new review is posted.' },
  { label: 'Competitor movement', desc: 'Notify me when a competitor’s ranking changes.' },
  { label: 'Monthly growth report', desc: 'Send the PDF report on the 1st of each month.' },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your business profile and notifications."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business profile */}
        <Card>
          <CardHeader>
            <CardTitle>Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="s-name">Business name</Label>
              <Input id="s-name" defaultValue={currentBusiness.name} />
            </div>
            <div>
              <Label htmlFor="s-url">Website</Label>
              <Input id="s-url" defaultValue={currentBusiness.website} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="s-industry">Industry</Label>
                <Select id="s-industry" defaultValue={currentBusiness.industry}>
                  {industries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="s-location">Location</Label>
                <Input id="s-location" defaultValue={currentBusiness.location} />
              </div>
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="s-owner">Your name</Label>
              <Input id="s-owner" defaultValue={user?.fullName ?? ''} />
            </div>
            <div>
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                type="email"
                defaultValue={user?.email ?? ''}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="s-pass">Change password</Label>
              <Input id="s-pass" type="password" placeholder="New password" />
            </div>
            <div className="flex items-center justify-between">
              <Button>Update account</Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {toggles.map((t, i) => (
              <label
                key={t.label}
                className="flex cursor-pointer items-center justify-between rounded-xl bg-ink-50/70 p-4 ring-1 ring-white/50 transition-colors hover:bg-ink-100/60"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{t.label}</p>
                  <p className="text-sm text-ink-500">{t.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-ink-200 transition-colors checked:bg-brand-600 relative after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform checked:after:translate-x-4"
                />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
