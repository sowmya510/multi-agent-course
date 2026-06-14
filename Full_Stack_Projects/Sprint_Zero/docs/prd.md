# Lab Quest — PRD

_Built with Sprint Zero. Reference: Science Buddies. Level: MVP._

## 1. Problem statement

Kids who need a science experiment — for a fair, for homework, or just for fun — usually land on sites built for adults: dense pages, long reading, and filters that assume you already know what you're looking for. A curious 8-to-13-year-old gets overwhelmed before they find anything they can actually do. Lab Quest gives kids a small, friendly library of science experiments they can search by purpose or topic, read in bite-sized pieces, rate, and collect into their own "to try" list — so finding something fun to do feels like a game, not homework.

## 2. Goals

- Enable a kid to search the experiment library and find a relevant experiment in under 30 seconds.
- Enable a kid to read everything they need about an experiment (what it teaches, what they need, the steps) on one digestible page without scrolling through walls of text.
- Enable a kid to rate any experiment and save it to a personal "Experiments to try" list that persists across logins.
- Keep every experiment's core info short enough to absorb in under a minute of reading.

## 3. Non-goals

- No Topic Selection Wizard / questionnaire-based recommendation engine (the MVP narrows by search and filters instead).
- No teacher, parent, or classroom-management tools, lesson plans, or how-to-help guides.
- No careers content, instructional videos, or blog/articles.
- No social features beyond the kid's own ratings (no comments, no following, no sharing).
- No content-management UI for editing the experiment library (experiments come from seed data).

## 4. Users & use cases

A 10-year-old has a science fair in two weeks and no idea what to do. She signs in, searches "plants," skims three short experiment cards, opens the one about how light affects bean sprouts, sees it needs only cups and seeds and takes about a week, gives it four stars, and saves it to her list so she can show her dad tonight.

A curious 8-year-old on a rainy Saturday wants something fun to do right now. He searches "rainy day," finds a quick experiment he can do with kitchen supplies, reads the four short steps, and tries it immediately.

A 12-year-old comparing options has already saved five experiments over the week. He logs back in, opens his "Experiments to try" list, re-reads two of them, lowers the rating on one that turned out to be boring, and removes it from his list.

## 5. User stories

### Must-have

- As a new user, I want to sign up with email and password so that I can access the product.
- As a returning user, I want to log in so that I can see my own data.
- As a signed-in user, I want my session to persist across reloads so that I don't have to log in every time.
- As a signed-in user, I want to log out so that my session ends.
- As a kid, I want to search experiments by keyword (topic or purpose) so that I can quickly find ones that interest me.
- As a kid, I want to filter experiments by subject and difficulty so that I only see ones I can actually do.
- As a kid, I want to open an experiment and read a short, friendly page (what it teaches, materials, steps, time, difficulty) so that I understand it without being overwhelmed.
- As a kid, I want to give an experiment a star rating so that I can remember how much I liked it.
- As a kid, I want to save an experiment to my "Experiments to try" list so that I can come back to it later.
- As a kid, I want to view and remove items from my saved list so that I can manage what I plan to try.

### Should-have

- As a kid, I want to see the average rating on each experiment so that I know which ones other kids liked.
- As a kid, I want to change or remove a rating I gave so that I can update my opinion.
- As a kid, I want to filter by time required and cost so that I can find quick or cheap experiments.

### Nice-to-have

- As a kid, I want a personalized "pick something for me" suggestion (a simplified Topic Selection Wizard) so that I don't have to choose from scratch.
- As a kid, I want to see badges for finishing experiments so that doing science feels rewarding.

## 6. Acceptance criteria

**Sign up**
Given I am a new visitor on the signup screen, when I enter a valid email and password and submit, then an account is created, I am logged in, and I land on the experiment search screen.

**Log in**
Given I have an existing account, when I enter my correct email and password, then I am logged in and can see my own saved list and ratings.

**Session persistence**
Given I am logged in, when I refresh or reopen the app, then I remain logged in and my saved list and ratings are still there.

**Log out**
Given I am logged in, when I click log out, then my session ends and I am returned to the login screen and can no longer reach protected pages.

**Search experiments**
Given I am logged in on the search screen, when I type a keyword and search, then I see only experiments whose title, topic, or purpose matches, displayed as short cards.

**Filter experiments**
Given I am on the search screen, when I select a subject and/or difficulty filter, then the visible experiments update to match the selected filters (combined with any active keyword).

**Read an experiment**
Given I am viewing the results, when I open an experiment, then I see one page with its title, a short kid-friendly summary, subject, difficulty, estimated time, cost, materials list, and numbered steps.

**Rate an experiment**
Given I am viewing an experiment, when I select a star rating, then my rating is saved, persists across reloads, and is reflected next time I open that experiment.

**Save to list**
Given I am viewing an experiment, when I tap save, then it is added to my "Experiments to try" list and remains there after I reload or log back in.

**Manage saved list**
Given I have saved experiments, when I open my saved list, then I see all of them, and when I remove one, then it disappears from the list and stays gone after reload.

## 7. Risks & assumptions

- **Risks**
  - Seed quality is the product: if the seeded experiments lack good subject/difficulty/time/cost tags or readable steps, search, filtering, and the "kid-sized" reading goal all fail. The seed must carry rich, realistic metadata.
  - Reading level: "kid-friendly and bite-sized" is subjective; copy that is still too dense would undercut the core goal.
  - Scope creep toward the full Science Buddies surface (videos, careers, wizard) could derail an MVP.
- **Assumptions**
  - `[ASSUMPTION]` A single kid user type is enough for the MVP — no separate parent/teacher role.
  - `[ASSUMPTION]` A modest seeded library (roughly 15-30 experiments across several subjects) is enough to demonstrate search, filter, rate, and save convincingly.
  - `[ASSUMPTION]` Ratings are per-user 1-5 stars; the displayed "average" is computed over seeded plus real ratings.
  - `[ASSUMPTION]` Data and auth are local (SQLite + self-issued JWT), so no external account is needed to run the demo.

## 8. Open questions

- None blocking. (Whether to add the simplified "pick for me" suggestion is a nice-to-have, not a build blocker.)

## 9. Success metrics

- **Leading indicator:** a new kid signs up and saves at least one experiment to their list within their first session.
- **Lagging indicator:** returning kids come back to a non-empty "Experiments to try" list and rate the experiments they actually tried.
