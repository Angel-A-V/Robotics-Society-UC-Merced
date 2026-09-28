// ── Members Offline Page ───────────────────────────────────────────────
// Shown at /login, /register and /portal while MEMBERS_ENABLED is false in
// lib/config.js (the backend is down). Explains what's going on and points
// people who want to join at Discord, Instagram and email instead.
//
// Styles: styles/pages/auth.css (shares the login card look)

import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Icon from '../components/ui/Icon'
import { CLUB_EMAIL, DISCORD_URL, INSTAGRAM_URL } from '../data/site'

export default function MembersOffline({ user, handleLogout }) {
  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="auth-page members-offline">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-card">
          <div className="members-offline-status">
            <span className="members-offline-dot" /> Temporarily Offline
          </div>

          <h2>Member Accounts Are Down</h2>
          <p className="subtitle">
            Our login and sign-up system is offline for now, so the members portal
            isn't available. You can still join the club though! Hop into our
            Discord to meet everyone and see announcements, or reach out and
            we'll get you set up.
          </p>

          <div className="members-offline-actions">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary full-width">
              <Icon name="fi fi-brands-discord" /> Join our Discord
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline full-width">
              <Icon name="fi fi-brands-instagram" /> Message us on Instagram
            </a>
            <a href={`mailto:${CLUB_EMAIL}?subject=Joining UCM Robotics Society`}
              className="btn btn-outline full-width">
              <Icon name="fi fi-sr-envelope" /> Email us
            </a>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--text)' }}>← Back to website</Link>
          </div>
        </div>
      </div>
    </>
  )
}
