// ── Chat Header ────────────────────────────────────────────────────────
// The bar above the messages: channel name, description, live/connecting
// indicator, and a read-only badge for users awaiting approval.

export default function ChatHeader({ channel, connected, hasChannel, isPending }) {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <strong className="chat-channel-name">#{channel?.name || 'Select a channel'}</strong>
        {channel?.description && <span className="chat-desc">{channel.description}</span>}
      </div>

      <div className="chat-header-right">
        {/* Only meaningful once a channel exists to connect to */}
        {hasChannel && (
          <span className={`ws-status ${connected ? 'ws-connected' : 'ws-connecting'}`}>
            <span className="ws-dot" />{connected ? 'Live' : 'Connecting...'}
          </span>
        )}
        {isPending && (
          <span className="read-only-badge"><i className="fi fi-rs-eye" /> Read Only</span>
        )}
      </div>
    </div>
  )
}
