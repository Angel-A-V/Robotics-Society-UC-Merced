// ── Message List ───────────────────────────────────────────────────────
// The scrolling message area, including the empty state.
//
// The scroll container ref is owned by ChatTab, which handles "stick to the
// bottom unless the user has scrolled up to read history".

import MessageItem from './MessageItem'

export default function MessageList({
  listRef, messages, currentUser, isAdmin, isMember, connected, hasChannel,
  onReact, onDelete, onOpenProfile, onOpenLightbox, onImageLoad,
}) {
  return (
    <div className="messages-list" ref={listRef}>
      {/* ── Empty state ── wording depends on why there is nothing here ── */}
      {messages.length === 0 && (
        <div className="empty-state">
          {!hasChannel
            ? 'Select a channel to start chatting.'
            : connected
              ? (isMember ? 'No messages yet — say hello! 👋' : 'No messages yet.')
              : 'Connecting to chat...'}
        </div>
      )}

      {messages.map((msg, i) => (
        // Live messages always have an id; the index fallback only covers
        // the brief window before the server assigns one.
        <MessageItem
          key={msg.id ?? `msg-${i}`}
          msg={msg}
          currentUser={currentUser}
          isAdmin={isAdmin}
          isMember={isMember}
          onReact={onReact}
          onDelete={onDelete}
          onOpenProfile={onOpenProfile}
          onOpenLightbox={onOpenLightbox}
          onImageLoad={onImageLoad}
        />
      ))}
    </div>
  )
}
