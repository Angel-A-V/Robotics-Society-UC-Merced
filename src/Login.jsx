import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE } from './api'

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Invalid username or password')
        return
      }
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${data.access}` }
      })
      const meData = await meRes.json()
      setUser(meData.user)
      navigate('/portal')
    } catch (err) {
      setError('Network error — is the Django server running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
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
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <i className="fi fi-sr-eye"></i> : <i className="fi fi-sr-eye-crossed"></i>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
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