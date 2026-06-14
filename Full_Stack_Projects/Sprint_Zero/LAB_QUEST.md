# Lab Quest

A kid-friendly science-experiment finder, built with Sprint Zero from the Science Buddies reference. Curious 8-to-13-year-olds sign in, search a library of experiments, read a bite-sized page, rate it, and save the ones they want to try.

---

## What you built

Lab Quest is an MVP web app with one core loop that works end to end: a kid signs in, searches the experiment library by keyword, subject, or difficulty, opens an experiment to read kid-sized instructions, gives it a star rating, and saves it to a personal "field journal" list. Ratings and saved items are real, per-user, and persist across reloads and re-logins.

It has two parts:

- A backend API (Express + SQLite) implementing nine endpoints to a fixed contract: signup, login, session check, list experiments (with search and filters), get one experiment, set/clear a rating, and list/add/remove saved items. Auth is a self-issued JWT. The seed creates 18 realistic experiments across five subjects (Biology, Chemistry, Physics, Environmental Science, Earth Science), a demo user, a test user, and a few extra raters so averages look real.
- A React (Vite) frontend with five screens — signup, login, search, experiment detail, and the saved "field journal" — styled in a bold "Wild Explorer" theme inspired by Nat Geo Kids (sunshine-yellow and jungle-green, thick black sticker frames, chunky badges, subject color-coding, and an adventure display font).

The full spec set that drove the build lives in `docs/` (scope, reference brief, PRD, decisions, user stories, API contract).

## Why you chose this component

The build configuration is `web-app / node-react / local`, chosen to match the audience and the demo goal:

- **Local data layer (SQLite + self-issued JWT)** so the app runs straight after clone with no account, keys, or `.env`. For a demo handed to non-developers, zero external setup matters more than a hosted database.
- **`node:sqlite` instead of `better-sqlite3`.** The original plan used `better-sqlite3`, but it has no prebuilt binary for the installed Node 26 and its native build fails. Node's built-in `node:sqlite` needs no compilation and no dependency, and the API is nearly identical — so it serves the "zero setup" goal even better. (Logged in `docs/decisions.md`.)
- **Express + React/Vite (plain JavaScript)** because the code stays small and readable — a non-developer can follow it — and Vite gives a fast dev loop.
- **A single contract (`docs/api-contract.md`) as the source of truth.** The backend implements it, the frontend consumes it, and QA validates against it, so the two halves stay in sync.
- **A curated 18-experiment seed with rich metadata.** Search and filtering are only as good as the tags, so the seed carries exact subject/difficulty/time/cost values and short, readable steps — that metadata is effectively the product.

## How to run or test it

Prerequisites: Node.js (v26 was used here, installed via Homebrew). No database, account, or `.env` is needed.

Backend (port 3001):

```
cd server
npm install
node seed.js      # creates the SQLite schema and seeds experiments + demo users
node index.js
```

Frontend (port 5173), in a second terminal:

```
cd client
npm install
npm run dev
```

Then open http://localhost:5173 and sign in with either seeded account, or create your own from the signup screen:

| Account | Email | Password |
| ------- | ----- | -------- |
| Demo | `maya.patel@example.com` | `rocket123` |
| Test | `test@labquest.app` | `test1234` |

Testing:

- API integration — the endpoints were verified end to end with curl: signup (201) and duplicate signup (409), login and wrong-password (401), unauthenticated access (401), keyword search, combined subject + difficulty filters, detail with materials and steps, rating set/update/clear, invalid rating (400), save idempotency (no duplicate on double-save), the saved list, and per-user isolation (one kid never sees another's ratings or saved items).
- Browser — a Playwright script drives the real UI through the full journey (signup, search, save from a card and from the detail page, persistence to the backend, the saved list, rating set and persist after reload). All ten checks pass with no console errors.

## Any assumptions you made

- A single "kid" user type is enough for the MVP — no separate parent or teacher role.
- A curated library of about 15–30 experiments is enough to demonstrate search, filter, rate, and save convincingly; the library ships as seed data with no in-app editing.
- Ratings are per-user 1–5 stars; each experiment shows a shared average across all users while highlighting the current kid's own selection.
- "Kid-friendly, bite-sized, interactive" is treated as a design directive on the frontend (large playful controls, short cards, encouraging tone), not a separate feature.
- The Topic Selection Wizard, teacher/parent tools, careers, videos, and content management from the reference are out of scope for this level (recorded in `docs/decisions.md`).
- Data and auth are local, so no external account is required to run the demo; the JWT secret defaults to a baked-in dev value.
- The seed is non-destructive: it upserts experiments by a stable id and never deletes user saves or ratings, so re-seeding is safe.

## Any improvements or optimizations you recommend

Product, roughly in order of value per effort:

1. A simplified "pick something for me" suggestion — a one-tap version of the Topic Selection Wizard for kids who freeze at a blank search.
2. A larger, richer experiment library so search and filters feel substantial; mostly seed-data work.
3. Surface the time and cost filters in the UI (the data and API already support them).
4. Completion badges or rewards to add the game-like motivation that brings kids back.
5. Sort by average rating or a "popular this week" row for light social proof.

Technical, for a move toward production:

- Move to the `Prod` scope level: input validation with clear messages, loading and empty states on every screen, error boundaries, and an error-path test per loop.
- Add indexes on the experiment search/filter columns and paginate `GET /experiments` once the library grows beyond a few hundred rows.
- Real imagery or illustrations per experiment (the UI currently leans on subject icons and color), which is what makes Nat Geo Kids feel immersive.
- Bundle the display fonts locally instead of loading them from Google Fonts, so the UI looks right offline.
- Harden auth for real users: configurable JWT secret, token expiry/refresh, password strength rules, and basic rate limiting on the auth endpoints.
- Wire the Playwright checks into CI so regressions are caught automatically, and add an automated accessibility pass.
