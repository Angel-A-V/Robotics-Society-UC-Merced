import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from '../Navbar'
import rblogo from '../assets/rblogo.jpg'

// Real team member data with actual photos
import NatePhoto from '../assets/team/Nate.jpg'
import TrevorPhoto from '../assets/team/Trevor.jpg'
import TonyPhoto from '../assets/team/Tony.png'
import ParneethPhoto from '../assets/team/Parneeth.jpg'
import WindyPhoto from '../assets/team/Windy.jpg'
import AndrewPhoto from '../assets/team/Andrew.png'
import RallyLogoCard from '../assets/logos/rally.png'

const projects = [
  {
    slug: 'battlebots',
    title: 'BattleBots',
    desc: 'Information on this project has yet to be given unfortunately.',
    icon: <i class="fi fi-sr-two-swords"></i>,
    tags: ['N/A'],
    status: 'Waiting On INFO',
    color: '#DC1111',
  },
  {
    slug: 'rally-kart',
    title: 'Rally Kart',
    desc: 'A student-built single-seat rally platform featuring a custom tubular space-frame chassis, CAN bus electronics, custom dashboard, and a scalable drivetrain engineered for performance, safety, and future expandability.',
    icon: null,
    logoSrc: RallyLogoCard,
    tags: ['Chassis Design', 'CAN Bus', 'Electronics'],
    status: 'Active',
    color: '#f59e0b',
  },
  {
    slug: 'robot-arm',
    title: 'Robot Arm',
    desc: 'A computer vision-guided robotic arm that autonomously identifies, classifies, and sorts physical objects using a camera and machine learning pipeline.',
    icon: <i class="fi fi-rs-robotic-arm"></i>,
    tags: ['OpenCV', 'Inverse Kinematics', 'Machine Learning', 'Servo Control', 'Raspberry Pi', 'Python'],
    status: 'Pending Approval',
    color: '#10b981',
  },
  {
    slug: 'autonomous-robot',
    title: 'Autonomous Robot',
    desc: 'A ground-based autonomous platform powered by ROS 2, CAN bus motors, and computer vision, capable of person detection, tracking, and autonomous navigation.',
    icon: <i className="fi fi-sr-home-robot"></i>,
    tags: ['ROS 2', 'CAN Bus', 'Vision / ML'],
    status: 'Active',
    color: '#3b82f6',
  },
]

const team = [
  {
    name: 'Nathaniel',
    role: 'President',
    photo: NatePhoto,
    job: 'Ensures club operations run smoothly and handles club affairs',
    fact: 'I love to cook and bake',
  },
  {
    name: 'Trevor',
    role: 'Vice President',
    photo: TrevorPhoto,
    job: 'Ensures the board stays on track, covers internal issues, and handles club affairs',
    fact: 'I play tennis and help run the club on campus. My favorite robot is Wall-E',
  },
  {
    name: 'Tony',
    role: 'Treasurer',
    photo: TonyPhoto,
    job: 'Requests money from SAB and manages club finances',
    fact: 'I can do a pistol squat while riding a skateboard',
  },
  {
    name: 'Praneeth',
    role: 'Secretary',
    photo: ParneethPhoto,
    job: 'Oversees club internal affairs and maintains deadlines for the club',
    fact: 'I love Corvettes and McLarens',
  },
  {
    name: 'Windy',
    role: 'Project Manager',
    photo: WindyPhoto,
    job: 'Maintains contact with projects and project leads, keeping up-to-date info on progress and goals',
    fact: 'I have a big fluffy dog',
  },
  {
    name: 'Andrew',
    role: 'Public Representative',
    photo: AndrewPhoto,
    job: 'Creates posters, videos, and manages the public-facing presence of the club',
    fact: 'I enjoy arcade rhythm games',
  },
]

// AnimatedCard — fades+slides in when scrolled into view
function AnimatedCard({ children, className, delay = 0, onClick }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('card-visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`animated-card ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default function Home({ user, handleLogout }) {
  const navigate = useNavigate()

  return (
    <div className="page-home">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-content">
          <div className="hero-badge">UC Merced Robotics Society</div>
          <h1 className="hero-title">
            Building the<br />
            <span className="hero-accent">Machines</span> of<br />
            Tomorrow
          </h1>
          <p className="hero-sub">
              We design, engineer, and program advanced robotic systems ranging from autonomous platforms and intelligent robotic arms to high performance rally vehicles and combat robots. Join us and help shape the future of robotics at UC Merced.
          </p>
          <div className="hero-btns">
            <Link to="/register" className="btn btn-primary btn-lg">Join the Club →</Link>
            <a href="#projects" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-outline btn-lg">View Projects</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">4</span><span className="stat-label">Active Projects</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">20+</span><span className="stat-label">Members</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">6</span><span className="stat-label">Years Running</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orb" />
          <div className="hero-ring ring1" />
          <div className="hero-ring ring2" />
          <div className="hero-ring ring3" />
          {/* Real club logo in hero */}
          <div className="hero-logo-wrap">
            <img src={rblogo} alt="UCM Robotics Society" className="hero-logo-img" />
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="section" id="projects">
        <div className="section-label">What We Build</div>
        <h2 className="section-title">Our Projects</h2>
        <p className="section-sub">Real robots. Real engineering. Real results.</p>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <AnimatedCard
              className="project-card project-card-clickable"
              key={p.slug}
              delay={i * 80}
              onClick={() => navigate(`/projects/${p.slug}`)}
            >
              <div className="project-color-bar" style={{ background: p.color }} />
              <div className="project-card-top">
                <div className="project-icon">
                  {p.logoSrc
                    ? <img src={p.logoSrc} alt={p.title} className="card-rally-logo" />
                    : p.icon}
                </div>
                <div className="project-status">{p.status}</div>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tag-row">
                {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="card-arrow">→</div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="section section-dark" id="about">
        <div className="about-inner">
          <div className="about-text">
            <div className="section-label">About Us</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>We Are UCM Robotics</h2>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, marginBottom: 20 }}>
              UC Merced Robotics Society is a student driven engineering organization focused on designing advanced robotic systems, intelligent electronics, autonomous platforms, and high performance mechanical projects.
              Our members collaborate across software, embedded systems, fabrication, artificial intelligence, and vehicle engineering to turn ambitious ideas into real working systems.
            </p>
            <p style={{ color: 'var(--text)', lineHeight: 1.8 }}>
              We meet weekly, collaborate across disciplines, and push the limits of what student
              robotics can achieve. Come build something you're proud of.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary">Apply to Join →</Link>
              <Link to="/login" className="btn btn-outline">Member Login</Link>
            </div>
          </div>
          <div className="about-features">
            {[
              { icon: <i className="fi fi-sr-brain-circuit"></i>, title: 'AI & Autonomy', desc: 'Computer vision, machine learning, autonomous navigation, and intelligent robotic control systems'},
              { icon: <i className="fi fi-sr-microchip"></i>, title: 'Embedded Systems', desc: 'CAN bus architecture, ECU development, motor controllers, sensors, and custom electronics integration'},
              { icon: <i className="fi fi-sr-car-mechanic"></i>, title: 'Mechanical Engineering', desc: 'CAD design, fabrication, suspension systems, drivetrain integration, and high performance robotic platforms'},
              { icon: <i className="fi fi-sr-robot-money"></i>, title: 'Advanced Robotics Projects', desc: 'From autonomous robots and intelligent robotic arms to combat robotics and rally inspired vehicle platforms' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <strong>{f.title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section" id="team">
        <div className="section-label">The People</div>
        <h2 className="section-title">Meet the Board</h2>
        <p className="section-sub">The people keeping the gears turning</p>
        <div className="team-grid">
          {team.map((m, i) => (
            <AnimatedCard className="team-card" key={m.name} delay={i * 60}>
              <div className="team-photo-wrap">
                <img src={m.photo} alt={m.name} className="team-photo" />
              </div>
              <strong className="team-name">{m.name}</strong>
              <span className="team-role">{m.role}</span>
              <div className="team-hover-info">
                <p className="team-job">{m.job}</p>
                <p className="team-fact">🎲 {m.fact}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <img src={rblogo} alt="" className="cta-logo" />
        <h2>Ready to Build the Future?</h2>
        <p>Applications are open. Join UC Merced's robotics engineering society.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Apply Now →</Link>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo-row">
          <img src={rblogo} alt="RS" className="footer-logo-img" />
          <span className="footer-logo-text">UC Merced Robotics Society</span>
        </div>
        <p>University of California, Merced · School of Engineering</p>
        <div className="footer-links">
          <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Home</a>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Join</Link>
        </div>
        <p className="footer-copy">© 2025 UC Merced Robotics Society</p>
      </footer>
    </div>
  )
}