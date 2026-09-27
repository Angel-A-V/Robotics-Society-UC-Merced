// ── Icon ───────────────────────────────────────────────────────────────
// Thin wrapper around the Flaticon <i> markup so data files can store a
// plain class-name string instead of JSX:
//   { icon: 'fi fi-sr-camera' }  →  <Icon name={item.icon} />
//
// Icon fonts are loaded from the CDN in index.html; sizing rules live in
// styles/components/icons.css.

export default function Icon({ name, className = '' }) {
  if (!name) return null
  return <i className={`${name} ${className}`.trim()} />
}
