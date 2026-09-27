// ── Reaction Add Button ────────────────────────────────────────────────
// The "+" smiley in a message's hover action bar. Opens a picker with the
// common emoji, plus a free-text box so any emoji can be used.

import { useState, useRef } from 'react'
import { RECOMMENDED_EMOJIS } from '../../../lib/config'

export default function ReactionAddButton({ message, onReact }) {
  const [showPicker, setShowPicker]   = useState(false)
  const [customEmoji, setCustomEmoji] = useState('')
  const inputRef = useRef(null)

  const react = (emoji) => {
    onReact(message.id, emoji)
    setShowPicker(false)
    setCustomEmoji('')
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const emoji = customEmoji.trim()
    if (emoji) react(emoji)
  }

  return (
    <div className="reaction-add-wrap">
      <button
        className="msg-action-btn"
        // Short delay so the input exists in the DOM before we focus it
        onClick={() => { setShowPicker(p => !p); setTimeout(() => inputRef.current?.focus(), 50) }}
        title="Add reaction"
      >
        <i className="fi fi-rr-smile-plus" />
      </button>

      {showPicker && (
        <div className="emoji-picker emoji-picker-actions">
          {/* ── Quick picks ── */}
          <div className="emoji-recommended">
            {RECOMMENDED_EMOJIS.map(emoji => (
              <button key={emoji} className="emoji-option" onClick={() => react(emoji)}>
                {emoji}
              </button>
            ))}
          </div>

          {/* ── Any other emoji ── */}
          <form className="emoji-custom-form" onSubmit={handleCustomSubmit}>
            <input
              ref={inputRef}
              className="emoji-custom-input"
              value={customEmoji}
              onChange={e => setCustomEmoji(e.target.value)}
              placeholder="Type any emoji…"
              maxLength={8}
            />
            <button type="submit" className="emoji-custom-submit">React</button>
          </form>
        </div>
      )}
    </div>
  )
}
