// ── useScrollSpy ───────────────────────────────────────────────────────
// Tracks which homepage section is currently on screen so the nav bar can
// highlight the matching link. Returns the active section id.
//
// Only runs on the homepage — on any other route there are no sections to
// watch, so it returns '' and the nav falls back to route-based matching.

import { useState, useEffect } from 'react'

export function useScrollSpy(sectionIds, enabled) {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    if (!enabled) { setActiveSection(''); return }

    // Near the very top of the page, "Home" is the active link regardless
    // of what the observers below report.
    const handleScroll = () => { if (window.scrollY < 200) setActiveSection('home') }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // One observer per section. The rootMargin shrinks the detection band
    // to roughly the middle of the viewport, so the highlight switches when
    // a section is genuinely the one being read.
    const observers = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [enabled])

  return activeSection
}
