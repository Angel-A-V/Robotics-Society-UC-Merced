import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import rblogo from './assets/rblogo.jpg'

export default function Navbar({ user, handleLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) { setActiveSection(''); return }
    const sections = ['projects', 'team', 'about']
    const observers = []
    const handleScroll = () => { if (window.scrollY < 200) setActiveSection('home') }
    window.addEventListener('scroll', handleScroll, { passive: true })
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => { window.removeEventListener('scroll', handleScroll); observers.forEach(o => o.disconnect()) }
  }, [isHome])

  const handleHomeClick = (e) => {
    e.preventDefault(); setMenuOpen(false)
    if (isHome) { window.scrollTo({ top: 0, behavior: 'smooth' }) } else { navigate('/') }
  }
  const handleProjectsClick = (e) => {
    e.preventDefault(); setMenuOpen(false)
    if (isHome) { document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) } else { navigate('/#projects') }
  }
  const handleHashClick = (hash) => (e) => {
    e.preventDefault(); setMenuOpen(false)
    if (isHome) { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }) } else { navigate(`/${hash}`) }
  }

  const isContact = location.pathname === '/contact'
  const isProjectPage = location.pathname.startsWith('/projects/')

  const getLinkClass = (section) => {
    if (section === 'contact') return isContact ? 'nav-active' : ''
    if (section === 'projects' && isProjectPage) return 'nav-active'
    if (!isHome && section !== 'contact') return ''
    return activeSection === section ? 'nav-active' : ''
  }

  return (
    <nav className="main-nav">
      <a href="/" onClick={handleHomeClick} className="nav-logo">
        <img src={rblogo} alt="RS Logo" className="nav-logo-img" />
        <span>UC Merced <span className="accent">Robotics</span></span>
      </a>

      <ul className="nav-links">
        <li><a href="/" onClick={handleHomeClick} className={getLinkClass('home')}>Home</a></li>
        <li><a href="/#projects" onClick={handleProjectsClick} className={getLinkClass('projects')}>Projects</a></li>
        <li><a href="/#team" onClick={handleHashClick('#team')} className={getLinkClass('team')}>Team</a></li>
        <li><a href="/#about" onClick={handleHashClick('#about')} className={getLinkClass('about')}>About</a></li>
        <li><Link to="/contact" className={getLinkClass('contact')}>Contact</Link></li>
      </ul>

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

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
      </button>

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