// ── Systems Grid ───────────────────────────────────────────────────────
// The card grid used for "Systems" / "System Architecture" sections.
// Takes the SYSTEMS array from a project data file.

import Icon from '../ui/Icon'

export default function SystemsGrid({ systems }) {
  if (!systems?.length) return null

  return (
    <div className="arch-grid">
      {systems.map(system => (
        <div className="arch-card" key={system.title}>
          <div className="arch-icon"><Icon name={system.icon} /></div>
          <h4>{system.title}</h4>
          <p>{system.desc}</p>
        </div>
      ))}
    </div>
  )
}
