// ── Nav Bar ────────────────────────────────────────────────────────────
// Top navigation, shown on every public page.
//
// Two kinds of link:
//   - Section links (Projects / Team / About) smooth-scroll when you are
//     already on the homepage, and navigate to /#section when you are not.
//   - Route links (Contact) are normal router links.
//
// The active highlight comes from useScrollSpy on the homepage, and from the
// current route everywhere else.
//
// Styles: styles/components/navbar.css

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { SCROLL_SPY_SECTIONS } from '../../data/site'
import rblogo from '../../assets/rblogo.jpg'

export default function Navbar({ user, handleLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome        = location.pathname === '/'
  const isContact     = location.pathname === '/contact'
  const isProjectPage = location.pathname.startsWith('/projects/')

  // Only spy on sections when we are actually on the homepage.
  const activeSection = useScrollSpy(SCROLL_SPY_SECTIONS, isHome)

  // ── Link handlers ──
  const handleHomeClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' })
    else navigate('/')
  }

  // Scroll to a homepage section, or navigate there first if we are elsewhere.
  const handleSectionClick = (hash) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    else navigate(`/${hash}`)
  }

  // Which nav link gets the highlighted "nav-active" class.
  const linkClass = (section) => {
    if (section === 'contact') return isContact ? 'nav-active' : ''
    if (section === 'projects' && isProjectPage) return 'nav-active'
    if (!isHome) return ''
    return activeSection === section ? 'nav-active' : ''
  }

  return (
    <nav className="main-nav">
      {/* ── Logo ── doubles as a "back to top" button on the homepage */}
      <a href="/" onClick={handleHomeClick} className="nav-logo">
        <img src={rblogo} alt="RS Logo" className="nav-logo-img" />
        <span>UC Merced <span className="accent">Robotics</span></span>
      </a>

      {/* ── Desktop links ── */}
      <ul className="nav-links">
        <li><a href="/" onClick={handleHomeClick} className={linkClass('home')}>Home</a></li>
        <li><a href="/#projects" onClick={handleSectionClick('#projects')} className={linkClass('projects')}>Projects</a></li>
        <li><a href="/#team" onClick={handleSectionClick('#team')} className={linkClass('team')}>Team</a></li>
        <li><a href="/#about" onClick={handleSectionClick('#about')} className={linkClass('about')}>About</a></li>
        <li><Link to="/contact" className={linkClass('contact')}>Contact</Link></li>
      </ul>

      {/* ── Account buttons ── swap between logged-in and logged-out */}
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/portal" className="btn btn-outline">Portal</Link>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Join Club</Link>
          </>
        )}
      </div>

      {/* ── Hamburger ── only visible below the mobile breakpoint */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
      </button>

      {/* ── Mobile drop-down menu ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/" onClick={handleHomeClick} className="mobile-link">Home</a>
          <a href="/#projects" onClick={handleSectionClick('#projects')} className="mobile-link">Projects</a>
          <a href="/#team" onClick={handleSectionClick('#team')} className="mobile-link">Team</a>
          <a href="/#about" onClick={handleSectionClick('#about')} className="mobile-link">About</a>
          <Link to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</Link>

          <div className="mobile-divider" />

          {user ? (
            <>
              <Link to="/portal" className="mobile-link" onClick={() => setMenuOpen(false)}>Portal</Link>
              <button className="mobile-link mobile-btn"
                onClick={() => { handleLogout(); setMenuOpen(false) }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link mobile-primary" onClick={() => setMenuOpen(false)}>Join Club</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
