// ── Home Page ──────────────────────────────────────────────────────────
// The public landing page, assembled from five sections:
//   Hero → Projects → About → Team → CTA → Footer
//
// All the words and photos come from the data/ folder, so copy edits do not
// touch this file:
//   data/site.js      hero text, about copy, feature cards
//   data/projects.js  the project cards
//   data/team.js      the board members
//
// Styles: styles/pages/home.css

import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AnimatedCard from '../components/ui/AnimatedCard'
import Icon from '../components/ui/Icon'
import TeamCarousel from '../components/ui/TeamCarousel'
import InfiniteSlider from '../components/ui/InfiniteSlider'
import AsciiLogo from '../components/ui/ascii-logo/AsciiLogo'
import { HERO, ABOUT_PARAGRAPHS, ABOUT_FEATURES, DISCORD_URL, INSTAGRAM_URL } from '../data/site'
import { PROJECTS, STATUS_TONES } from '../data/projects'
import { BOARD_MEMBERS } from '../data/team'
import { SPONSORS } from '../data/contact'
import rblogo from '../assets/rblogo.jpg'
import { MEMBERS_ENABLED } from '../lib/config'

export default function Home({ user, handleLogout }) {
  const navigate = useNavigate()

  // Smooth-scroll instead of jumping, for the in-page hero button
  const scrollToProjects = (e) => {
    e.preventDefault()
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page-home">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-grid" />

        <div className="hero-content">
          <div className="hero-badge">{HERO.badge}</div>
          <h1 className="hero-title">
            Building the<br />
            <span className="hero-accent">Machines</span> of<br />
            Tomorrow
          </h1>
          <p className="hero-sub">{HERO.sub}</p>

          <div className="hero-btns">
            <Link to="/register" className="btn btn-primary btn-lg">Join the Club →</Link>
            <a href="#projects" onClick={scrollToProjects} className="btn btn-outline btn-lg">
              View Projects
            </a>
          </div>

          {/* Stat row — dividers go between the stats, not around them */}
          <div className="hero-stats">
            {HERO.stats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className="stat-divider" />}
                <div className="stat">
                  <span className="stat-num">{stat.num}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Interactive 3D ASCII rendering of the club logo */}
        <div className="hero-visual">
          <AsciiLogo />
        </div>
      </section>

      {/* ── Sponsors ── scrolling strip; the open slots invite new sponsors ── */}
      <section className="sponsor-strip" aria-labelledby="sponsor-strip-title">
        <div className="section-label" id="sponsor-strip-title">Proudly Supported By</div>

        <InfiniteSlider gap={20} speed={30} label="Club sponsors">
          {SPONSORS.map(sponsor => <SponsorTile sponsor={sponsor} key={sponsor.name} />)}
          <Link to="/contact#sponsors" className="sponsor-tile sponsor-tile-open">
            <span className="sponsor-tile-logo"><Icon name="fi fi-rr-plus-small" /></span>
            <span className="sponsor-tile-text">
              <strong>Your Logo Here</strong>
              <span>Become a sponsor</span>
            </span>
          </Link>
        </InfiniteSlider>

        <p className="sponsor-strip-cta">
          Every visitor to our site sees this strip.{' '}
          <Link to="/contact#sponsors">Put your logo on it →</Link>
        </p>
      </section>

      {/* ── Projects ── each card links to its own detail page ── */}
      <section className="section" id="projects">
        <div className="section-label">What We Build</div>
        <h2 className="section-title">Our Projects</h2>
        <p className="section-sub">Real robots. Real engineering. Real results.</p>

        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <AnimatedCard
              className="project-card project-card-clickable"
              key={project.slug}
              delay={i * 80}          // Stagger so cards appear in sequence
              onClick={() => navigate(`/projects/${project.slug}`)}
            >
              {/* Photo on the left; a tinted placeholder until one is added */}
              <div
                className={`project-photo${project.photoFit ? ` fit-${project.photoFit}` : ''}`}
                style={{ '--project-color': project.color }}
              >
                {/* Blurred copy that fills the gaps around a 'contain-desktop' photo */}
                {project.photo && project.photoFit === 'contain-desktop' && (
                  <div className="project-photo-backdrop" style={{ backgroundImage: `url(${project.photo})` }} />
                )}
                {project.photo
                  ? <img src={project.photo} alt={`${project.title} project`} loading="lazy" />
                  : <div className="project-photo-placeholder"><ProjectIcon project={project} /></div>}
              </div>

              <div className="project-body-col">
                <div className={`project-status tone-${STATUS_TONES[project.status.toLowerCase()] ?? 'blue'}`}>
                  {project.status}
                </div>

                <h3>{project.title}</h3>
                <p>{project.desc}</p>

                <div className="tag-row">
                  {project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                </div>

                {/* Real link so the card is reachable by keyboard; the card's
                    own onClick is skipped so it doesn't navigate twice */}
                <Link
                  to={`/projects/${project.slug}`}
                  className="project-learn-more"
                  onClick={e => e.stopPropagation()}
                >
                  Learn more <span className="project-learn-arrow">→</span>
                </Link>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="section section-dark" id="about">
        <div className="about-inner">
          <div className="about-text">
            <div className="section-label">About Us</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>We Are UCM Robotics</h2>

            {ABOUT_PARAGRAPHS.map((text, i) => (
              <p key={i} style={{
                color: 'var(--text)',
                lineHeight: 1.8,
                marginBottom: i < ABOUT_PARAGRAPHS.length - 1 ? 20 : 0,
              }}>
                {text}
              </p>
            ))}

            <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary">Apply to Join →</Link>
              {MEMBERS_ENABLED && <Link to="/login" className="btn btn-outline">Member Login</Link>}
            </div>
          </div>

          <div className="about-features">
            {ABOUT_FEATURES.map(feature => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon"><Icon name={feature.icon} /></div>
                <div>
                  <strong>{feature.title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── swipeable carousel, details shown on the centred card ── */}
      <section className="section" id="team">
        <div className="section-label">The People</div>
        <h2 className="section-title">Meet the Board</h2>
        <p className="section-sub">The people keeping the gears turning</p>

        <TeamCarousel members={BOARD_MEMBERS} />
      </section>

      {/* ── Call to action ── */}
      <section className="cta-section">
        <img src={rblogo} alt="" className="cta-logo" />
        <h2>Ready to Build the Future?</h2>
        <p>
          Hop into our Discord to meet the team, ask questions, and catch every
          announcement, or follow along on Instagram.
        </p>
        <div className="cta-buttons">
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            <Icon name="fi fi-brands-discord" /> Join our Discord
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
            <Icon name="fi fi-brands-instagram" /> Follow @ucm_rs
          </a>
          {MEMBERS_ENABLED && <Link to="/register" className="btn btn-outline btn-lg">Apply Now →</Link>}
        </div>
      </section>

      <Footer />
    </div>
  )
}

// A project's logo image if it has one, otherwise its icon-font class
function ProjectIcon({ project }) {
  return project.logoSrc
    ? <img src={project.logoSrc} alt="" className="card-rally-logo" />
    : <Icon name={project.icon} />
}

// One sponsor in the scrolling strip; links to their site when `url` is set
function SponsorTile({ sponsor }) {
  const content = (
    <>
      <span className="sponsor-tile-logo"><img src={sponsor.logo} alt="" /></span>
      <span className="sponsor-tile-text">
        <strong>{sponsor.name}</strong>
        <span>{sponsor.tier}</span>
      </span>
    </>
  )
  return sponsor.url
    ? <a href={sponsor.url} className="sponsor-tile" target="_blank" rel="noopener noreferrer">{content}</a>
    : <div className="sponsor-tile">{content}</div>
}
