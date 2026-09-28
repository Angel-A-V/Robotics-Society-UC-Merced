// ── Team Carousel ──────────────────────────────────────────────────────
// The "Meet the Board" carousel on the homepage. One card sits centred and
// expanded (photo on top, details below); the others show just the photo.
//
// Navigate with the arrow buttons, the dots, the left/right arrow keys (when
// the carousel has focus), by dragging/swiping, or by clicking a side card.
//
// Usage:  <TeamCarousel members={BOARD_MEMBERS} />
//         where members is [{ name, role, photo, job, fact }, ...]
//
// Styles: styles/components/team-carousel.css

import { useState, useRef, useEffect, useMemo, useCallback, startTransition } from 'react'
import { motion, animate, useMotionValue, useInView, useReducedMotion } from 'framer-motion'

// Card size on desktop. Tablet and phone scale down from these.
const CARD_W = 340
const CARD_H = 500
const GAP = 32
const SIDE_PAD = 48       // Horizontal padding inside the viewport
const IMAGE_INSET = 10    // Gap between the card edge and the photo

// Share of the card the photo takes up on the active card
const ACTIVE_IMAGE_SHARE = 0.58

const SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }
const CARD_SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 1.05 }

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

// Tracks an element's width so the card sizes and centring can respond to it.
function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w != null) startTransition(() => setWidth(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, width]
}

export default function TeamCarousel({ members, label = 'Board member carousel' }) {
  const count = members.length
  const reduceMotion = useReducedMotion()
  const [viewportRef, viewportW] = useElementWidth()

  const isMobile = viewportW > 0 && viewportW < 640
  const isTablet = viewportW >= 640 && viewportW < 980
  const scale = isMobile ? 0.84 : isTablet ? 0.9 : 1
  const cardW = Math.round(CARD_W * scale)
  const cardH = Math.round(CARD_H * (isMobile ? 0.88 : isTablet ? 0.92 : 1))
  const sidePad = isMobile ? 16 : SIDE_PAD
  const step = cardW + GAP

  // Track offset that puts card 0 in the middle of the viewport. viewportW is
  // the content width (ResizeObserver excludes padding), so no padding to subtract.
  const centerOffset = useMemo(() => {
    const available = viewportW || 1200
    return (available - cardW) / 2
  }, [viewportW, cardW])

  const x = useMotionValue(0)

  // Start on the first card (the President). indexRef mirrors index for
  // event handlers, so a fast double-click moves two cards rather than one.
  const [index, setIndex] = useState(0)
  const indexRef = useRef(index)

  const snapToIndex = useCallback((next, { immediate = false } = {}) => {
    if (!count) return
    const target = clamp(next, 0, count - 1)
    indexRef.current = target
    setIndex(target)

    const targetX = centerOffset - target * step
    if (immediate || reduceMotion) x.set(targetX)
    else animate(x, targetX, SPRING)
  }, [count, centerOffset, step, reduceMotion, x])

  // Re-centre without animating whenever the layout changes (resize,
  // breakpoint switch, member list change).
  useEffect(() => {
    if (!count) return
    const target = clamp(indexRef.current, 0, count - 1)
    indexRef.current = target
    x.set(centerOffset - target * step)
  }, [count, centerOffset, step, x])

  const goPrev = useCallback(() => snapToIndex(indexRef.current - 1), [snapToIndex])
  const goNext = useCallback(() => snapToIndex(indexRef.current + 1), [snapToIndex])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  }

  // A drag ends with a click on whichever card is under the pointer; this
  // flag lets the card ignore that click.
  const draggedRef = useRef(false)

  const handleDragStart = () => { draggedRef.current = true }

  const handleDragEnd = (_, info) => {
    // Clear after the trailing click has been dispatched
    setTimeout(() => { draggedRef.current = false }, 0)

    // Flicks count as much as distance, so a quick short swipe still moves
    const swipePower = info.offset.x + info.velocity.x * 0.25
    const threshold = Math.max(40, step * 0.25)

    if (swipePower < -threshold) snapToIndex(indexRef.current + 1)
    else if (swipePower > threshold) snapToIndex(indexRef.current - 1)
    else snapToIndex(Math.round((centerOffset - x.get()) / step))
  }

  const handleCardClick = (i) => {
    if (draggedRef.current) return
    if (i !== indexRef.current) snapToIndex(i)
  }

  if (!count) return null

  return (
    <div
      className="team-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="team-carousel-arrow prev"
        onClick={goPrev}
        disabled={index === 0}
        aria-label="Previous member"
      >
        <ArrowIcon dir="left" />
      </button>
      <button
        type="button"
        className="team-carousel-arrow next"
        onClick={goNext}
        disabled={index === count - 1}
        aria-label="Next member"
      >
        <ArrowIcon dir="right" />
      </button>

      <div
        ref={viewportRef}
        className="team-carousel-viewport"
        style={{
          paddingInline: sidePad,
          height: cardH + 64,     // Room for the active card's lift and shadow
          visibility: viewportW ? 'visible' : 'hidden',   // No flash before measuring
        }}
      >
        <motion.div
          className="team-carousel-track"
          style={{ x, gap: GAP }}
          drag="x"
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {members.map((member, i) => (
            <MemberCard
              key={member.name}
              member={member}
              isActive={i === index}
              width={cardW}
              height={cardH}
              reduceMotion={reduceMotion}
              onClick={() => handleCardClick(i)}
              position={`${i + 1} of ${count}`}
            />
          ))}
        </motion.div>
      </div>

      <div className="team-carousel-dots">
        {members.map((member, i) => (
          <button
            key={member.name}
            type="button"
            className={`team-carousel-dot${i === index ? ' active' : ''}`}
            onClick={() => snapToIndex(i)}
            aria-label={`Show ${member.name}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}

function MemberCard({ member, isActive, width, height, reduceMotion, onClick, position }) {
  const ref = useRef(null)
  // Skip the hover/lift springs for cards that are off-screen
  const inView = useInView(ref, { amount: 0.35 })
  const allowMotion = inView && !reduceMotion
  const transition = reduceMotion ? { duration: 0 } : CARD_SPRING

  const imageShare = isActive ? ACTIVE_IMAGE_SHARE : 1

  return (
    <motion.article
      ref={ref}
      className={`team-carousel-card${isActive ? ' active' : ''}`}
      style={{ width, height }}
      initial={false}
      animate={allowMotion ? { scale: isActive ? 1.02 : 0.97, y: isActive ? -4 : 0 } : undefined}
      whileHover={allowMotion ? { scale: isActive ? 1.03 : 0.99, y: isActive ? -6 : -2 } : undefined}
      whileTap={allowMotion ? { scale: isActive ? 1.015 : 0.985 } : undefined}
      transition={transition}
      onClick={onClick}
      aria-roledescription="slide"
      aria-label={`${member.name}, ${member.role} (${position})`}
    >
      {/* Photo shrinks from full-card to the top half when the card becomes active */}
      <motion.div
        className="team-carousel-photo"
        initial={false}
        animate={{ height: `calc(${imageShare * 100}% - ${IMAGE_INSET * 2}px)` }}
        transition={transition}
        style={{ top: IMAGE_INSET, left: IMAGE_INSET, right: IMAGE_INSET }}
      >
        <img src={member.photo} alt={member.name} draggable={false} />
      </motion.div>

      {/* Details fade in underneath the photo on the active card */}
      <motion.div
        className="team-carousel-info"
        style={{ top: `${ACTIVE_IMAGE_SHARE * 100}%` }}
        initial={false}
        animate={allowMotion
          ? { opacity: isActive ? 1 : 0, y: isActive ? 0 : 18 }
          : { opacity: isActive ? 1 : 0 }}
        transition={transition}
        aria-hidden={!isActive}
      >
        <span className="team-carousel-role">{member.role}</span>
        <strong className="team-carousel-name">{member.name}</strong>
        <p className="team-carousel-job">{member.job}</p>
        <p className="team-carousel-fact">🎲 {member.fact}</p>
      </motion.div>
    </motion.article>
  )
}

function ArrowIcon({ dir }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}
      aria-hidden="true"
    >
      <path
        d="M9 18l6-6-6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
