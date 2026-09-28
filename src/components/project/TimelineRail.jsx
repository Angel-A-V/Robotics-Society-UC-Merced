// ── Timeline Rail ──────────────────────────────────────────────────────
// Horizontal project timeline: a rail with one dot per milestone, the
// milestone name angled above each dot and its date below. The rail fills
// in with the project's accent colour up to the last completed milestone,
// and the next one pulses.
//
// The dots work like tabs: click one (or use the arrow keys) and its
// details show in the panel underneath. It opens on the next milestone.
//
// Usage:  <TimelineRail items={TIMELINE} accent={HERO.accent} />
//         where items is [{ date, title, desc, done }, ...]
//
// Based on the shadcn "timeline-rail" component, rebuilt in plain JSX and
// CSS to match the rest of the site.
//
// Styles: styles/components/timeline-rail.css

import { useState, useRef, useLayoutEffect, useId } from 'react'

const STATUS_LABEL = { done: 'Completed', next: 'Up Next', planned: 'Planned' }

export default function TimelineRail({ items, accent }) {
  const id = useId()
  const count = items.length
  const lastDone = items.reduce((last, item, i) => (item.done ? i : last), -1)
  const nextIndex = items.findIndex(item => !item.done)   // -1 once everything is done
  const [selected, setSelected] = useState(nextIndex >= 0 ? nextIndex : count - 1)

  const scrollerRef = useRef(null)
  const gridRef = useRef(null)
  const tabRefs = useRef([])

  // The angled labels stick out above the rail and past its right edge.
  // Measure how far, so exactly that much room is reserved for them.
  const [labelRoom, setLabelRoom] = useState({ top: 0, right: 0 })
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    const grid = gridRef.current
    if (!scroller || !grid) return

    const measure = () => {
      const g = grid.getBoundingClientRect()
      let top = 0
      let right = 0
      grid.querySelectorAll('.timeline-rail-label').forEach(label => {
        const r = label.getBoundingClientRect()
        top = Math.max(top, g.top - r.top)
        right = Math.max(right, r.right - g.right)
      })
      const next = { top: Math.ceil(top), right: Math.ceil(right) }
      setLabelRoom(prev => (prev.top === next.top && prev.right === next.right ? prev : next))
    }

    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [items])

  const select = (i, { focus = false } = {}) => {
    setSelected(i)
    if (focus) tabRefs.current[i]?.focus()

    // On narrow screens the rail scrolls sideways; bring the pick into view
    // without moving the page itself.
    const scroller = scrollerRef.current
    const tab = tabRefs.current[i]
    if (scroller && tab && scroller.scrollWidth > scroller.clientWidth) {
      const col = tab.getBoundingClientRect()
      const box = scroller.getBoundingClientRect()
      scroller.scrollBy({ left: col.left + col.width / 2 - (box.left + box.width / 2), behavior: 'smooth' })
    }
  }

  const handleKeyDown = (e) => {
    const moves = { ArrowRight: selected + 1, ArrowLeft: selected - 1, Home: 0, End: count - 1 }
    if (!(e.key in moves)) return
    e.preventDefault()
    select(Math.max(0, Math.min(count - 1, moves[e.key])), { focus: true })
  }

  const statusOf = (i) => (items[i].done ? 'done' : i === nextIndex ? 'next' : 'planned')

  if (!count) return null
  const current = items[selected]
  const currentStatus = statusOf(selected)

  return (
    <div className="timeline-rail" style={accent ? { '--rail-accent': accent } : undefined}>
      <div className="timeline-rail-scroll" ref={scrollerRef}>
        <div
          className="timeline-rail-track"
          style={{
            '--count': count,
            '--label-right': `${labelRoom.right + 4}px`,
            paddingTop: labelRoom.top + 8,
          }}
        >
          <div
            ref={gridRef}
            className="timeline-rail-grid"
            role="tablist"
            aria-label="Development timeline"
            onKeyDown={handleKeyDown}
            style={{ '--progress': count > 1 ? Math.max(0, lastDone) / (count - 1) : 0 }}
          >
            {/* The rail, and the filled part up to the last completed milestone */}
            <div className="timeline-rail-line" aria-hidden="true">
              {lastDone > 0 && <div className="timeline-rail-fill" />}
            </div>

            {items.map((item, i) => {
              const status = statusOf(i)
              return (
                <button
                  key={`${item.title}-${i}`}
                  ref={el => { tabRefs.current[i] = el }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={i === selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={i === selected ? 0 : -1}
                  className={`timeline-rail-item is-${status}${i === selected ? ' is-selected' : ''}`}
                  onClick={() => select(i)}
                >
                  <span className="timeline-rail-label">{item.title}</span>
                  <span className="timeline-rail-dot" />
                  <span className="timeline-rail-date">{item.date}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details for the chosen milestone; `key` replays the fade-in on change */}
      <div
        key={selected}
        className="timeline-rail-panel"
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
      >
        <div className="timeline-rail-meta">
          <span className={`timeline-rail-status is-${currentStatus}`}>{STATUS_LABEL[currentStatus]}</span>
          <span className="timeline-rail-when">{current.date}</span>
          <span className="timeline-rail-step">Step {selected + 1} of {count}</span>
        </div>
        <h4>{current.title}</h4>
        {current.desc && <p>{current.desc}</p>}
      </div>
    </div>
  )
}
