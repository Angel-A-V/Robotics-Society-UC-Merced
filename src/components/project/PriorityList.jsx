// ── Priority List ──────────────────────────────────────────────────────
// Numbered list of what a project team is working on, in order.
// Takes a plain array of strings, e.g. PRIORITIES from a project data file.
//
// Styles: .priority-list in styles/pages/project-detail.css

export default function PriorityList({ items }) {
  if (!items?.length) return null

  return (
    <ol className="priority-list">
      {items.map((text, i) => (
        <li key={i}>
          <span className="priority-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="priority-text">{text}</span>
        </li>
      ))}
    </ol>
  )
}
