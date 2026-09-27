// ── Demo Pending ───────────────────────────────────────────────────────
// Placeholder shown in a project's Demo section until there is real footage
// or a build gallery to put there.

import Icon from '../ui/Icon'

export default function DemoPending() {
  return (
    <div className="demo-pending">
      <div className="demo-pending-icon"><Icon name="fi fi-sr-hourglass-end" /></div>
      <h3 className="demo-pending-title">Demo Pending</h3>
      <p className="demo-pending-sub">
        This project is currently in active development. A demonstration video and build
        gallery will be published here once the system reaches a testable milestone.
      </p>
      <div className="demo-pending-badge">In Development — Check Back Soon</div>
    </div>
  )
}
