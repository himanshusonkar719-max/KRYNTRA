# KRYNTRA — Project Presentation

---

## 1. Introduction

**KRYNTRA** is a **Continuous & Autonomous Agentic Cybersecurity Assessment Platform** designed for enterprise-grade security posture management.

It orchestrates simulated multi-engine reconnaissance (Nmap, OWASP ZAP, Trivy), couples it with LLM-assisted vulnerability triage, and performs regression-verified remediation inside disposable Docker test harnesses — delivering end-to-end autonomous cyber defense.

### Key Highlights

- **Autonomous Scanning** — multi-engine simulated scanners (Nmap, ZAP, Trivy) run continuously against target infrastructure.
- **AI-Powered Triage** — LLM-assisted vulnerability classification with OWASP Top 10 categorization and false-positive override.
- **Continuous Compliance** — automated control mapping for SOC 2 Type II, ISO 27001:2022, and NIST CSF 2.0 with instant audit-package generation.
- **Real-Time Dashboard** — executive security posture overview with radial resilience gauge, severity distribution, and live scanner logs.

---

## 2. Problem Statement

The cybersecurity landscape faces three compounding challenges:

| Challenge | Impact |
|-----------|--------|
| **Widening Skills Gap** | Organizations cannot assess candidate readiness; professionals lack accessible validation platforms. |
| **Reactive Security Posture** | Most enterprises respond to breaches *after* damage — not before. |
| **Manual Compliance Burden** | Mapping vulnerabilities to SOC 2 / ISO 27001 / NIST controls is tedious and error-prone. |

### What Existing Solutions Lack

- No unified platform combines **scanning → triage → remediation → compliance** in one autonomous pipeline.
- Traditional scanners generate noise; teams spend hours sorting false positives.
- Compliance mapping is disconnected from live vulnerability data.

**KRYNTRA solves this** by closing the loop — from automated discovery to verified fix to audit-ready report — without manual intervention.

---

## 3. Technical Architecture

### 3.1 Stack Overview

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), Tailwind CSS v4, Lucide Icons |
| **Backend** | Python FastAPI, SQLAlchemy ORM, SQLite |
| **Authentication** | JWT Bearer tokens with session persistence |
| **Scanning Engines** | Simulated Nmap, OWASP ZAP, Trivy |
| **Compliance** | SOC 2 Type II, ISO 27001:2022, NIST CSF 2.0 mappers |
| **Deployment** | Vercel (frontend), Render (backend), Docker support |

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                      CLIENT                         │
│  Next.js 16 · Tailwind CSS v4 · Dark Cyber Theme   │
├─────────────────────────────────────────────────────┤
│                    API GATEWAY                      │
│  FastAPI · JWT Auth · Rate Limiting · CORS          │
├─────────────────────────────────────────────────────┤
│                  SERVICES LAYER                     │
│  Scanner Service │ Triage Engine │ Compliance Mapper│
│  Scheduler       │ Remediation   │ Analytics        │
├─────────────────────────────────────────────────────┤
│                   DATA LAYER                        │
│  SQLite + SQLAlchemy ORM                            │
├─────────────────────────────────────────────────────┤
│                 INFRASTRUCTURE                      │
│  Vercel (frontend) │ Render (backend) │ Docker      │
└─────────────────────────────────────────────────────┘
```

### 3.3 Core Modules

| Module | Purpose |
|--------|---------|
| **Scanner Console** | Target input, engine toggles (Nmap / ZAP / Trivy), live progress logs, findings cards. |
| **AI Triage Queue** | OWASP Top 10 classification, false-positive override, Docker sandbox verification. |
| **Compliance Dashboard** | Automated SOC 2 / ISO 27001 / NIST CSF 2.0 control mapping, audit package export. |
| **Scheduler Service** | Continuous scan scheduling with configurable intervals. |
| **Remediation Engine** | Suggested fixes, regression-verified in disposable Docker harnesses. |

### 3.4 Key API Routes

| Route | Function |
|-------|----------|
| `/` | Landing page — live perimeter diagnostic gauge, attack pillars, automated workflow. |
| `/login` & `/register` | JWT authentication with session persistence. |
| `/dashboard` | Executive posture overview — resilience gauge, severity chips. |
| `/dashboard/scanner` | Multi-engine scanner console. |
| `/dashboard/triage` | AI triage queue with sandbox verification. |
| `/dashboard/compliance` | Automated compliance mapping and audit generation. |

---

## 4. Conclusion

### What KRYNTRA Delivers

- **Autonomous, end-to-end cyber defense** — scan, triage, remediate, and certify compliance without manual overhead.
- **Actionable intelligence** — LLM-powered triage eliminates noise and surfaces real threats.
- **Audit-ready compliance** — instant SOC 2, ISO 27001, and NIST CSF 2.0 report generation tied to live vulnerability data.
- **Modern, extensible stack** — Next.js + FastAPI architecture deployable on Vercel / Render with Docker support.

### Future Scope

| Phase | Features |
|-------|----------|
| **Phase 2** | Real-time multi-agent orchestration, extended scanner integrations (Nuclei, Burp). |
| **Phase 3** | Enterprise multi-tenant panel, RBAC, team analytics heatmaps. |
| **Phase 4** | Native SIEM integration, webhook alerting, custom compliance framework builder. |

---

> *KRYNTRA — from detection to defense, autonomously.*
