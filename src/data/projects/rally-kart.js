// ── Rally Kart ─────────────────────────────────────────────────────────
// All content for /projects/rally-kart. The page file
// (pages/projects/RallyKart.jsx) only arranges these blocks.

import DarrenPhoto  from '../../assets/team/Darren.jpg'
import GustavoPhoto from '../../assets/team/Gustavo.jpg'
import AngelPhoto   from '../../assets/team/Angel_RallyKart.png'
import DylanPhoto   from '../../assets/team/Dylan.jpg'
import RallyCrest   from '../../assets/projects/rally/RS_RK_crest.webp'
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

// ── Hero ── colours: the gold and blue of the Rally Kart logo
export const HERO = {
  title: 'Rally Kart',
  tagline: 'A student-designed hybrid all-wheel-drive rally vehicle and research platform: Nissan Leaf electric drive at the front, a Mazdaspeed3 combustion drivetrain at the rear, and a custom parametric steel tube chassis',
  status: 'Design & Research Phase',
  accent: '#FDB913',
  accent2: '#1463FF',
  crest: RallyCrest,   // The page shows the pixel-art kart on the right (see RallyKart.jsx)
  link: { href: RALLY_INSTAGRAM_URL, label: 'Follow @rs_rallykart', icon: 'fi fi-brands-instagram' },
}

// ── Overview ──
export const OVERVIEW = [
  'Rally Kart is a student engineering project focused on the design and development of a lightweight hybrid all-wheel-drive rally vehicle. Rather than building a conventional go-kart, the team is developing a custom tubular chassis around two independent drivetrains: a Nissan Leaf electric drive system powering the front axle and a Mazdaspeed3 combustion drivetrain powering the rear axle.',
  'The project is intended to serve as both a vehicle-development challenge and a research platform. The team plans to use testing and data collection to compare vehicle behavior under different power-delivery strategies.',
  'The chassis is being developed as a fully parametric steel tube frame. This allows dimensions and mounting locations to evolve as suspension geometry, drivetrain packaging, driver ergonomics, battery placement, cooling, and structural requirements become better defined.',
  'To keep the project financially realistic, the suspension strategy emphasizes adapting production automotive components rather than fabricating an entirely custom suspension system. The current design direction investigates Nissan Leaf front suspension hardware for the front axle and Mazdaspeed3 front suspension hardware for the rear axle. Because the Mazdaspeed3’s factory front brakes are too large for the team’s preferred wheel size, smaller standard Mazda3 brake components are also being studied for compatibility.',
  'The team is currently in the research, CAD, and component-validation phase. Members are creating reference models of individual suspension and brake components, documenting dimensions and sources, and building toward complete front and rear suspension assemblies that can later be integrated into the parametric chassis.',
]

// The research question the vehicle is built to answer
export const GOAL = 'Research question: how does controlled front electric assistance affect traction and acceleration, and how much electrical energy is required to produce that improvement?'

// ── Systems ── current direction for each system; most are still being validated
export const SYSTEMS = [
  {
    icon: 'fi fi-sr-ruler-triangle',
    title: 'Parametric Tube Chassis',
    desc: 'A custom steel tube frame modeled parametrically, so it can adapt around verified suspension geometry, drivetrain packaging, battery, cooling, driver, and safety requirements instead of a donor car’s dimensions.',
  },
  {
    icon: 'fi fi-sr-charging-station',
    title: 'Front Electric Drive',
    desc: 'A Nissan Leaf electric motor and reduction drive powers the front axle, providing controlled electric assistance for traction and acceleration.',
  },
  {
    icon: 'fi fi-sr-engine',
    title: 'Rear Combustion Drivetrain',
    desc: 'A Mazdaspeed3 engine and six-speed transaxle, relocated to drive the rear axle. Orientation, lubrication, turbo oil drainage, and CV angles are still being verified.',
  },
  {
    icon: 'fi fi-sr-car-mechanic',
    title: 'Donor-Based Suspension',
    desc: 'Nissan Leaf MacPherson suspension at the front, and Mazdaspeed3 front MacPherson hardware repurposed at the rear with an engineered linkage to fix rear toe. Proven hardware keeps the first prototype affordable.',
  },
  {
    icon: 'fi fi-sr-tire',
    title: 'Wheels & Brakes',
    desc: '15-inch wheels are the working target for rally proportions and tire sidewall. Smaller standard Mazda3 brakes are being studied for the rear so they clear that wheel size.',
  },
  {
    icon: 'fi fi-sr-temperature-high',
    title: 'Cooling & Packaging',
    desc: 'A custom cooling layout lets radiator placement, ducting, fans, and coolant routing be optimized around the vehicle rather than copied from the donor cars.',
  },
  {
    icon: 'fi fi-sr-chart-line-up',
    title: 'Research & Instrumentation',
    desc: 'Planned data collection on acceleration, wheel slip, motor power, battery energy use, and temperatures, comparing rear-only drive against different levels of front electric assist.',
  },
  {
    icon: 'fi fi-sr-shield-check',
    title: 'Safety & Validation',
    desc: 'Suspension, brakes, high-voltage electrics, fuel, and welded structure are all safety-critical. Every component is reviewed for strength, fatigue, clearance, and shutdown behavior before it is fabricated or driven.',
  },
]

// ── Current priorities ── in the order the team is tackling them
export const PRIORITIES = [
  'Build a reliable CAD library of donor suspension, hub, brake, and wheel components.',
  'Verify compatibility between the selected donor components and 15-inch wheels.',
  'Establish front and rear suspension geometry and mounting locations.',
  'Package the Nissan Leaf front drive system and Mazdaspeed3 rear drivetrain into the parametric chassis.',
  'Develop a safe rear toe-control solution for the repurposed Mazdaspeed3 front suspension.',
  'Define wheel travel, ground clearance, track width, loaded vehicle mass, and rally load cases.',
  'Design custom cooling, electrical, braking, and control systems around the final vehicle layout.',
  'Instrument the vehicle so the team can study traction, acceleration, energy use, temperatures, and system behavior during testing.',
]

// ── Timeline ── set `done: true` as each milestone is completed
export const TIMELINE = [
  {
    date: 'Fall 2026',
    title: 'New Direction',
    desc: 'The project moves from a single-engine go-kart to a hybrid all-wheel-drive rally vehicle, with Nissan Leaf electric drive at the front, a Mazdaspeed3 drivetrain at the rear, and a parametric steel tube chassis',
    done: true,
  },
  {
    date: 'Fall 2026',
    title: 'Research and Component CAD',
    desc: 'Building a CAD library of donor suspension, hub, brake, and wheel components, with every dimension labelled as verified, measured, estimated, or missing',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Suspension and Packaging',
    desc: 'Validating 15-inch wheel and brake clearance, setting front and rear suspension geometry, designing rear toe control, and packaging both drivetrains into the chassis',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Systems Design',
    desc: 'Cooling, electrical, braking, and control systems designed around the final vehicle layout, followed by safety review of all critical components',
    done: false,
  },
  {
    date: 'To Be Announced',
    title: 'Fabrication and Testing',
    desc: 'Frame fabrication and assembly, then instrumented testing that compares rear-only drive with front electric assist for traction, acceleration, and energy use',
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
  {
    photo: DylanPhoto,
    name: 'Dylan',
    role: 'Logistics Lead',
    badge: 'fi fi-sr-clipboard-list',
    photoPos: 'center 30%',
    bio: 'Responsible for maintaining full-project alignment across all technical leads, including understanding each subsystem’s design goals, requirements, constraints, and integration needs. Oversees technical and financial feasibility checks and helps identify risks or conflicts between teams to keep the Rally Kart build efficient, achievable, and cohesive.',
    fact: 'A very chill guy.',
  },
]

// ── Build gallery ── the chassis CAD is current; the engine photos are from
// the earlier single-engine kart concept
export const SLIDES = [
  { src: Frame,   caption: 'Parametric tube-frame chassis: the same model adjusted from its baseline layout without rebuilding it' },
  { src: Engine1, caption: 'Earlier concept: the Yamaha 2-stroke engine from the first design' },
  { src: Engine2, caption: 'Earlier concept: engine detail' },
  { src: Engine3, caption: 'Earlier concept: powertrain integration work' },
  { src: Engine4, caption: 'Earlier concept: engine bay assembly and mounting' },
  { src: Engine5, caption: 'Earlier concept: drivetrain component detail' },
  { src: Engine6, caption: 'Earlier concept: engine systems' },
  { src: Engine7, caption: 'Earlier concept: engine configuration and test fitting' },
  { src: GoKart,  caption: 'This go kart was our project before Rally Kart' },
]
