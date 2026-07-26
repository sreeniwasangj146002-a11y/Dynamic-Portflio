# Portfolio — with Admin Panel

A full-stack portfolio site (MERN-style) with a protected `/admin` dashboard.
Everything on the public site — your name, photo, bio, skills, projects, and
certificates — is **dynamic**: nothing is hardcoded. You add it all yourself
through the admin panel after logging in.

```
portfolio/
├── backend/    Express API + JWT auth + file uploads + JSON file "database"
└── frontend/   React site (public pages + /admin dashboard)
```

## 1. Backend setup

```bash
cd backend
cp .env.example .env     # then edit ADMIN_USERNAME / ADMIN_PASSWORD / JWT_SECRET if you like
npm install
npm start
```

The backend runs on **http://localhost:5000**. On first run it creates
`backend/data/db.json` — an empty content file — plus your admin login
(from `.env`, default `admin` / `changeme123`).

No MongoDB or other database server is required — content is stored in that
one JSON file. Uploaded photos, resumes, and certificate files are saved
under `backend/uploads/`.

**Important:** change the default admin password the first time you log in
(Admin Panel → Security), and put a real random string in `JWT_SECRET`
before deploying anywhere public.

## Contact form email

The public Contact section's "Send message" button won't actually deliver
mail until you configure it — add these to `backend/.env`:

```
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=your16charapppassword
```

`EMAIL_PASS` must be a **Gmail App Password**, not your normal Gmail
password:
1. Turn on 2-Step Verification: https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Paste the 16-character password (no spaces) into `EMAIL_PASS`

Messages are delivered to `EMAIL_TO` (defaults to `EMAIL_USER` if not set),
and each email's Reply-To is set to the visitor's address so you can just
hit reply. To use a different provider instead of Gmail, set `SMTP_HOST` /
`SMTP_PORT` / `SMTP_SECURE` in `.env` (see the comments in `.env.example`).

If email isn't configured, the form fails with a clear error instead of
silently pretending to succeed — so you'll always know if a message didn't
actually go out.

## 2. Frontend setup

```bash
cd frontend
npm install
npm start
```

The site runs on **http://localhost:3000** and talks to the backend at
**http://localhost:5000** by default (set automatically — no proxy
configuration needed, and this also makes uploaded photos/resumes/
certificates resolve correctly no matter how the frontend is served). Visit:

- **http://localhost:3000/** — the public portfolio (empty until you add content)
- **http://localhost:3000/admin/login** — admin login

Log in with the credentials from `backend/.env`, then use the sidebar to fill in:

| Tab | What it controls |
|---|---|
| Home | Name, title, tagline, stats, profile photo, resume PDF, contact links |
| About | Bio paragraphs, highlights, education timeline |
| Skills | Skill categories and tags |
| Experiences | Work history — company, role, dates, description, highlights |
| Experience Projects | Projects built as part of a job — add/edit/delete, upload a cover image |
| Personal Projects | Side/academic projects — add/edit/delete, upload a cover image |
| Certificates | Add/edit/delete certificates, upload the certificate file/image |
| Contact | Email, phone, location, availability note (shown on the public Contact section) |
| Appearance | Font style (4 curated presets) and base text size for the whole public site |
| Security | Change your admin password |

Everything saves to the backend immediately — no rebuild needed, just refresh
the public site to see your changes.

## 3. Building for production

```bash
cd frontend
npm run build
```

This creates `frontend/build/` — a static bundle you can serve with any
static host (Netlify, Vercel, nginx, etc.), as long as it's configured to
fall back to `index.html` for client-side routes like `/admin`. Create a
`frontend/.env` with `REACT_APP_API_URL` pointing at wherever you deploy
the backend, e.g.:

```
REACT_APP_API_URL=https://api.yourdomain.com
```

Without this, the frontend defaults to `http://localhost:5000`, which is
correct for local testing but must be set explicitly for any real
deployment — otherwise API calls and uploaded file links (photos, resumes,
certificates) will point at the wrong place.

Deploy `backend/` anywhere that can run Node (Render, Railway, a VPS, etc.),
keeping the `uploads/` folder persistent so files aren't lost on restart.

## Notes

- **Theme:** a dark navy design with a purple → blue gradient identity, plus
  pink and orange used as rotating accent colors on stat cards, skill tiles,
  and tag pills. A fixed icon sidebar (Home/About/Skills/Projects/
  Experience/Contact) sits on the left on desktop, with a matching top bar
  and a sun/moon toggle that switches to a light variant (remembered on
  return visits).
- **Typography:** the whole site uses a consistent rem-based type scale, so
  the base text size you pick in Appearance scales every heading, label,
  and paragraph proportionally rather than just the body text. Four
  curated font pairings are available (Modern, Classic, Elegant,
  Technical) with a live preview in the admin panel.
- **Real tech logos:** skill tags and project tech pills are matched
  against a library of ~40 recognized technologies (React, Node.js,
  MongoDB, Tailwind, Docker, etc.) and rendered with their actual brand
  icon and color; anything not recognized falls back to a generic icon —
  so it stays fully dynamic no matter what you type into the admin panel.
- The public site is fully responsive (sidebar collapses on mobile in
  favor of the navbar's menu) and gracefully shows a small "not configured
  yet" note for any section you haven't filled in.
- Projects are split into two independently-managed lists — **Experience
  Projects** (built on the job) and **Personal Projects** (built on your
  own time) — each with its own admin tab and public section.
