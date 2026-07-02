import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Users,
  Star,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Stagger, StaggerItem } from '@/components/common/Motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  latestAudit,
  opportunities,
  scoreLabels,
} from '@/data/mock'
import { formatCurrency } from '@/lib/utils'
import type { ScoreKey } from '@/types'

const impactTone = { high: 'bad', medium: 'warn', low: 'neutral' } as const

export function DashboardPage() {
  const scoreEntries = Object.entries(latestAudit.scores) as [
    ScoreKey,
    number,
  ][]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your growth snapshot for this month."
        actions={
          <Button to="/app/audit" size="sm">
            View full audit <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />

      {/* KPI row */}
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            icon={TrendingUp}
            tone="brand"
            label="Growth Score"
            value={String(latestAudit.overall)}
            delta="+7"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={DollarSign}
            tone="emerald"
            label="Est. monthly revenue at risk"
            value={formatCurrency(latestAudit.estimatedLostRevenue)}
            delta="-15%"
            deltaTone="good"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Users}
            tone="rose"
            label="Leads lost / month"
            value={String(latestAudit.estimatedLostLeads)}
            delta="-3"
            deltaTone="good"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Star}
            tone="amber"
            label="Avg. rating"
            value="4.7"
            delta="+0.1"
          />
        </StaggerItem>
      </Stagger>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Score breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Growth Score breakdown</CardTitle>
              <p className="mt-1 text-sm text-ink-500">
                Last audit {latestAudit.createdAt}
              </p>
            </div>
            <Badge tone="warn">Needs work</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <ScoreRing value={latestAudit.overall} size={140} label="overall" />
              <div className="w-full flex-1 space-y-4">
                {scoreEntries.map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-ink-700">
                        {scoreLabels[key]}
                      </span>
                      <span className="font-semibold text-ink-900">{value}</span>
                    </div>
                    <ProgressBar value={value} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top opportunities</CardTitle>
            <Link
              to="/app/audit"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.id} className="flex items-start gap-3">
                <Badge tone={impactTone[opp.impact]} className="mt-0.5 capitalize">
                  {opp.impact}
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {opp.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                    {opp.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          to="/app/competitors"
          title="Competitor Intelligence"
          body="See how you stack up against 3 tracked rivals."
        />
        <QuickLink
          to="/app/advisor"
          title="Ask the Growth Advisor"
          body="Get an AI growth plan for your next campaign."
        />
        <QuickLink
          to="/app/reviews"
          title="Review Monitoring"
          body="2 new reviews need a response."
        />
      </div>
    </>
  )
}

function QuickLink({
  to,
  title,
  body,
}: {
  to: string
  title: string
  body: string
}) {
  return (
    <Link
      to={to}
      className="group glass-card glass-card-hover rounded-2xl p-5 active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{title}</h3>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-600 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-500">{body}</p>
    </Link>
  )
}
