# Sprint Zero — Scope

## Reference

- **Company URL:** https://www.sciencebuddies.org/
- **Repo URL:** not provided

## Build configuration

- **Project type:** web-app
- **Stack profile:** node-react
- **Data layer:** local

A React + Vite UI talking to an Express API, with experiments, ratings, and a per-kid saved list stored locally in SQLite, plus self-issued JWT auth (no external account or keys needed).

## Build level

**MVP**

Real signup/login and real persisted data on the core loop: a kid can search experiments, rate them, and save them to their own list, and those choices survive a refresh and re-login.

## Core loop

A kid signs in, searches the experiment library by topic or purpose (e.g. "volcano", "plants", "rainy-day fun"), opens an experiment to read kid-sized instructions, gives it a star rating, and saves the ones they want to try to a personal "Experiments to try" list.

## Excludes

None specified.

## Assumptions made during scoping

- **Project type** — defaulted to `web-app`. The request describes a website kids browse and interact with. `[ASSUMED]`
- **Stack profile** — defaulted to `node-react` (Express + React/Vite). `[ASSUMED]`
- **Data layer** — defaulted to `local` (SQLite + self-issued JWT), so it runs straight after clone with no account. `[ASSUMED]`
- **Core loop** — inferred from the reference (Science Buddies) and the request: search experiments by purpose/topic, rate them, and build a saved list to try. `[ASSUMED]`
- **Kid-friendly, interactive UI with bite-sized information** is treated as a design directive on the frontend (large playful controls, short digestible cards, encouraging tone), not as a separate scope item. `[ASSUMED]`
