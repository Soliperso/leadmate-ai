/** Core domain types for LeadMate AI. */

export type Industry =
  | 'HVAC'
  | 'Roofing'
  | 'Electrician'
  | 'Plumbing'
  | 'Landscaping'
  | 'Dental'
  | 'Legal'
  | 'Accounting'
  | 'Insurance'
  | 'Other'

export interface Business {
  id: string
  name: string
  website: string
  industry: Industry
  location: string
  logoColor: string
}

/** The five audit dimensions from the PRD. */
export interface AuditScores {
  website: number
  seo: number
  reputation: number
  conversion: number
  visibility: number
}

export interface Audit {
  id: string
  businessId: string
  createdAt: string
  overall: number
  scores: AuditScores
  estimatedLostLeads: number
  estimatedLostRevenue: number
}

export interface Opportunity {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'website' | 'seo' | 'reputation' | 'conversion' | 'visibility'
}

export interface Competitor {
  id: string
  name: string
  rating: number
  reviews: number
  websiteScore: number
  domainAuthority: number
  socialEngagement: number
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  source: 'Google' | 'Yelp' | 'Facebook'
  date: string
  responded: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  cadence: string
  tagline: string
  features: string[]
  highlighted?: boolean
}

export type ScoreKey = keyof AuditScores
