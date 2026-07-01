import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/common/Logo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-500">
          The page you’re looking for doesn’t exist or has moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button to="/">Back home</Button>
        <Button to="/app" variant="secondary">
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
