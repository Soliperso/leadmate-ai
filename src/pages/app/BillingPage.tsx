import { useState } from 'react'
import { Check, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { IconTile } from '@/components/common/IconTile'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { pricingTiers } from '@/data/mock'
import { startCheckout } from '@/services/billing'
import { cn } from '@/lib/utils'

const currentPlanId = 'starter'

export function BillingPage() {
  const [pending, setPending] = useState<string | null>(null)

  async function upgrade(tierId: string) {
    setPending(tierId)
    await startCheckout(tierId)
    setPending(null)
  }

  return (
    <>
      <PageHeader
        title="Billing & Plans"
        subtitle="Manage your subscription and upgrade for more growth tools."
      />

      {/* Current plan */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <IconTile icon={CreditCard} size="lg" />
            <div>
              <p className="flex items-center gap-2 font-semibold text-ink-900">
                Starter plan <Badge tone="brand">Current</Badge>
              </p>
              <p className="text-sm text-ink-500">
                $29/mo · renews Aug 1, 2026
              </p>
            </div>
          </div>
          <Button variant="secondary">Manage payment method</Button>
        </CardContent>
      </Card>

      {/* Plan options */}
      <div className="grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => {
          const isCurrent = tier.id === currentPlanId
          return (
            <Card
              key={tier.id}
              className={cn(
                'flex flex-col p-6',
                tier.highlighted && 'ring-2 ring-brand-500',
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink-900">
                  {tier.name}
                </h3>
                {tier.highlighted && <Badge tone="brand">Popular</Badge>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-ink-900">
                  ${tier.price}
                </span>
                <span className="text-ink-500">{tier.cadence}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-ink-700">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent || pending === tier.id}
                onClick={() => upgrade(tier.id)}
              >
                {isCurrent
                  ? 'Current plan'
                  : pending === tier.id
                    ? 'Redirecting…'
                    : `Upgrade to ${tier.name}`}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Invoices */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 text-left text-ink-500">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Jul 1, 2026', 'Starter plan — monthly', '$29.00'],
                  ['Jun 1, 2026', 'Starter plan — monthly', '$29.00'],
                  ['May 1, 2026', 'Starter plan — monthly', '$29.00'],
                ].map(([date, desc, amount]) => (
                  <tr
                    key={date}
                    className="border-b border-ink-900/5 last:border-0"
                  >
                    <td className="py-3 text-ink-700">{date}</td>
                    <td className="py-3 text-ink-700">{desc}</td>
                    <td className="py-3 text-ink-700">{amount}</td>
                    <td className="py-3">
                      <Badge tone="good">Paid</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
