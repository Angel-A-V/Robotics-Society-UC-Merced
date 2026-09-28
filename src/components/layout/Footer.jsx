// ── Footer ─────────────────────────────────────────────────────────────
// Shared site footer. Links come from data/site.js.
//
// The Home link scrolls to the top instead of navigating, so clicking it
// while already on the homepage does something useful.
//
// Styles: styles/components/footer.css

import { Link, useLocation } from 'react-router-dom'
import { CLUB_NAME, CLUB_SCHOOL, COPYRIGHT_YEAR, FOOTER_LINKS, COMMUNITY_LINKS } from '../../data/site'
import Icon from '../ui/Icon'
import rblogo from '../../assets/rblogo.jpg'
import { MEMBERS_ENABLED } from '../../lib/config'

export default function Footer() {
  const isHome = useLocation().pathname === '/'

  return (
    <footer className="footer">
      <div className="footer-logo-row">
        <img src={rblogo} alt="RS" className="footer-logo-img" />
        <span className="footer-logo-text">{CLUB_NAME}</span>
      </div>

      <p>{CLUB_SCHOOL}</p>

      <div className="footer-links">
        {FOOTER_LINKS.filter(link => MEMBERS_ENABLED || !link.membersOnly).map(link => (
          link.to === '/' && isHome
            ? <a key={link.label} href="/"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                {link.label}
              </a>
            : <Link key={link.label} to={link.to}>{link.label}</Link>
        ))}
      </div>

      {/* Discord + Instagram accounts */}
      <div className="footer-socials">
        {COMMUNITY_LINKS.map(link => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            className="footer-social" aria-label={`${link.label} (${link.handle})`} title={link.handle}>
            <Icon name={link.icon} />
          </a>
        ))}
      </div>

      <p className="footer-copy">© {COPYRIGHT_YEAR} {CLUB_NAME}</p>
    </footer>
  )
}
