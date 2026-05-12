import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

import AseemPhoto from '../assets/team/Aseem.jpeg'
import JacoriPhoto from '../assets/team/Jacori.jpg'
import AngelPhoto from '../assets/team/Angel_AutoBot.jpeg'

import Design1 from '../assets/projects/autonomous/design1.png'
import Design2 from '../assets/projects/autonomous/design2.png'
import Design3 from '../assets/projects/autonomous/design3.png'
import Design4 from '../assets/projects/autonomous/design4.png'
import Design5 from '../assets/projects/autonomous/design5.png'
import RosPipe from '../assets/projects/autonomous/rospipe.png'

const SLIDES = [
  { src: Design1, caption: 'Full robot design — exterior shell and wheel assembly' },
  { src: Design2, caption: 'Internal chassis layout — component mounting and drive system' },
  { src: Design3, caption: 'Cross-section view — internal structure and component integration' },
  { src: Design4, caption: 'Exploded chassis view — modular assembly breakdown' },
  { src: Design5, caption: 'Base chassis CAD — structural frame and mounting points' },
  { src: RosPipe, caption: 'ROS 2 node graph — motor controller and gamepad control pipeline' },
]

function Slideshow({ slides }) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const go = useCallback((next) => {
    setFading(true)
    setTimeout(() => { setIndex(next); setFading(false) }, 200)
  }, [])

  const prev = () => go((index - 1 + slides.length) % slides.length)
  const next = () => go((index + 1) % slides.length)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index])

  return (
    <div className="slideshow" role="region" aria-label="Autonomous Robot photo gallery">
      <div className="slideshow-counter">{index + 1} / {slides.length}</div>
      <img
        src={slides[index].src}
        alt={slides[index].caption}
        className={`slideshow-img${fading ? ' fade-out' : ''}`}
      />
      <div className="slideshow-caption">{slides[index].caption}</div>
      <button className="slideshow-btn prev" onClick={prev} aria-label="Previous photo">&#8249;</button>
      <button className="slideshow-btn next" onClick={next} aria-label="Next photo">&#8250;</button>
      <div className="slideshow-dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slideshow-dot${i === index ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to photo ${i + 1}`}
            role="tab"
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  )
}

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
    photo: AseemPhoto,
    name: 'Aseem Anwar',
    role: 'Electrical Lead',
    badge: <i className="fi fi-sr-bolt"></i>,
    photoPos: 'center 55%',
    bio: '5th-year Mechanical Engineering student with an EE minor. Responsible for all electrical systems on the Autonomous Robot, from sensor integration and motor drivers to power architecture and circuit design. His systems-level approach ensures every subsystem communicates reliably under real-world operating conditions.',
    fact: 'Interests include robotics, building systems, and metamaterials. Outside school he enjoys playing and watching sports, photography, and spending time outdoors.',
  },
  {
    photo: JacoriPhoto,
    name: 'Jacori',
    role: 'Mechanical Lead',
    badge: <i className="fi fi-sr-tools"></i>,
    photoPos: 'center 30%',
    bio: 'Leads the mechanical branch of the Autonomous Robot project. Responsible for the chassis design, structural integrity, drive system packaging, and physical integration of all subsystems. Ensures the platform is robust, serviceable, and competition-ready.',
    fact: 'Does 3D modeling in Blender; brings precision spatial thinking to real-world mechanical fabrication.',
  },
  {
    photo: AngelPhoto,
    name: 'Angel Vargas',
    role: 'Software Lead',
    badge: <i className="fi fi-rs-display-code"></i>,
    photoPos: 'center 20%',
    bio: 'Responsible for the full software stack on the Autonomous Robot. Leading the integration of CAN bus motor controllers with ROS 2, implementing controller input and navigation, and developing computer vision and machine learning features enabling the robot to autonomously detect and follow people.',
    fact: 'Enjoys a wide range of things; website development, robotics, mechanical design, and building cool stuff in general.',
  },
]

export default function ProjectAutonomousRobot({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* ── Hero Banner ── */}
      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{
          background: 'linear-gradient(135deg, #020b1a 0%, #0a1f3d 50%, #020b1a 100%)'
        }} />
        <div className="project-hero-content">
          <div className="project-hero-nav">
            <BackBtn />
            <div className="project-badge" style={{ borderColor: '#3b82f6', color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}>Active Project</div>
          </div>
          <h1>Autonomous Robot</h1>
          <p>A ground-based autonomous platform using ROS 2, CAN bus motors, and computer vision to navigate and interact with its environment</p>
          <div className="tech-tags">
            {['ROS 2', 'CAN Bus', 'Computer Vision', 'Machine Learning', 'Motor Control', 'Python', 'C++'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="project-hero-visual">
          <div className="project-icon-large" style={{ alignSelf: 'center' }}><i className="fi fi-sr-home-robot"></i></div>
        </div>
      </div>

      <div className="project-body">

        {/* ── Overview ── */}
        <div className="project-section">
          <h2>Overview</h2>
          <p>
            The Autonomous Robot project is building a fully self-contained ground vehicle capable of
            navigating real-world environments without human input. The platform integrates high-torque
            CAN bus motors, a ROS 2 software stack, and a vision pipeline to give the robot situational
            awareness and autonomous decision-making.
          </p>
          <p style={{ marginTop: 16 }}>
            A core feature under development is a person-following mode, using onboard cameras and a
            trained detection model, the robot can identify a target person and autonomously track and
            follow them through a space. The project spans three disciplines: mechanical design,
            electrical systems, and software, each with dedicated leads.
          </p>
        </div>

        {/* ── Architecture ── */}
        <div className="project-section">
          <h2>System Architecture</h2>
          <div className="arch-grid">
            {[
              {
                icon: <i className="fi fi-rs-brain-circuit"></i>,
                title: 'ROS 2 Stack',
                desc: 'Navigation, control, and perception nodes running on ROS 2. Handles sensor fusion, motor commands, and high-level decision-making.',
              },
              {
                icon: <i className="fi fi-sr-square-bolt"></i>,
                title: 'CAN Bus Motors',
                desc: 'High-torque drive motors communicating over CAN bus for precise, low-latency speed and position control.',
              },
              {
                icon: <i className="fi fi-sr-camera"></i>,
                title: 'Computer Vision',
                desc: 'Onboard camera feeds into a real-time person-detection model, providing the robot with visual awareness of its environment.',
              },
              {
                icon: <i className="fi fi-sr-console-controller"></i>,
                title: 'Controller Input',
                desc: 'Manual control mode via gamepad input, allowing operators to drive the robot and test subsystems before switching to autonomous mode.',
              },
              {
                icon: <i className="fi fi-sr-car-battery"></i>,
                title: 'Power Architecture',
                desc: 'Custom power distribution board supplying regulated voltage to compute, sensors, and motors with safety cutoffs.',
              },
              {
                icon: <i className="fi fi-rr-crane"></i>,
                title: 'Mechanical Platform',
                desc: 'Structural chassis designed for stability and modularity, easy to service, easy to upgrade, built to survive test runs.',
              },
            ].map(a => (
              <div className="arch-card" key={a.title}>
                <div className="arch-icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="project-section">
          <h2>Development Timeline</h2>
          <div className="timeline">
            {[
              {
                date: 'Fall 2026',
                title: 'Controller Integration',
                desc: 'CAN bus motor controllers connected and configured for communication with the onboard control system; foundational robot programming and motion control development begins',
                done: true
              },
              {
                date: 'Fall 2026',
                title: 'Chassis Development',
                desc: 'Full chassis prototype completed through additive manufacturing with component mounting locations and structural layout finalized',
                done: true
              },
              {
                date: 'Spring 2027',
                title: 'Computer Vision Systems',
                desc: 'Camera systems, perception pipelines, and computer vision models integrated for environmental awareness and autonomous feature development',
                done: false
              },
              {
                date: 'Spring 2027',
                title: 'Software and Electrical Expansion',
                desc: 'Continued development of embedded systems, power distribution, controller architecture, and autonomous software features',
                done: false
              },
              {
                date: 'To Be Announced',
                title: 'Autonomous Navigation',
                desc: 'Development of navigation logic, obstacle avoidance systems, and autonomous movement capabilities',
                done: false
              },
              {
                date: 'To Be Announced',
                title: 'Advanced System Integration',
                desc: 'Full system optimization, sensor fusion refinement, and expansion of intelligent robotic functionality',
                done: false
              },
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

        {/* ── Project Leads ── */}
        <div className="project-section">
          <h2>Project Leads</h2>
          <div className="leads-grid">
            {leads.map(lead => (
              <div className="lead-card" key={lead.name}>
                <div className="lead-photo-wrap">
                  <img src={lead.photo} alt={lead.name} className="lead-photo"
                    style={{ objectPosition: lead.photoPos || 'center 15%' }} />
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

        {/* ── Build Gallery (replaces Demo placeholder) ── */}
        <div className="project-section">
          <h2>Build Gallery</h2>
          <Slideshow slides={SLIDES} />
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackBtn />
        </div>
      </div>
    </div>
  )
}