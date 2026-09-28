// ── Rally Kart ─────────────────────────────────────────────────────────
// All content for /projects/rally-kart. The page file
// (pages/projects/RallyKart.jsx) only arranges these blocks.

import DarrenPhoto  from '../../assets/team/Darren.jpg'
import GustavoPhoto from '../../assets/team/Gustavo.jpg'
import AngelPhoto   from '../../assets/team/Angel_RallyKart.png'
import RallyLogo    from '../../assets/logos/rally.png'
import { RALLY_INSTAGRAM_URL } from '../site'

import Frame   from '../../assets/projects/rally/frame.png'
import Engine1 from '../../assets/projects/rally/Engine.JPG'
import Engine2 from '../../assets/projects/rally/Engine2.JPG'
import Engine3 from '../../assets/projects/rally/Engine3.JPG'
import Engine4 from '../../assets/projects/rally/Engine4.JPG'
import Engine5 from '../../assets/projects/rally/Engine5.JPG'
import Engine6 from '../../assets/projects/rally/Engine6.JPG'
import Engine7 from '../../assets/projects/rally/Engine7.JPG'
import GoKart  from '../../assets/projects/rally/gokart.jpg'

// ── Hero ──
export const HERO = {
  title: 'Rally Kart',
  tagline: 'A student-built single-seat rally platform with a custom space-frame chassis, CAN bus electronics, and a scalable drivetrain built for performance and safety',
  status: 'Active Project',
  accent: '#f59e0b',
  background: 'linear-gradient(135deg, #1a0e00 0%, #3d2500 50%, #1a0e00 100%)',
  logoSrc: RallyLogo,
  link: { href: RALLY_INSTAGRAM_URL, label: 'Follow @rs_rallykart', icon: 'fi fi-brands-instagram' },
}

// ── Overview ──
export const OVERVIEW = [
  'The Rally Kart project is focused on developing a lightweight, high-performance single-seat rally platform engineered for durability, safety, and future expandability. The chassis is being designed as a custom tubular space-frame structure optimized for aerodynamic efficiency, structural rigidity, balanced weight distribution, and responsive handling across aggressive driving conditions.',
  'The platform is intended to remain lightweight enough for rapid acceleration and maneuverability while maintaining sufficient stability for high-speed cornering and uneven terrain. The initial drivetrain uses a compact 2-stroke Yamaha jet ski engine, chosen for its strong power-to-weight ratio and compact packaging. The chassis architecture is designed with long-term modularity in mind, allowing future integration of larger powertrains without a complete redesign.',
]

export const GOAL = 'The goal is to create a scalable rally platform that balances performance, reliability, affordability, and driver safety.'

// ── Systems ──
export const SYSTEMS = [
  {
    icon: 'fi fi-rs-building-foundation',
    title: 'Chassis & Structural Design',
    desc: 'Custom tubular space-frame chassis engineered for rigidity, low center of gravity, aerodynamic efficiency, and future drivetrain scalability. The frame supports modular upgrades while maintaining structural integrity and driver protection.',
  },
  {
    icon: 'fi fi-sr-settings',
    title: 'Powertrain',
    desc: 'Initial configuration based on a 2-stroke Yamaha jet ski engine, chosen for its compact form factor and strong power-to-weight ratio. The platform is engineered to support future higher-output engine and transmission upgrades.',
  },
  {
    icon: 'fi fi-sr-tire',
    title: 'Suspension & Handling',
    desc: 'Long-travel suspension geometry designed for responsive handling, terrain compliance, and vehicle stability during aggressive rally driving. Built to withstand uneven terrain, rapid directional changes, and moderate airborne impacts.',
  },
  {
    icon: 'fi fi-sr-car-battery',
    title: 'Electronics & Control',
    desc: 'Custom electrical architecture integrating dashboard systems, gauges, battery management, starter systems, and CAN bus communication networks. Future systems include electric power steering for improved low-speed precision.',
  },
  {
    icon: 'fi fi-sr-rules-alt',
    title: 'Safety Systems',
    desc: 'Reinforced structural members, rollover protection design, kill-switch systems, and driver-focused safety engineering intended to achieve motorsport-inspired safety standards while remaining cost-effective and manufacturable.',
  },
  {
    icon: 'fi fi-sr-ruler-triangle',
    title: 'Modularity & Scalability',
    desc: 'The chassis mounting architecture is designed for long-term upgradability, allowing integration of larger automotive powertrains and manual transmissions without requiring a complete platform redesign.',
  },
]

// ── Timeline ── set `done: true` as each milestone is completed
export const TIMELINE = [
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

// ── Project leads ── `photoPos` is the CSS object-position for the crop
export const LEADS = [
  {
    photo: DarrenPhoto,
    name: 'Darren Silva',
    role: 'Design Lead',
    badge: 'fi fi-sr-drawer-alt',
    photoPos: 'center 18%',
    bio: 'Responsible for the conceptualization, CAD development, and technical integration of the Rally Kart platform, including chassis architecture, suspension packaging, aerodynamic concepts, balanced weight distribution, and performance-focused structural engineering.',
    fact: 'Top 1% rally sim racer.',
  },
  {
    photo: GustavoPhoto,
    name: 'Gustavo Banegas',
    role: 'Technical Lead',
    badge: 'fi fi-ss-car-mechanic',
    photoPos: 'center 20%',
    bio: 'Responsible for fabrication planning, drivetrain integration, mechanical system implementation, and overall technical coordination of the Rally Kart build. Focused on ensuring structural integrity, system compatibility, and build reliability across all subsystems.',
    fact: 'Has a clicker game running in the background at all times.',
  },
  {
    photo: AngelPhoto,
    name: 'Angel Vargas',
    role: 'Electronics Lead',
    badge: 'fi fi-sr-transformer-bolt',
    photoPos: 'center 20%',
    bio: "Responsible for the vehicle's full electronics architecture, including ECU systems, custom dashboard development, gauges, battery management, starter integration, CAN bus communication networks, and future electric power steering integration for improved low-speed maneuverability.",
    fact: 'Built this website 😂',
  },
]

// ── Build gallery ──
export const SLIDES = [
  { src: Frame,   caption: 'Space-frame chassis — the structural backbone of the Rally Kart' },
  { src: Engine1, caption: 'Yamaha 2-stroke engine — selected for its power-to-weight ratio' },
  { src: Engine2, caption: 'Engine detail — compact packaging for optimal chassis balance' },
  { src: Engine3, caption: 'Powertrain integration work in progress' },
  { src: Engine4, caption: 'Engine bay assembly and mounting' },
  { src: Engine5, caption: 'Drivetrain component detail' },
  { src: Engine6, caption: 'Engine systems — powertrain ready for chassis integration' },
  { src: Engine7, caption: 'Final engine configuration and test fitting' },
  { src: GoKart,  caption: 'This go kart was our project before Rally Kart' },
]
