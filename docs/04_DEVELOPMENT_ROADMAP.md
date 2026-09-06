# KRYNTRA — Development Roadmap

**Version:** 1.0  
**Date:** August 5, 2026  
**Duration:** 8 weeks (August 5 – September 30, 2026)  
**Status:** Draft — Awaiting Review

---

## Timeline Overview

```
Week 1  ████ Foundation & Landing
Week 2  ████ Auth System & Core Layout
Week 3  ████ Assessment Engine (Part 1)
Week 4  ████ Assessment Engine (Part 2) & Results
Week 5  ████ Learning Paths & Dashboard
Week 6  ████ Analytics & Leaderboard
Week 7  ████ Polish, Accessibility & Performance
Week 8  ████ Testing, Bug Fixes & Launch Prep
```

---

## Week 1 — Foundation & Landing Page
**August 5 – August 11, 2026**

### Goals
Set up the project infrastructure, implement the design system, and build a polished landing page that communicates KRYNTRA's value proposition.

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 1.1 | Project scaffold | Initialize Vite + React, folder structure per architecture doc | 2 |
| 1.2 | Design system CSS | Implement `index.css` with all tokens (colors, typography, spacing, animations) | 4 |
| 1.3 | Common components | Build `Button`, `Card`, `Badge`, `Input` components with all variants | 4 |
| 1.4 | Layout components | Build `Navbar`, `Footer`, `PageShell` (the page wrapper) | 3 |
| 1.5 | Landing — Hero section | Left-aligned hero with headline, subtext, CTA, right-side visual | 4 |
| 1.6 | Landing — Features bento | Staggered bento grid showcasing platform capabilities | 4 |
| 1.7 | Landing — Social proof | Stats strip + testimonial/trust section | 2 |
| 1.8 | Landing — CTA section | Bottom call-to-action with enrollment prompt | 2 |
| 1.9 | Scroll animations | IntersectionObserver-based reveal + stagger | 2 |
| 1.10 | Responsive pass | Mobile + tablet layout for all landing sections | 3 |

### Deliverables
- ✅ Running dev server with landing page at `/`
- ✅ Design system implemented as CSS custom properties
- ✅ All buttons functional (scroll-to, navigate-to) — zero broken
- ✅ Mobile responsive

---

## Week 2 — Authentication & Core Layout
**August 12 – August 18, 2026**

### Goals
Implement user authentication (register, login, profile) and the authenticated app shell (sidebar + content area).

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 2.1 | Backend scaffold | Initialize Express/Fastify, Prisma, PostgreSQL connection | 3 |
| 2.2 | User model + migration | Users table with Prisma schema | 2 |
| 2.3 | Auth API | Register, login, refresh, logout endpoints with JWT | 5 |
| 2.4 | Auth middleware | JWT verification, role-based route guards | 2 |
| 2.5 | Frontend — Login page | Form with validation, error handling, "remember me" | 3 |
| 2.6 | Frontend — Register page | Form with password strength meter, terms checkbox | 3 |
| 2.7 | AuthContext | React context for auth state, token refresh logic | 3 |
| 2.8 | App shell — Sidebar | Fixed sidebar with nav items, user avatar, logout | 4 |
| 2.9 | Protected routes | Route guards redirecting unauthenticated users | 2 |
| 2.10 | Profile page | View/edit display name, avatar, email | 3 |

### Deliverables
- ✅ User can register, login, and maintain session
- ✅ Authenticated routes protected
- ✅ App shell with sidebar navigation
- ✅ All auth form buttons wired to real actions

---

## Week 3 — Assessment Engine (Part 1)
**August 19 – August 25, 2026**

### Goals
Build the assessment browsing interface and the core question-answering experience for MCQ-type assessments.

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 3.1 | Seed data | Create domains, sample assessments, and MCQ questions | 3 |
| 3.2 | Assessment API | CRUD endpoints, list with filters, start attempt | 4 |
| 3.3 | Assessments browse page | Card grid with domain filter, difficulty badges, search | 4 |
| 3.4 | Assessment detail modal | Description, duration, question count, start button | 3 |
| 3.5 | Assessment view — Layout | Question panel (left), navigation sidebar (right) | 4 |
| 3.6 | Question card — MCQ | Radio/checkbox selection, flag for review | 3 |
| 3.7 | Timer component | Countdown with warning state (< 5 min), auto-submit | 3 |
| 3.8 | Progress bar | Visual progress through questions | 2 |
| 3.9 | Auto-save | Persist answers every 30s to backend | 2 |
| 3.10 | Question navigation | Jump to specific question, see answered/flagged status | 2 |

### Deliverables
- ✅ Users can browse and filter assessments
- ✅ Users can start a timed MCQ assessment
- ✅ Answers persist (auto-save + manual)
- ✅ Timer warns and auto-submits

---

## Week 4 — Assessment Engine (Part 2) & Results
**August 26 – September 1, 2026**

### Goals
Add scenario-based questions, implement the submission + scoring pipeline, and build the results page.

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 4.1 | Scenario question type | Rich-text scenario display with multi-part questions | 4 |
| 4.2 | Code review question type | Syntax-highlighted code snippet with annotation UI | 5 |
| 4.3 | Submit flow | Confirmation modal → submit → scoring → redirect to results | 3 |
| 4.4 | Scoring engine (backend) | Calculate score, percentage, per-question correctness | 3 |
| 4.5 | Results page — Score summary | Large score display, pass/fail, time taken | 3 |
| 4.6 | Results page — Question review | Expandable list: user's answer vs correct, explanation | 4 |
| 4.7 | Results page — Domain breakdown | Bar chart of performance per topic area | 3 |
| 4.8 | Attempt history API | List past attempts for a user | 2 |
| 4.9 | Resume interrupted assessment | Detect in-progress attempt, offer resume | 2 |
| 4.10 | Anti-cheat basics | Tab-switch detection, randomized question order | 2 |

### Deliverables
- ✅ 3 question types functional (MCQ, scenario, code review)
- ✅ Assessment submission and instant scoring
- ✅ Detailed results page with explanations
- ✅ Resume capability for interrupted assessments

---

## Week 5 — Learning Paths & Dashboard
**September 2 – September 8, 2026**

### Goals
Implement the learning path system and the user's personal dashboard with skill analytics.

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 5.1 | Learning path seed data | 3 paths with ordered assessments | 2 |
| 5.2 | Path API | List, detail, enroll, progress endpoints | 3 |
| 5.3 | Paths browse page | Card layout with domain icon, difficulty, estimated time | 3 |
| 5.4 | Path detail page | Ordered step list with completion status, enroll CTA | 4 |
| 5.5 | Enrollment flow | Enroll button → progress tracking starts | 2 |
| 5.6 | Dashboard — Layout | Asymmetric grid: stats top, charts middle, lists bottom | 3 |
| 5.7 | Dashboard — Stat cards | Assessments taken, avg score, current streak, rank | 3 |
| 5.8 | Dashboard — Skill radar | Chart.js radar chart of domain performance | 3 |
| 5.9 | Dashboard — Score history | Line chart over last 30 days | 3 |
| 5.10 | Dashboard — Weak areas | Flagged topics with "Practice" action buttons | 2 |
| 5.11 | Dashboard — Recent activity | Last 5 assessments with scores | 2 |

### Deliverables
- ✅ Users can browse, enroll in, and track learning paths
- ✅ Personal dashboard with actionable analytics
- ✅ Radar chart, line chart, and weak-area recommendations
- ✅ All dashboard buttons link to real pages/actions

---

## Week 6 — Analytics Deep Dive & Leaderboard
**September 9 – September 15, 2026**

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 6.1 | Analytics API | Overview, history, per-domain, weakness endpoints | 4 |
| 6.2 | Analytics page — Full view | Expanded charts, filterable by date range and domain | 4 |
| 6.3 | Peer comparison | Anonymized percentile ranking per domain | 3 |
| 6.4 | Leaderboard API | Global + per-domain, weekly + all-time | 3 |
| 6.5 | Leaderboard page | Table with rank, name, score, domain filter tabs | 4 |
| 6.6 | Leaderboard — User highlight | Highlight current user's row, show rank change indicator | 2 |
| 6.7 | About page | KRYNTRA mission, team, methodology | 3 |
| 6.8 | 404 page | Branded error page with navigation | 1 |
| 6.9 | Loading states | Skeleton loaders for all data-dependent components | 3 |
| 6.10 | Empty states | Meaningful empty states for no assessments, no results, etc. | 2 |

### Deliverables
- ✅ Full analytics page with charts and filters
- ✅ Live leaderboard with user highlighting
- ✅ All pages have loading and empty states — zero broken UI

---

## Week 7 — Polish, Accessibility & Performance
**September 16 – September 22, 2026**

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 7.1 | Accessibility audit | Keyboard nav, ARIA labels, contrast check, screen reader test | 4 |
| 7.2 | Reduced motion | Verify all animations respect `prefers-reduced-motion` | 2 |
| 7.3 | SEO | Meta tags, title tags, semantic HTML, heading hierarchy | 2 |
| 7.4 | Performance optimization | Code splitting, lazy routes, image optimization | 3 |
| 7.5 | Bundle analysis | Identify and eliminate unused dependencies | 2 |
| 7.6 | Error boundaries | React error boundaries on every route | 2 |
| 7.7 | Toast notifications | Success/error feedback on all user actions | 2 |
| 7.8 | Mobile menu | Hamburger → slide-out menu for mobile | 3 |
| 7.9 | Dark mode refinement | Ensure all components work in the pastel-dark theme | 2 |
| 7.10 | Cross-browser testing | Chrome, Firefox, Edge, Safari | 3 |
| 7.11 | Button audit | Verify EVERY button on EVERY page has a functional handler | 3 |

### Deliverables
- ✅ WCAG AA compliant
- ✅ Performance budget met (LCP < 2s, CLS < 0.05)
- ✅ **100% button functionality verification**
- ✅ Cross-browser compatible

---

## Week 8 — Testing, Bug Fixes & Launch Preparation
**September 23 – September 30, 2026**

### Tasks

| # | Task | Details | Est. Hours |
|---|------|---------|------------|
| 8.1 | Unit tests | Component tests with Vitest + Testing Library | 6 |
| 8.2 | E2E tests | Full user flows with Playwright | 5 |
| 8.3 | E2E — Button integrity test | Automated test that clicks every button on every page | 3 |
| 8.4 | Bug fix sprint | Triage and fix all issues found in testing | 5 |
| 8.5 | CI/CD pipeline | GitHub Actions: lint → test → build → deploy | 3 |
| 8.6 | Production deployment | Deploy frontend to Vercel, backend to Railway | 2 |
| 8.7 | README + documentation | Setup instructions, API docs, contribution guide | 2 |
| 8.8 | Demo seed data | Polished sample data for all features | 2 |
| 8.9 | Final review | Full walkthrough of every page and interaction | 2 |

### Deliverables
- ✅ Automated test suite passing
- ✅ **Zero broken buttons** (E2E verified)
- ✅ Deployed to production
- ✅ README with setup instructions

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep from enterprise features | Schedule slip | Strict MVP scope; enterprise is post-launch |
| Assessment content quality | User retention | Seed with high-quality sample data; note CMS as P1 |
| Database performance at scale | Slow dashboards | Indexed queries, materialized leaderboard, Redis cache |
| Browser compatibility issues | Broken UI | Week 7 cross-browser sprint; progressive enhancement |
| Third-party API downtime | Auth/deploy failure | Fallback auth (local dev), multi-provider hosting |

---

## Weekly Check-in Format

Each week ends with a self-review:

1. **Completed** — What was shipped?
2. **Carried over** — What moved to next week? Why?
3. **Blocked** — What needs user input to unblock?
4. **Demo** — Screenshot/recording of the week's work
5. **Next week preview** — Top 3 priorities
