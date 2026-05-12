import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

import DarrenPhoto from '../assets/team/Darren.jpg'
import GustavoPhoto from '../assets/team/Gustavo.jpg'
import AngelPhoto from '../assets/team/Angel_RallyKart.png'
import RallyLogo from '../assets/logos/rally.png'

import Frame   from '../assets/projects/rally/frame.png'
import Engine1 from '../assets/projects/rally/Engine.JPG'
import Engine2 from '../assets/projects/rally/Engine2.JPG'
import Engine3 from '../assets/projects/rally/Engine3.JPG'
import Engine4 from '../assets/projects/rally/Engine4.JPG'
import Engine5 from '../assets/projects/rally/Engine5.JPG'
import Engine6 from '../assets/projects/rally/Engine6.JPG'
import Engine7 from '../assets/projects/rally/Engine7.JPG'

const SLIDES = [
  { src: Frame,   caption: 'Space-frame chassis — the structural backbone of the Rally Kart' },
  { src: Engine1, caption: 'Yamaha 2-stroke engine — selected for its power-to-weight ratio' },
  { src: Engine2, caption: 'Engine detail — compact packaging for optimal chassis balance' },
  { src: Engine3, caption: 'Powertrain integration work in progress' },
  { src: Engine4, caption: 'Engine bay assembly and mounting' },
  { src: Engine5, caption: 'Drivetrain component detail' },
  { src: Engine6, caption: 'Engine systems — powertrain ready for chassis integration' },
  { src: Engine7, caption: 'Final engine configuration and test fitting' },
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
    <div className="slideshow" role="region" aria-label="Rally Kart photo gallery">
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
    photo: DarrenPhoto,
    name: 'Darren Silva',
    role: 'Design Lead',
    badge: <i className="fi fi-sr-drawer-alt"></i>,
    photoPos: 'center 18%',
    bio: 'Responsible for the conceptualization, CAD development, and technical integration of the Rally Kart platform, including chassis architecture, suspension packaging, aerodynamic concepts, balanced weight distribution, and performance-focused structural engineering.',
    fact: 'Top 1% rally sim racer.',
  },
  {
    photo: GustavoPhoto,
    name: 'Gustavo Banegas',
    role: 'Technical Lead',
    badge: <i className="fi fi-ss-car-mechanic"></i>,
    photoPos: 'center 20%',
    bio: 'Responsible for fabrication planning, drivetrain integration, mechanical system implementation, and overall technical coordination of the Rally Kart build. Focused on ensuring structural integrity, system compatibility, and build reliability across all subsystems.',
    fact: 'Has a clicker game running in the background at all times.',
  },
  {
    photo: AngelPhoto,
    name: 'Angel Vargas',
    role: 'Electronics Lead',
    badge: <i className="fi fi-sr-transformer-bolt"></i>,
    photoPos: 'center 20%',
    bio: "Responsible for the vehicle's full electronics architecture, including ECU systems, custom dashboard development, gauges, battery management, starter integration, CAN bus communication networks, and future electric power steering integration for improved low-speed maneuverability.",
    fact: 'Built this website 😂',
  },
]

const systems = [
  {
    icon: <i className="fi fi-rs-building-foundation"></i>,
    title: 'Chassis & Structural Design',
    desc: 'Custom tubular space-frame chassis engineered for rigidity, low center of gravity, aerodynamic efficiency, and future drivetrain scalability. The frame supports modular upgrades while maintaining structural integrity and driver protection.',
  },
  {
    icon: <i className="fi fi-sr-settings"></i>,
    title: 'Powertrain',
    desc: 'Initial configuration based on a 2-stroke Yamaha jet ski engine, chosen for its compact form factor and strong power-to-weight ratio. The platform is engineered to support future higher-output engine and transmission upgrades.',
  },
  {
    icon: <i className="fi fi-sr-tire"></i>,
    title: 'Suspension & Handling',
    desc: 'Long-travel suspension geometry designed for responsive handling, terrain compliance, and vehicle stability during aggressive rally driving. Built to withstand uneven terrain, rapid directional changes, and moderate airborne impacts.',
  },
  {
    icon: <i className="fi fi-sr-car-battery"></i>,
    title: 'Electronics & Control',
    desc: 'Custom electrical architecture integrating dashboard systems, gauges, battery management, starter systems, and CAN bus communication networks. Future systems include electric power steering for improved low-speed precision.',
  },
  {
    icon: <i className="fi fi-sr-rules-alt"></i>,
    title: 'Safety Systems',
    desc: 'Reinforced structural members, rollover protection design, kill-switch systems, and driver-focused safety engineering intended to achieve motorsport-inspired safety standards while remaining cost-effective and manufacturable.',
  },
  {
    icon: <i className="fi fi-sr-ruler-triangle"></i>,
    title: 'Modularity & Scalability',
    desc: 'The chassis mounting architecture is designed for long-term upgradability, allowing integration of larger automotive powertrains and manual transmissions without requiring a complete platform redesign.',
  },
]

const timeline = [
  {
    date: 'Fall 2026',
    title: 'Concept and Design',
    desc: 'Initial chassis architecture, CAD development, drivetrain packaging, suspension layout, and early frame assembly work begin',
    done: true,
  },
  {
    date: 'Fall 2026 to Spring 2027',
    title: 'Electronics Integration',
    desc: 'Custom dashboard systems, CAN bus architecture, wiring, battery systems, starter systems, and control electronics developed and tested',
    done: false,
  },
  {
    date: 'Spring 2027',
    title: 'Fabrication and Assembly',
    desc: 'Tubular frame fabrication, suspension mounting, drivetrain integration, and structural assembly progress into full rolling chassis development',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Initial Testing',
    desc: 'Vehicle systems validation, drivetrain testing, steering calibration, and early terrain evaluation',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Rally Configuration',
    desc: 'Suspension tuning, performance refinement, electric power steering integration, and full rally capability testing',
    done: false,
  },
]

export default function ProjectRallyKart({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="project-hero-banner">
        <div className="project-hero-bg" style={{
          background: 'linear-gradient(135deg, #1a0e00 0%, #3d2500 50%, #1a0e00 100%)'
        }} />
        <div className="project-hero-content">
          <div className="project-hero-nav">
            <BackBtn />
            <div className="project-badge" style={{
              borderColor: '#f59e0b',
              color: '#f59e0b',
              background: 'rgba(245,158,11,0.1)'
            }}>
              Active Project
            </div>
          </div>
          <h1>Rally Kart</h1>
          <p>A student-built single-seat rally platform with a custom space-frame chassis, CAN bus electronics, and a scalable drivetrain built for performance and safety</p>
        </div>
        <div className="project-hero-visual" style={{ alignSelf: 'center' }}>
          <div className="project-icon-large">
            <img src={RallyLogo} alt="Rally Kart" className="project-rally-image" />
          </div>
        </div>
      </div>

      <div className="project-body">

        <div className="project-section">
          <h2>Overview</h2>
          <p>
            The Rally Kart project is focused on developing a lightweight, high-performance single-seat
            rally platform engineered for durability, safety, and future expandability. The chassis is
            being designed as a custom tubular space-frame structure optimized for aerodynamic efficiency,
            structural rigidity, balanced weight distribution, and responsive handling across aggressive
            driving conditions.
          </p>
          <p style={{ marginTop: 16 }}>
            The platform is intended to remain lightweight enough for rapid acceleration and maneuverability
            while maintaining sufficient stability for high-speed cornering and uneven terrain. The initial
            drivetrain uses a compact 2-stroke Yamaha jet ski engine, chosen for its strong power-to-weight
            ratio and compact packaging. The chassis architecture is designed with long-term modularity in
            mind, allowing future integration of larger powertrains without a complete redesign.
          </p>
          <div className="rally-kart-goal">
            <span className="rally-kart-goal-icon"><i className="fi fi-rs-archery"></i></span>
            <p>
              The goal is to create a scalable rally platform that balances performance, reliability,
              affordability, and driver safety.
            </p>
          </div>
        </div>

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

        <div className="project-section">
          <h2>Project Leads</h2>
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