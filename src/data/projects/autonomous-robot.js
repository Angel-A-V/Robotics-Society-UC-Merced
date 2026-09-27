// ── Autonomous Robot ───────────────────────────────────────────────────
// All content for /projects/autonomous-robot.

import AseemPhoto  from '../../assets/team/Aseem.jpeg'
import JacoriPhoto from '../../assets/team/Jacori.jpg'
import AngelPhoto  from '../../assets/team/Angel_AutoBot.jpeg'

import Design1 from '../../assets/projects/autonomous/design1.png'
import Design2 from '../../assets/projects/autonomous/design2.png'
import Design3 from '../../assets/projects/autonomous/design3.png'
import Design4 from '../../assets/projects/autonomous/design4.png'
import Design5 from '../../assets/projects/autonomous/design5.png'
import RosPipe  from '../../assets/projects/autonomous/rospipe.png'

// ── Hero ──
export const HERO = {
  title: 'Autonomous Robot',
  tagline: 'A ground-based autonomous platform using ROS 2, CAN bus motors, and computer vision to navigate and interact with its environment',
  status: 'Active Project',
  accent: '#3b82f6',
  background: 'linear-gradient(135deg, #020b1a 0%, #0a1f3d 50%, #020b1a 100%)',
  icon: 'fi fi-sr-home-robot',
  tags: ['ROS 2', 'CAN Bus', 'Computer Vision', 'Machine Learning', 'Motor Control', 'Python', 'C++'],
}

// ── Overview ──
export const OVERVIEW = [
  'The Autonomous Robot project is building a fully self-contained ground vehicle capable of navigating real-world environments without human input. The platform integrates high-torque CAN bus motors, a ROS 2 software stack, and a vision pipeline to give the robot situational awareness and autonomous decision-making.',
  'A core feature under development is a person-following mode, using onboard cameras and a trained detection model, the robot can identify a target person and autonomously track and follow them through a space. The project spans three disciplines: mechanical design, electrical systems, and software, each with dedicated leads.',
]

// ── System architecture ──
export const SYSTEMS = [
  {
    icon: 'fi fi-rs-brain-circuit',
    title: 'ROS 2 Stack',
    desc: 'Navigation, control, and perception nodes running on ROS 2. Handles sensor fusion, motor commands, and high-level decision-making.',
  },
  {
    icon: 'fi fi-sr-square-bolt',
    title: 'CAN Bus Motors',
    desc: 'High-torque drive motors communicating over CAN bus for precise, low-latency speed and position control.',
  },
  {
    icon: 'fi fi-sr-camera',
    title: 'Computer Vision',
    desc: 'Onboard camera feeds into a real-time person-detection model, providing the robot with visual awareness of its environment.',
  },
  {
    icon: 'fi fi-sr-console-controller',
    title: 'Controller Input',
    desc: 'Manual control mode via gamepad input, allowing operators to drive the robot and test subsystems before switching to autonomous mode.',
  },
  {
    icon: 'fi fi-sr-car-battery',
    title: 'Power Architecture',
    desc: 'Custom power distribution board supplying regulated voltage to compute, sensors, and motors with safety cutoffs.',
  },
  {
    icon: 'fi fi-rr-crane',
    title: 'Mechanical Platform',
    desc: 'Structural chassis designed for stability and modularity, easy to service, easy to upgrade, built to survive test runs.',
  },
]

// ── Timeline ──
export const TIMELINE = [
  {
    date: 'Fall 2026',
    title: 'Controller Integration',
    desc: 'CAN bus motor controllers connected and configured for communication with the onboard control system; foundational robot programming and motion control development begins',
    done: true,
  },
  {
    date: 'Fall 2026',
    title: 'Chassis Development',
    desc: 'Full chassis prototype completed through additive manufacturing with component mounting locations and structural layout finalized',
    done: true,
  },
  {
    date: 'Spring 2027',
    title: 'Computer Vision Systems',
    desc: 'Camera systems, perception pipelines, and computer vision models integrated for environmental awareness and autonomous feature development',
    done: false,
  },
  {
    date: 'Spring 2027',
    title: 'Software and Electrical Expansion',
    desc: 'Continued development of embedded systems, power distribution, controller architecture, and autonomous software features',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Autonomous Navigation',
    desc: 'Development of navigation logic, obstacle avoidance systems, and autonomous movement capabilities',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Advanced System Integration',
    desc: 'Full system optimization, sensor fusion refinement, and expansion of intelligent robotic functionality',
    done: false,
  },
]

// ── Project leads ──
export const LEADS = [
  {
    photo: AseemPhoto,
    name: 'Aseem Anwar',
    role: 'Electrical Lead',
    badge: 'fi fi-sr-bolt',
    photoPos: 'center 55%',
    bio: '5th-year Mechanical Engineering student with an EE minor. Responsible for all electrical systems on the Autonomous Robot, from sensor integration and motor drivers to power architecture and circuit design. His systems-level approach ensures every subsystem communicates reliably under real-world operating conditions.',
    fact: 'Interests include robotics, building systems, and metamaterials. Outside school he enjoys playing and watching sports, photography, and spending time outdoors.',
  },
  {
    photo: JacoriPhoto,
    name: 'Jacori',
    role: 'Mechanical Lead',
    badge: 'fi fi-sr-tools',
    photoPos: 'center 30%',
    bio: 'Leads the mechanical branch of the Autonomous Robot project. Responsible for the chassis design, structural integrity, drive system packaging, and physical integration of all subsystems. Ensures the platform is robust, serviceable, and competition-ready.',
    fact: 'Does 3D modeling in Blender; brings precision spatial thinking to real-world mechanical fabrication.',
  },
  {
    photo: AngelPhoto,
    name: 'Angel Vargas',
    role: 'Software Lead',
    badge: 'fi fi-rs-display-code',
    photoPos: 'center 20%',
    bio: 'Responsible for the full software stack on the Autonomous Robot. Leading the integration of CAN bus motor controllers with ROS 2, implementing controller input and navigation, and developing computer vision and machine learning features enabling the robot to autonomously detect and follow people.',
    fact: 'Enjoys a wide range of things; website development, robotics, mechanical design, and building cool stuff in general.',
  },
]

// ── Build gallery ──
export const SLIDES = [
  { src: Design1, caption: 'Full robot design — exterior shell and wheel assembly' },
  { src: Design2, caption: 'Internal chassis layout — component mounting and drive system' },
  { src: Design3, caption: 'Cross-section view — internal structure and component integration' },
  { src: Design4, caption: 'Exploded chassis view — modular assembly breakdown' },
  { src: Design5, caption: 'Base chassis CAD — structural frame and mounting points' },
  { src: RosPipe, caption: 'ROS 2 node graph — motor controller and gamepad control pipeline' },
]
