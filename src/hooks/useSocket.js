// ── useSocket ──────────────────────────────────────────────────────────
// Manages the real-time chat WebSocket for one channel.
//
// What it handles:
//   - Connecting with the JWT token as a query parameter
//   - Auto-reconnect with exponential backoff (1s → 2s → 4s → … → 30s)
//   - Typing indicators, with a per-user expiry timer
//   - De-duplicating live messages against the REST history
//   - Reaction updates pushed from other users
//   - A clean close when the channel changes or the component unmounts
//
// Server side: backend/api/consumers.py (ChatConsumer)

import { useEffect, useRef, useState, useCallback } from 'react'
import { WS_BASE, TYPING_TIMEOUT_MS } from '../lib/config'

// Builds the ws:// or wss:// URL for a channel.
// In production WS_BASE points at the deployed backend. In development it is
// empty, so we connect to the Vite dev server host and let its proxy forward
// /ws to Django (see vite.config.js).
function buildSocketUrl(channelId, token) {
  if (WS_BASE) return `${WS_BASE}/ws/chat/${channelId}/?token=${token}`
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}/ws/chat/${channelId}/?token=${token}`
}

export function useSocket(channelId, token) {
  const [messages, setMessages]       = useState([])
  const [connected, setConnected]     = useState(false)
  const [typingUsers, setTypingUsers] = useState([])   // ["angel", "xia.misu"]

  const socketRef    = useRef(null)
  const reconnectRef = useRef(null)   // setTimeout id for the pending retry
  const typingTimers = useRef({})     // { username: timeoutId }
  const retryCount   = useRef(0)      // Drives the backoff delay
  const isMounted    = useRef(true)   // Guards setState after unmount

  // Lets the portal tell "no channels exist" apart from "still connecting".
  const hasChannel = Boolean(channelId)

  const connect = useCallback(() => {
    if (!channelId || !token) return

    const socket = new WebSocket(buildSocketUrl(channelId, token))
    socketRef.current = socket

    socket.onopen = () => {
      if (!isMounted.current) return
      setConnected(true)
      retryCount.current = 0   // Reset the backoff after a successful connect
      console.log(`[WS] Connected to channel ${channelId}`)
    }

    socket.onmessage = (event) => {
      if (!isMounted.current) return
      const data = JSON.parse(event.data)

      // ── Reaction added or removed by someone ──
      // Patch that one message in place instead of refetching the channel.
      if (data.type === 'reaction_update') {
        setMessages(prev => prev.map(m =>
          m.id === data.message_id ? { ...m, reactions: data.reactions } : m
        ))
        return
      }

      // ── Someone started typing ──
      // Each user gets their own expiry timer, reset by every new event from
      // them. If nothing arrives within the timeout they drop off the list.
      if (data.type === 'typing') {
        const { username } = data
        setTypingUsers(prev => prev.includes(username) ? prev : [...prev, username])

        clearTimeout(typingTimers.current[username])
        typingTimers.current[username] = setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== username))
          delete typingTimers.current[username]
        }, TYPING_TIMEOUT_MS)
        return
      }

      // ── Someone stopped typing ──
      // Sent when they hit send or cleared the box, so clear immediately.
      if (data.type === 'typing_stop') {
        const { username } = data
        clearTimeout(typingTimers.current[username])
        delete typingTimers.current[username]
        setTypingUsers(prev => prev.filter(u => u !== username))
        return
      }

      if (data.error) {
        console.warn('[WS] Server error:', data.error)
        return
      }

      // ── A normal chat message ──
      // Skip it if the REST history already loaded this id.
      setMessages(prev => {
        if (data.id && prev.some(m => m.id === data.id)) return prev
        return [...prev, data]
      })
    }

    socket.onclose = (event) => {
      if (!isMounted.current) return
      setConnected(false)
      console.log(`[WS] Disconnected (code: ${event.code})`)

      // Reconnect unless this was a deliberate close (1000) or the server
      // rejected our token (4001) — retrying a bad token would just loop.
      if (event.code !== 1000 && event.code !== 4001) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000)
        retryCount.current++
        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${retryCount.current})`)
        reconnectRef.current = setTimeout(connect, delay)
      }
    }

    socket.onerror = () => setConnected(false)
  }, [channelId, token])

  // Open the socket, and re-open it whenever the channel changes.
  useEffect(() => {
    isMounted.current = true
    if (!channelId || !token) return

    // Clear everything belonging to the previous channel
    setMessages([])
    setConnected(false)
    setTypingUsers([])
    Object.values(typingTimers.current).forEach(clearTimeout)
    typingTimers.current = {}
    retryCount.current = 0

    connect()

    return () => {
      isMounted.current = false
      clearTimeout(reconnectRef.current)
      if (socketRef.current) {
        socketRef.current.onclose = null   // Stop onclose from queueing a retry
        socketRef.current.close(1000)      // 1000 = normal, intentional close
      }
    }
  }, [channelId, token])

  // Send a chat message. Silently ignored if the socket is not open —
  // the send button is already disabled in that state.
  const sendMessage = useCallback((content) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return
    socketRef.current.send(JSON.stringify({ content }))
  }, [])

  // sendTyping('start') while the user is typing,
  // sendTyping('stop')  when they send, clear the box, or go idle.
  const sendTyping = useCallback((action = 'start') => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return
    socketRef.current.send(JSON.stringify({
      type: action === 'stop' ? 'typing_stop' : 'typing',
      content: '',
    }))
  }, [])

  return { messages, setMessages, sendMessage, sendTyping, connected, hasChannel, typingUsers }
}
