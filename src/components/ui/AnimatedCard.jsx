// ── Animated Card ──────────────────────────────────────────────────────
// Wrapper that fades and slides its contents in when scrolled into view.
// `delay` staggers cards in a grid: delay={index * 80}.

import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

export default function AnimatedCard({ children, className = '', delay = 0, onClick }) {
  const ref = useRevealOnScroll(delay)

  return (
    <div ref={ref} className={`animated-card ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
