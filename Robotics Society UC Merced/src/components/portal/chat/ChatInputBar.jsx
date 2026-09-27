// ── Chat Input Bar ─────────────────────────────────────────────────────
// The composer: attach button, auto-growing textarea and send button.
// Members only — pending accounts get the read-only bar instead.
//
// Enter sends, Shift+Enter starts a new line.

import { CHAT_FILE_ACCEPT, CHAT_INPUT_MAX_HEIGHT } from '../../../lib/config'
import AttachmentPreview from './AttachmentPreview'

// Grows the textarea to fit its content, up to a cap, then scrolls.
function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, CHAT_INPUT_MAX_HEIGHT) + 'px'
  el.style.overflowY = el.scrollHeight > CHAT_INPUT_MAX_HEIGHT ? 'auto' : 'hidden'
}

export default function ChatInputBar({
  value, onChange, onSubmit,
  textareaRef, fileInputRef,
  pendingFile, onFileSelect, onRemoveFile,
  channel, hasChannel, connected, isUploading, canSend,
}) {
  // Placeholder doubles as connection feedback.
  const placeholder =
    !hasChannel  ? 'No channel selected'
    : pendingFile ? 'Add a message (optional)...'
    : connected   ? `Message #${channel?.name}...`
    : 'Reconnecting...'

  return (
    <div className="chat-input-area">
      {pendingFile && <AttachmentPreview file={pendingFile} onRemove={onRemoveFile} />}

      <form className="chat-input-bar" onSubmit={onSubmit}>
        {/* Hidden native picker, opened by the paperclip button */}
        <input ref={fileInputRef} type="file" accept={CHAT_FILE_ACCEPT}
          style={{ display: 'none' }}
          onChange={e => { onFileSelect(e.target.files[0]); e.target.value = '' }} />

        <button type="button" className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={!connected || isUploading} title="Attach file">
          <i className={isUploading ? 'fi fi-sr-hourglass-end' : 'fi fi-sr-file'} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-text-input"
          rows={1}
          placeholder={placeholder}
          value={value}
          onChange={e => { onChange(e); autoResize(e.target) }}
          disabled={!channel || !connected}
          autoComplete="off"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e) }
          }}
        />

        <button type="submit" className="btn btn-primary chat-send-btn" disabled={!canSend}>
          {isUploading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
