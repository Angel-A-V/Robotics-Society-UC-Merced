// ── Project Hero ───────────────────────────────────────────────────────
// The banner at the top of every project page. Everything it shows comes
// from the HERO object in that project's data file:
//   title, tagline, status, accent, background, and either icon or logoSrc.
// Optional `link: { href, label, icon }` adds a button, e.g. the team's Instagram.
//
// Styles: styles/pages/project-detail.css

import Icon from '../ui/Icon'
import BackToProjects from './BackToProjects'

export default function ProjectHero({ hero }) {
  const { title, tagline, status, accent, background, icon, logoSrc, tags, link } = hero

  return (
    <div className="project-hero-banner">
      {/* Coloured gradient behind the text, unique per project */}
      <div className="project-hero-bg" style={{ background }} />

      <div className="project-hero-content">
        <div className="project-hero-nav">
          <BackToProjects />
          {/* Status badge tinted with the project's accent colour */}
          <div className="project-badge" style={{
            borderColor: accent,
            color: accent,
            background: `${accent}1a`,   // same colour at ~10% opacity
          }}>
            {status}
          </div>
        </div>

        <h1>{title}</h1>
        <p>{tagline}</p>

        {tags?.length > 0 && (
          <div className="tech-tags">
            {tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
        )}

        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline project-hero-link">
            <Icon name={link.icon} /> {link.label}
          </a>
        )}
      </div>

      {/* Either a logo image or an icon, depending on what the project has */}
      <div className="project-hero-visual">
        <div className="project-icon-large" style={{ alignSelf: 'center' }}>
          {logoSrc
            ? <img src={logoSrc} alt={title} className="project-rally-image" />
            : <Icon name={icon} />}
        </div>
      </div>
    </div>
  )
}
