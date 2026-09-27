// ── Password Field ─────────────────────────────────────────────────────
// A password input with a show/hide eye toggle. Used by both the login and
// register forms so the two behave identically.
//
// The toggle button is tabIndex={-1} deliberately — tabbing from the
// password box should go to the submit button, not the eye icon.

import { useState } from 'react'

export default function PasswordField({ label, value, onChange, placeholder = '••••••••', required = true }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="password-input-wrap">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <i className={visible ? 'fi fi-sr-eye' : 'fi fi-sr-eye-crossed'} />
        </button>
      </div>
    </div>
  )
}
