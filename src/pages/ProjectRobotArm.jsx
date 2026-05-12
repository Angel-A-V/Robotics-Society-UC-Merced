import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import TrevorPhoto from '../assets/team/Trevor.jpg'

function BackBtn() {
  const navigate = useNavigate()
  return (
    <button className="back-link" onClick={() => navigate('/#projects')}>
      ← All Projects
    </button>
  )
}

const leads = [
  {
    photo: TrevorPhoto,
    name: 'Trevor',
    role: 'Project Lead',
    badge: <i className="fi fi-sr-tools"></i>,
    photoPos: 'center 20%',
    bio: 'Responsible for overall project architecture, CAD development, embedded programming, computer vision integration, machine learning systems, calculations, procurement, and full system assembly.',
    fact: 'The idea for this project originated from Trevor and his tennis teammates who wanted to design a robotic system capable of autonomous ball feeding.',
  },
]

const systems = [
  {
    icon: <i className="fi fi-sr-camera"></i>,
    title: 'Vision Input',
    desc: 'An anchored camera system provides visual input using OpenCV-based target detection and environmental awareness. The pipeline enables target tracking, payload recognition, and aiming assistance.',
  },
  {
    icon: <i className="fi fi-rs-brain-circuit"></i>,
    title: 'Machine Learning',
    desc: 'Reward-based machine learning systems evaluate throwing accuracy and motion efficiency. Successful throws reinforce optimal movement patterns, improving repeatability and targeting performance over time.',
  },
  {
    icon: <i className="fi fi-sr-settings"></i>,
    title: 'Inverse Kinematics',
    desc: 'Inverse kinematics algorithms coordinate each motor and joint throughout the robotic arm chain to generate smooth, optimized, and repeatable throwing motions with mechanical stability.',
  },
  {
    icon: <i className="fi fi-sr-ruler-triangle"></i>,
    title: 'Mechanical Systems',
    desc: 'The arm utilizes servo-driven joints, structural linkages, and a custom gripper and end-effector system engineered for controlled payload release and reliable mechanical performance.',
  },
]

const timeline = [
  {
    date: 'September 2026',
    title: 'Mechanical Assembly',
    desc: 'Robot arm structure assembled and validated for basic joint movement, servo control, and foundational kinematic testing',
    done: true,
  },
  {
    date: 'Late September 2026',
    title: 'Vision System Integration',
    desc: 'Raspberry Pi and camera systems integrated with OpenCV configured for live video streaming and environmental input processing',
    done: false,
  },
  {
    date: 'October 2026',
    title: 'Target Detection and Learning Systems',
    desc: 'Target classification, payload tracking, and reward-based machine learning systems developed for autonomous throwing evaluation',
    done: false,
  },
  {
    date: 'November 2026',
    title: 'Inverse Kinematics and Throwing',
    desc: 'Inverse kinematics algorithms integrated with full arm coordination and controlled object throwing functionality',
    done: false,
  },
  {
    date: 'January 2027',
    title: 'Full Autonomous Demonstration',
    desc: 'Robot arm autonomously detects targets and performs adaptive throwing operations with variable speed and distance control',
    done: false,
  },
]

export default function ProjectRobotArm({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero Banner ── */}
      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{ background: 'linear-gradient(135deg, #001a0a 0%, #003d18 50%, #001a0a 100%)' }} />
        <div className="project-hero-content">
          <div className="project-hero-nav">
            <BackBtn />
            <div className="project-badge" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>Pending Approval</div>
          </div>
          <h1>Robot Arm</h1>
          <p>A 6-DOF robotic arm engineered to autonomously identify targets, calculate optimal trajectories, and execute precise throwing motions using computer vision, inverse kinematics, and machine learning</p>
          <div className="tech-tags">
            {['OpenCV', 'Inverse Kinematics', 'Machine Learning', 'Servo Control', 'Raspberry Pi', 'Python'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="project-hero-visual">
          <div className="project-icon-large" style={{ alignSelf: 'center' }}><i class="fi fi-rs-robotic-arm"></i></div>
        </div>
      </div>

      <div className="project-body">

        {/* ── Overview ── */}
        <div className="project-section">
          <h2>Overview</h2>
          <p>
            The Robot Arm Project focuses on developing a high-precision 6-degree-of-freedom robotic arm
            capable of replicating complex human-style throwing motions through the integration of computer
            vision, inverse kinematics, and machine learning systems.
          </p>
          <p style={{ marginTop: 16 }}>
            The platform is being engineered to autonomously identify targets, calculate optimal
            trajectories, and execute repeatable throwing motions with controlled speed and accuracy.
            The long-term objective is to create a robotic system capable of adaptive targeting and motion
            refinement through reinforcement-based learning techniques.
          </p>
          <p style={{ marginTop: 16 }}>
            The robotic arm utilizes a multi-axis servo-driven architecture paired with a custom gripper
            and end-effector system specifically designed for stable payload handling and controlled release.
            The project combines mechanical engineering, embedded systems, software development, and
            artificial intelligence into a unified robotics platform.
          </p>
          <div className="rally-kart-goal">
            <span className="rally-kart-goal-icon"><i className="fi fi-rs-archery"></i></span>
            <p>
              The goal is to create an intelligent robotic throwing platform capable of combining
              perception, learning, and precise mechanical control into a fully autonomous system.
            </p>
          </div>
        </div>

        {/* ── Systems ── */}
        <div className="project-section">
          <h2>Systems</h2>
          <div className="arch-grid">
            {systems.map(s => (
              <div className="arch-card" key={s.title}>
                <div className="arch-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="project-section">
          <h2>Development Timeline</h2>
          <div className="timeline">
            {timeline.map((item, i) => (
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

        {/* ── Project Lead ── */}
        <div className="project-section">
          <h2>Project Lead</h2>
          <div className="leads-grid">
            {leads.map(lead => (
              <div className="lead-card" key={lead.name}>
                <div className="lead-photo-wrap">
                  <img src={lead.photo} alt={lead.name} className="lead-photo"
                    style={{ objectPosition: lead.photoPos }} />
                  <div className="lead-badge-icon">{lead.badge}</div>
                </div>
                <div className="lead-info">
                  <div className="lead-role-tag">{lead.role}</div>
                  <h3 className="lead-name">{lead.name}</h3>
                  <p className="lead-bio">{lead.bio}</p>
                  <div className="lead-fact">
                    <span className="lead-fact-label">Fun Fact</span>
                    <span className="lead-fact-text">{lead.fact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Demo ── */}
        <div className="project-section">
          <h2>Demo</h2>
          <div className="demo-pending">
            <div className="demo-pending-icon"><i className="fi fi-sr-hourglass-end"></i></div>
            <h3 className="demo-pending-title">Demo Pending</h3>
            <p className="demo-pending-sub">
              This project is currently in active development. A demonstration video and build
              gallery will be published here once the system reaches a testable milestone.
            </p>
            <div className="demo-pending-badge">In Development — Check Back Soon</div>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackBtn />
        </div>
      </div>
    </div>
  )
}