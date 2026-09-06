# KRYNTRA — Autonomous Cyber Defense Platform

**Continuous & Autonomous Agentic Cybersecurity Assessment Platform**  
*Enterprise Cybersecurity Posture, AI Triage & Real-Time Defense*

KRYNTRA orchestrates simulated multi-engine reconnaissance (Nmap, OWASP ZAP, Trivy) coupled with LLM-assisted vulnerability triage and regression-verified remediation in disposable Docker test harnesses.

---

## Architecture Overview

- **Frontend (`/frontend`)**: Next.js 16 (App Router), Tailwind CSS v4, Lucide Icons, Dark Cyber Aesthetic.
- **Backend (`/backend`)**: Python FastAPI, SQLite + SQLAlchemy, JWT Bearer Authentication, Multi-engine simulated scanner service, Continuous Compliance mapping (SOC2 Type II, ISO 27001:2022, NIST CSF 2.0).

---

## Quick Start & Running Locally

### 1. Start the Backend API (FastAPI)

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

- API Root: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Start the Frontend (Next.js)

```bash
cd frontend
npm run dev
```

- Web Application: `http://localhost:3000`

---

## Key Modules & Routes

- `/` — AegisSec-style landing page with live perimeter diagnostic gauge, multi-engine attack pillars, and automated lifecycle workflow.
- `/login` & `/register` — Full JWT authentication with session persistence and telemetry preview.
- `/dashboard` — Security Posture Executive Overview with radial resilience gauge and severity distribution chips.
- `/dashboard/scanner` — Multi-engine scanner console with target input, Nmap / ZAP / Trivy toggles, live progress logs, and findings cards.
- `/dashboard/triage` — AI Triage queue with OWASP Top 10 categorization, false-positive override, and interactive Docker sandbox verification.
- `/dashboard/compliance` — Automated control mapping for SOC2, ISO 27001, and NIST CSF 2.0 with instant audit package generation.
