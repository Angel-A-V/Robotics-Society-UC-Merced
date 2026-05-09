// Portal.jsx — Members-only dashboard
// Tabs: Announcements | Chat (real-time WebSocket) | Admin Panel

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'

// API_BASE — Django server URL for media files.
// Vite proxies /api and /ws but NOT /media — those go directly to Django port 8000.
// Change to your production domain when deploying.
const API_BASE = 'http://127.0.0.1:8000'

// ── Emoji recommendations (heart first) ──────────────────────────────────────
const RECOMMENDED_EMOJIS = ['❤️', '😭', '😂', '👍', '🤔', '🔥', '👏', '🤖', '💀', '🫡']

// ── Image extensions treated as inline previews ───────────────────────────────
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif']

function isImageFile(fileName = '') {
  return IMAGE_EXTS.includes(fileName.split('.').pop().toLowerCase())
}

// ── Helper: group consecutive messages from same author ───────────────────────
function groupMessages(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const sameAuthor = prev?.username === msg.username
    const withinTime = prev && (new Date(msg.created_at) - new Date(prev.created_at)) < 5 * 60 * 1000
    return { ...msg, grouped: sameAuthor && withinTime }
  })
}

// ── Lightbox — full-screen image viewer overlay ───────────────────────────────
// Shown when user clicks an image in chat. Closes on click/Escape.
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <img src={src} alt={alt} className="lightbox-img" />
        <a href={src} download={alt} className="lightbox-download" target="_blank" rel="noopener noreferrer">
          ↓ Download
        </a>
      </div>
    </div>
  )
}

// ── FileAttachment — renders inline image or file download card ───────────────
function FileAttachment({ fileUrl, fileName, fileType, onImageLoad, onLightbox }) {
  if (!fileUrl) return null

  // Build absolute URL — /media/... paths need the Django server prefix
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE}${fileUrl}`
  const showAsImage = fileType === 'image' || isImageFile(fileName)

  if (showAsImage) {
    return (
      <div className="msg-image-wrap">
        <img
          src={fullUrl}
          alt={fileName || 'image'}
          className="msg-image"
          loading="lazy"
          // onLoad fires after the image downloads — triggers re-scroll so image doesn't push content off-screen
          onLoad={onImageLoad}
          // Click opens lightbox inside the page, NOT a new tab
          onClick={() => onLightbox?.(fullUrl, fileName)}
          title="Click to view full size"
          onError={e => {
            e.target.style.display = 'none'
          }}
        />
      </div>
    )
  }

  const icon = fileType === 'pdf' ? '📄' : '📎'
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" download={fileName} className="msg-file-card">
      <span className="msg-file-icon">{icon}</span>
      <span className="msg-file-name">{fileName}</span>
      <span className="msg-file-dl">↓</span>
    </a>
  )
}

// ── AttachmentPreview — shows selected file before sending ───────────────────
// Shown in the input bar after the user picks a file.
// User can add a text message alongside it or just hit Send.
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
      {previewUrl ? (
        <img src={previewUrl} alt={file.name} className="attachment-thumb" />
      ) : (
        <div className="attachment-file-icon">
          {file.name.endsWith('.pdf') ? '📄' : '📎'}
        </div>
      )}
      <span className="attachment-name">{file.name}</span>
      <span className="attachment-size">({(file.size / 1024).toFixed(0)} KB)</span>
      <button className="attachment-remove" onClick={onRemove} title="Remove attachment">✕</button>
    </div>
  )
}

// ── ReactionBar ───────────────────────────────────────────────────────────────
function ReactionBar({ message, currentUser, onReact, isMember }) {
  const [showPicker, setShowPicker] = useState(false)
  const [customEmoji, setCustomEmoji] = useState('')
  const inputRef = useRef(null)

  const grouped = {}
  for (const r of (message.reactions || [])) {
    if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, users: [], mine: false }
    grouped[r.emoji].count++
    grouped[r.emoji].users.push(r.username)
    if (r.username === currentUser) grouped[r.emoji].mine = true
  }

  function handleCustomSubmit(e) {
    e.preventDefault()
    const emoji = customEmoji.trim()
    if (!emoji) return
    onReact(message.id, emoji)
    setCustomEmoji('')
    setShowPicker(false)
  }

  return (
    <div className="reaction-bar">
      {Object.entries(grouped).map(([emoji, data]) => (
        <button
          key={emoji}
          className={`reaction-chip ${data.mine ? 'mine' : ''}`}
          onClick={() => isMember && onReact(message.id, emoji)}
          title={data.users.join(', ')}
          disabled={!isMember}
        >
          {emoji} <span className="reaction-count">{data.count}</span>
        </button>
      ))}

      {isMember && (
        <div className="reaction-add-wrap">
          <button
            className="reaction-add"
            onClick={() => { setShowPicker(p => !p); setTimeout(() => inputRef.current?.focus(), 50) }}
            title="Add reaction"
          >+</button>

          {showPicker && (
            <div className="emoji-picker">
              <div className="emoji-recommended">
                {RECOMMENDED_EMOJIS.map(e => (
                  <button key={e} className="emoji-option"
                    onClick={() => { onReact(message.id, e); setShowPicker(false); setCustomEmoji('') }}>
                    {e}
                  </button>
                ))}
              </div>
              <form className="emoji-custom-form" onSubmit={handleCustomSubmit}>
                <input ref={inputRef} className="emoji-custom-input" value={customEmoji}
                  onChange={e => setCustomEmoji(e.target.value)}
                  placeholder="Type any emoji…" maxLength={8} />
                <button type="submit" className="emoji-custom-submit">React</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Portal
// ══════════════════════════════════════════════════════════════════════════════
export default function Portal({ user, handleLogout }) {
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
  const [pendingFile, setPendingFile]     = useState(null)   // File selected but not yet sent
  const [isUploading, setIsUploading]     = useState(false)
  const [uploadError, setUploadError]     = useState('')
  const [isDragging, setIsDragging]       = useState(false)
  const [lightbox, setLightbox]           = useState(null)   // { src, alt } or null

  // Admin
  const [users, setUsers] = useState([])

  // Refs
  const messagesListRef = useRef(null)   // Scrollable message container
  const chatEndRef      = useRef(null)   // Bottom sentinel
  const fileInputRef    = useRef(null)
  const typingTimer     = useRef(null)
  // Track whether user is near bottom so we don't force-scroll while reading history
  const isNearBottomRef = useRef(true)

  // Auth
  const token = localStorage.getItem('access_token')
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // WebSocket
  const { messages, setMessages, sendMessage, sendTyping, connected, hasChannel, typingUsers }
    = useSocket(activeChannel?.id, token)

  // Redirect if not logged in
  useEffect(() => { if (!user) navigate('/login') }, [user])

  // Load initial data on mount
  useEffect(() => {
    if (!user) return
    fetchAnnouncements()
    fetchChannels()
    if (user.role === 'admin') fetchUsers()
  }, [user])

  // Load history when channel switches
  useEffect(() => {
    if (activeChannel) fetchMessageHistory(activeChannel.id)
  }, [activeChannel])

  // ── Track scroll position to know if user is near the bottom ─────────────
  useEffect(() => {
    const container = messagesListRef.current
    if (!container) return

    const handleScroll = () => {
      const dist = container.scrollHeight - container.scrollTop - container.clientHeight
      isNearBottomRef.current = dist < 150
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Auto-scroll on new messages ──────────────────────────────────────────
  // useLayoutEffect fires after DOM mutations but before paint — more reliable
  // than useEffect for scroll positioning because the DOM is fully updated.
  useLayoutEffect(() => {
    if (!isNearBottomRef.current) return   // User scrolled up — don't interrupt
    const container = messagesListRef.current
    if (!container) return
    // Direct scrollTop manipulation — more reliable than scrollIntoView
    container.scrollTop = container.scrollHeight
  }, [messages])

  // ── Jump to bottom instantly when switching channels ─────────────────────
  useEffect(() => {
    if (!activeChannel) return
    isNearBottomRef.current = true   // Reset: new channel always starts at bottom
    // Two-stage scroll: immediate + delayed (for images that load after first paint)
    const scrollNow = () => {
      const c = messagesListRef.current
      if (c) c.scrollTop = c.scrollHeight
    }
    scrollNow()
    setTimeout(scrollNow, 100)   // Images may load after first render
    setTimeout(scrollNow, 400)   // Second pass for slow images
  }, [activeChannel?.id])

  // ── Scroll helper called by images onLoad ────────────────────────────────
  // When an image loads it changes the container height. Re-scroll only if
  // the user was already at the bottom before the image loaded.
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
        role: msg.role, created_at: msg.created_at,
        file_url: msg.file_url, file_name: msg.file_name, file_type: msg.file_type,
        reactions: msg.reactions || [],
      })))
    } catch (err) {
      console.error('[History] Failed:', err)
    }
  }

  async function fetchUsers() {
    const res = await fetch('/api/auth/users', { headers: authHeaders })
    if (res.ok) setUsers(await res.json())
  }

  // ── Send — handles text + optional file attachment together ──────────────
  async function handleSendMessage(e) {
    e.preventDefault()
    const hasText = msgInput.trim()
    const hasFile = Boolean(pendingFile)
    if (!hasText && !hasFile) return
    if (!activeChannel || !connected) return

    // Send text message via WebSocket if there's text
    if (hasText) {
      sendMessage(msgInput.trim())
      setMsgInput('')
    }

    // Upload file if one is attached
    if (hasFile) {
      await uploadFile(pendingFile)
      setPendingFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    sendTyping('stop')
    if (typingTimer.current) { clearTimeout(typingTimer.current); typingTimer.current = null }
  }

  // ── Typing indicator ──────────────────────────────────────────────────────
  function handleInputChange(e) {
    const val = e.target.value
    setMsgInput(val)
    if (!val) {
      sendTyping('stop')
      if (typingTimer.current) { clearTimeout(typingTimer.current); typingTimer.current = null }
      return
    }
    if (!typingTimer.current) {
      sendTyping('start')
      typingTimer.current = setTimeout(() => { typingTimer.current = null }, 2000)
    }
  }

  // ── File selection — store as pending, don't upload yet ─────────────────
  function handleFileSelect(file) {
    if (!file) return
    setUploadError('')
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('File too large. Max 8MB.')
      return
    }
    setPendingFile(file)       // Store — will be uploaded when Send is clicked
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Actual upload — called from handleSendMessage ────────────────────────
  async function uploadFile(file) {
    if (!file || !activeChannel) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`/api/chat/channels/${activeChannel.id}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        setUploadError(err.error || 'Upload failed')
      }
    } catch {
      setUploadError('Upload failed. Check your connection.')
    } finally {
      setIsUploading(false)
    }
  }

  // ── Drag and drop ────────────────────────────────────────────────────────
  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragging(false), [])
  const handleDrop      = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [activeChannel])

  // ── Reactions ─────────────────────────────────────────────────────────────
  async function handleReact(messageId, emoji) {
    const res = await fetch(`/api/chat/messages/${messageId}/react`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ emoji }),
    })
    if (res.ok) {
      const { reactions } = await res.json()
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions } : m))
    }
  }

  // ── Announcement actions ──────────────────────────────────────────────────
  async function createAnnouncement(e) {
    e.preventDefault()
    await fetch('/api/announcements/create', {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify(announcementForm),
    })
    setAnnouncementForm({ title: '', content: '', is_pinned: false })
    setShowAnnouncementForm(false)
    fetchAnnouncements()
  }

  async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return
    await fetch(`/api/announcements/${id}/`, { method: 'DELETE', headers: authHeaders })
    fetchAnnouncements()
  }

  async function deleteMessage(id) {
    await fetch(`/api/chat/messages/${id}/delete`, { method: 'DELETE', headers: authHeaders })
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  async function approveUser(id) {
    await fetch(`/api/auth/users/${id}/approve`, { method: 'POST', headers: authHeaders })
    fetchUsers()
  }
  async function changeRole(id, role) {
    await fetch(`/api/auth/users/${id}/role`, {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ role }),
    })
    fetchUsers()
  }

  if (!user) return null

  const isPending = user.role === 'pending'
  const isAdmin   = user.role === 'admin'
  const isMember  = user.role === 'member' || isAdmin
  const groupedMessages = groupMessages(messages)
  // Send button active if there's text OR a pending file
  const canSend = connected && activeChannel && (msgInput.trim() || pendingFile) && !isUploading

  return (
    <div className="portal-layout">

      {/* Lightbox — image viewer overlay */}
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {/* ══ Sidebar ══════════════════════════════════════════════════════ */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">⚙ UCM Robotics</Link>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.username[0].toUpperCase()}</div>
            <div>
              <div className="sidebar-username">{user.username}</div>
              <div className={`role-badge role-${user.role}`}>{user.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Portal</div>
          {[
            { id: 'announcements', icon: '📢', label: 'Announcements' },
            { id: 'chat',          icon: '💬', label: 'Chat' },
            ...(isAdmin ? [{ id: 'admin', icon: '🛡', label: 'Admin Panel' }] : []),
          ].map(item => (
            <button key={item.id}
              className={`sidebar-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="nav-section-label" style={{ marginTop: 24 }}>Navigate</div>
          <Link to="/" className="sidebar-nav-item">
            <span className="nav-icon">🏠</span> Back to Site
          </Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* ══ Main Content ════════════════════════════════════════════════ */}
      <main className="portal-main">
        {isPending && (
          <div className="pending-banner">
            ⏳ Your account is <strong>pending approval</strong>. You can read everything but cannot send messages until an admin approves you.
          </div>
        )}

        {/* ── Announcements ──────────────────────────────────────────── */}
        {tab === 'announcements' && (
          <div className="tab-content">
            <div className="tab-header">
              <div><h2>Announcements</h2><p>Club news and updates from admins</p></div>
              {isAdmin && (
                <button className="btn btn-primary" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                  + New Announcement
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
                  📌 Pin this announcement
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
                  {a.is_pinned && <div className="pin-badge">📌 Pinned</div>}
                  <div className="announcement-header">
                    <h3>{a.title}</h3>
                    {isAdmin && <button className="delete-btn" onClick={() => deleteAnnouncement(a.id)}>🗑</button>}
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

            {/* Channel list */}
            <div className="channel-list">
              <div className="channel-list-header">Channels</div>
              {channels.map(ch => (
                <button key={ch.id}
                  className={`channel-item ${activeChannel?.id === ch.id ? 'active' : ''}`}
                  onClick={() => setActiveChannel(ch)}>
                  <span className="channel-hash">#</span> {ch.name}
                </button>
              ))}
              {channels.length === 0 && (
                <div className="channel-empty">
                  No channels yet.{isAdmin ? ' Create one via Django admin.' : ''}
                </div>
              )}
            </div>

            {/* Chat area */}
            <div className={`chat-area ${isDragging ? 'drag-over' : ''}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

              {/* Header */}
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
                  {isPending && <span className="read-only-badge">👁 Read Only</span>}
                </div>
              </div>

              {/* Drag overlay */}
              {isDragging && (
                <div className="drag-overlay">
                  <div className="drag-overlay-inner">📎 Drop file to attach</div>
                </div>
              )}

              {/* Messages */}
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

                    {!msg.grouped
                      ? <div className={`message-avatar avatar-${msg.role}`}>{msg.username?.[0]?.toUpperCase() || '?'}</div>
                      : <div className="message-avatar-gap" />
                    }

                    <div className="message-body">
                      {!msg.grouped && (
                        <div className="message-meta">
                          <strong className={`message-username role-color-${msg.role}`}>{msg.username}</strong>
                          {msg.role === 'admin' && <span className="msg-role-badge">admin</span>}
                          <span className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      {msg.content && <div className="message-content">{msg.content}</div>}

                      <FileAttachment
                        fileUrl={msg.file_url} fileName={msg.file_name} fileType={msg.file_type}
                        onImageLoad={scrollIfNearBottom}
                        onLightbox={(src, alt) => setLightbox({ src, alt })}
                      />

                      <ReactionBar message={msg} currentUser={user.username}
                        onReact={handleReact} isMember={isMember} />
                    </div>

                    {isAdmin && msg.id && (
                      <button className="delete-btn small msg-delete" onClick={() => deleteMessage(msg.id)}>🗑</button>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Typing indicator */}
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

              {/* Upload error */}
              {uploadError && <div className="upload-error">⚠️ {uploadError}</div>}

              {/* Input area — file preview + text + send */}
              {isMember ? (
                <div className="chat-input-area">
                  {/* Attachment preview — shows above the input when a file is selected */}
                  {pendingFile && (
                    <AttachmentPreview
                      file={pendingFile}
                      onRemove={() => { setPendingFile(null); setUploadError('') }}
                    />
                  )}

                  <form className="chat-input-bar" onSubmit={handleSendMessage}>
                    {/* Hidden file input */}
                    <input ref={fileInputRef} type="file"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={e => { handleFileSelect(e.target.files[0]); e.target.value = '' }}
                    />

                    {/* Attach button */}
                    <button type="button" className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!connected || isUploading}
                      title="Attach file or image">
                      {isUploading ? '⏳' : '📎'}
                    </button>

                    {/* Text input */}
                    <input type="text" className="chat-text-input"
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
                    />

                    {/* Send — active when there's text OR a file */}
                    <button type="submit" className="btn btn-primary chat-send-btn"
                      disabled={!canSend}>
                      {isUploading ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="read-only-bar">
                  🔒 Your account needs admin approval before you can send messages.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Admin ───────────────────────────────────────────────────── */}
        {tab === 'admin' && isAdmin && (
          <div className="tab-content">
            <div className="tab-header">
              <div><h2>Admin Panel</h2><p>Manage users, roles, and content</p></div>
              <a href="http://127.0.0.1:8000/admin" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Django Admin →
              </a>
            </div>

            <div className="admin-stats">
              {[
                { label: 'Total Users',  val: users.length,                                   color: 'var(--sapphire)' },
                { label: 'Pending',      val: users.filter(u => u.role === 'pending').length, color: 'var(--warning)' },
                { label: 'Members',      val: users.filter(u => u.role === 'member').length,  color: 'var(--green)' },
                { label: 'Admins',       val: users.filter(u => u.role === 'admin').length,   color: 'var(--sapphire)' },
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
                <thead>
                  <tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
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
                            {u.role !== 'pending' && <button className="btn-sm btn-demote" onClick={() => changeRole(u.id, 'pending')}>✕ Revoke</button>}
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
          <span className="tab-icon">📢</span><span>News</span>
        </button>
        <button className={`mobile-tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          <span className="tab-icon">💬</span><span>Chat</span>
        </button>
        {isAdmin && (
          <button className={`mobile-tab-btn ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
            <span className="tab-icon">🛡</span><span>Admin</span>
          </button>
        )}
        <button className="mobile-tab-btn" onClick={handleLogout}>
          <span className="tab-icon">🚪</span><span>Logout</span>
        </button>
      </nav>
    </div>
  )
}