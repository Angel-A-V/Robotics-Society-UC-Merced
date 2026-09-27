// ── usePortalData ──────────────────────────────────────────────────────
// Loads and keeps fresh everything the portal displays apart from chat:
// announcements, channels and (for admins) the user list.
//
// Chat is not polled — it is live over WebSocket. See hooks/useSocket.js.
//
// The poll also re-fetches the current user, which is how a pending account
// flips to "member" on its own the moment an admin approves it, without the
// person needing to reload the page.

import { useState, useEffect, useCallback } from 'react'
import * as api from '../lib/api'
import { PORTAL_POLL_MS } from '../lib/config'

export function usePortalData(user, setUser) {
  const [announcements, setAnnouncements] = useState([])
  const [channels, setChannels]           = useState([])
  const [activeChannel, setActiveChannel] = useState(null)
  const [users, setUsers]                 = useState([])

  const refreshAnnouncements = useCallback(async () => {
    const { ok, data } = await api.announcements.list()
    if (ok) setAnnouncements(data)
  }, [])

  const refreshChannels = useCallback(async () => {
    const { ok, data } = await api.chat.channels()
    if (!ok) return
    setChannels(data)
    // Auto-select the first channel on the initial load only. During polling,
    // `prev` is already set, so whatever the user is reading stays selected.
    setActiveChannel(prev => prev || data[0] || null)
  }, [])

  const refreshUsers = useCallback(async () => {
    const { ok, data } = await api.users.list()
    if (ok) setUsers(data)
  }, [])

  // ── Initial load ──
  useEffect(() => {
    if (!user) return
    refreshAnnouncements()
    refreshChannels()
    if (user.role === 'admin') refreshUsers()
  }, [user?.id, user?.role])

  // ── Background polling ──
  useEffect(() => {
    if (!user) return

    const tick = async () => {
      // Skip while the tab is in the background to save battery and requests
      if (document.hidden) return

      refreshAnnouncements()
      refreshChannels()
      if (user.role === 'admin') refreshUsers()

      // Push a role or avatar change from the server into App state
      const { ok, data } = await api.auth.me()
      if (ok && data?.user &&
          (data.user.role !== user.role || data.user.avatar_url !== user.avatar_url)) {
        setUser(data.user)
      }
    }

    const intervalId = setInterval(tick, PORTAL_POLL_MS)

    // Also refresh the moment the tab regains focus — helps after sleep
    const onVisibilityChange = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [user])

  // ── Channel list mutations from the admin UI ──
  const addChannel = useCallback((channel) => {
    setChannels(prev => [...prev, channel])
    setActiveChannel(channel)   // Jump straight into the new channel
  }, [])

  const removeChannel = (channel) => {
    const remaining = channels.filter(c => c.id !== channel.id)
    setChannels(remaining)
    // If we just deleted the channel being viewed, fall back to another one
    if (activeChannel?.id === channel.id) setActiveChannel(remaining[0] || null)
  }

  return {
    announcements, refreshAnnouncements,
    channels, activeChannel, setActiveChannel, addChannel, removeChannel,
    users, refreshUsers,
  }
}
