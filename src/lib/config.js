// ── Config ─────────────────────────────────────────────────────────────
// Single source of truth for environment URLs and the site-wide limits.
// Nothing else in the app should read import.meta.env directly.
//
// In development both values are empty strings, which makes every request
// relative (/api/...) so the Vite dev-server proxy forwards it to Django
// on port 8000 — see vite.config.js.
// In production they hold the deployed backend URL, injected at build time.

export const API_BASE = import.meta.env.VITE_API_URL || ''
export const WS_BASE  = import.meta.env.VITE_WS_URL  || ''

// ── Upload limits ── keep these in sync with the backend
// backend/api/views.py enforces the same numbers server-side; these only
// give the user a fast error before wasting an upload.
export const MAX_CHAT_FILE_BYTES = 8 * 1024 * 1024   // 8MB — chat attachments
export const MAX_AVATAR_BYTES    = 4 * 1024 * 1024   // 4MB — profile pictures

// ── Content limits ──
export const MAX_BIO_LENGTH  = 300   // matches User.bio max_length in models.py
export const MIN_PASSWORD_LEN = 8    // matches RegisterSerializer min_length

// ── Chat behaviour ──
// Consecutive messages from the same person inside this window are grouped
// under one avatar/name header instead of repeating it.
export const MESSAGE_GROUP_WINDOW_MS = 5 * 60 * 1000  // 5 minutes

// How often the portal re-fetches announcements, channels, users and the
// current user's role. Chat is not polled — it is live over WebSocket.
export const PORTAL_POLL_MS = 5000

// How long a "user is typing" bubble stays up without a new typing event.
export const TYPING_TIMEOUT_MS = 4000

// Throttle: don't send more than one "typing" ping per this interval.
export const TYPING_PING_MS = 2000

// Max height the chat textarea grows to before it starts scrolling.
export const CHAT_INPUT_MAX_HEIGHT = 160

// Emoji offered in the reaction picker before the free-text box.
export const RECOMMENDED_EMOJIS = ['❤️', '😭', '😂', '👍', '🤔', '🔥', '👏', '🤖', '💀', '🫡']

// File extensions rendered as an inline image instead of a download card.
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif']

// Accept attribute for the chat file picker.
export const CHAT_FILE_ACCEPT = 'image/*,.pdf,.doc,.docx,.txt'
