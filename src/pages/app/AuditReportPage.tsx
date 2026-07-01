import { Download, Mail, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { ScoreRing } from '@/components/ui/ScoreRing'
import {
  auditHistory,
  latestAudit,
  opportunities,
  scoreLabels,
} from '@/data/mock'
import { emailMonthlyReport } from '@/services/reports'
import { currentBusiness } from '@/data/mock'
import { formatCurrency, scoreTone } from '@/lib/utils'
import type { ScoreKey } from '@/types'

const impactTone = { high: 'bad', medium: 'warn', low: 'neutral' } as const
const toneBadge = { good: 'good', warn: 'warn', bad: 'bad' } as const

export function AuditReportPage() {
  const scoreEntries = Object.entries(latestAudit.scores) as [
    ScoreKey,
    number,
  ][]

  return (
    <>
      <PageHeader
        title="AI Business Audit"
        subtitle={`Generated ${latestAudit.createdAt} · ${currentBusiness.website}`}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                emailMonthlyReport(currentBusiness.id, 'owner@business.com')
              }
            >
              <Mail className="h-4 w-4" /> Email report
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4" /> PDF
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4" /> Re-run
            </Button>
          </>
        }
      />

      {/* Score cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6 lg:row-span-2">
          <p className="text-sm font-medium text-ink-500">Overall Growth Score</p>
          <ScoreRing value={latestAudit.overall} size={160} className="mt-3" />
          <Badge tone="warn" className="mt-4">
            Needs work
          </Badge>
          <div className="mt-6 w-full space-y-3 border-t border-ink-900/5 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Leads lost / month</span>
              <span className="font-semibold text-ink-900">
                {latestAudit.estimatedLostLeads}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Revenue at risk</span>
              <span className="font-semibold text-rose-600">
                {formatCurrency(latestAudit.estimatedLostRevenue)}
              </span>
            </div>
          </div>
        </Card>

        {scoreEntries.map(([key, value]) => (
          <Card key={key} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-500">
                {scoreLabels[key]}
              </span>
              <Badge tone={toneBadge[scoreTone(value)]}>
                {scoreTone(value) === 'good'
                  ? 'Strong'
                  : scoreTone(value) === 'warn'
                    ? 'Fair'
                    : 'Weak'}
              </Badge>
            </div>
            <p className="mt-3 text-3xl font-bold text-ink-900">{value}</p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-900/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 shadow-sm transition-all duration-700 ease-out"
                style={{ width: `${value}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Opportunities */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue opportunities</CardTitle>
          <p className="mt-1 text-sm text-ink-500">
            Prioritized by revenue impact. Fix the top items first.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="flex items-start gap-4 rounded-xl bg-ink-50/70 p-4 ring-1 ring-white/50 transition-colors hover:bg-ink-100/70"
            >
              <Badge tone={impactTone[opp.impact]} className="mt-0.5 capitalize">
                {opp.impact} impact
              </Badge>
              <div className="flex-1">
                <p className="font-semibold text-ink-900">{opp.title}</p>
                <p className="mt-1 text-sm text-ink-600">{opp.description}</p>
              </div>
              <Badge tone="neutral" className="capitalize">
                {opp.category}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Audit history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 text-left text-ink-500">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Overall</th>
                  <th className="pb-3 font-medium">Leads lost</th>
                  <th className="pb-3 font-medium">Revenue at risk</th>
                </tr>
              </thead>
              <tbody>
                {auditHistory.map((audit) => (
                  <tr
                    key={audit.id}
                    className="border-b border-ink-900/5 last:border-0"
                  >
                    <td className="py-3 text-ink-700">{audit.createdAt}</td>
                    <td className="py-3">
                      <Badge tone={toneBadge[scoreTone(audit.overall)]}>
                        {audit.overall}
                      </Badge>
                    </td>
                    <td className="py-3 text-ink-700">
                      {audit.estimatedLostLeads}
                    </td>
                    <td className="py-3 text-ink-700">
                      {formatCurrency(audit.estimatedLostRevenue)}
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
