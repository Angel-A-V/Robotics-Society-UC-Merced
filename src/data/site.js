// ── Site Content ───────────────────────────────────────────────────────
// Club-wide copy and link lists. Editing the footer or the club blurb is a
// change in here, not in a component.

export const CLUB_NAME = 'UC Merced Robotics Society'
export const CLUB_SCHOOL = 'University of California, Merced · School of Engineering'
export const CLUB_EMAIL = 'nsamson@ucmerced.edu'
export const COPYRIGHT_YEAR = 2025

// ── Community & socials ──
// Used by the nav bar, footer, homepage, contact page and members-offline page.
export const DISCORD_URL         = 'https://discord.gg/jBS8bJ6rsN'
export const INSTAGRAM_URL       = 'https://www.instagram.com/ucm_rs/'
export const RALLY_INSTAGRAM_URL = 'https://www.instagram.com/rs_rallykart/'

export const COMMUNITY_LINKS = [
  { icon: 'fi fi-brands-discord',   label: 'Discord',              handle: 'Join our server', href: DISCORD_URL },
  { icon: 'fi fi-brands-instagram', label: 'Instagram',            handle: '@ucm_rs',         href: INSTAGRAM_URL },
  { icon: 'fi fi-brands-instagram', label: 'Rally Kart Instagram', handle: '@rs_rallykart',   href: RALLY_INSTAGRAM_URL },
]

// ── Nav bar links ──
// `hash` links scroll to a section of the homepage; `to` links are routes.
export const NAV_LINKS = [
  { id: 'home',     label: 'Home',     hash: null },
  { id: 'projects', label: 'Projects', hash: '#projects' },
  { id: 'team',     label: 'Team',     hash: '#team' },
  { id: 'about',    label: 'About',    hash: '#about' },
  { id: 'contact',  label: 'Contact',  to: '/contact' },
]

// Homepage sections the nav bar watches to highlight the active link.
export const SCROLL_SPY_SECTIONS = ['projects', 'team', 'about']

// ── Footer links ── `membersOnly` links hide while MEMBERS_ENABLED is false
export const FOOTER_LINKS = [
  { label: 'Home',    to: '/' },
  { label: 'Contact', to: '/contact' },
  { label: 'Login',   to: '/login', membersOnly: true },
  { label: 'Join',    to: '/register' },
]

// ── Hero ──
export const HERO = {
  badge: 'UC Merced Robotics Society',
  sub: 'We design, engineer, and program advanced robotic systems ranging from autonomous platforms and intelligent robotic arms to high performance rally vehicles and combat robots. Join us and help shape the future of robotics at UC Merced.',
  stats: [
    { num: '4',   label: 'Active Projects' },
    { num: '20+', label: 'Members' },
    { num: '6',   label: 'Years Running' },
  ],
}

// ── About section ──
export const ABOUT_PARAGRAPHS = [
  'UC Merced Robotics Society is a student driven engineering organization focused on designing advanced robotic systems, intelligent electronics, autonomous platforms, and high performance mechanical projects. Our members collaborate across software, embedded systems, fabrication, artificial intelligence, and vehicle engineering to turn ambitious ideas into real working systems.',
  "We meet weekly, collaborate across disciplines, and push the limits of what student robotics can achieve. Come build something you're proud of.",
]

export const ABOUT_FEATURES = [
  {
    icon: 'fi fi-sr-brain-circuit',
    title: 'AI & Autonomy',
    desc: 'Computer vision, machine learning, autonomous navigation, and intelligent robotic control systems',
  },
  {
    icon: 'fi fi-sr-microchip',
    title: 'Embedded Systems',
    desc: 'CAN bus architecture, ECU development, motor controllers, sensors, and custom electronics integration',
  },
  {
    icon: 'fi fi-sr-car-mechanic',
    title: 'Mechanical Engineering',
    desc: 'CAD design, fabrication, suspension systems, drivetrain integration, and high performance robotic platforms',
  },
  {
    icon: 'fi fi-sr-robot-money',
    title: 'Advanced Robotics Projects',
    desc: 'From autonomous robots and intelligent robotic arms to combat robotics and rally inspired vehicle platforms',
  },
]
