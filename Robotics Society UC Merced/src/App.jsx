// ── App ────────────────────────────────────────────────────────────────
// The router. This file does two things and nothing else:
//   1. Holds the logged-in user via useSession, and passes it down
//   2. Maps every URL to a page component
//
// Adding a page: create it in pages/, then add one <Route> below.
// Adding a project page: also add a card to data/projects.js, and make its
// `slug` match the path here.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ScrollToTop from './components/layout/ScrollToTop'
import { useSession } from './hooks/useSession'

import Home from './pages/Home'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Portal from './pages/Portal'

import BattleBots from './pages/projects/BattleBots'
import RallyKart from './pages/projects/RallyKart'
import RobotArm from './pages/projects/RobotArm'
import AutonomousRobot from './pages/projects/AutonomousRobot'

export default function App() {
  // One source of truth for "who is logged in", shared by every page.
  const { user, setUser, logout } = useSession()

  // Props every public page needs: the nav bar shows either Login/Join or
  // Portal/Logout depending on these.
  const pageProps = { user, handleLogout: logout }

  return (
    <Router>
      {/* Fixes scroll position on every navigation — renders nothing */}
      <ScrollToTop />

      <Routes>
        {/* ── Public site ── */}
        <Route path="/" element={<Home {...pageProps} setUser={setUser} />} />
        <Route path="/contact" element={<Contact {...pageProps} />} />

        {/* ── Project detail pages ── paths match the slugs in data/projects.js */}
        <Route path="/projects/battlebots"       element={<BattleBots {...pageProps} />} />
        <Route path="/projects/rally-kart"       element={<RallyKart {...pageProps} />} />
        <Route path="/projects/robot-arm"        element={<RobotArm {...pageProps} />} />
        <Route path="/projects/autonomous-robot" element={<AutonomousRobot {...pageProps} />} />

        {/* ── Auth ── these set the user on success ── */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* ── Members portal ── redirects to /login when not signed in ── */}
        <Route path="/portal"
          element={<Portal user={user} setUser={setUser} handleLogout={logout} />} />
      </Routes>
    </Router>
  )
}
