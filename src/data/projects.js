// ── Project Index ──────────────────────────────────────────────────────
// The four cards in the "Our Projects" grid on the homepage.
//
// `slug` must match the route in App.jsx and the page file name:
//   slug 'rally-kart' → /projects/rally-kart → pages/projects/RallyKart.jsx
//
// A card shows `logoSrc` if it has one, otherwise the `icon` class.
// `photo` fills the left half of the card. To add one: drop the image in
// src/assets/projects/<folder>/, import it here, and set `photo`. Until then
// the card shows a placeholder tinted with `color`. Photos are cropped to fill
// the slot; set `photoFit: 'contain'` for logos or anything that mustn't be
// cut off (it's shown whole on a black background instead), or
// `photoFit: 'contain-desktop'` for wide photos that crop too tightly on PC
// (shown whole over a blurred copy on desktop, cropped as usual on phones).
// `status` picks its pill colour from STATUS_TONES below (blue if unlisted).

import RallyLogo from '../assets/logos/rally.png'
import BattleBotsPhoto from '../assets/projects/battlebots/battlebot.jpg'
import RallyPhoto from '../assets/projects/rally/RS_RK_Logo.webp'
import AutonomousPhoto from '../assets/projects/autonomous/autonomous-robot.jpg'

// Status text (lowercase) → pill colour: 'green' | 'amber' | 'blue'
export const STATUS_TONES = {
  'active': 'green',
  'pending approval': 'amber',
  'waiting on info': 'blue',
}

export const PROJECTS = [
  {
    slug: 'battlebots',
    title: 'BattleBots',
    desc: 'Student-built combat robots in the 1 lb and 3 lb classes, designed, wired, and machined in-house and driven in competition.',
    icon: 'fi fi-sr-two-swords',
    tags: ['Combat Robotics', 'CAD', 'Electronics'],
    photo: BattleBotsPhoto,
    photoFit: 'contain-desktop',
    status: 'Active',
    color: '#DC1111',
  },
  {
    slug: 'rally-kart',
    title: 'Rally Kart',
    desc: 'A student-built single-seat rally platform featuring a custom tubular space-frame chassis, CAN bus electronics, custom dashboard, and a scalable drivetrain engineered for performance, safety, and future expandability.',
    icon: null,
    logoSrc: RallyLogo,
    tags: ['Chassis Design', 'CAN Bus', 'Electronics'],
    photo: RallyPhoto,
    photoFit: 'contain',
    status: 'Active',
    color: '#f59e0b',
  },
  {
    slug: 'robot-arm',
    title: 'Robot Arm',
    desc: 'A computer vision-guided robotic arm that autonomously identifies, classifies, and sorts physical objects using a camera and machine learning pipeline.',
    icon: 'fi fi-rs-robotic-arm',
    tags: ['OpenCV', 'Inverse Kinematics', 'Machine Learning', 'Servo Control', 'Raspberry Pi', 'Python'],
    photo: null,
    status: 'Pending Approval',
    color: '#10b981',
  },
  {
    slug: 'autonomous-robot',
    title: 'Autonomous Robot',
    desc: 'A ground-based autonomous platform powered by ROS 2, CAN bus motors, and computer vision, capable of person detection, tracking, and autonomous navigation.',
    icon: 'fi fi-sr-home-robot',
    tags: ['ROS 2', 'CAN Bus', 'Vision / ML'],
    photo: AutonomousPhoto,
    status: 'Active',
    color: '#3b82f6',
  },
]
