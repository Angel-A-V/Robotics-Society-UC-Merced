// Contact.jsx — Contact, Sponsorship & Collaboration page
// A professional-facing page for sponsors, companies, and organizations.

import Navbar from '../Navbar'
import { Link } from 'react-router-dom'
import rblogo from '../assets/rblogo.jpg'

// ── Contact cards data ────────────────────────────────────────────────────────
const CONTACT_CARDS = [
  {
    icon: '🤝',
    title: 'Sponsorship',
    desc: 'Partner with UCM Robotics Society to support the next generation of engineers. Your sponsorship funds hardware, competition fees, and club operations.',
    cta: 'Become a Sponsor',
    href: 'mailto:robotics@ucmerced.edu?subject=Sponsorship Inquiry — UCM Robotics Society',
    color: 'var(--sapphire)',
  },
  {
    icon: '🔬',
    title: 'Research Collaboration',
    desc: 'Collaborate with our student teams on robotics research projects. We work across autonomous systems, computer vision, embedded control, and more.',
    cta: 'Start a Collaboration',
    href: 'mailto:robotics@ucmerced.edu?subject=Research Collaboration — UCM Robotics Society',
    color: 'var(--green)',
  },
  {
    icon: '🏢',
    title: 'Industry Partnership',
    desc: 'Connect with talented engineering students for internships, co-ops, and full-time opportunities. We can arrange site visits and career talks.',
    cta: 'Partner With Us',
    href: 'mailto:robotics@ucmerced.edu?subject=Industry Partnership — UCM Robotics Society',
    color: 'var(--warning)',
  },
  {
    icon: '📢',
    title: 'Media & Outreach',
    desc: 'Interested in covering our work or featuring our team? We welcome press coverage, podcast appearances, and community outreach opportunities.',
    cta: 'Get in Touch',
    href: 'mailto:robotics@ucmerced.edu?subject=Media Inquiry — UCM Robotics Society',
    color: '#a78bfa',
  },
]

const SOCIAL_LINKS = [
  { icon: '📸', label: 'Instagram', handle: '@ucm_robotics', href: 'https://instagram.com/ucm_robotics' },
  { icon: '💼', label: 'LinkedIn', handle: 'UCM Robotics Society', href: 'https://linkedin.com' },
  { icon: '🐙', label: 'GitHub', handle: 'Angel-A-V', href: 'https://github.com/Angel-A-V/Robotics-Society-UC-Merced' },
]

const SPONSORS_PLACEHOLDER = [
  { name: 'Your Company Here', tier: 'Gold Sponsor' },
  { name: 'Your Company Here', tier: 'Silver Sponsor' },
  { name: 'Your Company Here', tier: 'Bronze Sponsor' },
]

export default function Contact({ user, handleLogout }) {
  return (
    <div className="page-contact">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="hero-bg-grid" />
        <div className="contact-hero-inner">
          <div className="hero-badge">Contact & Partnerships</div>
          <h1 className="contact-hero-title">
            Work With <span className="hero-accent">UCM Robotics</span>
          </h1>
          <p className="contact-hero-sub">
            Whether you're a company looking to sponsor, a researcher seeking collaboration,
            or an organization interested in partnership — we'd love to hear from you.
          </p>
          <a href="mailto:robotics@ucmerced.edu" className="btn btn-primary btn-lg">
            📧 Contact Us Directly
          </a>
        </div>
        <div className="contact-hero-logo">
          <img src={rblogo} alt="UCM Robotics" className="contact-logo-img" />
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="section" id="contact-options">
        <div className="section-label">How We Can Work Together</div>
        <h2 className="section-title">Partnership Opportunities</h2>
        <p className="section-sub">Investing in student engineers is investing in the future</p>

        <div className="contact-cards-grid">
          {CONTACT_CARDS.map(card => (
            <div className="contact-card" key={card.title}>
              <div className="contact-card-icon" style={{ color: card.color }}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <a href={card.href} className="btn btn-outline contact-card-btn"
                style={{ borderColor: card.color, color: card.color }}>
                {card.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Direct Contact ── */}
      <section className="section section-dark" id="direct-contact">
        <div className="contact-direct-inner">
          <div className="contact-direct-text">
            <div className="section-label">Direct Contact</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Reach Out Directly</h2>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, marginBottom: 24 }}>
              The fastest way to reach us is by email. We typically respond within 2–3 business days.
              For urgent matters, please indicate that in your subject line.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-info-icon">📧</span>
                <div>
                  <div className="contact-info-label">General Inquiries</div>
                  <a href="mailto:robotics@ucmerced.edu" className="contact-info-value">
                    robotics@ucmerced.edu
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">🏫</span>
                <div>
                  <div className="contact-info-label">University</div>
                  <div className="contact-info-value">University of California, Merced</div>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">🏗</span>
                <div>
                  <div className="contact-info-label">School</div>
                  <div className="contact-info-value">School of Engineering</div>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">📍</span>
                <div>
                  <div className="contact-info-label">Location</div>
                  <div className="contact-info-value">Merced, California 95343</div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="contact-socials">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="contact-social-chip">
                  <span>{s.icon}</span>
                  <div>
                    <div className="social-chip-label">{s.label}</div>
                    <div className="social-chip-handle">{s.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Sponsorship tiers */}
          <div className="sponsorship-tiers">
            <h3 style={{ marginBottom: 20, color: 'var(--text-h)' }}>Sponsorship Tiers</h3>

            <div className="tier-card tier-gold">
              <div className="tier-icon">🥇</div>
              <div className="tier-info">
                <div className="tier-name">Gold Sponsor</div>
                <div className="tier-perks">Logo on website · Recognition at events · Priority recruiting access · Dedicated thank-you post</div>
              </div>
            </div>

            <div className="tier-card tier-silver">
              <div className="tier-icon">🥈</div>
              <div className="tier-info">
                <div className="tier-name">Silver Sponsor</div>
                <div className="tier-perks">Logo on website · Recognition at events · Recruiting access</div>
              </div>
            </div>

            <div className="tier-card tier-bronze">
              <div className="tier-icon">🥉</div>
              <div className="tier-info">
                <div className="tier-name">Bronze Sponsor</div>
                <div className="tier-perks">Name on website · Recognition at events</div>
              </div>
            </div>

            <a href="mailto:robotics@ucmerced.edu?subject=Sponsorship Inquiry"
              className="btn btn-primary full-width" style={{ marginTop: 20 }}>
              Inquire About Sponsorship →
            </a>
          </div>
        </div>
      </section>

      {/* ── Current Sponsors ── */}
      <section className="section" id="sponsors">
        <div className="section-label">Our Supporters</div>
        <h2 className="section-title">Current Sponsors</h2>
        <p className="section-sub">We're grateful for the organizations that make our work possible</p>

        <div className="sponsors-grid">
          {SPONSORS_PLACEHOLDER.map((s, i) => (
            <div className="sponsor-placeholder" key={i}>
              <div className="sponsor-placeholder-inner">
                <div className="sponsor-placeholder-icon">🏢</div>
                <div className="sponsor-placeholder-name">{s.name}</div>
                <div className="sponsor-placeholder-tier">{s.tier}</div>
              </div>
            </div>
          ))}
          <div className="sponsor-placeholder sponsor-cta-card">
            <div className="sponsor-placeholder-inner">
              <div className="sponsor-placeholder-icon">➕</div>
              <div className="sponsor-placeholder-name">Your Organization</div>
              <a href="mailto:robotics@ucmerced.edu?subject=Sponsorship Inquiry"
                className="btn btn-primary" style={{ marginTop: 12, fontSize: 13 }}>
                Become a Sponsor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo-row">
          <img src={rblogo} alt="RS" className="footer-logo-img" />
          <span className="footer-logo-text">UC Merced Robotics Society</span>
        </div>
        <p>University of California, Merced · School of Engineering</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Join</Link>
        </div>
        <p className="footer-copy">© 2025 UC Merced Robotics Society</p>
      </footer>
    </div>
  )
}