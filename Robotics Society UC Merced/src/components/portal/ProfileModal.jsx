// ── Profile Modal ──────────────────────────────────────────────────────
// Pops up when a username or avatar is clicked in chat. Fetches that user's
// public profile (never their email) and shows their bio and join date.
//
// Styles: styles/portal/profile-modal.css

import { useState, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import RoleBadge from './RoleBadge'
import { useEscapeKey } from '../../hooks/useEscapeKey'
import { formatMonthYear } from '../../lib/format'
import * as api from '../../lib/api'

export default function ProfileModal({ username, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEscapeKey(onClose)

  useEffect(() => {
    api.auth.publicProfile(username).then(({ ok, data }) => {
      setProfile(ok ? data : null)
      setLoading(false)
    })
  }, [username])

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          <i className="fi fi-rr-cross-small" />
        </button>

        {loading ? (
          <div className="profile-modal-loading">Loading...</div>
        ) : !profile || profile.error ? (
          <div className="profile-modal-loading">User not found.</div>
        ) : (
          <>
            {/* ── Header: photo, name, role, join date ── */}
            <div className="profile-modal-header">
              <Avatar avatarUrl={profile.avatar_url} username={profile.username}
                role={profile.role} size={72} />
              <div className="profile-modal-info">
                <h2 className="profile-modal-name">{profile.username}</h2>
                <RoleBadge role={profile.role} />
                <div className="profile-modal-joined">
                  Joined {formatMonthYear(profile.date_joined)}
                </div>
              </div>
            </div>

            {/* ── Bio, or a muted placeholder when empty ── */}
            {profile.bio ? (
              <div className="profile-modal-bio">
                <div className="profile-modal-bio-label">About</div>
                <p>{profile.bio}</p>
              </div>
            ) : (
              <div className="profile-modal-bio" style={{ opacity: 0.4 }}>
                <p style={{ fontStyle: 'italic' }}>No bio yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
