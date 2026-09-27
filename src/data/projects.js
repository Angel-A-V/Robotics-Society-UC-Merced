// ── Project Index ──────────────────────────────────────────────────────
// The four cards in the "Our Projects" grid on the homepage.
//
// `slug` must match the route in App.jsx and the page file name:
//   slug 'rally-kart' → /projects/rally-kart → pages/projects/RallyKart.jsx
//
// A card shows `logoSrc` if it has one, otherwise the `icon` class.
// `color` is the stripe along the top of the card.

import RallyLogo from '../assets/logos/rally.png'

export const PROJECTS = [
  {
    slug: 'battlebots',
    title: 'BattleBots',
    desc: 'Information on this project has yet to be given unfortunately.',
    icon: 'fi fi-sr-two-swords',
    tags: ['N/A'],
    status: 'Waiting On INFO',
    color: '#DC1111',
  },
  {
    slug: 'rally-kart',
    title: 'Rally Kart',
    desc: 'A student-built single-seat rally platform featuring a custom tubular space-frame chassis, CAN bus electronics, custom dashboard, and a scalable drivetrain engineered for performance, safety, and future expandability.',
    icon: null,
    logoSrc: RallyLogo,
    tags: ['Chassis Design', 'CAN Bus', 'Electronics'],
    status: 'Active',
    color: '#f59e0b',
  },
  {
    slug: 'robot-arm',
    title: 'Robot Arm',
    desc: 'A computer vision-guided robotic arm that autonomously identifies, classifies, and sorts physical objects using a camera and machine learning pipeline.',
    icon: 'fi fi-rs-robotic-arm',
    tags: ['OpenCV', 'Inverse Kinematics', 'Machine Learning', 'Servo Control', 'Raspberry Pi', 'Python'],
    status: 'Pending Approval',
    color: '#10b981',
  },
  {
    slug: 'autonomous-robot',
    title: 'Autonomous Robot',
    desc: 'A ground-based autonomous platform powered by ROS 2, CAN bus motors, and computer vision, capable of person detection, tracking, and autonomous navigation.',
    icon: 'fi fi-sr-home-robot',
    tags: ['ROS 2', 'CAN Bus', 'Vision / ML'],
    status: 'Active',
    color: '#3b82f6',
  },
]
