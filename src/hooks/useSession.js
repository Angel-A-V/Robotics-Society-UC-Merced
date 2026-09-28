// ── useSession ─────────────────────────────────────────────────────────
// Owns "who is logged in" for the whole app. Lives at the top of App.jsx;
// the user object and logout function are passed down as props.
//
// On first load it checks for a saved token and asks the server whether it
// is still valid, which is what keeps you logged in across a page refresh.

import { useState, useEffect } from 'react'
import * as api from '../lib/api'
import { clearTokens, getToken } from '../lib/auth'
import { MEMBERS_ENABLED } from '../lib/config'

export function useSession() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!MEMBERS_ENABLED) return   // Backend is switched off — don't call it

    const token = getToken()
    if (!token) return   // Never logged in — nothing to restore

    // Verify the stored token against /api/auth/me
    api.auth.me().then(({ ok, status, data }) => {
      if (ok && data?.user) {
        setUser(data.user)      // Still valid — restore the session
      } else if (status !== 0) {
        clearTokens()           // Server rejected it — expired or revoked
      }
      // status === 0 means the request never landed (server down, offline).
      // Keep the token in that case so a blip doesn't log the user out.
    })
  }, [])   // Empty deps: runs once, when the app first mounts

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return { user, setUser, logout }
}
