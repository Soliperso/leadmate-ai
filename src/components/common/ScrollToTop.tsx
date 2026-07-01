import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position on route change (ignores in-page hash anchors). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
