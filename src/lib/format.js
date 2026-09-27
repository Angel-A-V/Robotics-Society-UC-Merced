// ── Formatting Helpers ─────────────────────────────────────────────────
// Date and time formatting used across the portal. Kept here so every
// timestamp in the app reads the same way.

// "2:45 PM" — chat message timestamps.
export function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// "3/14/2026" — announcement and user-table dates.
export function formatShortDate(value) {
  return new Date(value).toLocaleDateString()
}

// "March 14, 2026" — the account info panel.
export function formatLongDate(value) {
  return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// "March 2026" — the "Joined ..." line in the profile modal.
export function formatMonthYear(value) {
  return new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
