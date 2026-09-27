// ── Portal Tab Definitions ─────────────────────────────────────────────
// One list shared by the desktop sidebar and the mobile bottom bar, so a
// new tab only has to be added in one place.
//
// `adminOnly` tabs are filtered out for members and pending users.
// `shortLabel` is what fits in the mobile bar.

export const PORTAL_TABS = [
  { id: 'announcements', icon: 'fi fi-rr-megaphone', label: 'Announcements',      shortLabel: 'News' },
  { id: 'chat',          icon: 'fi fi-sr-comment',   label: 'Chat',               shortLabel: 'Chat' },
  { id: 'profile',       icon: 'fi fi-ss-user',      label: 'Profile & Settings', shortLabel: 'Profile' },
  { id: 'admin',         icon: 'fi fi-rr-settings',  label: 'Admin Panel',        shortLabel: 'Admin', adminOnly: true },
]

export function visibleTabs(isAdmin) {
  return PORTAL_TABS.filter(tab => !tab.adminOnly || isAdmin)
}

// ── Links out of the portal, back to the public site ──
export const PORTAL_SITE_LINKS = [
  { to: '/',          icon: 'fi fi-sr-house-blank', label: 'Back to Site' },
  { to: '/#projects', icon: 'fi fi-sr-user-robot',  label: 'Projects' },
  { to: '/#team',     icon: 'fi fi-rr-employees',   label: 'Team' },
  { to: '/contact',   icon: 'fi fi-sr-envelope',    label: 'Contact' },
]
