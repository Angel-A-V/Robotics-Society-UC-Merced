// Portal.jsx — Members-only dashboard
// Tabs: Announcements | Chat | Profile/Settings | Admin Panel

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'

const API_BASE = 'http://127.0.0.1:8000'
const RECOMMENDED_EMOJIS = ['❤️', '😭', '😂', '👍', '🤔', '🔥', '👏', '🤖', '💀', '🫡']
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif']

function isImageFile(fileName = '') {
  return IMAGE_EXTS.includes(fileName.split('.').pop().toLowerCase())
}

function groupMessages(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const sameAuthor = prev?.username === msg.username
    const withinTime = prev && (new Date(msg.created_at) - new Date(prev.created_at)) < 5 * 60 * 1000
    return { ...msg, grouped: sameAuthor && withinTime }
  })
}

// ── Avatar helper — shows image if set, initials fallback otherwise ────────────
function Avatar({ avatarUrl, username, role, size = 38, onClick, className = '' }) {
  const fullUrl = avatarUrl
    ? (avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}`)
    : null
  const initial = username?.[0]?.toUpperCase() || '?'
  const style = { width: size, height: size, fontSize: size * 0.42, flexShrink: 0,
                  borderRadius: '50%', cursor: onClick ? 'pointer' : 'default' }

  if (fullUrl) {
    return (
      <img src={fullUrl} alt={username} className={`msg-avatar-img ${className}`}
        style={style} onClick={onClick}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling?.style.removeProperty('display') }}
        title={username}
      />
    )
  }
  return (
    <div className={`message-avatar avatar-${role} ${className}`} style={style} onClick={onClick} title={username}>
      {initial}
    </div>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}><i className="fi fi-rr-cross-small"></i></button>
        <img src={src} alt={alt} className="lightbox-img" />
        <a href={src} download={alt} className="lightbox-download" target="_blank" rel="noopener noreferrer">↓ Download</a>
      </div>
    </div>
  )
}

// ── Profile Modal — shown when clicking a username/avatar ─────────────────────
function ProfileModal({ username, currentUserToken, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/auth/profile/${username}`, {
      headers: { Authorization: `Bearer ${currentUserToken}` }
    })
      .then(r => r.json())
      .then(d => { setProfile(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [username])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}><i className="fi fi-rr-cross-small"></i></button>
        {loading ? (
          <div className="profile-modal-loading">Loading...</div>
        ) : !profile || profile.error ? (
          <div className="profile-modal-loading">User not found.</div>
        ) : (
          <>
            <div className="profile-modal-header">
              <Avatar avatarUrl={profile.avatar_url} username={profile.username} role={profile.role} size={72} />
              <div className="profile-modal-info">
                <h2 className="profile-modal-name">{profile.username}</h2>
                <span className={`role-badge role-${profile.role}`}>{profile.role}</span>
                <div className="profile-modal-joined">
                  Joined {new Date(profile.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            {profile.bio && (
              <div className="profile-modal-bio">
                <div className="profile-modal-bio-label">About</div>
                <p>{profile.bio}</p>
              </div>
            )}
            {!profile.bio && (
              <div className="profile-modal-bio" style={{ opacity: 0.4 }}>
                <p style={{ fontStyle: 'italic' }}>No bio yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── FileAttachment ─────────────────────────────────────────────────────────────
function FileAttachment({ fileUrl, fileName, fileType, onImageLoad, onLightbox }) {
  if (!fileUrl) return null
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE}${fileUrl}`
  const showAsImage = fileType === 'image' || isImageFile(fileName)
  if (showAsImage) {
    return (
      <div className="msg-image-wrap">
        <img src={fullUrl} alt={fileName || 'image'} className="msg-image" loading="lazy"
          onLoad={onImageLoad}
          onClick={() => onLightbox?.(fullUrl, fileName)}
          title="Click to view full size"
          onError={e => { e.target.style.display = 'none' }} />
      </div>
    )
  }
  const icon = fileType === 'pdf' ? <i className="fi fi-rr-file-pdf"></i> : <i className="fi fi-rr-clip"></i>
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" download={fileName} className="msg-file-card">
      <span className="msg-file-icon">{icon}</span>
      <span className="msg-file-name">{fileName}</span>
      <span className="msg-file-dl">↓</span>
    </a>
  )
}

// ── AttachmentPreview ──────────────────────────────────────────────────────────
function AttachmentPreview({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    if (isImageFile(file.name)) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [file])
  if (!file) return null
  return (
    <div className="attachment-preview">
      {previewUrl
        ? <img src={previewUrl} alt={file.name} className="attachment-thumb" />
        : <div className="attachment-file-icon">{file.name.endsWith('.pdf') ? <i className="fi fi-rr-file-pdf"></i> : <i className="fi fi-rr-clip"></i>}</div>
      }
      <span className="attachment-name">{file.name}</span>
      <span className="attachment-size">({(file.size / 1024).toFixed(0)} KB)</span>
      <button className="attachment-remove" onClick={onRemove} title="Remove"><i className="fi fi-rr-cross-small"></i></button>
    </div>
  )
}

// ── ReactionChips — existing reactions shown BELOW the message content ────────
function ReactionChips({ message, currentUser, onReact, isMember }) {
  const grouped = {}
  for (const r of (message.reactions || [])) {
    if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, users: [], mine: false }
    grouped[r.emoji].count++
    grouped[r.emoji].users.push(r.username)
    if (r.username === currentUser) grouped[r.emoji].mine = true
  }
  if (Object.keys(grouped).length === 0) return null
  return (
    <div className="reaction-bar">
      {Object.entries(grouped).map(([emoji, data]) => (
        <button key={emoji} className={`reaction-chip ${data.mine ? 'mine' : ''}`}
          onClick={() => isMember && onReact(message.id, emoji)}
          title={data.users.join(', ')} disabled={!isMember}>
          {emoji} <span className="reaction-count">{data.count}</span>
        </button>
      ))}
    </div>
  )
}

// ── ReactionAddButton — the + emoji picker button, sits in the action bar ─────
function ReactionAddButton({ message, onReact }) {
  const [showPicker, setShowPicker] = useState(false)
  const [customEmoji, setCustomEmoji] = useState('')
  const inputRef = useRef(null)

  function handleCustomSubmit(e) {
    e.preventDefault()
    const emoji = customEmoji.trim()
    if (!emoji) return
    onReact(message.id, emoji)
    setCustomEmoji(''); setShowPicker(false)
  }

  return (
    <div className="reaction-add-wrap">
      <button className="msg-action-btn"
        onClick={() => { setShowPicker(p => !p); setTimeout(() => inputRef.current?.focus(), 50) }}
        title="Add reaction">
        <i className="fi fi-rr-smile-plus"></i>
      </button>
      {showPicker && (
        <div className="emoji-picker emoji-picker-actions">
          <div className="emoji-recommended">
            {RECOMMENDED_EMOJIS.map(e => (
              <button key={e} className="emoji-option"
                onClick={() => { onReact(message.id, e); setShowPicker(false); setCustomEmoji('') }}>{e}</button>
            ))}
          </div>
          <form className="emoji-custom-form" onSubmit={handleCustomSubmit}>
            <input ref={inputRef} className="emoji-custom-input" value={customEmoji}
              onChange={e => setCustomEmoji(e.target.value)} placeholder="Type any emoji…" maxLength={8} />
            <button type="submit" className="emoji-custom-submit">React</button>
          </form>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Portal
// ══════════════════════════════════════════════════════════════════════════════
export default function Portal({ user, setUser, handleLogout }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('announcements')

  // Announcements
  const [announcements, setAnnouncements]       = useState([])
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', is_pinned: false })
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)

  // Chat
  const [channels, setChannels]           = useState([])
  const [activeChannel, setActiveChannel] = useState(null)
  const [msgInput, setMsgInput]           = useState('')
  const [pendingFile, setPendingFile]     = useState(null)
  const [isUploading, setIsUploading]     = useState(false)
  const [uploadError, setUploadError]     = useState('')
  const [isDragging, setIsDragging]       = useState(false)
  const [lightbox, setLightbox]           = useState(null)
  const [profileModal, setProfileModal]   = useState(null)  // username string or null

  // Profile/Settings
  const [bio, setBio]                     = useState(user?.bio || '')
  const [avatarPreview, setAvatarPreview] = useState(null)  // local preview URL
  const [avatarFile, setAvatarFile]       = useState(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg]       = useState('')
  const avatarInputRef                    = useRef(null)

  // Admin
  const [users, setUsers] = useState([])

  // Channel management (admin)
  const [showNewChannel, setShowNewChannel] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [newChannelDesc, setNewChannelDesc] = useState('')
  const [channelError, setChannelError]     = useState('')
  const [channelSaving, setChannelSaving]   = useState(false)

  // Refs
  const messagesListRef = useRef(null)
  const chatEndRef      = useRef(null)
  const fileInputRef    = useRef(null)
  const typingTimer     = useRef(null)
  const textareaRef     = useRef(null)
  const isNearBottomRef = useRef(true)

  // Auto-resize textarea
  const autoResize = (el) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden'
  }

  const token = localStorage.getItem('access_token')
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const { messages, setMessages, sendMessage, sendTyping, connected, hasChannel, typingUsers }
    = useSocket(activeChannel?.id, token)

  useEffect(() => { if (!user) navigate('/login') }, [user])

  useEffect(() => {
    if (!user) return
    fetchAnnouncements()
    fetchChannels()
    if (user.role === 'admin') fetchUsers()
    setBio(user.bio || '')
  }, [user])

  useEffect(() => {
    if (activeChannel) fetchMessageHistory(activeChannel.id)
  }, [activeChannel])

  useEffect(() => {
    const container = messagesListRef.current
    if (!container) return
    const h = () => {
      isNearBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 150
    }
    container.addEventListener('scroll', h, { passive: true })
    return () => container.removeEventListener('scroll', h)
  }, [])

  useLayoutEffect(() => {
    if (!isNearBottomRef.current) return
    const c = messagesListRef.current
    if (c) c.scrollTop = c.scrollHeight
  }, [messages])

  useEffect(() => {
    if (!activeChannel) return
    isNearBottomRef.current = true
    const scrollNow = () => { const c = messagesListRef.current; if (c) c.scrollTop = c.scrollHeight }
    scrollNow()
    setTimeout(scrollNow, 100)
    setTimeout(scrollNow, 400)
  }, [activeChannel?.id])

  const scrollIfNearBottom = useCallback(() => {
    if (!isNearBottomRef.current) return
    const c = messagesListRef.current
    if (c) c.scrollTop = c.scrollHeight
  }, [])

  // ── Fetchers ──────────────────────────────────────────────────────────────
  async function fetchAnnouncements() {
    const res = await fetch('/api/announcements/', { headers: authHeaders })
    if (res.ok) setAnnouncements(await res.json())
  }
  async function fetchChannels() {
    const res = await fetch('/api/chat/channels/', { headers: authHeaders })
    if (res.ok) {
      const data = await res.json()
      setChannels(data)
      if (data.length > 0) setActiveChannel(data[0])
    }
  }
  async function fetchMessageHistory(channelId) {
    try {
      const res = await fetch(`/api/chat/channels/${channelId}/messages/`, { headers: authHeaders })
      if (!res.ok) return
      const history = await res.json()
      setMessages(history.map(msg => ({
        id: msg.id, content: msg.content, username: msg.username,
        role: msg.role, avatar_url: msg.avatar_url, created_at: msg.created_at,
        file_url: msg.file_url, file_name: msg.file_name, file_type: msg.file_type,
        reactions: msg.reactions || [],
      })))
    } catch (err) { console.error('[History] Failed:', err) }
  }
  async function fetchUsers() {
    const res = await fetch('/api/auth/users', { headers: authHeaders })
    if (res.ok) setUsers(await res.json())
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  async function handleSendMessage(e) {
    e.preventDefault()
    const hasText = msgInput.trim()
    const hasFile = Boolean(pendingFile)
    if (!hasText && !hasFile) return
    if (!activeChannel || !connected) return
    if (hasText) { sendMessage(msgInput.trim()); setMsgInput('') }
    if (hasFile) { await uploadFile(pendingFile); setPendingFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }
    sendTyping('stop')
    if (typingTimer.current) { clearTimeout(typingTimer.current); typingTimer.current = null }
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.overflowY = 'hidden' }
  }

  // ── Typing ────────────────────────────────────────────────────────────────
  function handleInputChange(e) {
    const val = e.target.value
    setMsgInput(val)
    autoResize(e.target)
    if (!val) { sendTyping('stop'); if (typingTimer.current) { clearTimeout(typingTimer.current); typingTimer.current = null }; return }
    if (!typingTimer.current) { sendTyping('start'); typingTimer.current = setTimeout(() => { typingTimer.current = null }, 2000) }
  }

  // ── File upload ───────────────────────────────────────────────────────────
  function handleFileSelect(file) {
    if (!file) return
    setUploadError('')
    if (file.size > 8 * 1024 * 1024) { setUploadError('File too large. Max 8MB.'); return }
    setPendingFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  async function uploadFile(file) {
    if (!file || !activeChannel) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`/api/chat/channels/${activeChannel.id}/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      })
      if (!res.ok) { const err = await res.json(); setUploadError(err.error || 'Upload failed') }
    } catch { setUploadError('Upload failed.') } finally { setIsUploading(false) }
  }

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragging(false), [])
  const handleDrop      = useCallback((e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }, [activeChannel])

  // ── Reactions ─────────────────────────────────────────────────────────────
  async function handleReact(messageId, emoji) {
    const res = await fetch(`/api/chat/messages/${messageId}/react`, {
      method: 'POST', headers: authHeaders, body: JSON.stringify({ emoji }),
    })
    if (res.ok) { const { reactions } = await res.json(); setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions } : m)) }
  }

  // ── Profile save ──────────────────────────────────────────────────────────
  async function handleProfileSave(e) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg('')
    try {
      // 1. Upload avatar if a new one was selected
      if (avatarFile) {
        const fd = new FormData()
        fd.append('avatar', avatarFile)
        const res = await fetch('/api/auth/profile/avatar', {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
        })
        if (!res.ok) { setProfileMsg('Avatar upload failed.'); setProfileSaving(false); return }
      }
      // 2. Save bio
      const res = await fetch('/api/auth/profile', {
        method: 'PUT', headers: authHeaders, body: JSON.stringify({ bio }),
      })
      if (res.ok) {
        // Fetch the fully updated user object from the server and push it
        // into App.jsx's top-level state via setUser.
        // This is the single source of truth — every component that reads
        // user.avatar_url or user.bio immediately gets the new values,
        // eliminating the flicker caused by stale props vs local preview state.
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (meRes.ok) {
          const meData = await meRes.json()
          setUser(meData.user)    // Updates App.jsx state → re-renders sidebar + all consumers
        }
        setProfileMsg('Profile saved! ✓')
        setAvatarFile(null)
        setAvatarPreview(null)   // Clear local preview — now using the server value via user prop
      } else {
        setProfileMsg('Save failed. Please try again.')
      }
    } catch { setProfileMsg('Save failed.') } finally { setProfileSaving(false) }
  }

  function handleAvatarSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) { setProfileMsg('Avatar too large. Max 4MB.'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  // ── Announcements ─────────────────────────────────────────────────────────
  async function createAnnouncement(e) {
    e.preventDefault()
    await fetch('/api/announcements/create', { method: 'POST', headers: authHeaders, body: JSON.stringify(announcementForm) })
    setAnnouncementForm({ title: '', content: '', is_pinned: false })
    setShowAnnouncementForm(false)
    fetchAnnouncements()
  }
  async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return
    await fetch(`/api/announcements/${id}/`, { method: 'DELETE', headers: authHeaders })
    fetchAnnouncements()
  }
  async function deleteMessage(id, authorUsername) {
    if (user.username !== authorUsername && !isAdmin) return
    if (!confirm('Delete this message?')) return
    await fetch(`/api/chat/messages/${id}/delete`, { method: 'DELETE', headers: authHeaders })
    setMessages(prev => prev.filter(m => m.id !== id))
  }
  // ── Channel management ──────────────────────────────────────────────────────
  async function createChannel(e) {
    e.preventDefault()
    if (!newChannelName.trim()) return
    setChannelSaving(true)
    setChannelError('')
    try {
      const res = await fetch('/api/chat/channels/create', {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify({ name: newChannelName.trim(), description: newChannelDesc.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setChannels(prev => [...prev, data])
        setActiveChannel(data)
        setNewChannelName('')
        setNewChannelDesc('')
        setShowNewChannel(false)
      } else {
        setChannelError(data.error || 'Failed to create channel')
      }
    } catch { setChannelError('Failed to create channel') }
    finally { setChannelSaving(false) }
  }

  async function deleteChannel(channel) {
    if (!confirm(`Delete #${channel.name} and ALL its messages? This cannot be undone.`)) return
    const res = await fetch(`/api/chat/channels/${channel.id}/delete`, {
      method: 'DELETE', headers: authHeaders,
    })
    if (res.ok) {
      setChannels(prev => prev.filter(c => c.id !== channel.id))
      // If deleted channel was active, switch to first remaining channel
      if (activeChannel?.id === channel.id) {
        const remaining = channels.filter(c => c.id !== channel.id)
        setActiveChannel(remaining[0] || null)
      }
    }
  }

  async function approveUser(id) { await fetch(`/api/auth/users/${id}/approve`, { method: 'POST', headers: authHeaders }); fetchUsers() }
  async function changeRole(id, role) { await fetch(`/api/auth/users/${id}/role`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ role }) }); fetchUsers() }

  if (!user) return null
  const isPending = user.role === 'pending'
  const isAdmin   = user.role === 'admin'
  const isMember  = user.role === 'member' || isAdmin
  const groupedMessages = groupMessages(messages)
  const canSend = connected && activeChannel && (msgInput.trim() || pendingFile) && !isUploading

  const currentAvatarUrl = avatarPreview || (user.avatar_url
    ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_BASE}${user.avatar_url}`)
    : null)

  return (
    <div className="portal-layout">
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      {profileModal && (
        <ProfileModal username={profileModal} currentUserToken={token} onClose={() => setProfileModal(null)} />
      )}

      {/* ══ Sidebar ══════════════════════════════════════════════════════ */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">⚙ UCM Robotics</Link>
          <div className="sidebar-user" onClick={() => setTab('profile')} style={{ cursor: 'pointer' }} title="Edit profile">
            <Avatar avatarUrl={user.avatar_url} username={user.username} role={user.role} size={34} />
            <div>
              <div className="sidebar-username">{user.username}</div>
              <div className={`role-badge role-${user.role}`}>{user.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Portal</div>
          {[
            { id: 'announcements', icon: <i className="fi fi-rr-megaphone"></i>, label: 'Announcements' },
            { id: 'chat',          icon: <i className="fi fi-sr-comment nav-icon"></i>, label: 'Chat' },
            { id: 'profile',       icon: <i className="fi fi-ss-user nav-icon"></i>, label: 'Profile & Settings' },
            ...(isAdmin ? [{ id: 'admin', icon: <i className="fi fi-rr-settings"></i>, label: 'Admin Panel' }] : []),
          ].map(item => (
            <button key={item.id}
              className={`sidebar-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}>
              {item.icon}<span className="nav-item-label">{item.label}</span>
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 24 }}>Navigate</div>
          <Link to="/" className="sidebar-nav-item"><span className="nav-icon"><i className="fi fi-sr-house-blank"></i></span>Back to Site</Link>
          <Link to="/#projects" className="sidebar-nav-item"><span className="nav-icon"><i className="fi fi-sr-user-robot"></i></span>Projects</Link>
          <Link to="/#team" className="sidebar-nav-item"><span className="nav-icon"><i className="fi fi-rr-employees"></i></span>Team</Link>
          <Link to="/contact" className="sidebar-nav-item"><span className="nav-icon"><i className="fi fi-sr-envelope"></i></span>Contact</Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* ══ Main Content ════════════════════════════════════════════════ */}
      <main className="portal-main">
        {isPending && (
          <div className="pending-banner">
            Your account is <strong>pending approval</strong>. You can read everything but cannot send messages until an admin approves you.
          </div>
        )}

        {/* ── Announcements ──────────────────────────────────────────── */}
        {tab === 'announcements' && (
          <div className="tab-content">
            <div className="tab-header">
              <div><h2>Announcements</h2><p>Club news and updates from admins</p></div>
              {isAdmin && (
                <button className="btn btn-primary" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                  + New
                </button>
              )}
            </div>
            {showAnnouncementForm && isAdmin && (
              <form className="announcement-form" onSubmit={createAnnouncement}>
                <input type="text" placeholder="Title..." value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required />
                <textarea placeholder="Content..." value={announcementForm.content} rows={4}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required />
                <label className="checkbox-label">
                  <input type="checkbox" checked={announcementForm.is_pinned}
                    onChange={e => setAnnouncementForm({ ...announcementForm, is_pinned: e.target.checked })} />
                  <i className="fi fi-rr-thumbtack"></i> Pin this
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary">Post</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAnnouncementForm(false)}>Cancel</button>
                </div>
              </form>
            )}
            {announcements.length === 0
              ? <div className="empty-state">No announcements yet.</div>
              : announcements.map(a => (
                <div className={`announcement-card ${a.is_pinned ? 'pinned' : ''}`} key={a.id}>
                  {a.is_pinned && <div className="pin-badge"><i className="fi fi-rr-thumbtack"></i> Pinned</div>}
                  <div className="announcement-header">
                    <h3>{a.title}</h3>
                    {isAdmin && <button className="delete-btn" onClick={() => deleteAnnouncement(a.id)}><i className="fi fi-rr-trash-xmark"></i></button>}
                  </div>
                  <p>{a.content}</p>
                  <div className="announcement-meta">
                    By <strong>{a.author_name || 'Admin'}</strong> · {new Date(a.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Chat ───────────────────────────────────────────────────── */}
        {tab === 'chat' && (
          <div className="chat-layout">
            <div className="channel-list">
              <div className="channel-list-header-row">
                <span className="channel-list-header">Channels</span>
                {/* Admin: add channel button */}
                {isAdmin && (
                  <button className="channel-add-btn"
                    onClick={() => { setShowNewChannel(p => !p); setChannelError('') }}
                    title="Create new channel"><i className="fi fi-rr-plus-small"></i></button>
                )}
              </div>

              {/* New channel form — shown when admin clicks + */}
              {isAdmin && showNewChannel && (
                <form className="new-channel-form" onSubmit={createChannel}>
                  <input
                    className="new-channel-input"
                    placeholder="channel-name"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    autoFocus
                    maxLength={32}
                  />
                  <input
                    className="new-channel-input"
                    placeholder="Description (optional)"
                    value={newChannelDesc}
                    onChange={e => setNewChannelDesc(e.target.value)}
                    maxLength={120}
                  />
                  {channelError && <div className="new-channel-error">{channelError}</div>}
                  <div className="new-channel-actions">
                    <button type="submit" className="btn btn-primary" style={{ fontSize: 12, padding: '5px 12px' }}
                      disabled={channelSaving || !newChannelName.trim()}>
                      {channelSaving ? '...' : 'Create'}
                    </button>
                    <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }}
                      onClick={() => { setShowNewChannel(false); setChannelError('') }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {channels.map(ch => (
                <div key={ch.id} className={`channel-item-wrap ${activeChannel?.id === ch.id ? 'active' : ''}`}>
                  <button
                    className={`channel-item ${activeChannel?.id === ch.id ? 'active' : ''}`}
                    onClick={() => setActiveChannel(ch)}>
                    <span className="channel-hash">#</span> {ch.name}
                  </button>
                  {/* Admin: delete button — only visible on hover */}
                  {isAdmin && (
                    <button className="channel-delete-btn"
                      onClick={() => deleteChannel(ch)}
                      title={`Delete #${ch.name}`}><i className="fi fi-ss-trash"></i></button>
                  )}
                </div>
              ))}
              {channels.length === 0 && !showNewChannel && (
                <div className="channel-empty">
                  {isAdmin ? 'No channels yet. Click + to create one.' : 'No channels yet.'}
                </div>
              )}
            </div>

            <div className={`chat-area ${isDragging ? 'drag-over' : ''}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

              <div className="chat-header">
                <div className="chat-header-left">
                  <strong className="chat-channel-name">#{activeChannel?.name || 'Select a channel'}</strong>
                  {activeChannel?.description && <span className="chat-desc">{activeChannel.description}</span>}
                </div>
                <div className="chat-header-right">
                  {hasChannel && (
                    <span className={`ws-status ${connected ? 'ws-connected' : 'ws-connecting'}`}>
                      <span className="ws-dot" />{connected ? 'Live' : 'Connecting...'}
                    </span>
                  )}
                  {isPending && <span className="read-only-badge"><i className="fi fi-rs-eye"></i> Read Only</span>}
                </div>
              </div>

              {isDragging && <div className="drag-overlay"><div className="drag-overlay-inner">Drop file to attach</div></div>}

              <div className="messages-list" ref={messagesListRef}>
                {groupedMessages.length === 0 && (
                  <div className="empty-state">
                    {!hasChannel ? 'Select a channel to start chatting.'
                      : connected ? (isMember ? 'No messages yet — say hello! 👋' : 'No messages yet.')
                      : 'Connecting to chat...'}
                  </div>
                )}

                {groupedMessages.map((msg, i) => (
                  <div key={msg.id ?? `msg-${i}`}
                    className={`message ${msg.grouped ? 'message-grouped' : ''} msg-enter`}>

                    {/* Clickable avatar — opens profile modal */}
                    {!msg.grouped
                      ? <Avatar avatarUrl={msg.avatar_url} username={msg.username} role={msg.role}
                          size={38} onClick={() => setProfileModal(msg.username)} />
                      : <div className="message-avatar-gap" />
                    }

                    <div className="message-body">
                      {!msg.grouped && (
                        <div className="message-meta">
                          {/* Clickable username — opens profile modal */}
                          <strong
                            className={`message-username role-color-${msg.role} clickable-username`}
                            onClick={() => setProfileModal(msg.username)}
                            title={`View ${msg.username}'s profile`}
                          >{msg.username}</strong>
                          {msg.role === 'admin' && <span className="msg-role-badge">admin</span>}
                          <span className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      {msg.content && <div className="message-content">{msg.content}</div>}
                      <FileAttachment fileUrl={msg.file_url} fileName={msg.file_name} fileType={msg.file_type}
                        onImageLoad={scrollIfNearBottom} onLightbox={(src, alt) => setLightbox({ src, alt })} />
                      <ReactionChips message={msg} currentUser={user.username} onReact={handleReact} isMember={isMember} />
                    </div>

                    {msg.id && (
                      <div className="message-actions">
                        {isMember && <ReactionAddButton message={msg} onReact={handleReact} />}
                        {(isAdmin || user.username === msg.username) && (
                          <button className="msg-action-btn danger"
                            onClick={() => deleteMessage(msg.id, msg.username)}
                            title="Delete message">
                            <i className="fi fi-ss-trash"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {typingUsers.length > 0 && (
                <div className="typing-indicator">
                  <span className="typing-dots"><span /><span /><span /></span>
                  <span className="typing-text">
                    {typingUsers.length === 1
                      ? <><strong>{typingUsers[0]}</strong> is typing...</>
                      : 'Several people are typing...'}
                  </span>
                </div>
              )}

              {uploadError && <div className="upload-error">⚠️ {uploadError}</div>}

              {isMember ? (
                <div className="chat-input-area">
                  {pendingFile && <AttachmentPreview file={pendingFile} onRemove={() => { setPendingFile(null); setUploadError('') }} />}
                  <form className="chat-input-bar" onSubmit={handleSendMessage}>
                    <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={e => { handleFileSelect(e.target.files[0]); e.target.value = '' }} />

                    <button type="button" className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!connected || isUploading} title="Attach file">
                      {isUploading ? <i className="fi fi-sr-hourglass-end"></i> : <i className="fi fi-sr-file"></i>}
                    </button>

                    {/* Auto-expanding textarea — Enter sends, Shift+Enter = new line */}
                    <textarea
                      ref={textareaRef}
                      className="chat-text-input"
                      rows={1}
                      placeholder={
                        !hasChannel ? 'No channel selected'
                        : pendingFile ? 'Add a message (optional)...'
                        : connected ? `Message #${activeChannel?.name}...`
                        : 'Reconnecting...'
                      }
                      value={msgInput}
                      onChange={handleInputChange}
                      disabled={!activeChannel || !connected}
                      autoComplete="off"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e) }
                      }}
                    />

                    <button type="submit" className="btn btn-primary chat-send-btn" disabled={!canSend}>
                      {isUploading ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="read-only-bar">Your account needs admin approval before you can send messages.</div>
              )}
            </div>
          </div>
        )}

        {/* ── Profile & Settings ─────────────────────────────────────── */}
        {tab === 'profile' && (
          <div className="tab-content">
            <div className="tab-header">
              <div><h2>Profile & Settings</h2><p>Customize how others see you</p></div>
            </div>

            <form className="profile-settings-form" onSubmit={handleProfileSave}>
              {/* Avatar section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrap" onClick={() => avatarInputRef.current?.click()} title="Click to change avatar">
                  {currentAvatarUrl ? (
                    <img src={currentAvatarUrl} alt="avatar" className="profile-avatar-img" />
                  ) : (
                    <div className={`profile-avatar-placeholder avatar-${user.role}`}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="profile-avatar-overlay"><i className="fi fi-sr-camera"></i> Change</div>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleAvatarSelect} />
                <div className="profile-avatar-info">
                  <strong>{user.username}</strong>
                  <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  <p className="profile-avatar-hint">Click avatar to upload a new photo (max 4MB, JPG/PNG/GIF/WebP)</p>
                </div>
              </div>

              {/* Bio */}
              <div className="profile-field">
                <label className="profile-label">About Me <span className="profile-label-hint">({bio.length}/300)</span></label>
                <textarea
                  className="profile-bio-input"
                  placeholder="Tell the team a bit about yourself — your interests, projects, skills..."
                  value={bio}
                  onChange={e => setBio(e.target.value.slice(0, 300))}
                  rows={4}
                />
              </div>

              {/* Account info — read only */}
              <div className="profile-field">
                <label className="profile-label">Account Info</label>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">Username:</span>
                    <span className="profile-info-value">{user.username}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Email:</span>
                    <span className="profile-info-value">{user.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Role:</span>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Joined:</span>
                    <span className="profile-info-value">
                      {new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {profileMsg && (
                  <span style={{ fontSize: 14, color: profileMsg.includes('✓') ? 'var(--green)' : 'var(--danger)' }}>
                    {profileMsg}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Admin ───────────────────────────────────────────────────── */}
        {tab === 'admin' && isAdmin && (
          <div className="tab-content">
            <div className="tab-header">
              <div><h2>Admin Panel</h2><p>Manage users, roles, and content</p></div>
              <a href="http://127.0.0.1:8000/admin" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Django Admin</a>
            </div>
            <div className="admin-stats">
              {[
                { label: 'Total Users', val: users.length, color: 'var(--sapphire)' },
                { label: 'Pending', val: users.filter(u => u.role === 'pending').length, color: 'var(--warning)' },
                { label: 'Members', val: users.filter(u => u.role === 'member').length, color: 'var(--green)' },
                { label: 'Admins', val: users.filter(u => u.role === 'admin').length, color: 'var(--sapphire)' },
              ].map(s => (
                <div className="admin-stat-card" key={s.label}>
                  <div className="admin-stat-num" style={{ color: s.color }}>{s.val}</div>
                  <div className="admin-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ marginBottom: 16 }}>All Users</h3>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className={u.id === user.id ? 'self-row' : ''}>
                      <td><strong>{u.username}</strong>{u.id === user.id && <span className="you-badge">you</span>}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                      <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td>
                        {u.id !== user.id && (
                          <div className="action-btns">
                            {u.role === 'pending' && <button className="btn-sm btn-approve" onClick={() => approveUser(u.id)}>✓ Approve</button>}
                            {u.role !== 'admin' && <button className="btn-sm btn-promote" onClick={() => changeRole(u.id, 'admin')}>↑ Admin</button>}
                            {u.role === 'admin' && <button className="btn-sm btn-demote" onClick={() => changeRole(u.id, 'member')}>↓ Member</button>}
                            {u.role !== 'pending' && <button className="btn-sm btn-demote" onClick={() => changeRole(u.id, 'pending')}><i className="fi fi-rr-cross-small"></i> Revoke</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ══ Mobile Bottom Tab Bar ═══════════════════════════════════════ */}
      <nav className="mobile-tab-bar" style={{ display: 'none' }}>
        <button className={`mobile-tab-btn ${tab === 'announcements' ? 'active' : ''}`} onClick={() => setTab('announcements')}>
          <span className="tab-icon"><i className="fi fi-rr-megaphone"></i></span><span>News</span>
        </button>
        <button className={`mobile-tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          <span className="tab-icon"><i className="fi fi-sr-comment"></i></span><span>Chat</span>
        </button>
        <button className={`mobile-tab-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          <span className="tab-icon"><i className="fi fi-ss-user"></i></span><span>Profile</span>
        </button>
        {isAdmin && (
          <button className={`mobile-tab-btn ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
            <span className="tab-icon"><i className="fi fi-rr-settings"></i></span><span>Admin</span>
          </button>
        )}
        {/* Back to main site — always visible on mobile */}
        <Link to="/" className="mobile-tab-btn">
          <span className="tab-icon"><i className="fi fi-sr-house-blank"></i></span><span>Site</span>
        </Link>
      </nav>
    </div>
  )
}