// ── Overview ───────────────────────────────────────────────────────────
// Renders the paragraphs from a project's OVERVIEW array, plus the optional
// highlighted goal callout underneath.

import Icon from '../ui/Icon'

export default function Overview({ paragraphs, goal }) {
  return (
    <>
      {paragraphs.map((text, i) => (
        // Every paragraph after the first gets spacing above it
        <p key={i} style={i === 0 ? undefined : { marginTop: 16 }}>{text}</p>
      ))}

      {goal && (
        <div className="rally-kart-goal">
          <span className="rally-kart-goal-icon"><Icon name="fi fi-rs-archery" /></span>
          <p>{goal}</p>
        </div>
      )}
    </>
  )
}
