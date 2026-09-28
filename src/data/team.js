// ── Board Members ──────────────────────────────────────────────────────
// The "Meet the Board" carousel on the homepage.
//
// To add a member: drop their photo in src/assets/team/, import it here,
// and add an entry. The carousel sizes itself — no CSS change needed.
//   role — their board position
//   job  — what the position is responsible for
//   fact — the fun fact shown on the centred card

import NatePhoto     from '../assets/team/Nate.jpg'
import TrevorPhoto   from '../assets/team/Trevor.jpg'
import TonyPhoto     from '../assets/team/Tony.png'
import ParneethPhoto from '../assets/team/Parneeth.jpg'
import WindyPhoto    from '../assets/team/Windy.jpg'
import AndrewPhoto   from '../assets/team/Andrew.png'
import KatelynnPhoto from '../assets/team/Katelynn.jpg'

export const BOARD_MEMBERS = [
  {
    name: 'Nathaniel',
    role: 'President',
    photo: NatePhoto,
    job: 'Ensures club operations run smoothly and handles club affairs',
    fact: 'I love to cook and bake',
  },
  {
    name: 'Trevor',
    role: 'Vice President',
    photo: TrevorPhoto,
    job: 'Ensures the board stays on track, covers internal issues, and handles club affairs',
    fact: 'I play tennis and help run the club on campus. My favorite robot is Wall-E',
  },
  {
    name: 'Tony',
    role: 'Treasurer',
    photo: TonyPhoto,
    job: 'Requests money from SAB and manages club finances',
    fact: 'I can do a pistol squat while riding a skateboard',
  },
  {
    name: 'Praneeth',
    role: 'Secretary',
    photo: ParneethPhoto,
    job: 'Oversees club internal affairs and maintains deadlines for the club',
    fact: 'I love Corvettes and McLarens',
  },
  {
    name: 'Windy',
    role: 'Project Manager',
    photo: WindyPhoto,
    job: 'Maintains contact with projects and project leads, keeping up-to-date info on progress and goals',
    fact: 'I have a big fluffy dog',
  },
  {
    name: 'Andrew',
    role: 'Public Representative',
    photo: AndrewPhoto,
    job: 'Creates posters, videos, and manages the public-facing presence of the club',
    fact: 'I enjoy arcade rhythm games',
  },
  {
    name: 'Katelynn',
    role: 'Social Media Manager',
    photo: KatelynnPhoto,
    job: "Runs the club's social media, sharing our projects, events, and announcements",
    fact: 'I like baking and gaming',
  },
]
