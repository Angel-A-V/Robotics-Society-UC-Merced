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
import { HERO, ABOUT_PARAGRAPHS, ABOUT_FEATURES } from '../data/site'
import { PROJECTS } from '../data/projects'
import { BOARD_MEMBERS } from '../data/team'
import rblogo from '../assets/rblogo.jpg'

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

        {/* Animated orbit rings around the club logo */}
        <div className="hero-visual">
          <div className="hero-orb" />
          <div className="hero-ring ring1" />
          <div className="hero-ring ring2" />
          <div className="hero-ring ring3" />
          <div className="hero-logo-wrap">
            <img src={rblogo} alt="UCM Robotics Society" className="hero-logo-img" />
          </div>
        </div>
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
              <div className="project-color-bar" style={{ background: project.color }} />

              <div className="project-card-top">
                <div className="project-icon">
                  {project.logoSrc
                    ? <img src={project.logoSrc} alt={project.title} className="card-rally-logo" />
                    : <Icon name={project.icon} />}
                </div>
                <div className="project-status">{project.status}</div>
              </div>

              <h3>{project.title}</h3>
              <p>{project.desc}</p>

              <div className="tag-row">
                {project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
              </div>

              <div className="card-arrow">→</div>
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
              <Link to="/login" className="btn btn-outline">Member Login</Link>
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

      {/* ── Team ── the job and fact are revealed on hover ── */}
      <section className="section" id="team">
        <div className="section-label">The People</div>
        <h2 className="section-title">Meet the Board</h2>
        <p className="section-sub">The people keeping the gears turning</p>

        <div className="team-grid">
          {BOARD_MEMBERS.map((member, i) => (
            <AnimatedCard className="team-card" key={member.name} delay={i * 60}>
              <div className="team-photo-wrap">
                <img src={member.photo} alt={member.name} className="team-photo" />
              </div>
              <strong className="team-name">{member.name}</strong>
              <span className="team-role">{member.role}</span>
              <div className="team-hover-info">
                <p className="team-job">{member.job}</p>
                <p className="team-fact">🎲 {member.fact}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── Call to action ── */}
      <section className="cta-section">
        <img src={rblogo} alt="" className="cta-logo" />
        <h2>Ready to Build the Future?</h2>
        <p>Applications are open. Join UC Merced's robotics engineering society.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Apply Now →</Link>
      </section>

      <Footer />
    </div>
  )
}
