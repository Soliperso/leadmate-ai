import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Reset scroll on route change. When the URL carries an in-page hash (e.g.
 * `/#features`), scroll to that element instead — after a frame so the target
 * section has mounted following a cross-route navigation.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const scrollToTarget = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      // Wait a frame for the destination page to render before scrolling.
      const raf = requestAnimationFrame(scrollToTarget)
      return () => cancelAnimationFrame(raf)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
