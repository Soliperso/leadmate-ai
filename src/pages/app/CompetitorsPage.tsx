import { Star, Trophy, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Stagger, StaggerItem, Counter } from '@/components/common/Motion'
import { competitors, currentBusiness, latestAudit } from '@/data/mock'
import { cn } from '@/lib/utils'

// The current business as a comparable row.
const you = {
  id: 'you',
  name: `${currentBusiness.name} (You)`,
  rating: 4.7,
  reviews: 203,
  websiteScore: latestAudit.scores.website,
  domainAuthority: 19,
  socialEngagement: 44,
}

const rows = [you, ...competitors]

const metrics: {
  key: 'rating' | 'reviews' | 'websiteScore' | 'domainAuthority' | 'socialEngagement'
  label: string
}[] = [
  { key: 'rating', label: 'Rating' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'websiteScore', label: 'Website' },
  { key: 'domainAuthority', label: 'Domain authority' },
  { key: 'socialEngagement', label: 'Social' },
]

export function CompetitorsPage() {
  return (
    <>
      <PageHeader
        title="Competitor Intelligence"
        subtitle="See exactly why competitors win the customers you’re losing."
      />

      {/* Insight banner */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/25">
        <CardContent className="flex items-start gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-white">
              Mile High Comfort is outranking you
            </p>
            <p className="mt-1 text-sm text-brand-100">
              They have 2× your reviews and a 20-point higher website score.
              Closing the review gap is your fastest path to the map pack.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle>Side-by-side comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 text-left text-ink-500">
                  <th className="pb-3 font-medium">Business</th>
                  {metrics.map((m) => (
                    <th key={m.key} className="pb-3 font-medium">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isYou = row.id === 'you'
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b border-ink-900/5 last:border-0',
                        isYou && 'bg-brand-50/60',
                      )}
                    >
                      <td className="py-3 font-medium text-ink-900">
                        {row.name}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {row.rating}
                        </span>
                      </td>
                      <td className="py-3 text-ink-700">{row.reviews}</td>
                      <td className="py-3 text-ink-700">{row.websiteScore}</td>
                      <td className="py-3 text-ink-700">
                        {row.domainAuthority}
                      </td>
                      <td className="py-3 text-ink-700">
                        {row.socialEngagement}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Competitor cards */}
      <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((c) => (
          <StaggerItem key={c.id}>
            <Card className="h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink-900">{c.name}</h3>
                <Badge tone="neutral">
                  <TrendingUp className="h-3.5 w-3.5" /> DA {c.domainAuthority}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Counter
                  value={c.rating}
                  decimals={1}
                  className="font-semibold tabular-nums text-ink-900"
                />
                <span className="text-ink-500">· {c.reviews} reviews</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">Website score</span>
                  <span className="font-medium tabular-nums text-ink-900">
                    {c.websiteScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Social engagement</span>
                  <span className="font-medium tabular-nums text-ink-900">
                    {c.socialEngagement}
                  </span>
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  )
}
