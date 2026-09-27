// ── Leads Grid ─────────────────────────────────────────────────────────
// Photo + bio cards for the people running a project.
// `photoPos` is the CSS object-position used to crop each photo nicely.

import Icon from '../ui/Icon'

export default function LeadsGrid({ leads }) {
  if (!leads?.length) return null

  return (
    <div className="leads-grid">
      {leads.map(lead => (
        <div className="lead-card" key={lead.name}>
          <div className="lead-photo-wrap">
            <img src={lead.photo} alt={lead.name} className="lead-photo"
              style={{ objectPosition: lead.photoPos || 'center 15%' }} />
            <div className="lead-badge-icon"><Icon name={lead.badge} /></div>
          </div>
          <div className="lead-info">
            <div className="lead-role-tag">{lead.role}</div>
            <h3 className="lead-name">{lead.name}</h3>
            <p className="lead-bio">{lead.bio}</p>
            <div className="lead-fact">
              <span className="lead-fact-label">Fun Fact</span>
              <span className="lead-fact-text">{lead.fact}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
