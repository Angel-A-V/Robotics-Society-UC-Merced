// ── Media Helpers ──────────────────────────────────────────────────────
// The backend stores uploads as relative paths (/media/avatars/user_1.png)
// rather than absolute URLs, so moving to cloud storage later only means
// changing API_BASE instead of rewriting every database row.
// These helpers turn those stored paths into something <img src> can use.

import { API_BASE, IMAGE_EXTENSIONS } from './config'

// Turns a stored path into a loadable URL. Already-absolute URLs are left
// alone so external images keep working.
export function resolveMediaUrl(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `${API_BASE}${path}`
}

// Decides whether a filename should render inline as an image. Used as a
// fallback when the server did not report a file_type.
export function isImageFile(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

// "12 KB" for the attachment preview chip.
export function formatFileSize(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`
}
