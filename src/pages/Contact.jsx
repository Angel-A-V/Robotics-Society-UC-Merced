// Contact.jsx — Contact, Sponsorship & Collaboration page

import Navbar from '../Navbar'
import { Link } from 'react-router-dom'
import rblogo from '../assets/rblogo.jpg'
import asucmLogo from '../assets/asucm-logo.png'

const CONTACT_CARDS = [
  {
    icon: <i className="fi fi-sr-handshake"></i>,
    title: 'Sponsorship',
    desc: 'Partner with UCM Robotics Society to support the next generation of engineers. Your sponsorship funds hardware, competition fees, and club operations.',
    cta: 'Become a Sponsor',
    href: 'mailto:nsamson@ucmerced.edu?subject=Sponsorship Inquiry — UCM Robotics Society',
    color: 'var(--sapphire)',
  },
  {
    icon: <i className="fi fi-sr-man-scientist"></i>,
    title: 'Research Collaboration',
    desc: 'Collaborate with our student teams on robotics research projects. We work across autonomous systems, computer vision, embedded control, and more.',
    cta: 'Start a Collaboration',
    href: 'mailto:nsamson@ucmerced.edu?subject=Research Collaboration — UCM Robotics Society',
    color: 'var(--green)',
  },
  {
    icon: <i className="fi fi-ss-industrial-pollution"></i>,
    title: 'Industry Partnership',
    desc: 'Connect with talented engineering students for internships, co-ops, and full-time opportunities. We can arrange site visits and career talks.',
    cta: 'Partner With Us',
    href: 'mailto:nsamson@ucmerced.edu?subject=Industry Partnership — UCM Robotics Society',
    color: 'var(--warning)',
  },
  {
    icon: <i className="fi fi-sr-megaphone"></i>,
    title: 'Media & Outreach',
    desc: 'Interested in covering our work or featuring our team? We welcome press coverage, podcast appearances, and community outreach opportunities.',
    cta: 'Get in Touch',
    href: 'mailto:nsamson@ucmerced.edu?subject=Media Inquiry — UCM Robotics Society',
    color: '#a78bfa',
  },
]

const SOCIAL_LINKS = [
  { icon: <i className="fi fi-brands-instagram"></i>, label: 'Instagram', handle: '@ucm_rs', href: 'https://instagram.com/ucm_rs' },
  { icon: <i className="fi fi-brands-linkedin"></i>, label: 'LinkedIn', handle: 'N/A' },
  { icon: <i className="fi fi-brands-github"></i>, label: 'GitHub', handle: 'Angel-A-V', href: 'https://github.com/Angel-A-V/Robotics-Society-UC-Merced' },
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
            or an organization interested in partnership, we'd love to hear from you.
          </p>
          <a href="mailto:nsamson@ucmerced.edu" className="btn btn-primary btn-lg">
            <i className="fi fi-sr-envelope"></i> Contact Us Directly
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
                <span className="contact-info-icon"><i className="fi fi-sr-circle-envelope"></i></span>
                <div>
                  <div className="contact-info-label">General Inquiries</div>
                  <a href="mailto:nsamson@ucmerced.edu" className="contact-info-value">
                    nsamson@ucmerced.edu
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon"><i className="fi fi-sr-graduation-cap"></i></span>
                <div>
                  <div className="contact-info-label">University</div>
                  <div className="contact-info-value">University of California, Merced</div>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon"><i className="fi fi-sr-diploma"></i></span>
                <div>
                  <div className="contact-info-label">School</div>
                  <div className="contact-info-value">School of Engineering</div>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon"><i className="fi fi-sr-map-marker"></i></span>
                <div>
                  <div className="contact-info-label">Location</div>
                  <div className="contact-info-value">Merced, California 95343</div>
                </div>
              </div>
            </div>

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

          {/* ── Our Sponsors box ── */}
          <div className="sponsorship-tiers">
            <h3 style={{ marginBottom: 20, color: 'var(--text-h)' }}>Our Sponsors</h3>
            <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              We're proud to be supported by organizations that believe in student-led engineering.
            </p>

            {/* ASUCM sponsor card */}
            <div className="sponsor-feature-card">
              <div className="sponsor-feature-logo">
                <img src={asucmLogo} alt="ASUCM" className="sponsor-feature-img" />
              </div>
              <div className="sponsor-feature-info">
                <div className="sponsor-feature-name">ASUCM</div>
                <div className="sponsor-feature-full">Associated Students of the University of California, Merced</div>
                <div className="sponsor-feature-desc">
                  Official student government sponsor providing funding and resources to support our robotics programs and competitions.
                </div>
              </div>
            </div>

            <div className="sponsor-cta-inline">
              <p style={{ color: 'var(--text)', fontSize: 13, marginBottom: 12 }}>
                Interested in sponsoring UCM Robotics Society?
              </p>
              <a href="mailto:robotics@ucmerced.edu?subject=Sponsorship Inquiry"
                className="btn btn-primary full-width">
                Inquire About Sponsorship →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MESA Labs Map ── */}
      <section className="section" id="location">
        <div className="section-label">Where We Work</div>
        <h2 className="section-title">MESA Labs</h2>
        <p className="section-sub">
          The majority of our projects are run from MESA Labs at 4225 Hospital Road, Atwater, CA
        </p>

        <div className="mesa-map-container">
          <div className="mesa-map-info">
            <div className="mesa-info-badge"><i className="fi fi-sr-map-marker"></i> Primary Lab Location</div>
            <h3 className="mesa-info-title">MESA Labs</h3>
            <div className="mesa-info-details">
              <div className="mesa-info-row">
                <span className="mesa-info-icon"><i className="fi fi-sr-house-building"></i></span>
                <div>
                  <div className="mesa-info-label">Address</div>
                  <div className="mesa-info-value">4225 Hospital Road<br />Atwater, CA 95301</div>
                </div>
              </div>
              <div className="mesa-info-row">
                <span className="mesa-info-icon"><i className="fi fi-sr-users-alt"></i></span>
                <div>
                  <div className="mesa-info-label">Facility</div>
                  <div className="mesa-info-value">Engineering Lab & Workshop</div>
                </div>
              </div>
              <div className="mesa-info-row">
                <span className="mesa-info-icon"><i className="fi fi-sr-user-robot"></i></span>
                <div>
                  <div className="mesa-info-label">Projects Run Here</div>
                  <div className="mesa-info-value">BattleBots · Rally Kart · Robot Arm · Autonomous Robot</div>
                </div>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=4225+Hospital+Road,+Atwater,+CA+95301"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: 20 }}
            >
              <i className="fi fi-sr-marker"></i> Open in Google Maps
            </a>
          </div>

          <div className="mesa-map-embed">
            <iframe
              title="MESA Labs Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-120.6093!3d37.3582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80918b7a7e3b5555%3A0x0!2s4225+Hospital+Rd%2C+Atwater%2C+CA+95301!5e0!3m2!1sen!2sus!4v1680000000000"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 12, minHeight: 320 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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