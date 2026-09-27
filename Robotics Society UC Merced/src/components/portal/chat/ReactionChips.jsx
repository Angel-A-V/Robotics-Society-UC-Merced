// ── Reaction Chips ─────────────────────────────────────────────────────
// The row of existing reactions shown under a message. One chip per emoji
// with a count; your own reactions get the "mine" highlight.
// Clicking a chip toggles your reaction off or on.

import { groupReactions } from '../../../lib/chat'

export default function ReactionChips({ message, currentUser, onReact, canReact }) {
  const grouped = groupReactions(message.reactions, currentUser)
  if (grouped.length === 0) return null

  return (
    <div className="reaction-bar">
      {grouped.map(({ emoji, count, users, mine }) => (
        <button
          key={emoji}
          className={`reaction-chip ${mine ? 'mine' : ''}`}
          onClick={() => canReact && onReact(message.id, emoji)}
          title={users.join(', ')}
          disabled={!canReact}
        >
          {emoji} <span className="reaction-count">{count}</span>
        </button>
      ))}
    </div>
  )
}
