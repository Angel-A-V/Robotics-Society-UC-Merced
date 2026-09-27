// ── Timeline ───────────────────────────────────────────────────────────
// Vertical development timeline. Items with `done: true` get the completed
// styling (filled dot, brighter text).

export default function Timeline({ items }) {
  if (!items?.length) return null

  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div className={`timeline-item ${item.done ? 'done' : ''}`} key={i}>
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-date">{item.date}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
