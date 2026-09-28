// ── Robot Arm ──────────────────────────────────────────────────────────
// All content for /projects/robot-arm.

import TrevorPhoto from '../../assets/team/Trevor.jpg'

// ── Hero ── colours: emerald with a teal glow
export const HERO = {
  title: 'Robot Arm',
  tagline: 'A 6-DOF robotic arm engineered to autonomously identify targets, calculate optimal trajectories, and execute precise throwing motions using computer vision, inverse kinematics, and machine learning',
  status: 'Pending Approval',
  accent: '#10B981',
  accent2: '#06B6D4',
  icon: 'fi fi-rs-robotic-arm',
  tags: ['OpenCV', 'Inverse Kinematics', 'Machine Learning', 'Servo Control', 'Raspberry Pi', 'Python'],
}

// ── Overview ──
export const OVERVIEW = [
  'The Robot Arm Project focuses on developing a high-precision 6-degree-of-freedom robotic arm capable of replicating complex human-style throwing motions through the integration of computer vision, inverse kinematics, and machine learning systems.',
  'The platform is being engineered to autonomously identify targets, calculate optimal trajectories, and execute repeatable throwing motions with controlled speed and accuracy. The long-term objective is to create a robotic system capable of adaptive targeting and motion refinement through reinforcement-based learning techniques.',
  'The robotic arm utilizes a multi-axis servo-driven architecture paired with a custom gripper and end-effector system specifically designed for stable payload handling and controlled release. The project combines mechanical engineering, embedded systems, software development, and artificial intelligence into a unified robotics platform.',
]

export const GOAL = 'The goal is to create an intelligent robotic throwing platform capable of combining perception, learning, and precise mechanical control into a fully autonomous system.'

// ── Systems ──
export const SYSTEMS = [
  {
    icon: 'fi fi-sr-camera',
    title: 'Vision Input',
    desc: 'An anchored camera system provides visual input using OpenCV-based target detection and environmental awareness. The pipeline enables target tracking, payload recognition, and aiming assistance.',
  },
  {
    icon: 'fi fi-rs-brain-circuit',
    title: 'Machine Learning',
    desc: 'Reward-based machine learning systems evaluate throwing accuracy and motion efficiency. Successful throws reinforce optimal movement patterns, improving repeatability and targeting performance over time.',
  },
  {
    icon: 'fi fi-sr-settings',
    title: 'Inverse Kinematics',
    desc: 'Inverse kinematics algorithms coordinate each motor and joint throughout the robotic arm chain to generate smooth, optimized, and repeatable throwing motions with mechanical stability.',
  },
  {
    icon: 'fi fi-sr-ruler-triangle',
    title: 'Mechanical Systems',
    desc: 'The arm utilizes servo-driven joints, structural linkages, and a custom gripper and end-effector system engineered for controlled payload release and reliable mechanical performance.',
  },
]

// ── Timeline ──
export const TIMELINE = [
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

// ── Project lead ──
export const LEADS = [
  {
    photo: TrevorPhoto,
    name: 'Trevor',
    role: 'Project Lead',
    badge: 'fi fi-sr-tools',
    photoPos: 'center 20%',
    bio: 'Responsible for overall project architecture, CAD development, embedded programming, computer vision integration, machine learning systems, calculations, procurement, and full system assembly.',
    fact: 'The idea for this project originated from Trevor and his tennis teammates who wanted to design a robotic system capable of autonomous ball feeding.',
  },
]
