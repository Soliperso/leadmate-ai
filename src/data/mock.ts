import type {
  Audit,
  Business,
  Competitor,
  Opportunity,
  PricingTier,
  Review,
} from '@/types'

export const currentBusiness: Business = {
  id: 'biz_1',
  name: 'Summit Peak HVAC',
  website: 'summitpeakhvac.com',
  industry: 'HVAC',
  location: 'Denver, CO',
  logoColor: '#2563eb',
}

export const latestAudit: Audit = {
  id: 'audit_3',
  businessId: 'biz_1',
  createdAt: '2026-06-28',
  overall: 68,
  scores: {
    website: 72,
    seo: 54,
    reputation: 81,
    conversion: 47,
    visibility: 63,
  },
  estimatedLostLeads: 15,
  estimatedLostRevenue: 18400,
}

export const auditHistory: Audit[] = [
  latestAudit,
  {
    id: 'audit_2',
    businessId: 'biz_1',
    createdAt: '2026-05-28',
    overall: 61,
    scores: { website: 68, seo: 48, reputation: 79, conversion: 42, visibility: 58 },
    estimatedLostLeads: 18,
    estimatedLostRevenue: 21200,
  },
  {
    id: 'audit_1',
    businessId: 'biz_1',
    createdAt: '2026-04-28',
    overall: 55,
    scores: { website: 63, seo: 41, reputation: 74, conversion: 39, visibility: 52 },
    estimatedLostLeads: 22,
    estimatedLostRevenue: 25600,
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'No online booking',
    description:
      'Visitors can’t schedule a service call without phoning. Adding online booking typically recovers 12–18 leads/month.',
    impact: 'high',
    category: 'conversion',
  },
  {
    id: 'opp_2',
    title: 'Weak local SEO for "AC repair Denver"',
    description:
      'You rank #14 for your top money keyword. Two optimized location pages could move you onto page one.',
    impact: 'high',
    category: 'seo',
  },
  {
    id: 'opp_3',
    title: 'Slow homepage (4.8s LCP)',
    description:
      'Largest Contentful Paint is well above the 2.5s target, costing you mobile conversions.',
    impact: 'medium',
    category: 'website',
  },
  {
    id: 'opp_4',
    title: 'Contact form missing on 6 pages',
    description:
      'Key service pages have no call-to-action, so interested visitors leave without converting.',
    impact: 'medium',
    category: 'conversion',
  },
  {
    id: 'opp_5',
    title: 'No Google Business posts in 60 days',
    description:
      'Regular GBP posts improve map-pack visibility. You have none in the last two months.',
    impact: 'low',
    category: 'visibility',
  },
]

export const competitors: Competitor[] = [
  {
    id: 'comp_1',
    name: 'Mile High Comfort',
    rating: 4.8,
    reviews: 412,
    websiteScore: 88,
    domainAuthority: 34,
    socialEngagement: 76,
  },
  {
    id: 'comp_2',
    name: 'FrontRange Heating & Air',
    rating: 4.6,
    reviews: 289,
    websiteScore: 79,
    domainAuthority: 28,
    socialEngagement: 61,
  },
  {
    id: 'comp_3',
    name: 'Rocky Mountain HVAC Pros',
    rating: 4.4,
    reviews: 156,
    websiteScore: 71,
    domainAuthority: 22,
    socialEngagement: 48,
  },
]

export const reviews: Review[] = [
  {
    id: 'rev_1',
    author: 'Jordan M.',
    rating: 5,
    text: 'Same-day AC repair in a heatwave — technician was on time and professional.',
    source: 'Google',
    date: '2026-06-27',
    responded: false,
  },
  {
    id: 'rev_2',
    author: 'Priya K.',
    rating: 2,
    text: 'Booking was confusing and I had to call twice to confirm my appointment.',
    source: 'Yelp',
    date: '2026-06-24',
    responded: false,
  },
  {
    id: 'rev_3',
    author: 'Dev R.',
    rating: 5,
    text: 'Installed a new furnace at a fair price. Highly recommend Summit Peak.',
    source: 'Google',
    date: '2026-06-20',
    responded: true,
  },
  {
    id: 'rev_4',
    author: 'Alex T.',
    rating: 4,
    text: 'Good service overall, though they ran a bit late on arrival.',
    source: 'Facebook',
    date: '2026-06-15',
    responded: true,
  },
]

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    cadence: '/mo',
    tagline: 'Prove the opportunity.',
    features: ['AI business audit', 'AI recommendations', 'Monthly PDF reports'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 99,
    cadence: '/mo',
    tagline: 'Outrank the competition.',
    highlighted: true,
    features: [
      'Everything in Starter',
      'Competitor tracking',
      'Review monitoring',
      'AI lead capture assistant',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    cadence: '/mo',
    tagline: 'Scale across locations.',
    features: [
      'Everything in Growth',
      'Multiple locations',
      'Agency tools',
      'White-label reports',
    ],
  },
]

export const scoreLabels: Record<keyof Audit['scores'], string> = {
  website: 'Website',
  seo: 'SEO',
  reputation: 'Reputation',
  conversion: 'Conversion',
  visibility: 'Visibility',
}
