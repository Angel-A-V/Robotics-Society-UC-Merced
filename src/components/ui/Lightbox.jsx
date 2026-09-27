// ── Lightbox ───────────────────────────────────────────────────────────
// Full-screen image viewer for chat attachments.
// Closes on Escape, on a click outside the image, or via the X button.

import { useEscapeKey } from '../../hooks/useEscapeKey'

export default function Lightbox({ src, alt, onClose }) {
  useEscapeKey(onClose)

  return (
    // Clicking the dark backdrop closes; stopPropagation keeps clicks on the
    // image itself from bubbling up and closing it.
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          <i className="fi fi-rr-cross-small" />
        </button>
        <img src={src} alt={alt} className="lightbox-img" />
        <a href={src} download={alt} className="lightbox-download"
          target="_blank" rel="noopener noreferrer">↓ Download</a>
      </div>
    </div>
  )
}
