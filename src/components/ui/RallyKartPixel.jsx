// ── Rally Kart Pixel ───────────────────────────────────────────────────
// Pixel-art rally kart driving across a dirt stage, used as the visual in
// the Rally Kart page hero.
//
// The drawing itself is the <rally-kart-pixel> web component in
// rally-pixel.js (160×90 canvas, scaled up with crisp pixels, fills its
// container's width). It pauses while scrolled off-screen and sits still
// for people who have reduced motion turned on. This wrapper just registers
// it.
//
// Usage:  <RallyKartPixel />   or   <RallyKartPixel speed={1.4} jumps={false} />
// Styles: .rally-kart-pixel in styles/pages/project-detail.css

import { useRef, useLayoutEffect } from 'react'
import './rally-pixel.js'

export default function RallyKartPixel({ speed = 1, sun = true, jumps = true, className = '' }) {
  const ref = useRef(null)

  // Set these as HTML attributes, not JSX props: React 19 would assign them
  // as element properties, and the component's `speed` is read-only.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.setAttribute('speed', String(speed))
    el.setAttribute('sun', sun ? 'on' : 'off')
    el.setAttribute('jumps', jumps ? 'on' : 'off')
  }, [speed, sun, jumps])

  return <rally-kart-pixel ref={ref} class={`rally-kart-pixel ${className}`.trim()} />
}
