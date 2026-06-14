# Decisions

_Sprint Zero build compared to Science Buddies. Level: MVP._

## Why this document exists

We are building Lab Quest, a small kid-friendly take on Science Buddies' science-fair project finder. Science Buddies is a huge library with 1,200+ projects, a recommendation wizard, teacher and parent tools, careers content, and videos. Our MVP rebuilds only the one loop that matters for a curious kid: search experiments, read a short friendly page, rate it, and save it to a "to try" list. This document explains, for a non-technical reader, what we deliberately left out and why, plus the technical choices behind the build.

## Scope decisions

### Smaller, curated library instead of 1,200+ projects

- **Reference does:** Hosts over 1,200 scientist-developed project ideas.
- **We chose to:** Seed a modest library (roughly 15-30 experiments across several subjects) with rich tags.
- **Reason:** The MVP only needs enough content to prove the search → rate → save loop works; a curated set keeps reading quality high and the demo focused.

### Search + filters instead of the Topic Selection Wizard

- **Reference does:** Offers a Topic Selection Wizard — an interest questionnaire that recommends projects.
- **We chose to:** Provide keyword search plus subject and difficulty filters.
- **Reason:** Filtering covers the same "find something that fits me" need for the core loop without building a recommendation engine. The wizard is logged as a v2 idea.

### Kid-sized project pages instead of long reference pages

- **Reference does:** Detailed multi-section project pages (abstract, full procedure, variables, bibliography).
- **We chose to:** A single short page per experiment — summary, subject, difficulty, time, cost, materials, numbered steps.
- **Reason:** The core goal is bite-sized, absorbable information for kids; trimming each page to the essentials directly serves that.

### No teacher, parent, or classroom tools

- **Reference does:** Lesson plans, how-to-help guides, and classroom-management resources.
- **We chose to:** Build for a single kid user type only.
- **Reason:** Out of scope for an MVP focused on the kid's own find-and-save loop.

### No careers, videos, or blog content

- **Reference does:** Science career profiles, instructional videos, and articles.
- **We chose to:** Omit all of it.
- **Reason:** None of it is part of the core loop; including it would dilute a focused MVP.

### Ratings limited to the kid's own stars

- **Reference does:** Surfaces popularity and "best for beginners" style signals.
- **We chose to:** Per-user 1-5 star ratings plus a simple average shown on each experiment.
- **Reason:** Ratings are part of the core loop; richer social/popularity signals are not needed to demonstrate it.

### No content-management UI

- **Reference does:** Editorial team maintains the library.
- **We chose to:** Ship experiments as seed data with no in-app editing.
- **Reason:** Editing tools are unnecessary for an MVP demo of the kid experience.

## Technical decisions

### Stack: node-react + local data layer

- **We chose:** React (Vite) frontend, Express backend, local SQLite database with self-issued JWT login.
- **Reason:** The local data layer means the app runs immediately after clone with no account, keys, or `.env` — the right default for a demo kit. Sprint Zero ships from a small catalog of profiles so the build stays predictable.

### SQLite driver: Node's built-in `node:sqlite` (not `better-sqlite3`)

- **We chose:** The built-in `node:sqlite` module instead of the `better-sqlite3` package named in the stack catalog.
- **Reason:** The machine runs Node 26, for which `better-sqlite3` had no prebuilt binary and its native source build failed. `node:sqlite` ships inside Node, needs no compilation and no dependency, and keeps the API nearly identical — so it serves the "zero external setup, local" goal even better. No contract or behaviour change.

### Testing: API integration (browser QA deferred)

- **We chose:** Full HTTP integration tests against every endpoint (auth, search, filters, detail, rate set/update/clear, save idempotency, saved list, per-user isolation) plus a production build of the frontend to validate it compiles. Browser-driven Playwright QA was not run.
- **Reason:** The Playwright MCP server is not connected in this environment, so a real browser could not be driven. The API layer — where the core-loop logic lives — is fully verified, and the React build confirms the UI compiles with all imports resolved. The browser auth dance should still be exercised manually before any real demo.

### Build level: MVP

- **We chose:** MVP.
- **Reason:** The user wants to prove the idea actually works — real login, real persisted ratings and saved lists on the core loop — without spending effort on production hardening yet.

## What we'd add next

1. **Simplified "pick something for me" wizard** — high value, low effort; turns the existing filters into a guided one-tap suggestion for kids who freeze at a blank search.
2. **Larger, richer experiment library** — more content per subject so search and filters feel substantial; mostly seed-data work.
3. **Filter by time and cost in the UI** — already in the data model; surfacing these controls helps kids find quick or cheap experiments.
4. **Completion badges / rewards** — adds the game-like motivation that keeps kids coming back.
5. **Average-rating sorting and "popular this week"** — light social proof to help kids choose.
