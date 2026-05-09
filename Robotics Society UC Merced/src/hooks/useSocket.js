// src/hooks/useSocket.js
//
// Custom React hook that manages the WebSocket connection to the chat backend.
// Keeps all the raw WebSocket logic here so Portal.jsx stays clean.
//
// Usage inside Portal.jsx:
//   const { messages, sendMessage, connected } = useSocket(activeChannel?.id, token)
//
// When activeChannel changes (user switches channels), the old connection is closed
// and a new one opens automatically — React's useEffect cleanup handles this.

import { useEffect, useRef, useState, useCallback } from 'react'

export function useSocket(channelId, token) {
  const [messages, setMessages]   = useState([])    // All messages for the current channel
  const [connected, setConnected] = useState(false)  // Is the WebSocket open right now?
  const wsRef = useRef(null)                          // Holds the WebSocket instance across renders

  useEffect(() => {
    // Don't try to connect if we have no channel or no auth token
    if (!channelId || !token) return

    // Clear messages from the previous channel immediately so the UI doesn't flash old content
    setMessages([])
    setConnected(false)

    // Open the WebSocket connection
    // We pass the JWT token as a query param because WebSocket headers aren't supported in browsers
    // Vite proxies /ws → ws://localhost:8000/ws so this works in development
    // Use window.location.host so this works on any machine/port automatically.
    // In development: localhost:5173 (Vite proxies /ws → ws://localhost:8000)
    // In production:  yourdomain.com (Nginx proxies /ws → the daphne server)
    const wsUrl = `ws://${window.location.host}/ws/chat/${channelId}/?token=${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    // Connection successfully opened
    ws.onopen = () => {
      setConnected(true)
      console.log(`[WS] Connected to channel ${channelId}`)
    }

    // Message received from the server (broadcast from any user in the channel)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // If the server sent an error (e.g. pending user tried to send), just log it
      if (data.error) {
        console.warn('[WS] Server error:', data.error)
        return
      }

      // Deduplicate — if history was loaded via REST and this WS message has the same ID,
      // don't append it twice. This handles the race where a message arrives over WS
      // at the same time history is loading from REST.
      setMessages(prev => {
        if (data.id && prev.some(m => m.id === data.id)) return prev
        return [...prev, data]
      })
    }

    // Connection closed (server restart, network drop, etc.)
    ws.onclose = (event) => {
      setConnected(false)
      console.log(`[WS] Disconnected from channel ${channelId} (code: ${event.code})`)
    }

    // WebSocket error
    ws.onerror = (error) => {
      console.error('[WS] Error:', error)
      setConnected(false)
    }

    // Cleanup — runs when channelId changes or the component unmounts
    // Closes the old connection before opening a new one
    return () => {
      console.log(`[WS] Closing connection to channel ${channelId}`)
      ws.close()
    }
  }, [channelId, token]) // Re-run whenever the channel or token changes

  // sendMessage — called by the chat input form's onSubmit
  // useCallback keeps a stable reference so it doesn't cause unnecessary re-renders
  const sendMessage = useCallback((content) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Cannot send — connection not open')
      return
    }
    // Send as JSON — consumers.py's receive() method parses this
    wsRef.current.send(JSON.stringify({ content }))
  }, [])

  // hasChannel — true when a channel ID was actually provided
  // Portal uses this to show "No channels yet" vs "Connecting..." vs "● Live"
  const hasChannel = Boolean(channelId)

  // Expose setMessages so Portal.jsx can pre-load message history from the REST API.
  // Flow: channel selected → REST fetch loads history into messages[] → WebSocket opens
  // → new messages are appended on top of the history. No duplicates because history
  // is loaded once on channel switch and WS only delivers messages sent AFTER connect.
  return { messages, setMessages, sendMessage, connected, hasChannel }
}