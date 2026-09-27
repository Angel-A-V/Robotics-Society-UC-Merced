// ── Footer ─────────────────────────────────────────────────────────────
// Shared site footer. Links come from data/site.js.
//
// The Home link scrolls to the top instead of navigating, so clicking it
// while already on the homepage does something useful.
//
// Styles: styles/components/footer.css

import { Link, useLocation } from 'react-router-dom'
import { CLUB_NAME, CLUB_SCHOOL, COPYRIGHT_YEAR, FOOTER_LINKS } from '../../data/site'
import rblogo from '../../assets/rblogo.jpg'

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
        {FOOTER_LINKS.map(link => (
          link.to === '/' && isHome
            ? <a key={link.label} href="/"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                {link.label}
              </a>
            : <Link key={link.label} to={link.to}>{link.label}</Link>
        ))}
      </div>

      <p className="footer-copy">© {COPYRIGHT_YEAR} {CLUB_NAME}</p>
    </footer>
  )
}
