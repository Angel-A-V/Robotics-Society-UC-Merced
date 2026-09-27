// ── useEscapeKey ───────────────────────────────────────────────────────
// Closes an overlay when Escape is pressed. Used by the lightbox and the
// profile modal so the behaviour is identical in both.

import { useEffect } from 'react'

export function useEscapeKey(onEscape) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onEscape() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEscape])
}
