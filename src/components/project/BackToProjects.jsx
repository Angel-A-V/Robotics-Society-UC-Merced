// ── Back To Projects ───────────────────────────────────────────────────
// Returns to the projects grid on the homepage rather than the top of the
// page, so you land back where you clicked in from.

import { useNavigate } from 'react-router-dom'

export default function BackToProjects() {
  const navigate = useNavigate()
  return (
    <button className="back-link" onClick={() => navigate('/#projects')}>
      ← All Projects
    </button>
  )
}
