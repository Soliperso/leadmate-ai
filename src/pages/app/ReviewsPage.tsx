import { useState } from 'react'
import { Star, Sparkles, Check, MessageSquare, Reply } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/common/StatCard'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { reviews } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

const sourceTone = {
  Google: 'brand',
  Yelp: 'bad',
  Facebook: 'neutral',
} as const

export function ReviewsPage() {
  const [items, setItems] = useState<Review[]>(reviews)
  const [draftFor, setDraftFor] = useState<string | null>(null)

  const avg =
    items.reduce((sum, r) => sum + r.rating, 0) / (items.length || 1)
  const needsResponse = items.filter((r) => !r.responded).length

  function markResponded(id: string) {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, responded: true } : r)),
    )
    setDraftFor(null)
  }

  return (
    <>
      <PageHeader
        title="Review Monitoring"
        subtitle="Track new reviews and respond with AI-drafted replies."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Star}
          tone="amber"
          label="Average rating"
          value={avg.toFixed(1)}
        />
        <StatCard
          icon={MessageSquare}
          tone="brand"
          label="Total reviews"
          value={String(items.length)}
        />
        <StatCard
          icon={Reply}
          tone={needsResponse > 0 ? 'rose' : 'emerald'}
          label="Awaiting response"
          value={String(needsResponse)}
          delta={needsResponse > 0 ? 'Action needed' : 'All clear'}
          deltaTone={needsResponse > 0 ? 'bad' : 'good'}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((review) => (
            <div
              key={review.id}
              className="rounded-xl bg-ink-50/70 p-4 ring-1 ring-white/50 transition-colors hover:bg-ink-100/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-600">
                    {review.author.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3.5 w-3.5',
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-ink-200',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={sourceTone[review.source]}>{review.source}</Badge>
                  <span className="text-xs text-ink-400">{review.date}</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-ink-600">{review.text}</p>

              {review.responded ? (
                <Badge tone="good" className="mt-3">
                  <Check className="h-3.5 w-3.5" /> Responded
                </Badge>
              ) : draftFor === review.id ? (
                <div className="mt-3 rounded-xl bg-brand-50 p-3">
                  <p className="text-xs font-medium text-brand-700">
                    <Sparkles className="mr-1 inline h-3.5 w-3.5" /> AI draft
                  </p>
                  <p className="mt-1 text-sm text-ink-700">
                    Thanks so much for the feedback, {review.author.split(' ')[0]}
                    ! We’re sorry the booking felt confusing — we’ve simplified
                    it and would love to make your next visit seamless.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => markResponded(review.id)}>
                      Post response
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDraftFor(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setDraftFor(review.id)}
                >
                  <Sparkles className="h-4 w-4" /> Draft AI response
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
