// ── File Attachment ────────────────────────────────────────────────────
// Renders an uploaded file inside a chat message. Images show inline and
// open the lightbox when clicked; anything else becomes a download card.

import { resolveMediaUrl, isImageFile } from '../../../lib/media'

export default function FileAttachment({ fileUrl, fileName, fileType, onImageLoad, onLightbox }) {
  if (!fileUrl) return null

  const fullUrl = resolveMediaUrl(fileUrl)
  // Trust the server's file_type, but fall back to the extension for older
  // messages saved before file_type existed.
  const showAsImage = fileType === 'image' || isImageFile(fileName)

  // ── Inline image ──
  if (showAsImage) {
    return (
      <div className="msg-image-wrap">
        <img
          src={fullUrl}
          alt={fileName || 'image'}
          className="msg-image"
          loading="lazy"
          // Images load after the message, changing the list height — this
          // re-pins the scroll to the bottom once the image has its size.
          onLoad={onImageLoad}
          onClick={() => onLightbox?.(fullUrl, fileName)}
          title="Click to view full size"
          // Hide broken images rather than showing a torn-page icon
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
    )
  }

  // ── Download card (PDF, doc, txt, ...) ──
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer"
      download={fileName} className="msg-file-card">
      <span className="msg-file-icon">
        <i className={fileType === 'pdf' ? 'fi fi-rr-file-pdf' : 'fi fi-rr-clip'} />
      </span>
      <span className="msg-file-name">{fileName}</span>
      <span className="msg-file-dl">↓</span>
    </a>
  )
}
