// ── Portal Mobile Tabs ─────────────────────────────────────────────────
// The bottom tab bar that replaces the sidebar on phones.
//
// NOTE: this is rendered with display:none inline, and the mobile media
// query in styles/portal/chat.css flips it back to flex below 900px. Do not
// remove the inline style — without it the bar shows on desktop too.

import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { visibleTabs } from './portalTabs'

export default function PortalMobileTabs({ activeTab, onTabChange, isAdmin }) {
  return (
    <nav className="mobile-tab-bar" style={{ display: 'none' }}>
      {visibleTabs(isAdmin).map(tab => (
        <button key={tab.id}
          className={`mobile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}>
          <span className="tab-icon"><Icon name={tab.icon} /></span>
          <span>{tab.shortLabel}</span>
        </button>
      ))}

      {/* Always-available escape hatch back to the public site */}
      <Link to="/" className="mobile-tab-btn">
        <span className="tab-icon"><Icon name="fi fi-sr-house-blank" /></span>
        <span>Site</span>
      </Link>
    </nav>
  )
}
