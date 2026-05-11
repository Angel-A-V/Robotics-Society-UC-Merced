import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import rblogo from './assets/rblogo.jpg'

// handleLogout now comes from App.jsx — it clears localStorage and resets user state
export default function Navbar({ user, handleLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)  // Mobile hamburger state


  const isHome = location.pathname === '/'

  // Clicking "Home" always scrolls to top of homepage
  const handleHomeClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  // Clicking "Projects" goes to #projects section on homepage
  const handleProjectsClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      // Already on homepage — just scroll to #projects
      const el = document.querySelector('#projects')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // On a different page — navigate to homepage then scroll
      navigate('/#projects')
    }
  }

  const handleHashClick = (hash) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${hash}`)
    }
  }

  return (
    <nav className="main-nav">
      {/* ── Logo with real club image ── */}
      <a href="/" onClick={handleHomeClick} className="nav-logo">
        <img src={rblogo} alt="RS Logo" className="nav-logo-img" />
        <span>UC Merced <span className="accent">Robotics</span></span>
      </a>

      {/* ── Desktop nav links ── */}
      <ul className="nav-links">
        <li><a href="/" onClick={handleHomeClick}>Home</a></li>
        <li><a href="/#projects" onClick={handleProjectsClick}>Projects</a></li>
        <li><a href="/#team" onClick={handleHashClick('#team')}>Team</a></li>
        <li><a href="/#about" onClick={handleHashClick('#about')}>About</a></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* ── Desktop actions ── */}
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

      {/* ── Mobile hamburger button ── */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
      </button>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/" onClick={handleHomeClick} className="mobile-link">Home</a>
          <a href="/#projects" onClick={handleProjectsClick} className="mobile-link">Projects</a>
          <a href="/#team" onClick={handleHashClick('#team')} className="mobile-link">Team</a>
          <a href="/#about" onClick={handleHashClick('#about')} className="mobile-link">About</a>
          <Link to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="mobile-divider" />
          {user ? (
            <>
              <Link to="/portal" className="mobile-link" onClick={() => setMenuOpen(false)}>Portal</Link>
              <button className="mobile-link mobile-btn" onClick={() => { handleLogout(); setMenuOpen(false) }}>Logout</button>
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