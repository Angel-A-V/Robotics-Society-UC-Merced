# UCM Robotics Society Platform

A full-stack community platform for the UC Merced Robotics Society — combining a public-facing robotics showcase website with a secure, real-time members-only portal.

---

## 🧭 Project Overview

**Public Website** — open to everyone
- Homepage with hero, project showcase, team section, and contact page
- Four project detail pages: BattleBots, Rally Kart, Robot Arm, Autonomous Robot
- Sponsor section, MESA Labs map, and social links

**Members Portal** — login required, approval-based
- Real-time Discord-style chat with channels, reactions, and file uploads
- Announcements board managed by admins
- Profile customization with avatar and bio
- Admin dashboard for user and content management

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Django + Django REST Framework |
| Real-Time | Django Channels + Daphne (WebSockets) |
| Auth | JWT via SimpleJWT |
| Database | SQLite (dev) → PostgreSQL (production) |
| Styling | Vanilla CSS + Flaticon Uicons |

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
Go to http://localhost:5173/register and sign up.

---

## 🔐 Security Notes

- `.env` and `db.sqlite3` are gitignored — never commit them
- Passwords are hashed using Django's built-in PBKDF2 — never stored plaintext
- New users default to `pending` role and cannot send messages until approved by an admin
- JWT tokens expire after 1 hour (access) and 7 days (refresh)

---

## 📁 Project Structure

```
Robotics Society UC Merced/
├── backend/
│   ├── api/              # Models, views, serializers, consumers
│   ├── core/             # Django settings, URLs, ASGI config
│   ├── manage.py
│   ├── requirements.txt
│   └── .env              # ← you create this locally, never committed
├── src/
│   ├── assets/           # Images, team photos, project photos
│   ├── pages/            # React page components
│   ├── hooks/            # Custom React hooks (WebSocket)
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

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
| **Andrew** | Public Relations |

---

*UC Merced Robotics Society · School of Engineering · University of California, Merced*