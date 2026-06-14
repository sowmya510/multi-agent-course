# Reference brief — Science Buddies

**Company URL:** https://www.sciencebuddies.org/
**Repo URL:** not provided
**Language(s):** n/a

---

## What it does

Science Buddies is a free nonprofit education site that helps K-12 students find and carry out science fair projects and hands-on experiments. It hosts a library of 1,200+ scientist-developed project ideas across dozens of subjects (biology, chemistry, physics, environmental science, and more), each written so a student can pick something that fits their interests, grade level, budget, and the time they have. Its users are mostly students choosing a science fair project, plus the parents and teachers helping them.

## Core user flow

1. A student arrives not knowing what to do and either browses by subject/grade or uses the Topic Selection Wizard, which asks a few simple interest questions and returns a personalized shortlist.
2. They filter the project list by subject, difficulty, time required, cost, and materials to narrow it to projects they can actually do.
3. They open a project idea page and read a kid-sized summary: the question it answers, difficulty, estimated time, cost, and the materials and steps involved.
4. They decide whether it fits and either save it for later or move on to compare others.
5. They pick one and follow the full procedure to complete the experiment.

## How it works (high level)

- A large, categorized content library of project ideas, each tagged with structured metadata (subject, difficulty, time, cost, materials) that powers search and filtering.
- A recommendation flow (Topic Selection Wizard) that maps a short interest questionnaire to matching projects.
- Free accounts let students save projects and track the ones they are interested in.
- Search and faceted filtering sit on top of the tagged metadata so the same library can be sliced many ways (by grade, by subject, by quick-and-cheap, etc.).

## Feature inventory

| Feature | What it does |
|---------|--------------|
| Project idea library | 1,200+ project ideas, each a standalone page with summary, materials, steps. |
| Keyword search | Free-text search across the project library. |
| Filter by subject/topic | Narrow projects to a science area (biology, chemistry, physics, etc.). |
| Filter by difficulty | Easy / intermediate / advanced bands. |
| Filter by time required | Short vs multi-day projects. |
| Filter by cost | Free / low / higher material cost. |
| Filter by grade level | Elementary, middle, high school groupings. |
| Topic Selection Wizard | Interest questionnaire that returns a personalized project shortlist. |
| Project idea detail page | Summary, abstract, difficulty, time, cost, materials list, procedure steps. |
| Save / favorite projects | Logged-in students bookmark projects to a personal list. |
| User accounts | Free signup/login to persist saved projects and preferences. |
| Ratings / popularity signals | Projects surface popularity / "best for beginners" style signals. |
| Teacher & parent resources | Guides, lesson plans, and how-to-help material (out of scope for a kid MVP). |
| STEM activities & blog | Quick activities and articles beyond formal science-fair projects. |
| Careers & video content | Science career profiles and instructional videos. |

## Who it's for

The person setting it up is a teacher or parent steering a child toward a doable project, or the site's own editors curating the library. The end user is a K-12 student who needs to find a science experiment that matches their interests, grade, time, and budget, and then actually do it.

## Things worth flagging

- The structured per-project metadata (subject, difficulty, time, cost) is the heart of the product — search and filtering are only as good as those tags, so the MVP's seed data must carry them.
- The Topic Selection Wizard is a recommendation layer on top of the same library; for an MVP it can be simplified to filter-by-purpose/topic rather than a full questionnaire.
- Reading level and chunk size matter: the real site keeps each project digestible, which maps directly to this build's "kid-sized, interactive" design directive.
- The real site has a very broad surface (careers, videos, teacher tools, blog). A faithful MVP should rebuild only the find → read → rate → save loop and deliberately cut the rest.
- No AI/LLM integration is core to the public project-finding flow; the recommendation is questionnaire/metadata-driven, so the MVP needs no model dependency.
