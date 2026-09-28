// ── Infinite Slider ────────────────────────────────────────────────────
// A row of items that scrolls sideways forever. Used for the sponsor strip
// on the homepage.
//
// Usage:  <InfiniteSlider gap={24} speed={40} reverse label="Sponsors">
//           {items}
//         </InfiniteSlider>
//   gap      px between items
//   speed    px per second
//   reverse  scroll left-to-right instead of right-to-left
//
// The items are repeated until they're wider than the slider, then that row
// is doubled and slid by exactly one copy, so the loop has no visible seam
// however few items there are. Hovering pauses it, and it sits still for
// people who have reduced motion turned on.
//
// Styles: styles/components/infinite-slider.css

import { useState, useRef, useLayoutEffect } from 'react'

export default function InfiniteSlider({ children, gap = 24, speed = 40, reverse = false, label }) {
  const rootRef = useRef(null)
  const setRef = useRef(null)      // First copy of the items, used for measuring
  const [setWidth, setSetWidth] = useState(0)
  const [copies, setCopies] = useState(1)

  // Re-measure on resize and when images load (both change the set's width)
  useLayoutEffect(() => {
    const root = rootRef.current
    const set = setRef.current
    if (!root || !set) return

    const measure = () => {
      const w = set.getBoundingClientRect().width   // Includes its trailing gap
      if (!w) return
      setSetWidth(w)
      setCopies(Math.max(1, Math.ceil(root.clientWidth / w)))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    ro.observe(set)
    return () => ro.disconnect()
  }, [gap])

  const distance = setWidth * copies

  // Two identical halves; only the very first set is real; every repeat is
  // hidden from screen readers and keyboard focus.
  const renderHalf = (half) =>
    Array.from({ length: copies }, (_, i) => {
      const isOriginal = half === 0 && i === 0
      return (
        <div
          key={`${half}-${i}`}
          ref={isOriginal ? setRef : undefined}
          className="infinite-slider-set"
          aria-hidden={isOriginal ? undefined : true}
          inert={isOriginal ? undefined : true}
        >
          {children}
        </div>
      )
    })

  return (
    <div
      ref={rootRef}
      className={`infinite-slider${reverse ? ' reverse' : ''}`}
      role="region"
      aria-label={label}
      style={{ '--gap': `${gap}px` }}
    >
      <div
        className={`infinite-slider-track${distance ? ' running' : ''}`}
        style={{
          '--distance': `${distance}px`,
          '--duration': `${distance / speed}s`,
        }}
      >
        {renderHalf(0)}
        {renderHalf(1)}
      </div>
    </div>
  )
}
