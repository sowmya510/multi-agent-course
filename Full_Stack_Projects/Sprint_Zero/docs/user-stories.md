# User stories

_Level: MVP. Expanded from `docs/prd.md`._

## Must-have

### Story 1 — Sign up

**Story:** As a new user, I want to sign up with email and password so that I can access the product.

**Acceptance criteria:**

- Given a new visitor on `/signup`, when they enter a valid email and a password and click "Create account", then a session is created and they land on the authenticated search screen at `/`.
- Given the signup form, when the email is already registered, then an inline error "That email is already taken" is shown and no new account is created.
- Given the signup form, when the email is invalid or the password is empty, then a validation message is shown and the submit does not proceed.

**Priority:** Must-have
**Effort:** Medium

### Story 2 — Log in

**Story:** As a returning user, I want to log in so that I can see my own data.

**Acceptance criteria:**

- Given a registered user on `/login`, when they enter the correct email and password and click "Log in", then a session is created and they land on the search screen showing their own saved list and ratings.
- Given the login form, when the email or password is wrong, then an inline error "Email or password is incorrect" is shown and no session is created.

**Priority:** Must-have
**Effort:** Small

### Story 3 — Session persists across reload

**Story:** As a signed-in user, I want my session to persist across reloads so that I don't have to log in every time.

**Acceptance criteria:**

- Given a logged-in user on the search screen, when they refresh the browser, then they remain on the authenticated screen and are not redirected to `/login`.
- Given a logged-in user, when they close and reopen the app in the same browser, then their session is restored and their saved list is still visible.

**Priority:** Must-have
**Effort:** Small

### Story 4 — Log out

**Story:** As a signed-in user, I want to log out so that my session ends.

**Acceptance criteria:**

- Given a logged-in user, when they click "Log out", then their session ends and they are redirected to `/login`.
- Given a logged-out user, when they navigate directly to `/` or `/saved`, then they are redirected to `/login`.

**Priority:** Must-have
**Effort:** Small

### Story 5 — Search experiments

**Story:** As a kid, I want to search experiments by keyword so that I can quickly find ones that interest me.

**Acceptance criteria:**

- Given a logged-in kid on the search screen, when they type "plants" into the search box and submit, then only experiments whose title, summary, or subject match "plants" are shown as cards.
- Given a search with no matches, when results are empty, then a friendly empty-state message ("No experiments found — try another word!") is shown.
- Given an empty search box, when the screen loads, then all experiments are shown.

**Priority:** Must-have
**Effort:** Medium

### Story 6 — Filter experiments

**Story:** As a kid, I want to filter experiments by subject and difficulty so that I only see ones I can actually do.

**Acceptance criteria:**

- Given the search screen, when the kid selects subject "Biology", then only Biology experiments remain visible.
- Given a subject filter is active, when the kid also selects difficulty "Easy", then only Easy Biology experiments remain (filters combine).
- Given active filters and a keyword, when both are set, then results match the keyword and all selected filters together.
- Given active filters, when the kid clears them, then the full list (subject to any keyword) returns.

**Priority:** Must-have
**Effort:** Medium

### Story 7 — Read an experiment

**Story:** As a kid, I want to open an experiment and read a short, friendly page so that I understand it without being overwhelmed.

**Acceptance criteria:**

- Given a results card, when the kid clicks it, then they see a detail page at `/experiments/:id` showing title, summary, subject, difficulty, estimated time, cost, a materials list, and numbered steps.
- Given a detail page, when it renders, then the materials and steps are each shown as readable short lists, not one long paragraph.

**Priority:** Must-have
**Effort:** Medium

### Story 8 — Rate an experiment

**Story:** As a kid, I want to give an experiment a star rating so that I can remember how much I liked it.

**Acceptance criteria:**

- Given an experiment detail page, when the kid clicks the 4th star, then a 4-star rating is saved and the stars show 4 filled.
- Given the kid has rated an experiment, when they reload or reopen that experiment, then their previous rating is still shown filled.
- Given the kid already rated an experiment, when they click a different star, then the rating updates to the new value (no duplicate ratings).

**Priority:** Must-have
**Effort:** Medium

### Story 9 — Save to list

**Story:** As a kid, I want to save an experiment to my "Experiments to try" list so that I can come back to it later.

**Acceptance criteria:**

- Given an experiment detail page or card, when the kid clicks "Save", then the experiment is added to their saved list and the control switches to a "Saved" state.
- Given a saved experiment, when the kid reloads or logs back in, then it is still in their saved list.
- Given an already-saved experiment, when the kid clicks the control again, then it is removed from the saved list (toggle behaviour).

**Priority:** Must-have
**Effort:** Medium

### Story 10 — Manage saved list

**Story:** As a kid, I want to view and remove items from my saved list so that I can manage what I plan to try.

**Acceptance criteria:**

- Given saved experiments, when the kid opens `/saved`, then all saved experiments are listed as cards.
- Given the saved list, when the kid clicks "Remove" on one, then it disappears from the list immediately and stays gone after reload.
- Given an empty saved list, when `/saved` loads, then a friendly empty-state ("Nothing saved yet — go find an experiment!") is shown.

**Priority:** Must-have
**Effort:** Small

## Should-have

### Story 11 — See average rating

**Story:** As a kid, I want to see the average rating on each experiment so that I know which ones other kids liked.

**Acceptance criteria:**

- Given an experiment with one or more ratings, when it appears on a card or detail page, then its average star rating and rating count are shown.
- Given an experiment with no ratings, when it appears, then it shows "Not rated yet" instead of a number.

**Priority:** Should-have
**Effort:** Small

### Story 12 — Change or remove a rating

**Story:** As a kid, I want to change or remove a rating I gave so that I can update my opinion.

**Acceptance criteria:**

- Given the kid has rated an experiment, when they pick a different number of stars, then their rating updates and the average recomputes.
- Given the kid has a rating, when they clear it, then their rating is removed and the average recomputes.

**Priority:** Should-have
**Effort:** Small

### Story 13 — Filter by time and cost

**Story:** As a kid, I want to filter by time required and cost so that I can find quick or cheap experiments.

**Acceptance criteria:**

- Given the search screen, when the kid selects time "Under an hour", then only experiments within that time band remain.
- Given the search screen, when the kid selects cost "Free", then only no-cost experiments remain, combining with any other active filters.

**Priority:** Should-have
**Effort:** Small

## Nice-to-have

- As a kid, I want a "pick something for me" one-tap suggestion (simplified Topic Selection Wizard) so that I don't have to choose from scratch.
- As a kid, I want completion badges so that doing science feels rewarding.

## Edge cases to discuss

- A kid rates and saves an experiment, then logs out and logs in as a different kid — each kid must see only their own ratings and saved list, never the other's.
- Search and filters active at once with zero combined matches — the empty state must appear rather than a stale list.
- Saving the same experiment twice (double-click) must not create duplicate saved rows.
- Average rating display when seeded ratings exist but the current kid hasn't rated — the kid sees the average but no personal selection.

## Questions for the team

1. Should ratings be visible to other kids (a true average across all users) or kept private per kid? Assumed: a shared average is shown, the kid's own selection is highlighted.
2. Is a ~15-30 experiment seeded library enough to demo search and filters convincingly, or do we need more breadth per subject?
