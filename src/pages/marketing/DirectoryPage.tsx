import { useState } from 'react'
import { MapPin, Star, ShieldCheck, Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { competitors, currentBusiness } from '@/data/mock'

interface DirectoryEntry {
  name: string
  industry: string
  location: string
  rating: number
  reviews: number
  trustScore: number
}

// Build a small public directory from mock businesses.
const entries: DirectoryEntry[] = [
  {
    name: currentBusiness.name,
    industry: currentBusiness.industry,
    location: currentBusiness.location,
    rating: 4.7,
    reviews: 203,
    trustScore: 68,
  },
  ...competitors.map((c) => ({
    name: c.name,
    industry: 'HVAC',
    location: 'Denver, CO',
    rating: c.rating,
    reviews: c.reviews,
    trustScore: c.websiteScore,
  })),
]

export function DirectoryPage() {
  const [query, setQuery] = useState('')
  const filtered = entries.filter((e) =>
    `${e.name} ${e.industry} ${e.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <div className="py-16">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">Trusted business directory</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900">
            Find trusted local businesses
          </h1>
          <p className="mt-4 text-lg text-ink-600">
            Every listing is scored by LeadMate AI for reputation, website
            quality, and trust.
          </p>
          <div className="relative mx-auto mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              className="pl-10"
              placeholder="Search by name, trade, or city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {filtered.map((e) => (
            <Card key={e.name} className="p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">
                    {e.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="h-4 w-4" /> {e.location} · {e.industry}
                  </p>
                </div>
                <Badge tone={e.trustScore >= 75 ? 'good' : 'warn'}>
                  <ShieldCheck className="h-3.5 w-3.5" /> {e.trustScore} trust
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-ink-900">{e.rating}</span>
                <span className="text-ink-500">({e.reviews} reviews)</span>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-ink-500">
              No businesses match “{query}”.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
