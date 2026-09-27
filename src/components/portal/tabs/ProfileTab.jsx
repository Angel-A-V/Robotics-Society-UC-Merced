// ── Profile Tab ────────────────────────────────────────────────────────
// "Profile & Settings": avatar upload, bio, and read-only account info.
//
// After saving, this re-fetches the user from the server and pushes it up
// through setUser. That keeps App.jsx's user object the single source of
// truth, so the sidebar, chat avatar and everything else update together
// instead of drifting out of sync with a local preview.
//
// Styles: styles/portal/profile.css

import { useState, useRef } from 'react'
import RoleBadge from '../RoleBadge'
import { resolveMediaUrl } from '../../../lib/media'
import { formatLongDate } from '../../../lib/format'
import { MAX_AVATAR_BYTES, MAX_BIO_LENGTH } from '../../../lib/config'
import * as api from '../../../lib/api'

export default function ProfileTab({ user, setUser }) {
  const [bio, setBio]                 = useState(user?.bio || '')
  const [avatarFile, setAvatarFile]   = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)  // Local object URL
  const [saving, setSaving]           = useState(false)
  const [message, setMessage]         = useState('')
  const avatarInputRef = useRef(null)

  // NOTE: `bio` is seeded once from the user object and deliberately NOT
  // re-synced afterwards. The portal polls every few seconds, and re-seeding
  // on every refresh would wipe out a bio you were part-way through typing.

  // Show the local preview while it exists, otherwise the saved photo.
  const currentAvatarUrl = avatarPreview || resolveMediaUrl(user.avatar_url)

  function handleAvatarSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_AVATAR_BYTES) {
      setMessage('Avatar too large. Max 4MB.')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    // 1. Upload the new avatar, if one was picked
    if (avatarFile) {
      const { ok } = await api.auth.uploadAvatar(avatarFile)
      if (!ok) {
        setMessage('Avatar upload failed.')
        setSaving(false)
        return
      }
    }

    // 2. Save the bio
    const { ok } = await api.auth.updateBio(bio)
    if (!ok) {
      setMessage('Save failed. Please try again.')
      setSaving(false)
      return
    }

    // 3. Pull the updated user back down and push it to App state
    const me = await api.auth.me()
    if (me.ok && me.data?.user) setUser(me.data.user)

    setMessage('Profile saved! ✓')
    setAvatarFile(null)
    setAvatarPreview(null)   // Drop the preview — we now use the saved value
    setSaving(false)
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Profile &amp; Settings</h2>
          <p>Customize how others see you</p>
        </div>
      </div>

      <form className="profile-settings-form" onSubmit={handleSave}>
        {/* ── Avatar ── the whole circle is the upload button ── */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrap"
            onClick={() => avatarInputRef.current?.click()}
            title="Click to change avatar">
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="avatar" className="profile-avatar-img" />
            ) : (
              <div className={`profile-avatar-placeholder avatar-${user.role}`}>
                {user.username[0].toUpperCase()}
              </div>
            )}
            <div className="profile-avatar-overlay"><i className="fi fi-sr-camera" /> Change</div>
          </div>

          <input ref={avatarInputRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handleAvatarSelect} />

          <div className="profile-avatar-info">
            <strong>{user.username}</strong>
            <RoleBadge role={user.role} />
            <p className="profile-avatar-hint">
              Click avatar to upload a new photo (max 4MB, JPG/PNG/GIF/WebP)
            </p>
          </div>
        </div>

        {/* ── Bio ── capped to match the model's max_length ── */}
        <div className="profile-field">
          <label className="profile-label">
            About Me <span className="profile-label-hint">({bio.length}/{MAX_BIO_LENGTH})</span>
          </label>
          <textarea
            className="profile-bio-input"
            placeholder="Tell the team a bit about yourself — your interests, projects, skills..."
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
            rows={4}
          />
        </div>

        {/* ── Account info ── read only; roles are changed by admins ── */}
        <div className="profile-field">
          <label className="profile-label">Account Info</label>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Username:</span>
              <span className="profile-info-value">{user.username}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email:</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Role:</span>
              <RoleBadge role={user.role} />
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Joined:</span>
              <span className="profile-info-value">{formatLongDate(user.date_joined)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && (
            <span style={{
              fontSize: 14,
              color: message.includes('✓') ? 'var(--green)' : 'var(--danger)',
            }}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
