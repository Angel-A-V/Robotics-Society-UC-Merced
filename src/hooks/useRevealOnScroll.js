// ── useRevealOnScroll ──────────────────────────────────────────────────
// Adds the "card-visible" class the first time an element scrolls into
// view, which triggers the fade + slide-in transition defined in
// styles/components/animated-card.css.
//
// The observer disconnects after firing once, so the animation does not
// replay every time you scroll past.

import { useEffect, useRef } from 'react'

export function useRevealOnScroll(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.style.transitionDelay = `${delay}ms`   // Staggers cards in a grid
        el.classList.add('card-visible')
        observer.unobserve(el)
      },
      { threshold: 0.1 }   // Fire once 10% of the card is on screen
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}
