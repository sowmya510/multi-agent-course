# API contract

_Sprint Zero build. Stack: node-react. Data layer: local. Level: MVP._

## Auth

The backend exposes `POST /auth/signup` and `POST /auth/login` (and `GET /auth/me`), which return `{ access_token, user }`. The client stores the token and sends it as `Authorization: Bearer <token>` on every protected call; the backend verifies its own JWT (signed with a secret that defaults to a baked-in dev secret, so no `.env` is needed).

Invalid or expired tokens return `401 Unauthorized`. Every user-owned record (ratings, saved items) is scoped to the authenticated user by `user_id`. List endpoints return only the current user's records. Ownership is checked on every write. Experiments are shared library content, but every experiment response is annotated with the current user's own rating and saved state.

## Base URL

`http://localhost:3001`

## Entities

- `User` — a kid account (`id`, `email`, `created_at`). Password is stored hashed and never returned.
- `Experiment` — a science experiment in the shared library (`id`, `title`, `summary`, `subject`, `difficulty`, `time_band`, `cost_band`, `materials[]`, `steps[]`). Read-only from seed data.
- `Rating` — a single kid's 1-5 star rating of one experiment (one per user per experiment).
- `SavedItem` — an entry in a kid's personal "Experiments to try" list (one per user per experiment).

## Endpoints

### POST /auth/signup

**Purpose:** Create a new kid account and return a session token.
**Auth:** public
**Request body:**
```json
{ "email": "maya.patel@example.com", "password": "rocket123" }
```
**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "8f1c2e7a-1d3b-4a90-bb21-9e4c2f0a7d11", "email": "maya.patel@example.com", "created_at": "2026-06-14T15:00:00Z" }
}
```
**Error responses:**
- `409 Conflict` — `{ "error": "email_taken", "message": "That email is already taken." }`
- `400 Bad Request` — `{ "error": "invalid_input", "message": "Email and password are required." }`
**Notes:** Password is hashed with bcryptjs before storage.

### POST /auth/login

**Purpose:** Authenticate an existing kid and return a session token.
**Auth:** public
**Request body:**
```json
{ "email": "maya.patel@example.com", "password": "rocket123" }
```
**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "8f1c2e7a-1d3b-4a90-bb21-9e4c2f0a7d11", "email": "maya.patel@example.com", "created_at": "2026-06-14T15:00:00Z" }
}
```
**Error responses:**
- `401 Unauthorized` — `{ "error": "invalid_credentials", "message": "Email or password is incorrect." }`
**Notes:** none

### GET /auth/me

**Purpose:** Return the current user from the session token (used to restore a session on reload).
**Auth:** required
**Request body:** none
**Response:** `200 OK`
```json
{ "user": { "id": "8f1c2e7a-1d3b-4a90-bb21-9e4c2f0a7d11", "email": "maya.patel@example.com", "created_at": "2026-06-14T15:00:00Z" } }
```
**Error responses:**
- `401 Unauthorized` — `{ "error": "unauthorized", "message": "Missing or invalid token." }`
**Notes:** Logout is client-side (the client discards the token); there is no server logout endpoint.

### GET /experiments

**Purpose:** List experiments in the shared library, with optional keyword and filters. Each item is annotated with the average rating, the current user's own rating, and whether the user has saved it.
**Auth:** required
**Request body:** none
**Query params (all optional):**
- `q` — keyword matched against title, summary, and subject (case-insensitive)
- `subject` — exact subject, e.g. `Biology`
- `difficulty` — `Easy` | `Intermediate` | `Advanced`
- `time_band` — `Under an hour` | `A few hours` | `Multiple days`
- `cost_band` — `Free` | `Low` | `Medium`
**Response:** `200 OK`
```json
{
  "experiments": [
    {
      "id": "c2a1...",
      "title": "Does light make bean sprouts grow faster?",
      "summary": "Grow bean seeds in light and dark and see which sprouts win.",
      "subject": "Biology",
      "difficulty": "Easy",
      "time_band": "Multiple days",
      "cost_band": "Free",
      "average_rating": 4.5,
      "rating_count": 12,
      "my_rating": 4,
      "is_saved": true
    }
  ]
}
```
**Notes:** `my_rating` is `null` if the user hasn't rated it. `average_rating` is `null` and `rating_count` is `0` when no one has rated it. Filters combine with AND; an empty result returns `{ "experiments": [] }`.

### GET /experiments/:id

**Purpose:** Get one experiment with full detail (materials and steps), annotated for the current user.
**Auth:** required
**Request body:** none
**Response:** `200 OK`
```json
{
  "id": "c2a1...",
  "title": "Does light make bean sprouts grow faster?",
  "summary": "Grow bean seeds in light and dark and see which sprouts win.",
  "subject": "Biology",
  "difficulty": "Easy",
  "time_band": "Multiple days",
  "cost_band": "Free",
  "materials": ["4 dried beans", "2 clear cups", "Paper towels", "Water"],
  "steps": [
    "Wrap two beans in a wet paper towel and put them in each cup.",
    "Put one cup on a sunny windowsill and one in a dark cupboard.",
    "Keep the towels damp and check both cups every day for a week.",
    "Measure the sprouts and compare which grew taller."
  ],
  "average_rating": 4.5,
  "rating_count": 12,
  "my_rating": 4,
  "is_saved": true
}
```
**Error responses:**
- `404 Not Found` — `{ "error": "not_found", "message": "Experiment not found." }`
**Notes:** none

### PUT /experiments/:id/rating

**Purpose:** Set or update the current user's star rating for an experiment.
**Auth:** required
**Request body:**
```json
{ "stars": 4 }
```
**Response:** `200 OK`
```json
{ "experiment_id": "c2a1...", "my_rating": 4, "average_rating": 4.5, "rating_count": 12 }
```
**Error responses:**
- `400 Bad Request` — `{ "error": "invalid_input", "message": "Stars must be an integer from 1 to 5." }`
- `404 Not Found` — `{ "error": "not_found", "message": "Experiment not found." }`
**Notes:** Idempotent per user — re-rating updates the existing row rather than creating a duplicate. `average_rating` and `rating_count` are recomputed and returned.

### DELETE /experiments/:id/rating

**Purpose:** Remove the current user's rating for an experiment.
**Auth:** required
**Request body:** none
**Response:** `200 OK`
```json
{ "experiment_id": "c2a1...", "my_rating": null, "average_rating": 4.6, "rating_count": 11 }
```
**Notes:** Returns `200` with the recomputed average even if the user had no prior rating (no-op).

### GET /saved

**Purpose:** List the current user's saved "Experiments to try", newest first.
**Auth:** required
**Request body:** none
**Response:** `200 OK`
```json
{
  "experiments": [
    {
      "id": "c2a1...",
      "title": "Does light make bean sprouts grow faster?",
      "summary": "Grow bean seeds in light and dark and see which sprouts win.",
      "subject": "Biology",
      "difficulty": "Easy",
      "time_band": "Multiple days",
      "cost_band": "Free",
      "average_rating": 4.5,
      "rating_count": 12,
      "my_rating": 4,
      "is_saved": true,
      "saved_at": "2026-06-14T15:10:00Z"
    }
  ]
}
```
**Notes:** Same experiment shape as the list endpoint, plus `saved_at`. Empty list returns `{ "experiments": [] }`.

### POST /saved

**Purpose:** Add an experiment to the current user's saved list.
**Auth:** required
**Request body:**
```json
{ "experiment_id": "c2a1..." }
```
**Response:** `201 Created`
```json
{ "experiment_id": "c2a1...", "is_saved": true, "saved_at": "2026-06-14T15:10:00Z" }
```
**Error responses:**
- `404 Not Found` — `{ "error": "not_found", "message": "Experiment not found." }`
**Notes:** Idempotent — saving an already-saved experiment returns `201`/`200` with `is_saved: true` and does not create a duplicate row.

### DELETE /saved/:experimentId

**Purpose:** Remove an experiment from the current user's saved list.
**Auth:** required
**Request body:** none
**Response:** `204 No Content`
**Notes:** No-op (still `204`) if the experiment was not saved.

## Conventions

- All request and response bodies are JSON.
- Timestamps are ISO 8601 strings (e.g. `"2026-01-15T09:30:00Z"`).
- IDs are UUID v4 strings, consistent across the contract.
- The backend never returns `user_id` in response bodies — it's implicit from the session.
- `POST` returns `201 Created` with the created resource.
- `PUT` returns `200 OK` with the updated resource.
- `DELETE` returns `204 No Content`.
- Error responses use shape: `{ "error": "short_code", "message": "Human readable." }`

## What agents must NOT do

- Do not add or remove endpoints without updating this file first.
- Do not change response shapes. The frontend and backend engineers build against this document in parallel — shape drift breaks the build.
- Do not skip JWT middleware on protected routes.
