// ── Channel List ───────────────────────────────────────────────────────
// The channel sidebar inside the chat tab. Admins also get the "+" button
// and inline create form, plus a delete button on each channel.
//
// Styles: styles/portal/chat.css (list) and styles/portal/channels.css (form)

import { useState } from 'react'
import * as api from '../../../lib/api'

export default function ChannelList({
  channels, activeChannel, onSelect, isAdmin, onChannelCreated, onChannelDeleted,
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName]         = useState('')
  const [description, setDescription] = useState('')
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)

  const closeForm = () => { setShowForm(false); setError('') }

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError('')

    // The backend slugifies the name (lowercase, spaces → hyphens) and
    // rejects duplicates, so the error text comes from there.
    const { ok, data } = await api.chat.createChannel(name.trim(), description.trim())

    if (ok) {
      onChannelCreated(data)
      setName('')
      setDescription('')
      closeForm()
    } else {
      setError(data.error || 'Failed to create channel')
    }
    setSaving(false)
  }

  async function handleDelete(channel) {
    // Deleting a channel cascades to every message in it, so confirm first.
    if (!confirm(`Delete #${channel.name} and ALL its messages? This cannot be undone.`)) return
    const { ok } = await api.chat.deleteChannel(channel.id)
    if (ok) onChannelDeleted(channel)
  }

  return (
    <div className="channel-list">
      <div className="channel-list-header-row">
        <span className="channel-list-header">Channels</span>
        {isAdmin && (
          <button className="channel-add-btn"
            onClick={() => { setShowForm(p => !p); setError('') }}
            title="Create new channel">
            <i className="fi fi-rr-plus-small" />
          </button>
        )}
      </div>

      {/* ── New channel form ── admin only, toggled by the + button ── */}
      {isAdmin && showForm && (
        <form className="new-channel-form" onSubmit={handleCreate}>
          <input className="new-channel-input" placeholder="channel-name"
            value={name} onChange={e => setName(e.target.value)} autoFocus maxLength={32} />
          <input className="new-channel-input" placeholder="Description (optional)"
            value={description} onChange={e => setDescription(e.target.value)} maxLength={120} />

          {error && <div className="new-channel-error">{error}</div>}

          <div className="new-channel-actions">
            <button type="submit" className="btn btn-primary"
              style={{ fontSize: 12, padding: '5px 12px' }}
              disabled={saving || !name.trim()}>
              {saving ? '...' : 'Create'}
            </button>
            <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }}
              onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── The channels ── */}
      {channels.map(channel => (
        <div key={channel.id}
          className={`channel-item-wrap ${activeChannel?.id === channel.id ? 'active' : ''}`}>
          <button
            className={`channel-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
            onClick={() => onSelect(channel)}>
            <span className="channel-hash">#</span> {channel.name}
          </button>
          {/* Delete only appears on hover (always visible on touch screens) */}
          {isAdmin && (
            <button className="channel-delete-btn" onClick={() => handleDelete(channel)}
              title={`Delete #${channel.name}`}>
              <i className="fi fi-ss-trash" />
            </button>
          )}
        </div>
      ))}

      {channels.length === 0 && !showForm && (
        <div className="channel-empty">
          {isAdmin ? 'No channels yet. Click + to create one.' : 'No channels yet.'}
        </div>
      )}
    </div>
  )
}
