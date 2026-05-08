import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

function BackBtn() {
  const navigate = useNavigate()
  return <button className="back-link" onClick={() => navigate('/#projects')}>← All Projects</button>
}

export default function ProjectRallyCart({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{ background: 'linear-gradient(135deg, #1a1000 0%, #3d2a00 50%, #1a1400 100%)' }} />
        <div className="project-hero-content">
          <BackBtn />
          <div className="project-badge" style={{ borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>In Progress</div>
          <h1>Rally Cart</h1>
          <p>Placeholder</p>
          <div className="tech-tags">
            {['Embedded Systems', 'CAN Bus', 'Path Planning', 'Sensor Fusion', 'Motor Control'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="project-hero-visual">
          <div className="project-icon-large">🏎️</div>
        </div>
      </div>

      <div className="project-body">
        <div className="project-section">
          <h2>Overview</h2>
          <p>
            The Rally Cart project takes a standard electric go-kart and retrofits it with an autonomous
            control stack. The vehicle must navigate a defined course without human input, using onboard
            sensors for localization and obstacle detection. It serves as a real-world platform for
            testing control algorithms that would otherwise only run in simulation.
          </p>
          <p style={{ marginTop: 16 }}>
            A key engineering challenge is the safety override system — a physical deadman switch and
            software watchdog that immediately restores manual control if the autonomous system
            behaves unexpectedly. Safety is the first requirement, performance is second.
          </p>
        </div>

        <div className="project-section">
          <h2>Systems</h2>
          <div className="arch-grid">
            {[
              { icon: '🎮', title: 'Drive-by-Wire', desc: 'Steering, throttle, and braking fully actuated electronically via servo and motor controllers' },
              { icon: '📡', title: 'Localization', desc: 'GPS + IMU fusion provides position estimates accurate enough for course navigation' },
              { icon: '🛡', title: 'Safety Override', desc: 'Hardware and software emergency stop returns immediate manual control to the driver' },
              { icon: '💻', title: 'Onboard Compute', desc: 'Raspberry Pi + microcontroller stack handles sensing, planning, and low-level control' },
            ].map(a => (
              <div className="arch-card" key={a.title}>
                <div className="arch-icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="project-section">
          <h2>Timeline</h2>
          <div className="timeline">
            {[
              { date: 'Oct 2024', title: 'Kart Acquisition', desc: 'Electric go-kart platform obtained and stripped down for modification', done: true },
              { date: 'Nov 2024', title: 'Drive-by-Wire', desc: 'Steering servo and throttle actuator installed, basic electronic control working', done: true },
              { date: 'Jan 2025', title: 'Sensor Integration', desc: 'GPS and IMU mounted, CAN bus communication between controllers established', done: false },
              { date: 'Mar 2025', title: 'Autonomous Lap', desc: 'First fully autonomous lap of a fixed course', done: false },
              { date: 'May 2025', title: 'Demo Day', desc: 'Live autonomous driving demonstration for club showcase', done: false },
            ].map((item, i) => (
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
        </div>

        <div className="project-section">
          <h2>Team</h2>
          <div className="team-grid-sm">
            {[
              { name: 'TBD', role: 'Project Lead', emoji: '🏎️' },
              { name: 'TBD', role: 'Electrical', emoji: '⚡' },
              { name: 'TBD', role: 'Software', emoji: '💻' },
            ].map(m => (
              <div className="team-card-sm" key={m.role}>
                <div className="team-avatar-sm">{m.emoji}</div>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 48, textAlign: 'center' }}><BackBtn /></div>
      </div>
    </div>
  )
}
