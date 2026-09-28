// ── BattleBots ─────────────────────────────────────────────────────────
// All content for /projects/battlebots. The page file
// (pages/projects/BattleBots.jsx) only arranges these blocks.

import TylerPhoto from '../../assets/team/Tyler.jpg'

import SpinnerPhoto   from '../../assets/projects/battlebots/battlebot.jpg'
import InternalsPhoto from '../../assets/projects/battlebots/internals.jpg'
import LidPhoto       from '../../assets/projects/battlebots/lid.jpg'

// ── Hero ──
export const HERO = {
  title: 'BattleBots',
  tagline: 'Student-built combat robots, from the first CAD sketch all the way to the arena',
  status: 'Active Project',
  accent: '#DC1111',
  background: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 50%, #1a0505 100%)',
  icon: 'fi fi-sr-two-swords',
  tags: ['1 lb Class', '3 lb Class', 'CAD', 'Electronics', 'Fabrication'],
}

// ── Overview ──
export const OVERVIEW = [
  "BattleBots is where we design, build, and fight combat robots. The project is split into teams by weight class, and each team gets hands-on with mechanical design, electronics, CAD, manufacturing, and match strategy, all packed into a robot that has to survive a fight.",
  "We've competed in the 1 lb and 12 lb classes before and learned a lot about what holds up in the arena and what doesn't. Going forward we're focusing on 1 lb and 3 lb bots. Smaller bots are quicker and cheaper to build, so more members can get involved, try out new ideas, and keep improving the design between events.",
]

// ── Systems ──
export const SYSTEMS = [
  {
    icon: 'fi fi-sr-tire',
    title: 'Drive',
    desc: "This is how the robot moves. Motors, gearboxes, wheels, and traction all have to balance speed, torque, and toughness. Mobility wins a lot of fights: if you can't move, you can't attack, dodge, or recover after a big hit.",
  },
  {
    icon: 'fi fi-sr-two-swords',
    title: 'Weapons',
    desc: 'The weapon is how we damage, disable, or shove the other robot around. Vertical spinners, horizontal spinners, lifters, and flippers each need a different design approach and a different way of getting power to the weapon.',
  },
  {
    icon: 'fi fi-sr-battery-bolt',
    title: 'Electrical & Power',
    desc: "Batteries, speed controllers (ESCs), receivers, wiring, connectors, and safety parts. Everything has to be light and efficient, and it has to take the vibration and shock of every hit without cutting out mid-match.",
  },
  {
    icon: 'fi fi-sr-shield',
    title: 'Structure & Armor',
    desc: 'The chassis and armor protect everything inside when the robot takes a hit. A solid frame also keeps the weapon lined up and holds the robot together through a whole tournament.',
  },
  {
    icon: 'fi fi-sr-cube',
    title: 'CAD & Manufacturing',
    desc: 'Every part starts as a 3D model in CAD before we make it with machining, 3D printing, or laser cutting. Quick prototypes let us test ideas, cut weight, and make each build better than the last.',
  },
]

// ── Timeline ── set `done: true` as each milestone is completed
export const TIMELINE = [
  {
    date: 'August 2026',
    title: 'Concept and Design',
    desc: 'We kick things off with robot concepts, strategy talks, and competition planning for the new 3 lb bot, plus revisions to the 1 lb bot. Members work on CAD models, drivetrain layouts, weapon ideas, and the overall chassis design.',
    done: true,
  },
  {
    date: 'September 2026',
    title: 'Electronics and Systems Integration',
    desc: "The 1 lb bot heads to competition while work continues on the 3 lb bot's electronics: batteries, ESCs, receivers, motors, and wiring.",
    done: false,
  },
  {
    date: 'Winter 2026',
    title: 'Fabrication and Assembly',
    desc: 'Final revisions, testing, and making spare parts. Every system gets inspected before competition, and we pack toolkits, batteries, and replacement parts while practicing driving and match strategy. By the end, both the 1 lb and 3 lb bots are ready for their next events.',
    done: false,
  },
]

// ── Project lead ── `photoPos` is the CSS object-position for the crop
export const LEADS = [
  {
    photo: TylerPhoto,
    name: 'Tyler',
    role: 'Project Lead',
    badge: 'fi fi-sr-console-controller',
    photoPos: 'center 20%',
    bio: 'Runs the BattleBots project day to day, leads the CAD work and design changes, and drives the bots in competition.',
  },
]

// ── Build gallery ──
export const SLIDES = [
  { src: SpinnerPhoto,   caption: 'Our spinner, saw blade and all' },
  { src: InternalsPhoto, caption: 'Inside the chassis: batteries, motors, and wiring packed in tight' },
  { src: LidPhoto,       caption: 'The top plate, named and decorated by the team' },
]
