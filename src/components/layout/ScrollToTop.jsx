// ── Scroll To Top ──────────────────────────────────────────────────────
// Renders nothing. Sits inside the Router and fixes scroll position on
// every navigation:
//   - No hash in the URL  → jump to the top of the new page
//   - Hash like #projects → smooth-scroll to that section
//
// Without this, clicking "Home" from halfway down a project page would land
// you halfway down the homepage.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    // Small delay so the target section has rendered before we scroll to it.
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [pathname, hash])

  return null
}
