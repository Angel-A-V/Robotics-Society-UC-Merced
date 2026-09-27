// ── Portal Sidebar ─────────────────────────────────────────────────────
// The left column of the portal: who you are, the tab switcher, links back
// to the public site, and logout.
//
// Hidden below the mobile breakpoint, where PortalMobileTabs takes over.
//
// Styles: styles/portal/layout.css

import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import RoleBadge from './RoleBadge'
import Icon from '../ui/Icon'
import { visibleTabs, PORTAL_SITE_LINKS } from './portalTabs'

export default function PortalSidebar({ user, activeTab, onTabChange, isAdmin, onLogout }) {
  return (
    <aside className="portal-sidebar">
      {/* ── Header ── clicking your name opens the profile tab ── */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">⚙ UCM Robotics</Link>
        <div className="sidebar-user" onClick={() => onTabChange('profile')}
          style={{ cursor: 'pointer' }} title="Edit profile">
          <Avatar avatarUrl={user.avatar_url} username={user.username}
            role={user.role} size={34} />
          <div>
            <div className="sidebar-username">{user.username}</div>
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* ── Portal tabs ── */}
        <div className="nav-section-label">Portal</div>
        {visibleTabs(isAdmin).map(tab => (
          <button key={tab.id}
            className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}>
            <Icon name={tab.icon} />
            <span className="nav-item-label">{tab.label}</span>
          </button>
        ))}

        {/* ── Links back to the public site ── */}
        <div className="nav-section-label" style={{ marginTop: 24 }}>Navigate</div>
        {PORTAL_SITE_LINKS.map(link => (
          <Link key={link.to} to={link.to} className="sidebar-nav-item">
            <span className="nav-icon"><Icon name={link.icon} /></span>
            {link.label}
          </Link>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>Logout</button>
    </aside>
  )
}
