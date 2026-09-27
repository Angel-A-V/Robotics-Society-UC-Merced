// ── Project Section ────────────────────────────────────────────────────
// One titled block in a project page body. Keeps the heading markup
// consistent across all four project pages.

export default function ProjectSection({ title, children }) {
  return (
    <div className="project-section">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
