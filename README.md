# UCM Robotics Society — Developer README

Welcome to the team! This document covers **everything you need** to get the project running on your machine: what to install, how to start both servers, and a full reference for every backend API route.

---

## 📁 Project Structure

```
Robotics Society UC Merced/
├── backend/                  ← Django (Python) — API server
│   ├── api/                  ← Our custom app (models, views, routes)
│   ├── core/                 ← Django project config (settings, urls)
│   ├── manage.py             ← Django CLI tool
│   └── db.sqlite3            ← Local database file (auto-created)
│
├── src/                      ← React (JavaScript) — Frontend
│   ├── pages/                ← One file per page/route
│   ├── assets/               ← Images, logos, team photos
│   ├── App.jsx               ← Route definitions
│   ├── Navbar.jsx            ← Top navigation bar
│   └── index.css             ← All site styling
│
├── vite.config.js            ← Frontend build config + API proxy
└── package.json              ← JavaScript dependencies
```

> **How it works:** React runs on port **5173** (what you see in the browser). Django runs on port **8000** (the API). Vite automatically forwards any `/api/...` request from React to Django — you never need to manually handle that.

---

## ✅ Prerequisites

Install these **once** on your machine before anything else.

| Tool | Version | How to check | Download |
|------|---------|--------------|----------|
| **Python** | 3.9 or higher | `python3 --version` | [python.org](https://python.org) |
| **Node.js** | 18 or higher | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | Comes with Node | `npm --version` | (included with Node) |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com) |

---

## 🚀 First-Time Setup

Do this **once** when you first clone the repo.

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR-ORG/Robotics-Society-UC-Merced.git
cd "Robotics Society UC Merced"
```

---

### Step 2 — Set up the Django backend

Open a terminal in the `backend/` folder:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
# Create the virtual environment
python3 -m venv venv

# Activate it — Mac/Linux:
source venv/bin/activate

# Activate it — Windows:
venv\Scripts\activate
```

> 💡 You'll know it's active when you see `(venv)` at the start of your terminal prompt.

Install all Python dependencies:

```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

Apply the database migrations (creates the database tables):

```bash
python manage.py migrate
```

---

### Step 3 — Set up the React frontend

In a **separate terminal**, go back to the root project folder:

```bash
cd "Robotics Society UC Merced"   # root folder (NOT backend/)
npm install
```

This installs all JavaScript packages listed in `package.json`.

---

## ▶️ Starting the Project (Every Time)

You need **two terminals running at the same time** whenever you work on this.

### Terminal 1 — Django Backend

```bash
cd backend
source venv/bin/activate      # Mac/Linux
# OR: venv\Scripts\activate   # Windows

python manage.py runserver
```

✅ You should see:
```
Starting development server at http://127.0.0.1:8000/
```

---

### Terminal 2 — React Frontend

```bash
cd "Robotics Society UC Merced"   # root folder
npm run dev
```

✅ You should see:
```
  VITE ready in ...ms
  ➜  Local:   http://localhost:5173/
```

Now open **http://localhost:5173** in your browser — that's the site.

---

## 👤 Creating the First Admin Account

The **first person to register** on a fresh database automatically becomes **admin**. This is built into the code.

So on a new machine, just:
1. Make sure both servers are running
2. Go to `http://localhost:5173/register`
3. Register an account — you're now admin
4. Log in and go to `/portal` — you'll see the Admin Panel tab

**Alternative (command line):**
```bash
cd backend
source venv/bin/activate
python manage.py createsuperuser
```
Then visit `http://127.0.0.1:8000/admin` to log into Django's built-in admin panel.

---

## 🔑 Role System

| Role | What they can do |
|------|-----------------|
| **pending** | Default after registration. Can view announcements and read chat. Cannot send messages. |
| **member** | Approved by admin. Can send chat messages and participate fully. |
| **admin** | Full access. Can approve users, manage roles, create announcements, delete messages, access Django admin. |

Admins approve pending users from the **Portal → Admin Panel** tab on the website.

---

## 🛣️ Backend API Routes

Base URL: `http://127.0.0.1:8000`

All API routes are under `/api/`. The Django built-in admin is at `/admin/`.

> **Authentication:** Every protected route requires an `Authorization` header:
> ```
> Authorization: Bearer <your_access_token>
> ```
> You get the token when you log in or register.

---

### 🔐 Auth Routes

| Method | Route | Auth Required | Who | Description |
|--------|-------|--------------|-----|-------------|
| `POST` | `/api/auth/register` | ❌ No | Anyone | Create a new account. Returns JWT tokens immediately. Body: `{ username, email, password, confirm_password }` |
| `POST` | `/api/auth/login` | ❌ No | Anyone | Log in. Returns `access` + `refresh` tokens. Body: `{ username, password }` |
| `POST` | `/api/auth/refresh` | ❌ No | Anyone | Get a new access token using your refresh token. Body: `{ refresh }` |
| `GET`  | `/api/auth/me` | ✅ Yes | Any logged-in user | Returns the currently logged-in user's data |

---

### 👥 User Management Routes (Admin Only)

| Method | Route | Auth Required | Who | Description |
|--------|-------|--------------|-----|-------------|
| `GET`  | `/api/auth/users` | ✅ Yes | Admin only | List all users in the database |
| `POST` | `/api/auth/users/<id>/approve` | ✅ Yes | Admin only | Approve a pending user — changes their role to `member` |
| `PUT`  | `/api/auth/users/<id>/role` | ✅ Yes | Admin only | Change a user's role. Body: `{ role }` where role is `pending`, `member`, or `admin` |

---

### 📢 Announcements Routes

| Method | Route | Auth Required | Who | Description |
|--------|-------|--------------|-----|-------------|
| `GET`    | `/api/announcements/` | ✅ Yes | Any logged-in user | List all announcements (pinned first, then newest) |
| `POST`   | `/api/announcements/create` | ✅ Yes | Admin only | Create a new announcement. Body: `{ title, content, is_pinned }` |
| `GET`    | `/api/announcements/<id>/` | ✅ Yes | Admin only | Get a single announcement by ID |
| `PUT`    | `/api/announcements/<id>/` | ✅ Yes | Admin only | Edit an announcement |
| `DELETE` | `/api/announcements/<id>/` | ✅ Yes | Admin only | Delete an announcement |

---

### 💬 Chat Routes

| Method | Route | Auth Required | Who | Description |
|--------|-------|--------------|-----|-------------|
| `GET`    | `/api/chat/channels/` | ✅ Yes | Any logged-in user | List all chat channels |
| `GET`    | `/api/chat/channels/<id>/messages/` | ✅ Yes | Any logged-in user | Get all messages in a channel (pending users can read) |
| `POST`   | `/api/chat/channels/<id>/messages/send` | ✅ Yes | Members + Admins only | Send a message in a channel. Body: `{ content }` |
| `DELETE` | `/api/chat/messages/<id>/delete` | ✅ Yes | Message author or Admin | Soft-delete a message (hides it but keeps it in the DB) |

---

### 🛠️ Django Built-in Routes

| Route | Description |
|-------|-------------|
| `http://127.0.0.1:8000/` | Health check — shows "Robotics Society Backend Running" |
| `http://127.0.0.1:8000/admin` | Django's built-in admin dashboard — manage all data via GUI |

> ⚠️ **Important:** Always open `/admin` at `http://127.0.0.1:8000/admin` directly — **not** through the React app's URL. The "Django Admin" button in the portal opens it in a new tab at the correct address automatically.

---

## 📦 Full Dependency List

### Python (Backend)

| Package | What it does |
|---------|-------------|
| `django` | The web framework — handles routing, database, admin panel |
| `djangorestframework` | Adds REST API capabilities to Django |
| `djangorestframework-simplejwt` | JWT token authentication (login sessions) |
| `django-cors-headers` | Allows React (port 5173) to communicate with Django (port 8000) |

Install all at once:
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

### JavaScript (Frontend)

| Package | What it does |
|---------|-------------|
| `react` | UI component framework |
| `react-dom` | Renders React components into the browser |
| `react-router-dom` | Client-side routing — handles all the `/projects/...`, `/portal`, etc. URLs |
| `vite` | Build tool and dev server with hot-reload |
| `@vitejs/plugin-react` | Vite plugin that adds React support |

Install all at once:
```bash
npm install
```
(This reads `package.json` and installs everything automatically.)

---

## 🔧 Useful Commands

### Django

```bash
# Apply database changes after editing models.py
python manage.py migrate

# Create migration files after changing models.py
python manage.py makemigrations

# Open a Python shell with Django loaded (good for debugging)
python manage.py shell

# Create a superuser from the command line
python manage.py createsuperuser
```

### npm / React

```bash
# Start dev server (use this while developing)
npm run dev

# Build for production (outputs to dist/ folder)
npm run build

# Install a new package
npm install <package-name>
```

---

## ❓ Troubleshooting

**"Module not found" error in Django**
```bash
# Make sure your venv is activated, then reinstall
source venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

**"Cannot find module" error in React**
```bash
npm install
```

**Backend not responding / Network error in browser**
- Make sure Django is running in Terminal 1 (`python manage.py runserver`)
- Make sure React is running in Terminal 2 (`npm run dev`)
- Both need to be running at the same time

**403 Forbidden when logging into Django admin**
- This is fixed in `settings.py` via `CSRF_TRUSTED_ORIGINS`
- If it happens, restart Django: `Ctrl+C` then `python manage.py runserver`

**Database errors / "table does not exist"**
```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

---

## 🌐 All Local URLs at a Glance

| URL | What it is |
|-----|-----------|
| `http://localhost:5173` | The website (React frontend) |
| `http://localhost:5173/register` | Registration page |
| `http://localhost:5173/login` | Login page |
| `http://localhost:5173/portal` | Members-only portal |
| `http://localhost:5173/#projects` | Homepage projects section |
| `http://localhost:5173/#team` | Homepage team section |
| `http://127.0.0.1:8000` | Django backend health check |
| `http://127.0.0.1:8000/admin` | Django admin dashboard |
| `http://127.0.0.1:8000/api/auth/login` | API login endpoint |

---

*For questions, ping the project lead or check the code — every file has comments explaining what it does.*
