// src/hooks/useSocket.js
// WebSocket hook — manages the real-time chat connection.
// Features:
//   - Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s → max 30s)
//   - Typing indicator support (send + receive)
//   - Deduplication against REST-loaded history
//   - Clean disconnect on channel switch or unmount

import { useEffect, useRef, useState, useCallback } from 'react'

export function useSocket(channelId, token) {
  const [messages,   setMessages]   = useState([])
  const [connected,  setConnected]  = useState(false)
  const [typingUsers, setTypingUsers] = useState([])  // ["angel", "xia.misu"]
  const wsRef        = useRef(null)
  const reconnectRef = useRef(null)   // Holds the reconnect setTimeout id
  const typingTimers = useRef({})     // Per-user typing expiry timers { username: timeoutId }
  const retryCount   = useRef(0)
  const isMounted    = useRef(true)

  // Expose setMessages so Portal can inject REST history
  // hasChannel — drives "No channels yet" vs "Connecting..." in Portal UI
  const hasChannel = Boolean(channelId)

  const connect = useCallback(() => {
    if (!channelId || !token) return

    // In production: use VITE_WS_URL (Railway backend)
    // In development: use current host so Vite proxy handles /ws → localhost:8000
    let wsUrl
    const WS_BASE = import.meta.env.VITE_WS_URL || ''
    if (WS_BASE) {
      wsUrl = `${WS_BASE}/ws/chat/${channelId}/?token=${token}`
    } else {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
      wsUrl = `${proto}://${window.location.host}/ws/chat/${channelId}/?token=${token}`
    }
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      if (!isMounted.current) return
      setConnected(true)
      retryCount.current = 0   // Reset backoff on successful connect
      console.log(`[WS] Connected to channel ${channelId}`)
    }

    ws.onmessage = (event) => {
      if (!isMounted.current) return
      const data = JSON.parse(event.data)

      // Route by message type
      // Reaction update — another user added/removed a reaction
      // Update that specific message's reactions in state without a full refetch
      if (data.type === 'reaction_update') {
        setMessages(prev => prev.map(m =>
          m.id === data.message_id ? { ...m, reactions: data.reactions } : m
        ))
        return
      }

      if (data.type === 'typing') {
        // Add user to typingUsers. Each incoming typing event resets THAT user's
        // expiry timer to 4 seconds. If no new typing event comes within 4s,
        // they are removed (they stopped typing or went idle).
        const username = data.username

        setTypingUsers(prev => {
          if (prev.includes(username)) return prev
          return [...prev, username]
        })

        // Store per-user timeout so each user has their own independent timer
        if (!typingTimers.current[username]) {
          typingTimers.current[username] = null
        }
        clearTimeout(typingTimers.current[username])
        typingTimers.current[username] = setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== username))
          delete typingTimers.current[username]
        }, 4000)   // 4s — clears if user stops typing
        return
      }

      if (data.type === 'typing_stop') {
        // Immediate clear — user sent their message or explicitly stopped typing
        const username = data.username
        clearTimeout(typingTimers.current[username])
        delete typingTimers.current[username]
        setTypingUsers(prev => prev.filter(u => u !== username))
        return
      }

      if (data.error) {
        console.warn('[WS] Server error:', data.error)
        return
      }

      // Regular message — deduplicate against REST history
      setMessages(prev => {
        if (data.id && prev.some(m => m.id === data.id)) return prev
        return [...prev, data]
      })
    }

    ws.onclose = (event) => {
      if (!isMounted.current) return
      setConnected(false)
      console.log(`[WS] Disconnected (code: ${event.code})`)

      // Auto-reconnect unless it was a clean close (1000) or auth failure (4001)
      if (event.code !== 1000 && event.code !== 4001) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000)
        retryCount.current++
        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${retryCount.current})`)
        reconnectRef.current = setTimeout(connect, delay)
      }
    }

    ws.onerror = () => {
      setConnected(false)
    }
  }, [channelId, token])

  useEffect(() => {
    isMounted.current = true
    if (!channelId || !token) return

    // Reset state when switching channels
    setMessages([])
    setConnected(false)
    setTypingUsers([])
    // Clear all per-user typing timers from previous channel
    Object.values(typingTimers.current).forEach(clearTimeout)
    typingTimers.current = {}
    retryCount.current = 0

    connect()

    return () => {
      isMounted.current = false
      clearTimeout(reconnectRef.current)
      if (wsRef.current) {
        wsRef.current.onclose = null   // Prevent reconnect on intentional close
        wsRef.current.close(1000)
      }
    }
  }, [channelId, token])

  // Send a regular chat message
  const sendMessage = useCallback((content) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ content }))
  }, [])

  // sendTyping('start') — called while user is actively typing
  // sendTyping('stop')  — called when user sends, clears input, or goes idle
  const sendTyping = useCallback((action = 'start') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({
      type:    action === 'stop' ? 'typing_stop' : 'typing',
      content: '',
    }))
  }, [])

  return { messages, setMessages, sendMessage, sendTyping, connected, hasChannel, typingUsers }
}