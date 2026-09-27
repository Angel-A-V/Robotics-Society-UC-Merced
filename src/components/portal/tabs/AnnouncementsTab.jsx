// ── Announcements Tab ──────────────────────────────────────────────────
// Club news. Everyone can read; only admins see the create form and the
// delete buttons. Pinned announcements sort to the top (ordering is set by
// the Announcement model's Meta class on the backend).
//
// Styles: styles/portal/announcements.css

import { useState } from 'react'
import { formatShortDate } from '../../../lib/format'
import * as api from '../../../lib/api'

const EMPTY_FORM = { title: '', content: '', is_pinned: false }

export default function AnnouncementsTab({ announcements, isAdmin, onChanged }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  async function handleCreate(e) {
    e.preventDefault()
    await api.announcements.create(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
    onChanged()   // Ask Portal to re-fetch the list
  }

  async function handleDelete(id) {
    if (!confirm('Delete this announcement?')) return
    await api.announcements.remove(id)
    onChanged()
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Announcements</h2>
          <p>Club news and updates from admins</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + New
          </button>
        )}
      </div>

      {/* ── Create form ── admin only ── */}
      {showForm && isAdmin && (
        <form className="announcement-form" onSubmit={handleCreate}>
          <input type="text" placeholder="Title..." value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />

          <textarea placeholder="Content..." value={form.content} rows={4}
            onChange={e => setForm({ ...form, content: e.target.value })} required />

          {/* Pin toggle — pinned announcements stay at the top of the list */}
          <button type="button"
            className={`pin-toggle-btn ${form.is_pinned ? 'active' : ''}`}
            onClick={() => setForm({ ...form, is_pinned: !form.is_pinned })}>
            <i className="fi fi-rr-thumbtack" />
            <span>{form.is_pinned ? 'Pinned' : 'Pin'}</span>
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary">Post</button>
            <button type="button" className="btn btn-outline"
              onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* ── The list ── */}
      {announcements.length === 0 ? (
        <div className="empty-state">No announcements yet.</div>
      ) : (
        announcements.map(item => (
          <div className={`announcement-card ${item.is_pinned ? 'pinned' : ''}`} key={item.id}>
            {item.is_pinned && (
              <div className="pin-badge"><i className="fi fi-rr-thumbtack" /> Pinned</div>
            )}

            <div className="announcement-header">
              <h3>{item.title}</h3>
              {isAdmin && (
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  <i className="fi fi-ss-trash" />
                </button>
              )}
            </div>

            <p>{item.content}</p>

            <div className="announcement-meta">
              By <strong>{item.author_name || 'Admin'}</strong> · {formatShortDate(item.created_at)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
