// ── Chat Data Helpers ──────────────────────────────────────────────────
// Pure functions that reshape message data for display. No React, no
// fetching — which makes them easy to reason about and easy to test.

import { MESSAGE_GROUP_WINDOW_MS } from './config'

// Marks each message with `grouped: true` when it was sent by the same
// person as the message above it, within the grouping window. Grouped
// messages hide the repeated avatar and name (Discord-style stacking).
export function groupMessages(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const sameAuthor = prev?.username === msg.username
    const withinTime = prev &&
      (new Date(msg.created_at) - new Date(prev.created_at)) < MESSAGE_GROUP_WINDOW_MS
    return { ...msg, grouped: sameAuthor && withinTime }
  })
}

// Collapses a flat reaction list into one entry per emoji:
//   [{emoji:'👍',username:'a'}, {emoji:'👍',username:'b'}]
//   → [{emoji:'👍', count:2, users:['a','b'], mine:false}]
// `mine` drives the highlighted chip for reactions you added yourself.
export function groupReactions(reactions = [], currentUser) {
  const byEmoji = new Map()
  for (const r of reactions) {
    if (!byEmoji.has(r.emoji)) {
      byEmoji.set(r.emoji, { emoji: r.emoji, count: 0, users: [], mine: false })
    }
    const entry = byEmoji.get(r.emoji)
    entry.count++
    entry.users.push(r.username)
    if (r.username === currentUser) entry.mine = true
  }
  return [...byEmoji.values()]
}

// Normalises a message from the REST history endpoint so it has the exact
// same shape as one arriving live over the WebSocket. Without this the two
// sources differ and fields like `reactions` flicker as they alternate.
export function normalizeMessage(msg) {
  return {
    id:         msg.id,
    content:    msg.content,
    username:   msg.username,
    role:       msg.role,
    avatar_url: msg.avatar_url,
    created_at: msg.created_at,
    file_url:   msg.file_url,
    file_name:  msg.file_name,
    file_type:  msg.file_type,
    reactions:  msg.reactions || [],
  }
}
