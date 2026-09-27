// ── Role Badge ─────────────────────────────────────────────────────────
// The small coloured pill showing pending / member / admin.
// Colours are defined by .role-pending / .role-member / .role-admin
// in styles/portal/layout.css.

export default function RoleBadge({ role }) {
  return <span className={`role-badge role-${role}`}>{role}</span>
}
