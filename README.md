# Maram-SEVEN Abha Launch Tracker

Interactive dashboard tracking readiness for the SEVEN Abha destination launch — milestones, team workstreams, risks, and auto-generated review email summaries.

Live URL: _(add your Vercel URL here after deploying)_

---

## 🔑 Admin lock

The tracker has two modes:

- **Admin** (only you): full edit powers, publish button, add task, etc.
- **View-only** (everyone else): browse, filter, present, and generate email summaries — but cannot edit

**Your admin URL:** `<your-vercel-url>/?admin=maram-abha-2026`
**Team's URL:** `<your-vercel-url>/`

To change the admin token, edit `const ADMIN_TOKEN` in `src/App.jsx`.

---

## 📁 Repo structure

```
maram-seven-abha-tracker/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── data.json          ← published tracker state (what viewers see)
└── src/
    ├── App.jsx            ← main tracker component
    └── main.jsx           ← React entry point
```

---

## 🌐 Deploy to Vercel

1. Push all files to a new GitHub repo (`maram-seven-abha-tracker`, Public)
2. Go to **https://vercel.com/new** → sign in with GitHub
3. Import the repo → leave defaults → **Deploy**
4. Live URL ready in ~30 seconds

Any push to GitHub auto-redeploys.

---

## 🔄 Weekly workflow (admin)

1. Open your admin URL (with `?admin=...`)
2. Update tasks during/after the review meeting
3. Click green **⤴ Publish** button → downloads `data.json`
4. Go to GitHub → replace `public/data.json` with the downloaded file → commit
5. Vercel redeploys in ~30s → team sees updates

---

## ✨ Features

- Interactive milestone timeline with countdowns to Soft Opening and Grand Opening
- Task tracker across 5 workstreams: Brand, Attractions, Destinations, PR & Events, Media
- Editable status, risk, priority, comments (admin only)
- Presentation mode for review meetings
- Dashboard, Milestones, Detailed tracker, Kanban, Destination tracker views
- Auto-generated email summaries (leadership + team versions) — copy directly into Outlook with formatted tables
- Progress-since-last-review comparison after each snapshot
- Backup / Restore JSON for admin safety net
- Admin lock via URL token

---

## 🛠 Run locally (optional)

Requires Node.js 18+:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal.
