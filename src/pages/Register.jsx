// ── Register Page ──────────────────────────────────────────────────────
// Creates an account and logs straight in. New accounts start with the
// "pending" role and need an admin to approve them before they can post —
// the success screen spells out what they can and cannot do meanwhile.
//
// Styles: styles/pages/auth.css

import { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordField from '../components/ui/PasswordField'
import { saveTokens } from '../lib/auth'
import { MIN_PASSWORD_LEN } from '../lib/config'
import * as api from '../lib/api'

export default function Register({ setUser }) {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Checked here so the user gets an answer without a round trip. The
    // backend validates both again in RegisterSerializer.
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < MIN_PASSWORD_LEN) {
      setError(`Password must be at least ${MIN_PASSWORD_LEN} characters`)
      return
    }

    setLoading(true)
    const { ok, status, data } = await api.auth.register(form)

    if (status === 0) {
      setError('Network error — is the Django server running on port 8000?')
      setLoading(false)
      return
    }
    if (!ok) {
      // Django REST returns { field: ["message", ...] } — flatten it into
      // one readable line.
      setError(Object.values(data).flat().join(' ') || 'Registration failed')
      setLoading(false)
      return
    }

    saveTokens(data)
    setUser(data.user)
    setSuccess(true)
    setLoading(false)
  }

  // ── Success screen ──
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
          <h2 style={{ marginBottom: 12 }}>Account Created!</h2>
          <p style={{ color: 'var(--text)', marginBottom: 24 }}>
            Your account has been created with{' '}
            <strong style={{ color: 'var(--warning)' }}>pending</strong> status.
            An admin must approve you before you can send messages.
          </p>
          <div className="alert alert-warning" style={{ textAlign: 'left' }}>
            <strong>What you can do right now:</strong><br />
            ✓ View announcements<br />
            ✓ Browse chat history (read-only)<br />
            ✓ View all projects<br />
            ✗ Send messages (requires approval)
          </div>
          <Link to="/portal" className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 16 }}>
            Enter Portal →
          </Link>
        </div>
      </div>
    )
  }

  // ── Sign-up form ──
  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">⚙</div>
          UCM <span style={{ color: 'var(--cyan)' }}>Robotics</span>
        </Link>

        <h2>Join the Society</h2>
        <p className="subtitle">Create your member account</p>

        <div className="alert alert-warning" style={{ fontSize: 12 }}>
          New accounts require admin approval before full access is granted.
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="robotics_fan_42"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@ucmerced.edu"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <PasswordField
            label="Password"
            placeholder={`Min. ${MIN_PASSWORD_LEN} characters`}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <PasswordField
            label="Confirm Password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
          />

          <button type="submit" className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text)' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: 'var(--cyan)' }}>Login →</Link>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text)' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
