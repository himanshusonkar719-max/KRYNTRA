# KRYNTRA — Technical Architecture Document

**Version:** 1.0  
**Date:** August 5, 2026  
**Status:** Draft — Awaiting Review

---

## 1. Architecture Overview

KRYNTRA follows a **modern full-stack architecture** with a clear separation between a React SPA frontend and a Node.js REST API backend, connected to a PostgreSQL database.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                                                             │
│  React 18 + Vite + React Router v6                          │
│  Vanilla CSS (custom design system)                         │
│  Chart.js (analytics) + Monaco Editor (code review)         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      API GATEWAY                            │
│                                                             │
│  Express.js / Fastify                                       │
│  JWT Auth Middleware                                        │
│  Rate Limiting (express-rate-limit)                         │
│  CORS + Helmet security headers                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     SERVICES LAYER                          │
│                                                             │
│  AuthService     │  AssessmentService  │  AnalyticsService  │
│  UserService     │  LeaderboardService │  CertService       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
│                                                             │
│  PostgreSQL (Supabase / self-hosted)                        │
│  Prisma ORM                                                 │
│  Redis (session cache, leaderboard)                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                           │
│                                                             │
│  Vercel (frontend)  │  Railway/Render (API)                 │
│  Cloudflare CDN     │  GitHub Actions (CI/CD)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **React 18** + Vite | Fast HMR, tree-shaking, modern DX |
| Routing | **React Router v6** | File-based-like routing, lazy loading |
| Styling | **Vanilla CSS** with CSS custom properties | Full control, no framework lock-in, design-system driven |
| Charts | **Chart.js** + react-chartjs-2 | Lightweight, customizable radar/line charts |
| Code Editor | **Monaco Editor** | VS Code-quality code viewing for code-review assessments |
| Icons | **Lucide React** | Consistent, lightweight icon set |
| Fonts | **Inter** (primary) + **JetBrains Mono** (code) | Clean sans-serif + readable monospace |
| Animation | CSS transitions + Web Animations API | No heavy libraries; `prefers-reduced-motion` respected |

### 2.2 Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | **Node.js 20 LTS** | Mature, fast, JavaScript full-stack |
| Framework | **Express.js** (or Fastify for perf) | Minimal, well-documented, huge ecosystem |
| ORM | **Prisma** | Type-safe queries, migration system, PostgreSQL support |
| Auth | **JWT** (access + refresh tokens) | Stateless, scalable; httpOnly cookie for refresh |
| Validation | **Zod** | Runtime schema validation for API inputs |
| Security | **Helmet** + **cors** + **express-rate-limit** | Headers, CORS policy, brute-force protection |

### 2.3 Database

| Component | Technology |
|-----------|-----------|
| Primary DB | **PostgreSQL 15** |
| Cache | **Redis** (leaderboard, session store) |
| File Storage | **Cloudflare R2** or **Supabase Storage** (certificates, avatars) |

### 2.4 DevOps

| Component | Technology |
|-----------|-----------|
| CI/CD | **GitHub Actions** |
| Frontend Hosting | **Vercel** |
| Backend Hosting | **Railway** or **Render** |
| Monitoring | **Sentry** (error tracking) |
| Analytics | **PostHog** (self-hosted or cloud) |

---

## 3. Database Schema

### 3.1 Core Tables

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'user', -- user | admin | enterprise
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Domains (Web App Sec, Network Sec, etc.)
CREATE TABLE domains (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  color       VARCHAR(7), -- hex color for UI
  sort_order  INT DEFAULT 0
);

-- Assessments
CREATE TABLE assessments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id     UUID REFERENCES domains(id),
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  difficulty    VARCHAR(20) NOT NULL, -- beginner | intermediate | advanced
  duration_mins INT NOT NULL DEFAULT 60,
  total_points  INT NOT NULL,
  question_count INT NOT NULL,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID REFERENCES assessments(id) ON DELETE CASCADE,
  type            VARCHAR(20) NOT NULL, -- mcq | scenario | code_review
  content         JSONB NOT NULL, -- question text, code snippet, scenario
  options         JSONB, -- for MCQ: [{id, text, isCorrect}]
  correct_answer  JSONB, -- answer key
  explanation     TEXT,
  points          INT NOT NULL DEFAULT 1,
  sort_order      INT DEFAULT 0
);

-- User Assessment Attempts
CREATE TABLE attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  assessment_id   UUID REFERENCES assessments(id),
  status          VARCHAR(20) DEFAULT 'in_progress', -- in_progress | completed | abandoned
  score           INT,
  max_score       INT,
  percentage      DECIMAL(5,2),
  answers         JSONB, -- [{questionId, selectedAnswer, isCorrect, timeTaken}]
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  time_spent_secs INT
);

-- Learning Paths
CREATE TABLE learning_paths (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  domain_id   UUID REFERENCES domains(id),
  difficulty  VARCHAR(20) NOT NULL,
  estimated_hours DECIMAL(4,1),
  sort_order  INT DEFAULT 0
);

-- Learning Path Steps (ordered assessments within a path)
CREATE TABLE path_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id         UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  assessment_id   UUID REFERENCES assessments(id),
  step_number     INT NOT NULL,
  is_required     BOOLEAN DEFAULT true
);

-- User Path Enrollments
CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  path_id     UUID REFERENCES learning_paths(id),
  status      VARCHAR(20) DEFAULT 'active', -- active | completed | paused
  progress    DECIMAL(5,2) DEFAULT 0, -- percentage complete
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Leaderboard (materialized / cached)
CREATE TABLE leaderboard_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  domain_id   UUID REFERENCES domains(id), -- NULL = global
  total_score INT DEFAULT 0,
  rank        INT,
  period      VARCHAR(20) DEFAULT 'all_time', -- weekly | monthly | all_time
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Indexes

```sql
CREATE INDEX idx_attempts_user ON attempts(user_id);
CREATE INDEX idx_attempts_assessment ON attempts(assessment_id);
CREATE INDEX idx_attempts_status ON attempts(status);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(period, domain_id, rank);
CREATE INDEX idx_questions_assessment ON questions(assessment_id);
```

---

## 4. API Design

### 4.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET  | `/api/auth/me` | Get current user profile |

### 4.2 Assessments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assessments` | List assessments (filterable by domain, difficulty) |
| GET | `/api/assessments/:id` | Get assessment details |
| POST | `/api/assessments/:id/start` | Begin attempt, returns questions |
| PUT | `/api/attempts/:id/answer` | Submit answer for a question |
| POST | `/api/attempts/:id/submit` | Complete and score the attempt |
| GET | `/api/attempts/:id/results` | Get detailed results |

### 4.3 Learning Paths

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/paths` | List learning paths |
| GET | `/api/paths/:id` | Get path details + steps |
| POST | `/api/paths/:id/enroll` | Enroll in a path |
| GET | `/api/paths/:id/progress` | Get user's progress |

### 4.4 Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | User's skill summary |
| GET | `/api/analytics/history` | Score history over time |
| GET | `/api/analytics/domains` | Per-domain performance |
| GET | `/api/analytics/weaknesses` | Identified weak areas |

### 4.5 Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Global rankings |
| GET | `/api/leaderboard/:domain` | Domain-specific rankings |

---

## 5. Security Architecture

### 5.1 Authentication Flow

```
1. User registers → password hashed with bcrypt (12 rounds)
2. Login → server issues:
   - Access token (JWT, 15 min TTL, in memory)
   - Refresh token (JWT, 7 day TTL, httpOnly cookie)
3. API requests → access token in Authorization header
4. Token expired → client calls /refresh → new access token
5. Logout → refresh token blacklisted in Redis
```

### 5.2 Security Headers

```javascript
// Helmet configuration
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // for CSS custom properties
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.kryntra.com"],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
})
```

### 5.3 Assessment Integrity

- Questions served in randomized order per attempt
- Tab-switch detection (Page Visibility API) — logs events, warns user
- Answers validated server-side; no correct answers sent to client
- Rate limiting on submission endpoints (max 1 submit per attempt)

---

## 6. Folder Structure

```
KRYNTRA/
├── docs/                          # Project documents
│   ├── 01_PRD.md
│   ├── 02_TECHNICAL_ARCHITECTURE.md
│   ├── 03_UI_UX_DESIGN_SYSTEM.md
│   ├── 04_DEVELOPMENT_ROADMAP.md
│   └── 05_TESTING_QA_PLAN.md
│
├── frontend/                      # React SPA
│   ├── public/
│   │   ├── favicon.svg
│   │   └── fonts/
│   ├── src/
│   │   ├── assets/                # Images, icons
│   │   ├── components/
│   │   │   ├── common/            # Button, Input, Modal, Card, Badge
│   │   │   ├── layout/            # Navbar, Sidebar, Footer, PageShell
│   │   │   ├── assessment/        # QuestionCard, Timer, ProgressBar
│   │   │   ├── dashboard/         # RadarChart, ScoreHistory, WeakAreas
│   │   │   └── landing/           # Hero, Features, Testimonials, CTA
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessments.jsx
│   │   │   ├── AssessmentView.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── LearningPaths.jsx
│   │   │   ├── PathDetail.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── hooks/                 # useAuth, useAssessment, useTimer
│   │   ├── context/               # AuthContext, ThemeContext
│   │   ├── services/              # api.js, auth.js, assessments.js
│   │   ├── utils/                 # formatters, validators, constants
│   │   ├── styles/
│   │   │   ├── index.css          # Design system tokens + global styles
│   │   │   ├── components/        # Per-component CSS modules
│   │   │   └── pages/             # Per-page CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                       # Node.js API
│   ├── src/
│   │   ├── config/                # db.js, env.js, redis.js
│   │   ├── middleware/            # auth.js, rateLimit.js, validate.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── assessment.routes.js
│   │   │   ├── path.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   └── leaderboard.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── assessment.service.js
│   │   │   ├── analytics.service.js
│   │   │   └── leaderboard.service.js
│   │   ├── models/                # Prisma client exports
│   │   ├── utils/                 # jwt.js, hash.js, errors.js
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js                # Sample data
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint + test on PR
│       └── deploy.yml             # Auto-deploy on merge
│
├── .gitignore
└── README.md
```

---

## 7. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.2s |
| Largest Contentful Paint | < 2.0s |
| Time to Interactive | < 2.5s |
| Cumulative Layout Shift | < 0.05 |
| API response time (P95) | < 200ms |
| Bundle size (gzipped) | < 150KB initial |
