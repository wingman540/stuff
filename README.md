# LinkedUp 🪜

**Careers start here.** LinkedUp is a mobile app — think LinkedIn, but built for
**high school and college students** — to explore careers, find first jobs &
internships, and connect with verified career mentors in a **safe, monitored**
environment.

It's a React + TypeScript app (Vite) designed mobile-first and presented inside a
phone frame so you can preview it on a laptop or run it full-screen on a phone.

## ✨ Features

| Area | What it does |
| --- | --- |
| 🏠 **Home** | A LinkedIn-style feed of opportunities, mentor advice, and safety tips, plus the careers you're exploring. |
| 💼 **Jobs** | Internships, part-time roles, paid apprenticeships, and volunteer gigs from **verified, youth-friendly employers** — each shows pay and a minimum age. |
| 🧭 **Explore** | Three views in one: a **career library**, **"Day in the Life" videos**, and an **earnings dashboard**. |
| 🎬 **Day in the Life** | Short videos where real professionals show what their workday is actually like. |
| 📊 **Earnings dashboard** | Compare **lifetime earnings** vs. **cost of training** across careers, sorted by pay, lowest cost, or best value (ROI). |
| 🧑‍🏫 **Mentors** | Identity-verified, background-checked professionals who volunteer to guide students. |
| 🛡️ **Safe network** | Message verified mentors and official **company HR / recruiting team inboxes** — never a stranger's personal number. |

## 🔒 Youth-safety safeguards (built in throughout)

LinkedUp is designed for minors, so safety isn't a feature — it's the foundation:

- **Verified-only contacts** — every mentor and employer is identity-verified and
  background-checked before they can reach a student.
- **Guardian oversight** — for users under 18, a parent/guardian can review
  conversations and is notified of applications and new connections.
- **Live safe-message filter** — the chat composer blocks messages that contain
  phone numbers, emails, home addresses, requests to meet in person, money/payment
  requests, or attempts to move the chat off-platform. _(See `src/screens/ThreadScreen.tsx`
  — try typing a phone number into a chat to see it in action.)_
- **Team inboxes, not personal numbers** — company contacts are HR/recruiting/
  apprenticeship team inboxes that have opted in to mentoring students.
- **One-tap report & block**, **quiet hours**, and **verified-only messaging** are
  on by default for student accounts.

## 🚀 Run it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
# or
npm run build && npm run preview   # production build + preview
```

Open the URL on a phone for the full-screen mobile experience, or on a desktop to
see it inside the phone frame.

## 🧱 Tech & structure

- **React 18 + TypeScript + Vite**, no UI framework — hand-rolled mobile CSS.
- State-based navigation with a small back-stack (`src/nav.ts`, `src/App.tsx`).

```
src/
  App.tsx              # shell: app bar, tab bar, navigation, toasts
  nav.ts               # navigation types
  data/                # types + illustrative career / job / mentor / chat data
  components/ui.tsx    # shared bits: Avatar, badges, money formatting
  screens/             # Home, Jobs, Explore, Mentors, Network, Profile + detail views
```

> ⚠️ **Note:** Career salaries, lifetime-earnings, and training costs are rounded
> U.S. estimates for exploration only — not guarantees. People and chat threads are
> sample data to demonstrate the experience.
