// ── API Client ─────────────────────────────────────────────────────────
// Every call to the Django backend goes through this file. If an endpoint
// path changes, it changes here once instead of in a dozen components.
//
// Each helper resolves to { ok, status, data }:
//   ok     — true for 2xx responses
//   status — the HTTP status code (0 if the network request never landed)
//   data   — the parsed JSON body, or {} when there is no body
//
// Callers branch on `ok` and read `data` — they never touch fetch() or
// build an Authorization header themselves.
//
// Endpoint list mirrors backend/api/urls.py.

import { API_BASE } from './config'
import { authHeaders, jsonAuthHeaders } from './auth'

// ── Core request ──
async function request(path, { method = 'GET', body, auth = true, form = false } = {}) {
  const headers = {}
  if (auth) Object.assign(headers, form ? authHeaders() : jsonAuthHeaders())
  else if (!form) headers['Content-Type'] = 'application/json'

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      // FormData must be passed through untouched so the browser can set
      // the multipart boundary; everything else is JSON-encoded.
      body: body === undefined ? undefined : (form ? body : JSON.stringify(body)),
    })

    // DELETE endpoints and some errors come back with no body at all.
    let data = {}
    try { data = await res.json() } catch { /* empty body — fine */ }

    return { ok: res.ok, status: res.status, data }
  } catch {
    // Network-level failure: server down, DNS, offline, CORS block.
    return { ok: false, status: 0, data: {} }
  }
}

// ── Auth & account ──
export const auth = {
  login:    (username, password) =>
    request('/api/auth/login', { method: 'POST', auth: false, body: { username, password } }),

  register: ({ username, email, password, confirm }) =>
    request('/api/auth/register', {
      method: 'POST', auth: false,
      body: { username, email, password, confirm_password: confirm },
    }),

  // Current user. Pass an explicit token to verify one we were just handed
  // (right after login, before it is read back out of localStorage);
  // call it with no argument to use the stored token.
  me: (token) => token ? meWithToken(token) : request('/api/auth/me'),

  publicProfile: (username) => request(`/api/auth/profile/${username}`),

  updateBio: (bio) => request('/api/auth/profile', { method: 'PUT', body: { bio } }),

  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('avatar', file)
    return request('/api/auth/profile/avatar', { method: 'POST', form: true, body: form })
  },
}

// /api/auth/me using an explicit token instead of the stored one.
async function meWithToken(token) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = {}
    try { data = await res.json() } catch { /* empty body */ }
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: {} }
  }
}

// ── Admin: user management ──
export const users = {
  list:       ()          => request('/api/auth/users'),
  approve:    (id)        => request(`/api/auth/users/${id}/approve`, { method: 'POST' }),
  changeRole: (id, role)  => request(`/api/auth/users/${id}/role`, { method: 'PUT', body: { role } }),
}

// ── Announcements ──
export const announcements = {
  list:   ()     => request('/api/announcements/'),
  create: (data) => request('/api/announcements/create', { method: 'POST', body: data }),
  remove: (id)   => request(`/api/announcements/${id}/`, { method: 'DELETE' }),
}

// ── Chat ──
export const chat = {
  channels:      ()                => request('/api/chat/channels/'),
  createChannel: (name, description) =>
    request('/api/chat/channels/create', { method: 'POST', body: { name, description } }),
  deleteChannel: (id)              => request(`/api/chat/channels/${id}/delete`, { method: 'DELETE' }),

  messages:      (channelId)       => request(`/api/chat/channels/${channelId}/messages/`),
  deleteMessage: (id)              => request(`/api/chat/messages/${id}/delete`, { method: 'DELETE' }),
  react:         (id, emoji)       => request(`/api/chat/messages/${id}/react`, { method: 'POST', body: { emoji } }),

  upload: (channelId, file) => {
    const form = new FormData()
    form.append('file', file)
    return request(`/api/chat/channels/${channelId}/upload`, { method: 'POST', form: true, body: form })
  },
}

// Link to Django's own admin site, shown on the Admin tab.
export const djangoAdminUrl = `${API_BASE}/admin/`
