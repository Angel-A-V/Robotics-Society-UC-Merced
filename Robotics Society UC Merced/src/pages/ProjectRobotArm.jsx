import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

function BackBtn() {
  const navigate = useNavigate()
  return <button className="back-link" onClick={() => navigate('/#projects')}>← All Projects</button>
}

export default function ProjectRobotArm({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{ background: 'linear-gradient(135deg, #001a0a 0%, #003d18 50%, #001a0a 100%)' }} />
        <div className="project-hero-content">
          <BackBtn />
          <div className="project-badge" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>Active Project</div>
          <h1>Robot Arm (CSV)</h1>
          <p>Vision-guided robotic arm that sorts objects using ML classification</p>
          <div className="tech-tags">
            {['OpenCV', 'Servo Control', 'Python', 'TensorFlow', 'Raspberry Pi'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="project-hero-visual">
          <div className="project-icon-large">🦾</div>
        </div>
      </div>

      <div className="project-body">
        <div className="project-section">
          <h2>Overview</h2>
          <p>
            The CSV (Computer-vision Sorting Vehicle... arm) project is a multi-joint robotic arm that uses
            a mounted camera and a machine learning model to identify objects on a surface, determine their
            category, and physically move them to the correct location. Think of it as an automated sorting
            line powered by computer vision.
          </p>
          <p style={{ marginTop: 16 }}>
            The arm is built from servo-driven joints with a custom gripper end-effector. The camera
            pipeline runs YOLO-based detection at real-time frame rates, and inverse kinematics
            translates pixel coordinates into joint angles for precise pick-and-place operation.
          </p>
        </div>

        <div className="project-section">
          <h2>Pipeline</h2>
          <div className="arch-grid">
            {[
              { icon: '📷', title: 'Vision Input', desc: 'Top-mounted RGB camera streams video — OpenCV handles preprocessing and ROI cropping' },
              { icon: '🧠', title: 'ML Classification', desc: 'Lightweight YOLO model classifies object type and orientation in real time' },
              { icon: '📐', title: 'Inverse Kinematics', desc: 'Target pixel coords converted to 3D workspace position, then IK solver computes joint angles' },
              { icon: '🤏', title: 'Pick & Place', desc: 'Servo arm moves to target, grips object, and deposits it in the correct bin' },
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
              { date: 'Sep 2024', title: 'Arm Assembly', desc: '5-DOF servo arm built, basic forward kinematics tested', done: true },
              { date: 'Oct 2024', title: 'Camera Setup', desc: 'Raspberry Pi camera module integrated, OpenCV streaming working', done: true },
              { date: 'Nov 2024', title: 'Object Detection', desc: 'YOLO model trained on target object classes, running at 15fps on Pi', done: true },
              { date: 'Feb 2025', title: 'IK + Grasping', desc: 'Inverse kinematics integrated, successful pick-and-place on known objects', done: false },
              { date: 'May 2025', title: 'Full Sort Demo', desc: 'Arm sorts mixed objects into bins autonomously — live demo at showcase', done: false },
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
              { name: 'TBD', role: 'Project Lead', emoji: '🦾' },
              { name: 'TBD', role: 'ML Engineer', emoji: '🧠' },
              { name: 'TBD', role: 'Mechanical', emoji: '🔧' },
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
