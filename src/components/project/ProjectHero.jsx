// ── Project Hero ───────────────────────────────────────────────────────
// The banner at the top of every project page. Everything it shows comes
// from the HERO object in that project's data file:
//   title, tagline, status, tags
//   accent    main project colour (badge, tags, glow, bottom stripe, timeline)
//   accent2   optional second colour for the other glow and the stripe fade
//   photo     optional photo that fills the right side and fades into the text
//   photoPos  optional CSS background-position for the photo crop
//   icon / logoSrc   shown on the right when there is no photo
//   crest     optional small logo shown beside the title (a team badge)
//   link      optional { href, label, icon } button, e.g. the team's Instagram
//
// A page can also pass its own `visual` (e.g. an animation) to fill the right
// side instead of the photo / logo / icon:
//   <ProjectHero hero={HERO} visual={<RallyKartPixel />} />
//
// Styles: styles/pages/project-detail.css

import Icon from '../ui/Icon'
import BackToProjects from './BackToProjects'

export default function ProjectHero({ hero, visual }) {
  const {
    title, tagline, status, tags, link,
    accent, accent2, photo, photoPos,
    icon, logoSrc, crest,
  } = hero

  return (
    <div
      className={`project-hero-banner${photo ? ' has-photo' : ''}${visual ? ' has-visual' : ''}`}
      style={{ '--hero-accent': accent, '--hero-accent-2': accent2 || accent }}
    >
      {/* Glows in the project's colours, then the photo on top of them */}
      <div className="project-hero-bg" />
      {photo && (
        <div
          className="project-hero-photo"
          style={{ backgroundImage: `url(${photo})`, backgroundPosition: photoPos || 'center' }}
          aria-hidden="true"
        />
      )}

      <div className="project-hero-content">
        <div className="project-hero-nav">
          <BackToProjects />
          <div className="project-badge">{status}</div>
        </div>

        <div className="project-hero-title">
          {crest && <img src={crest} alt="" className="project-hero-crest" />}
          <h1>{title}</h1>
        </div>
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

      {/* Right side: the page's own visual, else nothing extra when there's a
          photo (the photo is the visual), else the logo or icon */}
      {visual ? (
        <div className="project-hero-visual project-hero-scene">{visual}</div>
      ) : !photo && (
        <div className="project-hero-visual">
          <div className="project-icon-large">
            {logoSrc
              ? <img src={logoSrc} alt={`${title} logo`} className="project-rally-image" />
              : <Icon name={icon} />}
          </div>
        </div>
      )}
    </div>
  )
}
