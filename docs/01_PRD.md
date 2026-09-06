# KRYNTRA — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** August 5, 2026  
**Status:** Draft — Awaiting Review

---

## 1. Vision & Problem Statement

The cybersecurity skills gap continues to widen — organizations struggle to assess candidate readiness, and professionals lack accessible, high-quality platforms to validate their knowledge against real-world scenarios.

**KRYNTRA** bridges this gap by providing an online cybersecurity assessment platform that combines structured evaluations, hands-on challenges, and measurable skill analytics in a modern, premium interface.

### Value Proposition

| For | KRYNTRA delivers |
|-----|-----------------|
| **Students** | Structured learning paths, practice assessments, skill-gap identification |
| **Professionals** | Industry-aligned assessments, certifiable scores, portfolio-ready results |
| **Enterprises** | Bulk candidate evaluation, team analytics, custom assessment creation |

---

## 2. Target Users

### 2.1 Primary Personas

**Alex — The Aspiring Analyst**
- 22, CS undergraduate
- Preparing for entry-level SOC analyst roles
- Needs structured practice and progress tracking
- Price-sensitive; values free tier content

**Priya — The Mid-Career Professional**
- 30, 5 years in IT, pivoting to cybersecurity
- Wants to validate skills against NIST/OWASP frameworks
- Needs certifiable assessment results for resume
- Willing to pay for premium assessments

**Marcus — The Hiring Manager**
- 40, CISO at a fintech startup
- Needs to screen 50+ candidates per quarter
- Wants customizable assessments and comparative analytics
- Enterprise budget; values team dashboard

### 2.2 Secondary Personas
- **Cybersecurity educators** — using the platform for classroom assignments
- **CTF enthusiasts** — looking for challenge-style content

---

## 3. Core Features

### 3.1 Assessment Engine (P0 — MVP)

The heart of the platform. Supports multiple assessment types:

| Type | Description | Interaction Model |
|------|-------------|-------------------|
| **MCQ** | Multiple-choice knowledge tests | Radio/checkbox selection, timed |
| **Scenario-Based** | Read a security incident scenario, answer analysis questions | Rich-text scenario → multi-part questions |
| **Practical Labs** | Hands-on tasks in a sandboxed environment | Browser-based terminal or IDE |
| **Code Review** | Identify vulnerabilities in code snippets | Inline annotation + explanation |

**Key behaviors:**
- Timer per section (configurable: 30/60/90 min)
- Auto-save progress every 30 seconds
- Anti-cheat: tab-switch detection, randomized question order
- Instant scoring for MCQ; queued review for practical labs

### 3.2 Learning Paths (P0 — MVP)

Curated sequences of assessments organized by domain:

- **Network Security** — firewalls, IDS/IPS, packet analysis
- **Web Application Security** — OWASP Top 10, XSS, SQLi, CSRF
- **Incident Response** — detection, containment, forensics
- **Cloud Security** — AWS/Azure/GCP misconfigurations
- **Governance & Compliance** — ISO 27001, GDPR, SOC 2

Each path has:
- Prerequisite checks
- Progressive difficulty (Beginner → Intermediate → Advanced)
- Completion percentage and estimated time

### 3.3 Analytics Dashboard (P0 — MVP)

Personal dashboard for each user showing:

- **Skill radar chart** — performance across domains
- **Score history** — line chart over time
- **Weak areas** — flagged topics with recommended resources
- **Peer comparison** — anonymized percentile ranking
- **Assessment log** — all past attempts with review links

### 3.4 Global Leaderboard (P1)

- Weekly and all-time rankings
- Filterable by domain, difficulty, region
- Anonymized by default; opt-in display name
- Anti-gaming: score decay for inactive users

### 3.5 Certification & Badges (P1)

- Digital badges for completing learning paths
- Shareable certificate links (unique URL with verification)
- LinkedIn integration for one-click profile addition
- QR-code on PDF certificate for verification

### 3.6 Enterprise Panel (P2 — Post-MVP)

- Bulk user invite and management
- Custom assessment builder
- Team performance heatmap
- Export reports (PDF, CSV)

---

## 4. User Stories

### 4.1 Assessment Taker

| ID | Story | Priority |
|----|-------|----------|
| AT-01 | As a user, I can browse available assessments by domain so I find relevant tests | P0 |
| AT-02 | As a user, I can start a timed assessment and see a progress bar | P0 |
| AT-03 | As a user, I can flag questions for review before submitting | P0 |
| AT-04 | As a user, I receive instant scores and detailed explanations after submission | P0 |
| AT-05 | As a user, I can resume an interrupted assessment within 24 hours | P0 |
| AT-06 | As a user, I can view my score history and performance trends | P0 |
| AT-07 | As a user, I can share my assessment results via a public link | P1 |

### 4.2 Learner

| ID | Story | Priority |
|----|-------|----------|
| LR-01 | As a learner, I can enroll in a learning path and track my progress | P0 |
| LR-02 | As a learner, I receive recommendations based on my weak areas | P0 |
| LR-03 | As a learner, I can earn badges for completing milestones | P1 |
| LR-04 | As a learner, I can download a PDF certificate after completing a path | P1 |

### 4.3 Admin / Content Creator

| ID | Story | Priority |
|----|-------|----------|
| AD-01 | As an admin, I can create and publish new assessments | P1 |
| AD-02 | As an admin, I can view platform-wide analytics | P1 |
| AD-03 | As an admin, I can manage user accounts and roles | P1 |

---

## 5. Success Metrics

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Registered users | 1,000+ |
| Assessment completions | 5,000+ |
| Average session duration | > 12 minutes |
| Assessment completion rate | > 70% |
| NPS (Net Promoter Score) | > 40 |
| Page load time (P95) | < 2 seconds |
| Zero broken interactive elements | 100% pass rate |

---

## 6. Scope Boundaries

### In Scope (MVP — 8 weeks)
- User auth (signup, login, profile)
- Assessment engine (MCQ + scenario-based)
- 3 learning paths (Web App Sec, Network Sec, Incident Response)
- Personal analytics dashboard
- Responsive web app (mobile + desktop)
- Landing page + about page

### Out of Scope (Post-MVP)
- Practical lab sandboxed environments
- Enterprise panel and billing
- Native mobile app
- Real-time multiplayer CTF mode
- AI-powered question generation

---

## 7. Assumptions & Dependencies

- Content (questions, scenarios) will be seeded with sample data; real content to be added by subject matter experts
- No payment processing in MVP; all features are free-tier
- Hosting on Vercel (frontend) + Railway/Render (backend API)
- Database: PostgreSQL via Supabase or self-hosted
