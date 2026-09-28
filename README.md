# UCM Robotics Society Platform

A full-stack community platform for the UC Merced Robotics Society — combining a public-facing robotics showcase website with a secure, real-time members-only portal.

---

## 🧭 Project Overview

**Public Website** — open to everyone
- Homepage with an interactive 3D ASCII logo, a scrolling sponsor strip, photo project cards, and a swipeable "Meet the Board" carousel
- Four project detail pages: BattleBots, Rally Kart, Robot Arm, Autonomous Robot, each with systems, a timeline, leads, and a photo gallery
- Discord and Instagram links in the nav bar, footer, homepage, and contact page
- Contact page with partnership cards, sponsors, socials, and the MESA Labs map

**Members Portal** — login required, approval-based
> ⚠️ **Currently switched off.** The backend is down, so `MEMBERS_ENABLED` in
> `src/lib/config.js` is `false`: `/login`, `/register`, and `/portal` show a
> "temporarily offline" page pointing people to Discord, Instagram, and email,
> the Login links are hidden, and the site makes no backend calls. Set it back
> to `true` to restore everything below.

- Real-time Discord-style chat with channels, reactions, and file uploads
- Announcements board managed by admins
- Profile customization with avatar and bio
- Admin dashboard for user and content management

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Django + Django REST Framework |
| Real-Time | Django Channels + Daphne (WebSockets) |
| Auth | JWT via SimpleJWT |
| Database | SQLite (dev) → PostgreSQL (production) |
| Animation | Framer Motion (board carousel) |
| Styling | Vanilla CSS + Flaticon Uicons |
| Hosting | Cloudflare Workers (static assets via Wrangler) |

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip

---

### 1. Clone the repo

```bash
git clone https://github.com/Angel-A-V/Robotics-Society-UC-Merced
cd "Robotics Society UC Merced"
```

---

### 2. Frontend setup

```bash
npm install
```

---

### 3. Backend setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Mac/Linux
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

---

### 4. Create your .env file

Create a file called `.env` inside the `backend/` folder.  
**This file is never committed to GitHub — you must create it manually.**

Contact the project lead (Angel) for the current secret key, or see the pinned message in Discord.

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

### 5. Run database migrations

```bash
# From inside backend/ with .venv active
python manage.py migrate
```

---

### 6. Run the project

You need **two terminals** running at the same time:

**Terminal 1 — Backend**
```bash
cd backend
source .venv/bin/activate
daphne -p 8000 core.asgi:application
```

**Terminal 2 — Frontend**
```bash
# From project root
npm run dev
```

Open **http://localhost:5173**

---

### 7. Create your admin account

The **first account registered** on the site automatically becomes the admin.  
Set `MEMBERS_ENABLED = true` in `src/lib/config.js` first, then go to
http://localhost:5173/register and sign up.

> Only working on the public website? Skip steps 3–7. With the members area
> switched off, `npm run dev` on its own is all you need.

---

### 8. Deploy

```bash
npm run deploy     # builds, then publishes with Wrangler (Cloudflare)
```

---

## 🔐 Security Notes

- `.env` and `db.sqlite3` are gitignored — never commit them
- Passwords are hashed using Django's built-in PBKDF2 — never stored plaintext
- New users default to `pending` role and cannot send messages until approved by an admin
- JWT tokens expire after 1 hour (access) and 7 days (refresh)

---

## 📁 Project Structure

Everything is split by responsibility, so a change has one obvious home.

```
Robotics Society UC Merced/
├── backend/
│   ├── api/
│   │   ├── models.py         # Database tables: User, Announcement, Channel, Message, Reaction
│   │   ├── serializers.py    # Model ↔ JSON conversion and input validation
│   │   ├── permissions.py    # IsMember / IsAdmin role checks
│   │   ├── broadcast.py      # Pushing updates over WebSocket from REST views
│   │   ├── consumers.py      # The live chat WebSocket handler
│   │   ├── routing.py        # ws:// URL → consumer
│   │   ├── urls.py           # /api/... routes
│   │   ├── tests.py          # API smoke tests (python manage.py test api)
│   │   └── views/            # One module per area of the API
│   │       ├── auth.py            # register, /me
│   │       ├── users.py           # admin user management
│   │       ├── announcements.py
│   │       ├── channels.py        # chat channel CRUD
│   │       ├── messages.py        # history, send, delete, reactions
│   │       ├── uploads.py         # chat file attachments
│   │       └── profile.py         # bio, avatar, public profile
│   ├── core/                 # Django settings, root URLs, ASGI/WSGI entry
│   └── .env                  # ← you create this locally, never committed
│
├── src/
│   ├── main.jsx              # Entry point — mounts the app
│   ├── App.jsx               # Router: every URL → a page
│   │
│   ├── lib/                  # Plain JavaScript, no React
│   │   ├── config.js         # Env URLs, MEMBERS_ENABLED switch, every size/time limit
│   │   ├── api.js            # Every backend call lives here
│   │   ├── auth.js           # Token storage and request headers
│   │   ├── media.js          # Upload URLs, image detection
│   │   ├── format.js         # Date and time formatting
│   │   └── chat.js           # Message grouping, reaction grouping
│   │
│   ├── hooks/                # Reusable stateful behaviour
│   │   ├── useSession.js     # Who is logged in
│   │   ├── useSocket.js      # The chat WebSocket
│   │   ├── usePortalData.js  # Portal data loading + polling
│   │   ├── useScrollSpy.js   # Nav bar active-link tracking
│   │   ├── useRevealOnScroll.js
│   │   └── useEscapeKey.js
│   │
│   ├── data/                 # CONTENT ONLY — edit copy here, not in components
│   │   ├── site.js           # Club info, Discord/Instagram links, nav/footer links, hero, about
│   │   ├── team.js           # Board members
│   │   ├── projects.js       # The four homepage project cards (photo, status, tags)
│   │   ├── contact.js        # Partnership cards, sponsors, socials, lab location
│   │   └── projects/         # Per-project text, timelines, leads, galleries
│   │
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, ScrollToTop
│   │   ├── ui/               # Avatar, Slideshow, TeamCarousel, InfiniteSlider, AsciiLogo, …
│   │   ├── project/          # Hero, SystemsGrid, Timeline, LeadsGrid, …
│   │   └── portal/           # Sidebar, mobile tabs, ProfileModal
│   │       ├── tabs/         # Announcements, Chat, Profile, Admin
│   │       └── chat/         # Channel list, messages, reactions, input bar
│   │
│   ├── pages/                # One file per route
│   │   ├── Home.jsx  Contact.jsx  Login.jsx  Register.jsx  Portal.jsx
│   │   ├── MembersOffline.jsx   # Shown at /login, /register, /portal while the backend is off
│   │   └── projects/         # BattleBots, RallyKart, RobotArm, AutonomousRobot
│   │
│   ├── styles/               # See "Styling" below
│   └── assets/               # Images, team photos, project photos
│
├── index.html                # Loads the Flaticon icon fonts
├── package.json
└── vite.config.js            # Dev-server proxy: /api and /ws → Django :8000
```

---

## 🎨 Styling

`src/styles/index.css` contains no styles of its own — it is a manifest that
`@import`s the partials **in cascade order**. Vite inlines them into one file at
build time, so there is no extra network cost.

**Order matters.** CSS applies the last matching rule, so moving an `@import`
can change how the site looks. Add new files inside the matching group, and
leave `overrides.css` last.

| Want to change… | Edit |
|---|---|
| A colour, font, shadow or radius | `styles/base/tokens.css` |
| The nav bar | `styles/components/navbar.css` |
| A button | `styles/components/buttons.css` |
| The footer | `styles/components/footer.css` |
| The homepage (hero, sponsor strip, project cards) | `styles/pages/home.css` |
| The "Meet the Board" carousel | `styles/components/team-carousel.css` |
| The scrolling sponsor slider | `styles/components/infinite-slider.css` |
| Login / register / members-offline screens | `styles/pages/auth.css` |
| A project page | `styles/pages/project-detail.css` |
| The contact page | `styles/pages/contact.css` |
| The portal shell and sidebar | `styles/portal/layout.css` |
| The chat | `styles/portal/chat.css` |
| Phone / tablet layout | `styles/responsive.css` |

Colours are CSS variables defined once in `tokens.css` — use
`var(--sapphire)`, never a raw hex value.

---

## 🧩 Common Tasks

| Task | What to do |
|---|---|
| Change any wording on the site | Edit the matching file in `src/data/` |
| Add a board member | Add a photo to `src/assets/team/`, then an entry in `src/data/team.js` (the carousel opens on the first entry, so keep the President first) |
| Add or change a project card photo | Add it to `src/assets/projects/<project>/`, import it in `src/data/projects.js`, and set `photo`. Photos are cropped to fill; use `photoFit: 'contain'` for logos, or `'contain-desktop'` for wide photos that crop too tightly on PC |
| Add a sponsor | Add their logo to `src/assets/`, then an entry to `SPONSORS` in `src/data/contact.js`. It shows up on the contact page and in the homepage sponsor strip |
| Change the Discord or Instagram links | `DISCORD_URL` / `INSTAGRAM_URL` / `RALLY_INSTAGRAM_URL` in `src/data/site.js` |
| Turn the members area (login, sign-up, portal) on or off | `MEMBERS_ENABLED` in `src/lib/config.js` |
| Update a project's timeline | Edit `TIMELINE` in `src/data/projects/<project>.js` |
| Add photos to a project gallery | Add them to `src/assets/projects/`, then to `SLIDES` in that project's data file. Shrink phone photos first (around 1200px on the long side); a raw 4MB photo slows the page down |
| Add a whole new project page | Add a card to `src/data/projects.js`, create `src/data/projects/<slug>.js`, copy a page from `src/pages/projects/`, add a `<Route>` in `App.jsx` |
| Add a new API endpoint | Add the view to the right module in `backend/api/views/`, export it in `views/__init__.py`, add the path to `api/urls.py`, then add a helper to `src/lib/api.js` |
| Change an upload size limit | Three places, keep them in sync: `src/lib/config.js`, `backend/api/views/uploads.py`, `DATA_UPLOAD_MAX_MEMORY_SIZE` in `core/settings.py` |
| Add a portal tab | Add an entry to `src/components/portal/portalTabs.js`, then render it in `pages/Portal.jsx` |
| Run the backend tests | `cd backend && python manage.py test api` |

---

## 👥 Team

| Name | Role |
|------|------|
| **Angel Vargas** | Project Lead / Full-Stack Development |
| **Nathaniel** | President |
| **Trevor** | Vice President |
| **Tony** | Treasurer |
| **Praneeth** | Secretary |
| **Windy** | Project Manager |
| **Andrew** | Public Representative |
| **Katelynn** | Social Media Manager |

---

*UC Merced Robotics Society · School of Engineering · University of California, Merced*