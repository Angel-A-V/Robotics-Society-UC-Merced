// ── Portal ─────────────────────────────────────────────────────────────
// Members-only dashboard. This file is the shell: it decides what the
// current user is allowed to see, wires up the data and the chat socket,
// and renders the active tab.
//
// The actual screens live in components/portal/tabs/.
//
// Deliberate choices worth knowing about:
//   - useSocket lives HERE, not inside ChatTab, so the chat connection
//     survives switching to another tab and back.
//   - Only one tab is mounted at a time, so each tab's own UI state
//     (drafts, open forms) resets when you leave it.
//
// Styles: styles/portal/*.css

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import PortalSidebar from '../components/portal/PortalSidebar'
import PortalMobileTabs from '../components/portal/PortalMobileTabs'
import ProfileModal from '../components/portal/ProfileModal'
import Lightbox from '../components/ui/Lightbox'

import AnnouncementsTab from '../components/portal/tabs/AnnouncementsTab'
import ChatTab from '../components/portal/tabs/ChatTab'
import ProfileTab from '../components/portal/tabs/ProfileTab'
import AdminTab from '../components/portal/tabs/AdminTab'

import { usePortalData } from '../hooks/usePortalData'
import { useSocket } from '../hooks/useSocket'
import { getToken } from '../lib/auth'

export default function Portal({ user, setUser, handleLogout }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('announcements')

  // Shared overlays — either tab can open them, so they live at this level.
  const [lightbox, setLightbox]         = useState(null)   // { src, alt }
  const [profileModal, setProfileModal] = useState(null)   // username string

  const token = getToken()
  const portal = usePortalData(user, setUser)
  const socket = useSocket(portal.activeChannel?.id, token)

  // Not logged in? The portal has nothing to show — send them to login.
  useEffect(() => { if (!user) navigate('/login') }, [user])
  if (!user) return null

  // ── Permissions ── derived from the role, used throughout the tabs
  const isPending = user.role === 'pending'
  const isAdmin   = user.role === 'admin'
  const isMember  = user.role === 'member' || isAdmin   // Admins can do everything members can

  return (
    <div className="portal-layout">
      {/* ── Overlays ── */}
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
      {profileModal && (
        <ProfileModal username={profileModal} onClose={() => setProfileModal(null)} />
      )}

      <PortalSidebar
        user={user}
        activeTab={tab}
        onTabChange={setTab}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="portal-main">
        {/* ── Pending banner ── explains the read-only state up front ── */}
        {isPending && (
          <div className="pending-banner">
            Your account is <strong>pending approval</strong>. You can read everything but
            cannot send messages until an admin approves you.
          </div>
        )}

        {tab === 'announcements' && (
          <AnnouncementsTab
            announcements={portal.announcements}
            isAdmin={isAdmin}
            onChanged={portal.refreshAnnouncements}
          />
        )}

        {tab === 'chat' && (
          <ChatTab
            user={user}
            isAdmin={isAdmin}
            isMember={isMember}
            isPending={isPending}
            channels={portal.channels}
            activeChannel={portal.activeChannel}
            onSelectChannel={portal.setActiveChannel}
            onChannelCreated={portal.addChannel}
            onChannelDeleted={portal.removeChannel}
            socket={socket}
            onOpenLightbox={setLightbox}
            onOpenProfile={setProfileModal}
          />
        )}

        {tab === 'profile' && <ProfileTab user={user} setUser={setUser} />}

        {tab === 'admin' && isAdmin && (
          <AdminTab
            users={portal.users}
            currentUser={user}
            onChanged={portal.refreshUsers}
          />
        )}
      </main>

      <PortalMobileTabs activeTab={tab} onTabChange={setTab} isAdmin={isAdmin} />
    </div>
  )
}
