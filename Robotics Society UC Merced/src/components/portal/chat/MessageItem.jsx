// ── Message Item ───────────────────────────────────────────────────────
// One chat message: avatar, name, time, text, attachment and reactions.
//
// When `msg.grouped` is true this message follows another from the same
// person within a few minutes, so the avatar and name header are replaced
// by a blank spacer to keep the text aligned.

import Avatar from '../../ui/Avatar'
import FileAttachment from './FileAttachment'
import ReactionChips from './ReactionChips'
import ReactionAddButton from './ReactionAddButton'
import { formatTime } from '../../../lib/format'

export default function MessageItem({
  msg, currentUser, isAdmin, isMember,
  onReact, onDelete, onOpenProfile, onOpenLightbox, onImageLoad,
}) {
  // You can delete your own messages; admins can delete anyone's.
  const canDelete = isAdmin || currentUser.username === msg.username

  return (
    <div className={`message ${msg.grouped ? 'message-grouped' : ''} msg-enter`}>
      {/* ── Avatar, or a spacer for grouped messages ── */}
      {msg.grouped ? (
        <div className="message-avatar-gap" style={{ width: 38, height: 1, flexShrink: 0 }} />
      ) : (
        <Avatar avatarUrl={msg.avatar_url} username={msg.username} role={msg.role}
          size={38} onClick={() => onOpenProfile(msg.username)} />
      )}

      <div className="message-body">
        {/* ── Name + time header, hidden on grouped messages ── */}
        {!msg.grouped && (
          <div className="message-meta">
            <strong
              className={`message-username role-color-${msg.role} clickable-username`}
              onClick={() => onOpenProfile(msg.username)}
              title={`View ${msg.username}'s profile`}
            >
              {msg.username}
            </strong>
            {msg.role === 'admin' && <span className="msg-role-badge">admin</span>}
            <span className="message-time">{formatTime(msg.created_at)}</span>
          </div>
        )}

        {msg.content && <div className="message-content">{msg.content}</div>}

        <FileAttachment
          fileUrl={msg.file_url} fileName={msg.file_name} fileType={msg.file_type}
          onImageLoad={onImageLoad} onLightbox={onOpenLightbox}
        />

        <ReactionChips message={msg} currentUser={currentUser.username}
          onReact={onReact} canReact={isMember} />
      </div>

      {/* ── Hover actions ──
          Only for saved messages: a message still waiting on its server id
          cannot be reacted to or deleted yet. */}
      {msg.id && (
        <div className="message-actions">
          {isMember && <ReactionAddButton message={msg} onReact={onReact} />}
          {canDelete && (
            <button className="msg-action-btn danger"
              onClick={() => onDelete(msg.id, msg.username)}
              title="Delete message">
              <i className="fi fi-ss-trash" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
