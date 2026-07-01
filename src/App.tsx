import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { AppLayout } from '@/components/layout/AppLayout'

import { LandingPage } from '@/pages/marketing/LandingPage'
import { PricingPage } from '@/pages/marketing/PricingPage'
import { DirectoryPage } from '@/pages/marketing/DirectoryPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { OnboardingPage } from '@/pages/app/OnboardingPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { AuditReportPage } from '@/pages/app/AuditReportPage'
import { CompetitorsPage } from '@/pages/app/CompetitorsPage'
import { GrowthAdvisorPage } from '@/pages/app/GrowthAdvisorPage'
import { ReviewsPage } from '@/pages/app/ReviewsPage'
import { BillingPage } from '@/pages/app/BillingPage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public / marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
        </Route>

        {/* Auth + onboarding (full-screen, no shell) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated app */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="audit" element={<AuditReportPage />} />
          <Route path="competitors" element={<CompetitorsPage />} />
          <Route path="advisor" element={<GrowthAdvisorPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
