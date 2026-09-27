// ── Chat Tab ───────────────────────────────────────────────────────────
// Container for the chat screen. Owns everything that is purely about
// composing and viewing messages; the WebSocket itself lives in Portal.jsx
// so the connection survives switching tabs.
//
// Pieces: ChannelList | ChatHeader + MessageList + TypingIndicator + ChatInputBar

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import ChannelList from '../chat/ChannelList'
import ChatHeader from '../chat/ChatHeader'
import MessageList from '../chat/MessageList'
import TypingIndicator from '../chat/TypingIndicator'
import ChatInputBar from '../chat/ChatInputBar'
import { groupMessages, normalizeMessage } from '../../../lib/chat'
import { MAX_CHAT_FILE_BYTES, TYPING_PING_MS } from '../../../lib/config'
import * as api from '../../../lib/api'

// How close to the bottom counts as "following the conversation".
const STICK_TO_BOTTOM_PX = 150

export default function ChatTab({
  user, isAdmin, isMember, isPending,
  channels, activeChannel, onSelectChannel, onChannelCreated, onChannelDeleted,
  socket, onOpenLightbox, onOpenProfile,
}) {
  const { messages, setMessages, sendMessage, sendTyping, connected, hasChannel, typingUsers } = socket

  const [msgInput, setMsgInput]     = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging]   = useState(false)

  const messagesListRef = useRef(null)
  const fileInputRef    = useRef(null)
  const textareaRef     = useRef(null)
  const typingTimer     = useRef(null)
  // Tracks whether to auto-scroll. If the user scrolled up to read history
  // we leave them alone instead of yanking them back down.
  const isNearBottomRef = useRef(true)

  // ── Load history when the channel changes ──
  // The socket only delivers messages sent from now on, so past messages
  // come from REST and are normalised into the same shape.
  useEffect(() => {
    if (!activeChannel) return
    api.chat.messages(activeChannel.id).then(({ ok, data }) => {
      if (ok) setMessages(data.map(normalizeMessage))
    })
  }, [activeChannel])

  // ── Scroll tracking ──
  useEffect(() => {
    const container = messagesListRef.current
    if (!container) return
    const handler = () => {
      isNearBottomRef.current =
        container.scrollHeight - container.scrollTop - container.clientHeight < STICK_TO_BOTTOM_PX
    }
    container.addEventListener('scroll', handler, { passive: true })
    return () => container.removeEventListener('scroll', handler)
  }, [])

  const scrollToBottom = useCallback(() => {
    const container = messagesListRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [])

  // Follow new messages down, but only if the user was already at the bottom.
  // useLayoutEffect so it happens before the browser paints — no visible jump.
  useLayoutEffect(() => {
    if (isNearBottomRef.current) scrollToBottom()
  }, [messages])

  // Opening a channel always starts at the newest message. The repeats catch
  // late-loading images and fonts that change the list height after mount.
  useEffect(() => {
    if (!activeChannel) return
    isNearBottomRef.current = true
    scrollToBottom()
    const t1 = setTimeout(scrollToBottom, 100)
    const t2 = setTimeout(scrollToBottom, 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [activeChannel?.id])

  const scrollIfNearBottom = useCallback(() => {
    if (isNearBottomRef.current) scrollToBottom()
  }, [scrollToBottom])

  // ── Sending ──
  async function handleSend(e) {
    e.preventDefault()
    const text = msgInput.trim()
    if (!text && !pendingFile) return
    if (!activeChannel || !connected) return

    if (text) { sendMessage(text); setMsgInput('') }

    // Files go over REST; the server then broadcasts the message over the
    // socket, so it arrives like any other message.
    if (pendingFile) {
      await uploadFile(pendingFile)
      setPendingFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Clear our typing bubble on everyone else's screen right away
    sendTyping('stop')
    clearTimeout(typingTimer.current)
    typingTimer.current = null

    // Shrink the textarea back to one line
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.overflowY = 'hidden'
    }
  }

  // ── Typing indicator ──
  // Throttled: one "typing" ping per interval rather than one per keystroke.
  function handleInputChange(e) {
    const value = e.target.value
    setMsgInput(value)

    if (!value) {
      sendTyping('stop')
      clearTimeout(typingTimer.current)
      typingTimer.current = null
      return
    }

    if (!typingTimer.current) {
      sendTyping('start')
      typingTimer.current = setTimeout(() => { typingTimer.current = null }, TYPING_PING_MS)
    }
  }

  // ── File picking and upload ──
  function handleFileSelect(file) {
    if (!file) return
    setUploadError('')
    // Checked here for instant feedback; the server enforces it too.
    if (file.size > MAX_CHAT_FILE_BYTES) {
      setUploadError('File too large. Max 8MB.')
      return
    }
    setPendingFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadFile(file) {
    if (!file || !activeChannel) return
    setIsUploading(true)
    const { ok, data } = await api.chat.upload(activeChannel.id, file)
    if (!ok) setUploadError(data.error || 'Upload failed')
    setIsUploading(false)
  }

  // ── Drag and drop onto the chat area ──
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop      = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  // ── Reactions and deletion ──
  async function handleReact(messageId, emoji) {
    const { ok, data } = await api.chat.react(messageId, emoji)
    // Patch locally so it feels instant; the socket also broadcasts this to
    // everyone else, and the ids match so nothing duplicates.
    if (ok) {
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, reactions: data.reactions } : m
      ))
    }
  }

  async function handleDeleteMessage(id, authorUsername) {
    if (user.username !== authorUsername && !isAdmin) return
    if (!confirm('Delete this message?')) return
    const { ok } = await api.chat.deleteMessage(id)
    if (ok) setMessages(prev => prev.filter(m => m.id !== id))
  }

  const canSend = connected && activeChannel && (msgInput.trim() || pendingFile) && !isUploading

  return (
    <div className="chat-layout">
      <ChannelList
        channels={channels}
        activeChannel={activeChannel}
        onSelect={onSelectChannel}
        isAdmin={isAdmin}
        onChannelCreated={onChannelCreated}
        onChannelDeleted={onChannelDeleted}
      />

      <div className={`chat-area ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

        <ChatHeader channel={activeChannel} connected={connected}
          hasChannel={hasChannel} isPending={isPending} />

        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-overlay-inner">Drop file to attach</div>
          </div>
        )}

        <MessageList
          listRef={messagesListRef}
          messages={groupMessages(messages)}
          currentUser={user}
          isAdmin={isAdmin}
          isMember={isMember}
          connected={connected}
          hasChannel={hasChannel}
          onReact={handleReact}
          onDelete={handleDeleteMessage}
          onOpenProfile={onOpenProfile}
          onOpenLightbox={(src, alt) => onOpenLightbox({ src, alt })}
          onImageLoad={scrollIfNearBottom}
        />

        <TypingIndicator typingUsers={typingUsers} />

        {uploadError && <div className="upload-error">⚠️ {uploadError}</div>}

        {/* Pending accounts can read the channel but not post in it */}
        {isMember ? (
          <ChatInputBar
            value={msgInput}
            onChange={handleInputChange}
            onSubmit={handleSend}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            pendingFile={pendingFile}
            onFileSelect={handleFileSelect}
            onRemoveFile={() => { setPendingFile(null); setUploadError('') }}
            channel={activeChannel}
            hasChannel={hasChannel}
            connected={connected}
            isUploading={isUploading}
            canSend={canSend}
          />
        ) : (
          <div className="read-only-bar">
            Your account needs admin approval before you can send messages.
          </div>
        )}
      </div>
    </div>
  )
}
