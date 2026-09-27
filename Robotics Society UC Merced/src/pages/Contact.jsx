// ── Contact Page ───────────────────────────────────────────────────────
// Contact, sponsorship and collaboration.
//   Hero → Partnership cards → Direct contact + sponsors → Lab map → Footer
//
// All copy, email addresses and links come from data/contact.js.
//
// Styles: styles/pages/contact.css

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Icon from '../components/ui/Icon'
import {
  CONTACT_CARDS, CONTACT_DETAILS, SOCIAL_LINKS,
  LAB_LOCATION, SPONSORS, SPONSOR_INQUIRY_HREF,
} from '../data/contact'
import { CLUB_EMAIL } from '../data/site'
import rblogo from '../assets/rblogo.jpg'
import asucmLogo from '../assets/asucm-logo.png'

export default function Contact({ user, handleLogout }) {
  return (
    <div className="page-contact">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="hero-bg-grid" />
        <div className="contact-hero-inner">
          <div className="hero-badge">Contact &amp; Partnerships</div>
          <h1 className="contact-hero-title">
            Work With <span className="hero-accent">UCM Robotics</span>
          </h1>
          <p className="contact-hero-sub">
            Whether you're a company looking to sponsor, a researcher seeking collaboration,
            or an organization interested in partnership, we'd love to hear from you.
          </p>
          <a href={`mailto:${CLUB_EMAIL}`} className="btn btn-primary btn-lg">
            <Icon name="fi fi-sr-envelope" /> Contact Us Directly
          </a>
        </div>
        <div className="contact-hero-logo">
          <img src={rblogo} alt="UCM Robotics" className="contact-logo-img" />
        </div>
      </section>

      {/* ── Partnership cards ── each one opens a pre-filled email ── */}
      <section className="section" id="contact-options">
        <div className="section-label">How We Can Work Together</div>
        <h2 className="section-title">Partnership Opportunities</h2>
        <p className="section-sub">Investing in student engineers is investing in the future</p>

        <div className="contact-cards-grid">
          {CONTACT_CARDS.map(card => (
            <div className="contact-card" key={card.title}>
              <div className="contact-card-icon" style={{ color: card.color }}>
                <Icon name={card.icon} />
              </div>
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

      {/* ── Direct contact + sponsors ── */}
      <section className="section section-dark" id="direct-contact">
        <div className="contact-direct-inner">
          <div className="contact-direct-text">
            <div className="section-label">Direct Contact</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Reach Out Directly</h2>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, marginBottom: 24 }}>
              The fastest way to reach us is by email. We typically respond within 2–3 business days.
              For urgent matters, please indicate that in your subject line.
            </p>

            {/* Details list — entries with an href become clickable */}
            <div className="contact-info-list">
              {CONTACT_DETAILS.map(item => (
                <div className="contact-info-item" key={item.label}>
                  <span className="contact-info-icon"><Icon name={item.icon} /></span>
                  <div>
                    <div className="contact-info-label">{item.label}</div>
                    {item.href
                      ? <a href={item.href} className="contact-info-value">{item.value}</a>
                      : <div className="contact-info-value">{item.value}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Socials ── */}
            <div className="contact-socials">
              {SOCIAL_LINKS.map(social => (
                <a key={social.label} href={social.href}
                  target="_blank" rel="noopener noreferrer" className="contact-social-chip">
                  <span><Icon name={social.icon} /></span>
                  <div>
                    <div className="social-chip-label">{social.label}</div>
                    <div className="social-chip-handle">{social.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Sponsors ── */}
          <div className="sponsorship-tiers">
            <h3 style={{ marginBottom: 20, color: 'var(--text-h)' }}>Our Sponsors</h3>
            <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              We're proud to be supported by organizations that believe in student-led engineering.
            </p>

            {SPONSORS.map(sponsor => (
              <div className="sponsor-feature-card" key={sponsor.name}>
                <div className="sponsor-feature-logo">
                  <img src={asucmLogo} alt={sponsor.name} className="sponsor-feature-img" />
                </div>
                <div className="sponsor-feature-info">
                  <div className="sponsor-feature-name">{sponsor.name}</div>
                  <div className="sponsor-feature-full">{sponsor.fullName}</div>
                  <div className="sponsor-feature-desc">{sponsor.desc}</div>
                </div>
              </div>
            ))}

            <div className="sponsor-cta-inline">
              <p style={{ color: 'var(--text)', fontSize: 13, marginBottom: 12 }}>
                Interested in sponsoring UCM Robotics Society?
              </p>
              <a href={SPONSOR_INQUIRY_HREF} className="btn btn-primary full-width">
                Inquire About Sponsorship →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lab location ── */}
      <section className="section" id="location">
        <div className="section-label">Where We Work</div>
        <h2 className="section-title">{LAB_LOCATION.name}</h2>
        <p className="section-sub">
          The majority of our projects are run from {LAB_LOCATION.name} at{' '}
          {LAB_LOCATION.address.join(', ')}
        </p>

        <div className="mesa-map-container">
          <div className="mesa-map-info">
            <div className="mesa-info-badge">
              <Icon name="fi fi-sr-map-marker" /> Primary Lab Location
            </div>
            <h3 className="mesa-info-title">{LAB_LOCATION.name}</h3>

            <div className="mesa-info-details">
              {LAB_LOCATION.rows.map(row => (
                <div className="mesa-info-row" key={row.label}>
                  <span className="mesa-info-icon"><Icon name={row.icon} /></span>
                  <div>
                    <div className="mesa-info-label">{row.label}</div>
                    {/* whiteSpace: pre-line renders the \n in the address */}
                    <div className="mesa-info-value" style={{ whiteSpace: 'pre-line' }}>
                      {row.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a href={LAB_LOCATION.mapsUrl} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary" style={{ marginTop: 20 }}>
              <Icon name="fi fi-sr-marker" /> Open in Google Maps
            </a>
          </div>

          <div className="mesa-map-embed">
            <iframe
              title={`${LAB_LOCATION.name} Location`}
              src={LAB_LOCATION.embedUrl}
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

      <Footer />
    </div>
  )
}
