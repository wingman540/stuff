# LinkedUp — Realistic Build Roadmap (Demo → Real Product)

> Status today: a polished **front-end prototype**. No backend, no auth, no
> database; data is sample/illustrative, "videos" are simulated, and all state
> lives in the browser's `localStorage`. This document is the honest path to a
> real, safe, shippable product.

The hard part of LinkedUp is **not** the screens you've seen — it's the three
things that make it trustworthy and legal: **(1) keeping minors safe, (2) real
identity/background verification, and (3) content moderation at scale.** The
roadmap is organized around de-risking those first.

---

## 0. The non-negotiable constraint: this is a product for minors

Everything below is shaped by one fact — **a meaningful share of users are under
18**. That triggers legal, trust, and cost realities most consumer apps never
face:

- **COPPA** (US, under-13): verifiable parental consent, data minimization,
  deletion rights. Easiest mitigation: **13+ only at launch**, with verified
  guardian consent for 13–17.
- **State minor-safety / "age-appropriate design" laws** (e.g. California
  AADC) and **KOSA-style** federal scrutiny: duty-of-care, safety-by-default,
  no dark patterns.
- **FERPA** if you integrate with schools/districts.
- **Mandatory-reporting & CSAM obligations**: if minors message adults, you are
  legally and morally on the hook for detection and reporting (NCMEC).
- **Background checks on adults** (mentors, employers) — FCRA compliance if you
  use a screening vendor.

**Implication:** budget for a privacy/safety attorney *before* launch (~$10–25k
for initial review + policies). This is not optional and investors will ask.

---

## Phase 1 — Foundations & "real" core (≈ 6–10 weeks)

Goal: turn the prototype into a real app with accounts and a backend, **without**
yet exposing minors to strangers.

**Stack (pragmatic, boring-on-purpose):**
- Keep the React front end; migrate to **Next.js** (SSR, routing, API routes) or
  keep Vite + a separate API.
- **Backend:** Supabase or Firebase to start (managed auth + Postgres/Firestore +
  storage + row-level security) — fastest path for a small team. Move to a custom
  Node/Postgres service only when you outgrow it.
- **Auth:** email/OAuth, with **age gate + guardian-email verification** for
  under-18.
- **Infra:** Vercel (front end) + managed DB; IaC later.

**Work:**
- Real data models: users, guardians, careers, jobs, mentors, sessions,
  messages, approvals, audit log.
- Replace `localStorage` user store with real auth + persisted profiles.
- Move careers/jobs/earnings to the DB (admin-editable).
- **Cited earnings data:** replace illustrative numbers with BLS OES / Education
  data, stored with source + date. (This is also a credibility fix for the
  pitch.)
- Basic analytics + error monitoring (PostHog/Sentry).

**Exit criteria:** real people can sign up, build a profile, browse careers/jobs,
and watch real "day in the life" videos. **No stranger-to-minor messaging yet.**

---

## Phase 2 — The safety system (≈ 8–14 weeks) — *the real moat*

This is the most expensive, most differentiating phase. Do not skip or fake it.

1. **Identity & background verification for adults (mentors, employer reps):**
   - Integrate a vendor — **Persona/Stripe Identity** for ID verification,
     **Checkr** for background checks. Don't build this yourself.
   - "Verified" badge only after passing. Re-screen periodically.

2. **Messaging with real safeguards:**
   - Server-side message pipeline (not the client-side regex in the demo).
   - **Moderation:** an ML classifier (OpenAI/Google moderation APIs, or
     Hive/Sift) for grooming, PII, self-harm, harassment, off-platform contact.
     The demo's filter is a placeholder for this.
   - **Guardian co-visibility** for minors; quiet hours; rate limits.
   - **CSAM detection + NCMEC reporting** workflow (legal requirement).

3. **Trust & Safety operations:**
   - Report/block → real queue with human reviewers (even if it's *you* at
     first). Define SLAs, escalation, and an incident runbook.
   - Audit logging for every sensitive action.

4. **Guardian consent & controls:** real guardian accounts, consent records,
   approval workflows (the dashboard you demoed, made real).

**Exit criteria:** a 16-year-old can message a *verified* mentor, a guardian can
oversee it, unsafe content is caught and escalated, and you can prove all of it
in an audit log.

> Reality check: Phases 1–2 are **~4–6 months for 2–3 engineers**, and the safety
> vendors carry real per-check/per-message costs. This is why "safety-first for
> minors" is a moat — it's hard and expensive, so it's defensible.

---

## Phase 3 — Marketplace & engagement (≈ 6–10 weeks)

Now make it useful enough to retain users and attract the paying side.

- **Real job/internship listings:** employer portal to post + verify; or seed via
  partnerships/scrapers with permission.
- **Real applications** routed to employers; status tracking.
- **Mentor onboarding funnel** (supply side — usually the hard side of a
  marketplace; recruit mentors before students).
- **Group sessions:** real scheduling + monitored group video (Zoom/Whereby/
  LiveKit) — never 1:1 minor↔adult video.
- **Notifications:** real push/email (web push, FCM, Resend/SendGrid).
- **"Day in the life" video:** real hosting (Mux/Cloudflare Stream) + a creator
  upload + moderation pipeline.

---

## Phase 4 — Pilot, then scale (ongoing)

- **Land one pilot:** a single school, district, or youth org. This is your
  traction story and your feedback loop. Don't go wide.
- **Pick the payer** and build for it:
  - **B2B2C via schools/districts** (likely best — they have budget and a
    duty-of-care need),
  - **Employer-paid verified recruiting** of early talent,
  - or workforce-development grants/nonprofits.
- Harden infra (load, on-call), accessibility (WCAG — important for schools),
  SOC 2 if selling to districts.

---

## Sequencing summary

| Phase | Focus | Rough time (2–3 eng) | Why it matters to investors |
|------|-------|----------------------|------------------------------|
| 1 | Accounts + backend + real data | 6–10 wks | Proves it's a product, not a mockup |
| 2 | **Safety, verification, moderation** | 8–14 wks | The moat + table-stakes for minors |
| 3 | Marketplace + engagement | 6–10 wks | Two-sided value, retention |
| 4 | Pilot + monetization + scale | ongoing | Traction + a business |

**Realistic to a safe, pilotable v1: ~6–9 months** with a small focused team,
*plus* legal review running in parallel from day one.

---

## What to do BEFORE writing more code (cheap, high-leverage)

These de-risk the biggest unknown — demand — and cost almost nothing:

1. **Talk to 30+ students and 10+ guardians.** Would they use it? What scares the
   guardians? This reshapes the product more than any feature.
2. **Recruit 5–10 real mentors** by hand. If you can't get mentors, the
   marketplace doesn't work — find out now.
3. **Get one pilot partner** (a school/club) verbally interested.
4. **Talk to a privacy attorney** about the minor-safety obligations above.
5. **Stand up a waitlist** off the current demo to measure real interest.

If those go well, *then* spend the 6–9 months building Phases 1–3. Traction +
this demo + a credible safety/legal plan = a fundable pre-seed story.

---

## Biggest risks (name them in your pitch before they ask)

- **Safety/liability with minors** — mitigated by Phase 2 + legal + 13+ gate.
- **Cold-start / mentor supply** — the hard side of the marketplace.
- **Monetization** — teens don't pay; you need schools or employers.
- **Incumbents** — LinkedIn, Handshake, TikTok career content, school
  counselors. Your wedge is *safe, youth-specific, guided*.
- **Build cost of trust** — the thing that makes you defensible is also what
  makes you slow/expensive. That's the bet.
