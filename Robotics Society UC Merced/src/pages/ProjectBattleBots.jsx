import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

// Back button that returns to homepage #projects section (not top of page)
function BackBtn() {
  const navigate = useNavigate()
  return (
    <button className="back-link" onClick={() => navigate('/#projects')}>
      ← All Projects
    </button>
  )
}


export default function ProjectBattleBots({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{ background: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 50%, #1a0505 100%)' }} />
        <div className="project-hero-content">
          <div className="project-hero-nav">
            <BackBtn />
            <div className="project-badge" style={{ borderColor: '#DC1111', color: '#DC1111', background: 'rgba(220,17,17,0.1)' }}>Waiting On INFO</div>
          </div>
          <h1>BattleBots</h1>
          <p>Information on this project has yet to be given unfortunately.</p>
          <div className="tech-tags">
            {['N/A'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="project-hero-visual">
          <div className="project-icon-large" style={{ alignSelf: "center" }}><i class="fi fi-sr-two-swords"></i></div>
        </div>
      </div>

      <div className="project-body">
        <div className="project-section">
          <h2>Overview</h2>
          <p>
            Information on this project has yet to be given unfortunately.</p>
          <p style={{ marginTop: 16 }}>
          
          </p>
        </div>

        {/* <div className="project-section">
          <h2>Weight Classes</h2>
          <div className="arch-grid">
            {[
              { icon: '🪲', title: '1lb Antweight', desc: 'Ultra-compact bot. Every gram counts. Focus on precision machining and reliable electronics in a tiny package.' },
              { icon: '🦖', title: '12–15lb Beetleweight', desc: 'More room for powerful weapon systems and reinforced armor. Higher stakes, higher energy.' },
              { icon: '⚙️', title: 'Weapon Systems', desc: 'We experiment with spinners, lifters, and wedge designs depending on the competition meta.' },
              { icon: '🛡', title: 'Armor Design', desc: 'Material selection is critical — HDPE, aluminum, and titanium are commonly used depending on impact zones.' },
            ].map(a => (
              <div className="arch-card" key={a.title}>
                <div className="arch-icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="project-section">
          <h2>Build Timeline</h2>
          <div className="timeline">
            {[
              { date: 'Sep 2024', title: 'Design Phase', desc: 'CAD models created in SolidWorks, stress testing simulated, weight budget allocated', done: true },
              { date: 'Oct 2024', title: 'Fabrication', desc: 'Chassis CNC machined, 3D printed parts produced, electronics sourced and tested', done: true },
              { date: 'Nov 2024', title: 'Assembly & Wiring', desc: 'Full bot assembled, drive and weapon ESCs programmed, radio bound', done: true },
              { date: 'Jan 2025', title: 'Test Box Runs', desc: 'Weapon speed tests, drive reliability, damage assessment and repairs', done: true },
              { date: 'Spring 2025', title: 'Competition Entry', desc: 'Regional BattleBots competition — full combat conditions', done: false },
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
        </div> */}

        {/* <div className="project-section">
          <h2>Team</h2>
          <div className="team-grid-sm">
            {[
              { name: 'TBD', role: 'Combat Lead', emoji: '⚔️' },
              { name: 'TBD', role: 'Mechanical Design', emoji: '🔧' },
              { name: 'TBD', role: 'Electronics', emoji: '⚡' },
            ].map(m => (
              <div className="team-card-sm" key={m.role}>
                <div className="team-avatar-sm">{m.emoji}</div>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="project-section">
          <h2>Demo</h2>
          <div className="video-placeholder">
            <div className="video-inner">
              <div style={{ fontSize: 48 }}>▶</div>
              <p>Competition footage — coming soon</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackBtn />
        </div> */}
      </div>
    </div>
  )
}