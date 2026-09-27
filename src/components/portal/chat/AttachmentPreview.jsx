// ── Attachment Preview ─────────────────────────────────────────────────
// The chip above the input bar showing the file you are about to send,
// with a thumbnail for images. Sits between picking a file and sending it.

import { useState, useEffect } from 'react'
import { isImageFile, formatFileSize } from '../../../lib/media'

export default function AttachmentPreview({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null)

  // Build a local preview URL for images, and revoke it on cleanup so the
  // browser can release the memory.
  useEffect(() => {
    if (!file || !isImageFile(file.name)) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!file) return null

  return (
    <div className="attachment-preview">
      {previewUrl
        ? <img src={previewUrl} alt={file.name} className="attachment-thumb" />
        : <div className="attachment-file-icon">
            <i className={file.name.endsWith('.pdf') ? 'fi fi-rr-file-pdf' : 'fi fi-rr-clip'} />
          </div>}

      <span className="attachment-name">{file.name}</span>
      <span className="attachment-size">({formatFileSize(file.size)})</span>

      <button className="attachment-remove" onClick={onRemove} title="Remove">
        <i className="fi fi-rr-cross-small" />
      </button>
    </div>
  )
}
