// Portal.jsx — Members-only dashboard
// Tabs: Announcements | Chat (now real-time via WebSocket) | Admin Panel

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'  // Real-time WebSocket hook

export default function Portal({ user, handleLogout }) {
  const navigate = useNavigate()

  // ── Tab state ──────────────────────────────────────────────────────
  const [tab, setTab] = useState('announcements')

  // ── Announcements state ────────────────────────────────────────────
  const [announcements, setAnnouncements]               = useState([])
  const [announcementForm, setAnnouncementForm]         = useState({ title: '', content: '', is_pinned: false })
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)

  // ── Chat state ─────────────────────────────────────────────────────
  const [channels, setChannels]         = useState([])
  const [activeChannel, setActiveChannel] = useState(null)
  const [msgInput, setMsgInput]         = useState('')
  const chatEndRef                      = useRef(null)

  // ── Admin state ────────────────────────────────────────────────────
  const [users, setUsers] = useState([])

  // ── Auth ───────────────────────────────────────────────────────────
  const token = localStorage.getItem('access_token')
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // ── WebSocket — replaces the old setInterval polling ───────────────
  // When activeChannel changes, useSocket closes the old WS and opens a new one.
  // messages is the live list of messages for the current channel.
  // connected shows whether the WS handshake is complete.
  const { messages, setMessages, sendMessage, connected, hasChannel } = useSocket(activeChannel?.id, token)

  // ── Redirect if not logged in ──────────────────────────────────────
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  // ── Load initial data on mount ─────────────────────────────────────
  useEffect(() => {
    if (!user) return
    fetchAnnouncements()
    fetchChannels()
    if (user.role === 'admin') fetchUsers()
  }, [user])

  // ── Load message history when switching channels ───────────────────
  // The WebSocket only delivers NEW messages in real time.
  // We still fetch history via REST on channel switch so existing messages show up.
  useEffect(() => {
    if (activeChannel) fetchMessageHistory(activeChannel.id)
  }, [activeChannel])

  // ── Auto-scroll to bottom when messages arrive ─────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Fetchers ───────────────────────────────────────────────────────

  async function fetchAnnouncements() {
    const res = await fetch('/api/announcements/', { headers: authHeaders })
    if (res.ok) setAnnouncements(await res.json())
  }

  async function fetchChannels() {
    const res = await fetch('/api/chat/channels/', { headers: authHeaders })
    if (res.ok) {
      const data = await res.json()
      setChannels(data)
      // Auto-select the first channel
      if (data.length > 0) setActiveChannel(data[0])
    }
  }

  async function fetchMessageHistory(channelId) {
    // Load existing message history from REST API when switching channels.
    // The WebSocket only delivers NEW messages going forward after the connection opens.
    // Without this, you'd only see messages sent while you're actively connected.
    // With this: REST loads the full history first, then WebSocket appends new arrivals.
    try {
      const res = await fetch(`/api/chat/channels/${channelId}/messages/`, { headers: authHeaders })
      if (!res.ok) return
      const history = await res.json()

      // setMessages is exposed by useSocket — it writes directly into the hook's state.
      // useSocket already resets messages to [] when channelId changes, so history
      // loads cleanly into an empty list with no duplicates from the previous channel.
      // Map REST fields (username, created_at) to match WebSocket message shape exactly.
      setMessages(history.map(msg => ({
        id:         msg.id,
        content:    msg.content,
        username:   msg.username,     // From MessageSerializer source='author.username'
        role:       msg.role,
        created_at: msg.created_at,
      })))
    } catch (err) {
      console.error('[History] Failed to load message history:', err)
    }
  }

  async function fetchUsers() {
    const res = await fetch('/api/auth/users', { headers: authHeaders })
    if (res.ok) setUsers(await res.json())
  }

  // ── Send message via WebSocket ─────────────────────────────────────
  function handleSendMessage(e) {
    e.preventDefault()
    if (!msgInput.trim() || !activeChannel) return
    // useSocket.sendMessage writes to the WebSocket — consumers.py saves + broadcasts
    sendMessage(msgInput.trim())
    setMsgInput('')  // Clear the input immediately (optimistic UX)
  }

  // ── Announcement actions ───────────────────────────────────────────
  async function createAnnouncement(e) {
    e.preventDefault()
    await fetch('/api/announcements/create', {
      method: 'POST',
      headers: authHeaders,
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

  // ── Admin message delete ───────────────────────────────────────────
  async function deleteMessage(id) {
    // Still uses REST for delete — no need to do this over WebSocket
    await fetch(`/api/chat/messages/${id}/delete`, { method: 'DELETE', headers: authHeaders })
    // No need to refetch — message will just stay visible until page reload
    // (could filter from messages state for instant UI update)
  }

  // ── User management ────────────────────────────────────────────────
  async function approveUser(id) {
    await fetch(`/api/auth/users/${id}/approve`, { method: 'POST', headers: authHeaders })
    fetchUsers()
  }

  async function changeRole(id, role) {
    await fetch(`/api/auth/users/${id}/role`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ role }),
    })
    fetchUsers()
  }

  if (!user) return null

  const isPending = user.role === 'pending'
  const isAdmin   = user.role === 'admin'
  const isMember  = user.role === 'member' || isAdmin

  return (
    <div className="portal-layout">

      {/* ══ Sidebar ════════════════════════════════════════════════ */}
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
            <button
              key={item.id}
              className={`sidebar-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 24 }}>Navigate</div>
          <Link to="/" className="sidebar-nav-item">
            <span className="nav-icon">🏠</span> Back to Site
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* ══ Main Content ═══════════════════════════════════════════ */}
      <main className="portal-main">

        {/* Pending warning banner */}
        {isPending && (
          <div className="pending-banner">
            ⏳ Your account is <strong>pending approval</strong>. You can read everything but cannot send messages until an admin approves you.
          </div>
        )}

        {/* ── Announcements Tab ─────────────────────────────────── */}
        {tab === 'announcements' && (
          <div className="tab-content">
            <div className="tab-header">
              <div>
                <h2>Announcements</h2>
                <p>Club news and updates from admins</p>
              </div>
              {isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                >
                  + New Announcement
                </button>
              )}
            </div>

            {showAnnouncementForm && isAdmin && (
              <form className="announcement-form" onSubmit={createAnnouncement}>
                <input
                  type="text"
                  placeholder="Announcement title..."
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Announcement content..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  rows={4}
                  required
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={announcementForm.is_pinned}
                    onChange={e => setAnnouncementForm({ ...announcementForm, is_pinned: e.target.checked })}
                  />
                  📌 Pin this announcement
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary">Post</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAnnouncementForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            {announcements.length === 0 ? (
              <div className="empty-state">No announcements yet.</div>
            ) : (
              announcements.map(a => (
                <div className={`announcement-card ${a.is_pinned ? 'pinned' : ''}`} key={a.id}>
                  {a.is_pinned && <div className="pin-badge">📌 Pinned</div>}
                  <div className="announcement-header">
                    <h3>{a.title}</h3>
                    {isAdmin && (
                      <button className="delete-btn" onClick={() => deleteAnnouncement(a.id)}>🗑</button>
                    )}
                  </div>
                  <p>{a.content}</p>
                  <div className="announcement-meta">
                    By <strong>{a.author_name || 'Admin'}</strong> · {new Date(a.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Chat Tab ──────────────────────────────────────────── */}
        {tab === 'chat' && (
          <div className="chat-layout">

            {/* Channel sidebar */}
            <div className="channel-list">
              <div className="channel-list-header">Channels</div>
              {channels.map(ch => (
                <button
                  key={ch.id}
                  className={`channel-item ${activeChannel?.id === ch.id ? 'active' : ''}`}
                  onClick={() => setActiveChannel(ch)}
                >
                  # {ch.name}
                </button>
              ))}
              {channels.length === 0 && (
                <div style={{ padding: '12px', fontSize: 13, color: 'var(--text)' }}>
                  No channels yet.{isAdmin ? ' Create one via Django admin.' : ''}
                </div>
              )}
            </div>

            {/* Chat area */}
            <div className="chat-area">
              <div className="chat-header">
                <strong>#{activeChannel?.name || 'Select a channel'}</strong>
                <span className="chat-desc">{activeChannel?.description}</span>
                {/* Show live connection status dot */}
                {hasChannel && (
                  <span className={`ws-status ${connected ? 'ws-connected' : 'ws-connecting'}`}>
                    {connected ? '● Live' : '○ Connecting...'}
                  </span>
                )}
                {isPending && <span className="read-only-badge">👁 Read Only</span>}
              </div>

              <div className="messages-list">
                {messages.length === 0 && (
                  <div className="empty-state">
                    {!hasChannel
                      ? 'Select a channel to start chatting.'
                      : connected
                        ? (isMember ? 'No messages yet — say hello! 👋' : 'No messages yet.')
                        : 'Connecting...'}
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div className="message" key={msg.id ?? `msg-${i}`}>
                    <div className="message-avatar">
                      {msg.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="message-body">
                      <div className="message-meta">
                        <strong>{msg.username}</strong>
                        <span className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="message-content">{msg.content}</div>
                    </div>
                    {/* Admins can delete any message */}
                    {isAdmin && msg.id && (
                      <button className="delete-btn small" onClick={() => deleteMessage(msg.id)}>🗑</button>
                    )}
                  </div>
                ))}
                {/* Invisible div at the bottom — scrolled into view when messages arrive */}
                <div ref={chatEndRef} />
              </div>

              {/* Input bar — only shown to members and admins */}
              {isMember ? (
                <form className="chat-input-bar" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder={
                      !hasChannel
                        ? 'No channel selected'
                        : connected
                          ? `Message #${activeChannel?.name}...`
                          : 'Connecting...'
                    }
                    value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    disabled={!activeChannel || !connected}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!activeChannel || !connected || !msgInput.trim()}
                  >
                    Send
                  </button>
                </form>
              ) : (
                <div className="read-only-bar">
                  🔒 Your account needs admin approval before you can send messages.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Admin Tab ─────────────────────────────────────────── */}
        {tab === 'admin' && isAdmin && (
          <div className="tab-content">
            <div className="tab-header">
              <div>
                <h2>Admin Panel</h2>
                <p>Manage users, roles, and content</p>
              </div>
              {/* Direct link to Django admin — must be <a> not <Link>, see comments in previous version */}
              <a
                href="http://127.0.0.1:8000/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Django Admin →
              </a>
            </div>

            <div className="admin-stats">
              {[
                { label: 'Total Users',  val: users.length,                                      color: 'var(--sapphire)' },
                { label: 'Pending',      val: users.filter(u => u.role === 'pending').length,    color: 'var(--warning)'  },
                { label: 'Members',      val: users.filter(u => u.role === 'member').length,     color: 'var(--green)'    },
                { label: 'Admins',       val: users.filter(u => u.role === 'admin').length,      color: 'var(--sapphire)' },
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
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className={u.id === user.id ? 'self-row' : ''}>
                      <td>
                        <strong>{u.username}</strong>
                        {u.id === user.id && <span className="you-badge">you</span>}
                      </td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                      <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td>
                        {u.id !== user.id && (
                          <div className="action-btns">
                            {u.role === 'pending' && (
                              <button className="btn-sm btn-approve" onClick={() => approveUser(u.id)}>
                                ✓ Approve
                              </button>
                            )}
                            {u.role !== 'admin' && (
                              <button className="btn-sm btn-promote" onClick={() => changeRole(u.id, 'admin')}>
                                ↑ Admin
                              </button>
                            )}
                            {u.role === 'admin' && (
                              <button className="btn-sm btn-demote" onClick={() => changeRole(u.id, 'member')}>
                                ↓ Member
                              </button>
                            )}
                            {u.role !== 'pending' && (
                              <button className="btn-sm btn-demote" onClick={() => changeRole(u.id, 'pending')}>
                                ✕ Revoke
                              </button>
                            )}
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
    </div>
  )
}