// ── Avatar ─────────────────────────────────────────────────────────────
// Shows a user's profile photo, falling back to the first letter of their
// username. Colour-coded by role via the avatar-<role> class.
//
// IMPORTANT: this always renders a <div> wrapper, with the <img> inside it,
// rather than swapping between <div> and <img>. React reuses DOM nodes when
// the element type matches, and switching types between messages used to
// leak one person's photo onto another person's bubble.

import { useState } from 'react'
import { resolveMediaUrl } from '../../lib/media'

export default function Avatar({ avatarUrl, username, role, size = 38, onClick, className = '' }) {
  // Set when the image 404s (deleted file, bad path) so we drop to initials.
  const [imgFailed, setImgFailed] = useState(false)

  const fullUrl = resolveMediaUrl(avatarUrl)
  const showImage = fullUrl && !imgFailed
  const initial = username?.[0]?.toUpperCase() || '?'

  return (
    <div
      className={`message-avatar avatar-${role} ${className}`}
      onClick={onClick}
      title={username}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,   // Scales the initial with the circle
        flexShrink: 0,
        borderRadius: '50%',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {showImage
        ? <img
            src={fullUrl}
            alt={username}
            className="msg-avatar-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            onError={() => setImgFailed(true)}
          />
        : initial}
    </div>
  )
}
