// ── Typing Indicator ───────────────────────────────────────────────────
// The animated dots above the input bar. Names one person, or says
// "several people" once more than one is typing.

export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null

  return (
    <div className="typing-indicator">
      <span className="typing-dots"><span /><span /><span /></span>
      <span className="typing-text">
        {typingUsers.length === 1
          ? <><strong>{typingUsers[0]}</strong> is typing...</>
          : 'Several people are typing...'}
      </span>
    </div>
  )
}
