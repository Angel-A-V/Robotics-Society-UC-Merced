// ── Auth Storage ───────────────────────────────────────────────────────
// Wraps localStorage so token key names live in exactly one place.
// Every request that needs a login uses the header helpers below.

const ACCESS_KEY  = 'access_token'
const REFRESH_KEY = 'refresh_token'

export function getToken() {
  return localStorage.getItem(ACCESS_KEY)
}

// Called after a successful login or register — the API returns both tokens.
export function saveTokens({ access, refresh }) {
  if (access)  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

// Called on logout, and whenever the server rejects a stored token.
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

// ── Request headers ──
// authHeaders()     — for FormData uploads; the browser must set the
//                     multipart Content-Type itself (with its boundary),
//                     so we deliberately do NOT set it here.
// jsonAuthHeaders() — for normal JSON requests.
export function authHeaders(token = getToken()) {
  return { Authorization: `Bearer ${token}` }
}

export function jsonAuthHeaders(token = getToken()) {
  return { ...authHeaders(token), 'Content-Type': 'application/json' }
}
