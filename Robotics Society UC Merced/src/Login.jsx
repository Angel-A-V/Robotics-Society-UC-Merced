import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Django's JWT login endpoint — send username and password
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Django returns { detail: "No active account found..." } on bad login
        setError(data.detail || 'Invalid username or password')
        return
      }

      // Store both tokens in localStorage so they survive page refreshes
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      // Now fetch the actual user info using the access token we just got
      const meRes = await fetch('/api/auth/me', {
        headers: {
          // Every protected Django endpoint needs this header
          'Authorization': `Bearer ${data.access}`
        }
      })

      const meData = await meRes.json()

      // Save user to React state so the whole app knows who's logged in
      setUser(meData.user)

      // Send them to the portal
      navigate('/portal')

    } catch (err) {
      setError('Network error — is the Django server running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
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
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
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