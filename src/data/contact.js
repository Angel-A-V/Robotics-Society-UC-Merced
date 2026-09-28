// ── Contact Page Content ───────────────────────────────────────────────
// Partnership cards, social links and the lab location block.

import { CLUB_EMAIL, COMMUNITY_LINKS } from './site'
import asucmLogo from '../assets/asucm-logo.png'

// Helper so every card links to the same inbox with its own subject line.
const mailto = (subject) => `mailto:${CLUB_EMAIL}?subject=${subject} — UCM Robotics Society`

// ── Partnership cards ──
// `color` tints the icon and the button border.
export const CONTACT_CARDS = [
  {
    icon: 'fi fi-sr-handshake',
    title: 'Sponsorship',
    desc: 'Partner with UCM Robotics Society to support the next generation of engineers. Your sponsorship funds hardware, competition fees, and club operations.',
    cta: 'Become a Sponsor',
    href: mailto('Sponsorship Inquiry'),
    color: 'var(--sapphire)',
  },
  {
    icon: 'fi fi-sr-man-scientist',
    title: 'Research Collaboration',
    desc: 'Collaborate with our student teams on robotics research projects. We work across autonomous systems, computer vision, embedded control, and more.',
    cta: 'Start a Collaboration',
    href: mailto('Research Collaboration'),
    color: 'var(--green)',
  },
  {
    icon: 'fi fi-ss-industrial-pollution',
    title: 'Industry Partnership',
    desc: 'Connect with talented engineering students for internships, co-ops, and full-time opportunities. We can arrange site visits and career talks.',
    cta: 'Partner With Us',
    href: mailto('Industry Partnership'),
    color: 'var(--warning)',
  },
  {
    icon: 'fi fi-sr-megaphone',
    title: 'Media & Outreach',
    desc: 'Interested in covering our work or featuring our team? We welcome press coverage, podcast appearances, and community outreach opportunities.',
    cta: 'Get in Touch',
    href: mailto('Media Inquiry'),
    color: '#a78bfa',
  },
]

// ── Direct contact list ──
export const CONTACT_DETAILS = [
  { icon: 'fi fi-sr-circle-envelope', label: 'General Inquiries', value: CLUB_EMAIL, href: `mailto:${CLUB_EMAIL}` },
  { icon: 'fi fi-sr-graduation-cap',  label: 'University',        value: 'University of California, Merced' },
  { icon: 'fi fi-sr-diploma',         label: 'School',            value: 'School of Engineering' },
  { icon: 'fi fi-sr-map-marker',      label: 'Location',          value: 'Merced, California 95343' },
]

// ── Socials ──
// Discord and the Instagram accounts come from COMMUNITY_LINKS in site.js
export const SOCIAL_LINKS = [
  ...COMMUNITY_LINKS,
  { icon: 'fi fi-brands-linkedin',  label: 'LinkedIn',  handle: 'N/A' },
  { icon: 'fi fi-brands-github',    label: 'GitHub',    handle: 'Angel-A-V', href: 'https://github.com/Angel-A-V/Robotics-Society-UC-Merced' },
]

// ── Lab location ──
export const LAB_LOCATION = {
  name: 'MESA Labs',
  address: ['4225 Hospital Road', 'Atwater, CA 95301'],
  mapsUrl: 'https://maps.google.com/?q=4225+Hospital+Road,+Atwater,+CA+95301',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-120.6093!3d37.3582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80918b7a7e3b5555%3A0x0!2s4225+Hospital+Rd%2C+Atwater%2C+CA+95301!5e0!3m2!1sen!2sus!4v1680000000000',
  rows: [
    { icon: 'fi fi-sr-house-building', label: 'Address',          value: '4225 Hospital Road\nAtwater, CA 95301' },
    { icon: 'fi fi-sr-users-alt',      label: 'Facility',         value: 'Engineering Lab & Workshop' },
    { icon: 'fi fi-sr-user-robot',     label: 'Projects Run Here', value: 'BattleBots · Rally Kart · Robot Arm · Autonomous Robot' },
  ],
}

// ── Sponsors ──
// Shown on the contact page and in the scrolling sponsor strip on the homepage.
// To add one: drop the logo in src/assets/, import it above, and add an entry.
//   tier — the short label under their name in the homepage strip
//   url  — optional; makes their logo in the strip link to their site
export const SPONSORS = [
  {
    name: 'ASUCM',
    logo: asucmLogo,
    tier: 'Official Sponsor',
    fullName: 'Associated Students of the University of California, Merced',
    desc: 'Official student government sponsor providing funding and resources to support our robotics programs and competitions.',
  },
]

// NOTE: the inline "Inquire About Sponsorship" button under the sponsor card
// has always pointed at a different address than the cards above it.
// Kept as-is so nothing changes silently — switch it to CLUB_EMAIL if that
// was not intentional.
export const SPONSOR_INQUIRY_HREF = 'mailto:robotics@ucmerced.edu?subject=Sponsorship Inquiry'
