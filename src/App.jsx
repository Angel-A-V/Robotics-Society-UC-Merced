import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ProjectBattleBots from './pages/ProjectBattleBots'
import ProjectRallyKart from './pages/ProjectRallyCart'
import ProjectRobotArm from './pages/ProjectRobotArm'
import ProjectAutonomousRobot from './pages/ProjectAutonomousRobot'
import Login from './pages/Login'
import Register from './pages/Register'
import Portal from './pages/Portal'
import Contact from './pages/Contact'
import './index.css'
import { API_BASE } from './api'

// ScrollToTop scrolls window to 0 on every route change UNLESS there's a hash (like #projects)
// This fixes: clicking Home tab goes to top, clicking back from project goes to top
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      // No hash anchor — scroll to top of page
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      // Has a hash like #projects — scroll to that element after a tick
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // When the app first loads, check if there's already a token saved
    // This keeps the user logged in after a page refresh
    const token = localStorage.getItem('access_token')
    if (!token) return  // No token, nothing to do

    // Verify the token is still valid by hitting /api/auth/me
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data.user)         // Token valid — restore the user session
        else localStorage.removeItem('access_token')  // Token expired — clear it
      })
      .catch(() => {})  // Server not running yet, fail silently
  }, [])  // Empty array means this only runs once when the app first mounts

  // Pass this to Navbar so the logout button works
  const handleLogout = () => {
    localStorage.removeItem('access_token')   // Delete the stored token
    localStorage.removeItem('refresh_token')
    setUser(null)                             // Clear user from React state
  }

  return (
    <Router>
      {/* ScrollToTop runs on every navigation — handles scroll-to-top vs scroll-to-anchor */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} handleLogout={handleLogout} />} />
        <Route path="/projects/battlebots" element={<ProjectBattleBots user={user} handleLogout={handleLogout} />} />
        <Route path="/projects/rally-kart" element={<ProjectRallyKart user={user} handleLogout={handleLogout} />} />
        <Route path="/projects/robot-arm" element={<ProjectRobotArm user={user} handleLogout={handleLogout} />} />
        <Route path="/projects/autonomous-robot" element={<ProjectAutonomousRobot user={user} handleLogout={handleLogout} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/portal" element={<Portal user={user} setUser={setUser} handleLogout={handleLogout} />} />
        <Route path="/contact" element={<Contact user={user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  )
}