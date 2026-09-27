// ── Login Page ─────────────────────────────────────────────────────────
// Signs in against /api/auth/login, stores the returned JWT pair, then
// fetches the user and hands it up to App state before redirecting.
//
// Styles: styles/pages/auth.css

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordField from '../components/ui/PasswordField'
import { saveTokens } from '../lib/auth'
import * as api from '../lib/api'

export default function Login({ setUser }) {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { ok, status, data } = await api.auth.login(form.username, form.password)

    // status 0 means the request never reached the server at all
    if (status === 0) {
      setError('Network error — is the Django server running on port 8000?')
      setLoading(false)
      return
    }
    if (!ok) {
      setError(data.detail || 'Invalid username or password')
      setLoading(false)
      return
    }

    saveTokens(data)

    // Fetch the full user with the token we just got, rather than waiting
    // for it to round-trip through localStorage.
    const me = await api.auth.me(data.access)
    if (me.ok && me.data?.user) setUser(me.data.user)

    setLoading(false)
    navigate('/portal')
  }

  return (
    <div className="auth-page">
      {/* Decorative floating orbs — see styles/pages/auth.css */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">⚙</div>
          UCM <span style={{ color: 'var(--cyan)' }}>Robotics</span>
        </Link>

        <h2>Member Login</h2>
        <p className="subtitle">Access the members portal</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <PasswordField
            label="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text)' }}>
          Not a member?{' '}
          <Link to="/register" style={{ color: 'var(--cyan)' }}>Apply to join →</Link>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text)' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
