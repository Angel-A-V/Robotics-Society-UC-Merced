import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register({ setUser }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic client-side validation before even hitting the server
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      // Hit our custom register endpoint in api/views.py RegisterView
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          confirm_password: form.confirm,  // Django serializer checks these match too
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Django returns field-level errors as objects e.g. { username: ["already taken"] }
        // This flattens them into a single readable string
        const messages = Object.values(data).flat().join(' ')
        setError(messages || 'Registration failed')
        return
      }

      // Registration returns tokens immediately — store them just like login does
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      // Save user to React state
      setUser(data.user)
      setSuccess(true)

    } catch (err) {
      setError('Network error — is the Django server running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  // Show this screen after successful registration instead of redirecting immediately
  // so the user understands they're in pending state
  if (success) {
    return (
      <div className="auth-page">
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
          <Link
            to="/portal"
            className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 16 }}
          >
            Enter Portal →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
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
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            style={{ justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
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