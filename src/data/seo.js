// ── Search & Link Previews ─────────────────────────────────────────────
// The title and description Google shows for each page, and what appears
// when someone shares a link (Discord, iMessage, Instagram DMs, …).
//
// Used in two places, so keep this file plain text (no image imports):
//   - vite.config.js (seoPages plugin) writes a real HTML file per page at
//     build time with these tags filled in, plus sitemap.xml
//   - components/layout/PageMeta.jsx updates the tags as you click around
//
// Adding a public page? Add it here too, or Google won't be told about it.
// Descriptions read best around 120–160 characters.

export const SITE_URL = 'https://robotics-society-ucmerced.com'
export const SITE_NAME = 'UC Merced Robotics Society'

// Shared preview image (public/og-image.png, 1200×630)
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const PAGES = [
  {
    path: '/',
    title: 'UC Merced Robotics Society | Student Robotics Club at UC Merced',
    description: 'UC Merced Robotics Society is a student-run robotics club at the University of California, Merced. We build combat robots, a rally kart, a robot arm and an autonomous robot.',
    priority: '1.0',
  },
  {
    path: '/projects/battlebots',
    title: `BattleBots | ${SITE_NAME}`,
    description: 'Student-built 1 lb and 3 lb combat robots at UC Merced, designed in CAD, wired, machined in-house and driven in competition by the Robotics Society.',
    priority: '0.8',
  },
  {
    path: '/projects/rally-kart',
    title: `Rally Kart | ${SITE_NAME}`,
    description: 'A student-built single-seat rally kart at UC Merced with a custom tubular space-frame chassis, CAN bus electronics and a Yamaha 2-stroke drivetrain.',
    priority: '0.8',
  },
  {
    path: '/projects/robot-arm',
    title: `Robot Arm | ${SITE_NAME}`,
    description: 'A 6-DOF robotic arm built by UC Merced students that uses computer vision, inverse kinematics and machine learning to find targets and throw at them.',
    priority: '0.8',
  },
  {
    path: '/projects/autonomous-robot',
    title: `Autonomous Robot | ${SITE_NAME}`,
    description: 'A ground robot built by UC Merced students using ROS 2, CAN bus motors and computer vision for person detection, tracking and autonomous navigation.',
    priority: '0.8',
  },
  {
    path: '/contact',
    title: `Contact & Sponsorship | ${SITE_NAME}`,
    description: 'Get in touch with the UC Merced Robotics Society: join the club on Discord, sponsor our robots, collaborate on research, or visit us at MESA Labs.',
    priority: '0.6',
  },
]

// Member-only pages: kept out of Google (robots.txt + noindex)
export const PRIVATE_PATHS = ['/login', '/register', '/portal']

export const pageFor = (path) => PAGES.find(page => page.path === path)
