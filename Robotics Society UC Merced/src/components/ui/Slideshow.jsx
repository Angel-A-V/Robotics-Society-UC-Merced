// ── Slideshow ──────────────────────────────────────────────────────────
// Photo gallery used by the project pages. Supports the arrow buttons, the
// dot indicators, and the left/right arrow keys.
//
// Usage:  <Slideshow slides={SLIDES} label="Rally Kart photo gallery" />
//         where slides is [{ src, caption }, ...]

import { useState, useEffect, useCallback } from 'react'

// Must match the CSS fade-out transition in styles/components/slideshow.css
const FADE_MS = 200

export default function Slideshow({ slides, label = 'Photo gallery' }) {
  const [index, setIndex]   = useState(0)
  const [fading, setFading] = useState(false)

  // Fade the current photo out, swap it, then fade back in.
  const go = useCallback((next) => {
    setFading(true)
    setTimeout(() => { setIndex(next); setFading(false) }, FADE_MS)
  }, [])

  // Wrap around at both ends so the gallery never dead-ends.
  const goPrev = () => go((index - 1 + slides.length) % slides.length)
  const goNext = () => go((index + 1) % slides.length)

  // Arrow-key navigation. Re-bound whenever the index changes so the
  // handler always closes over the current slide.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, slides.length])

  if (!slides?.length) return null

  return (
    <div className="slideshow" role="region" aria-label={label}>
      <div className="slideshow-counter">{index + 1} / {slides.length}</div>

      <img
        src={slides[index].src}
        alt={slides[index].caption}
        className={`slideshow-img${fading ? ' fade-out' : ''}`}
      />

      <div className="slideshow-caption">{slides[index].caption}</div>

      <button className="slideshow-btn prev" onClick={goPrev} aria-label="Previous photo">&#8249;</button>
      <button className="slideshow-btn next" onClick={goNext} aria-label="Next photo">&#8250;</button>

      <div className="slideshow-dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slideshow-dot${i === index ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to photo ${i + 1}`}
            role="tab"
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  )
}
