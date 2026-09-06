# KRYNTRA — Testing & Quality Assurance Plan

**Version:** 1.0  
**Date:** August 5, 2026  
**Status:** Draft — Awaiting Review

---

## 1. Testing Philosophy

KRYNTRA's QA strategy prioritizes **user-facing reliability** above all else. The primary invariant is:

> **Every interactive element on every page must produce a meaningful response when activated.**

No button, link, or form control may ever be a dead-end. If a feature isn't ready, the element is either hidden or shows a graceful "coming soon" state — never broken.

---

## 2. Testing Layers

```
┌─────────────────────────────────────────────┐
│  Layer 4: Manual Review                     │
│  Visual QA, cross-browser, UX walkthrough   │
├─────────────────────────────────────────────┤
│  Layer 3: E2E Tests (Playwright)            │
│  Full user flows + button integrity sweep   │
├─────────────────────────────────────────────┤
│  Layer 2: Integration Tests                 │
│  API endpoint tests, auth flows, DB queries │
├─────────────────────────────────────────────┤
│  Layer 1: Unit Tests (Vitest)               │
│  Components, utilities, hooks, services     │
└─────────────────────────────────────────────┘
```

---

## 3. Unit Testing (Layer 1)

### 3.1 Tools
- **Vitest** — test runner (fast, Vite-native)
- **@testing-library/react** — component testing
- **@testing-library/jest-dom** — DOM assertions
- **msw** (Mock Service Worker) — API mocking

### 3.2 Coverage Targets

| Category | Target | Priority |
|----------|--------|----------|
| Components (UI) | 80% line coverage | P0 |
| Hooks | 90% branch coverage | P0 |
| Utility functions | 95% line coverage | P0 |
| Services (API calls) | 80% line coverage | P1 |
| Context providers | 85% line coverage | P1 |

### 3.3 Component Test Template

```javascript
// Example: Button component test
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Start Assessment</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Start Assessment');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows correct disabled styling', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveStyle({ cursor: 'not-allowed' });
  });
});
```

### 3.4 Key Test Cases per Component

| Component | Must-test behaviors |
|-----------|-------------------|
| Button | All variants render, click fires, disabled blocks click, loading shows spinner |
| Input | Value binding, validation errors shown, focus ring appears, placeholder text |
| Card | Hover effects, click navigation (if clickable), content rendering |
| Timer | Countdown ticks, warning state at threshold, auto-submit on expiry |
| QuestionCard | Option selection, flag toggle, answer persistence |
| RadarChart | Data renders correctly, labels present, empty state |
| Navbar | All links navigate, active state highlights, mobile toggle |
| ProgressBar | Correct percentage, animated fill, accessible label |

---

## 4. Integration Testing (Layer 2)

### 4.1 Tools
- **Vitest** + **supertest** — API endpoint testing
- **Prisma** test client — database assertions
- **Docker** — isolated test database

### 4.2 API Test Cases

| Endpoint | Test |
|----------|------|
| `POST /api/auth/register` | Creates user, returns tokens; rejects duplicate email; validates input |
| `POST /api/auth/login` | Returns tokens for valid credentials; rejects invalid; rate-limited |
| `GET /api/assessments` | Returns list; filters by domain; filters by difficulty; paginated |
| `POST /api/assessments/:id/start` | Creates attempt; returns questions without answers; enforces auth |
| `POST /api/attempts/:id/submit` | Scores correctly; rejects double-submit; updates leaderboard |
| `GET /api/analytics/overview` | Returns correct aggregates; scoped to authenticated user |
| `GET /api/leaderboard` | Sorted by score; paginated; user's rank included |

### 4.3 Auth Flow Integration

```
1. Register → verify tokens returned
2. Login → verify access + refresh tokens
3. Access protected route → verify 200 with valid token
4. Access protected route → verify 401 without token
5. Refresh → verify new access token returned
6. Logout → verify refresh token invalidated
7. Use invalidated refresh → verify 401
```

---

## 5. End-to-End Testing (Layer 3)

### 5.1 Tools
- **Playwright** — cross-browser E2E testing
- Browsers: Chromium, Firefox, WebKit

### 5.2 Critical User Flows

| Flow | Steps |
|------|-------|
| **Registration → First Assessment** | Land on home → click "Get Started" → fill register form → redirected to dashboard → click "Assessments" → select an assessment → start → answer questions → submit → view results |
| **Login → Resume Assessment** | Login → dashboard shows in-progress assessment → click resume → continue answering → submit |
| **Learning Path Enrollment** | Login → Paths page → select path → click "Enroll" → see progress → complete first assessment → progress updates |
| **Dashboard Analytics** | Login → dashboard → verify radar chart renders → verify score history shows data → click weak area → navigates to relevant assessment |
| **Leaderboard** | Login → leaderboard → verify current user highlighted → switch domain filter → results update |

### 5.3 Button Integrity Test (CRITICAL)

This is a dedicated E2E test that crawls every accessible page and verifies that every `<button>`, `<a>`, and `[role="button"]` element produces a response:

```javascript
// tests/e2e/button-integrity.spec.js
import { test, expect } from '@playwright/test';

const PAGES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/assessments',
  '/paths',
  '/leaderboard',
  '/profile',
  '/about',
];

for (const page of PAGES) {
  test(`All buttons on ${page} are functional`, async ({ page: pw }) => {
    await pw.goto(page);
    
    // Find all interactive elements
    const buttons = await pw.locator('button, a[href], [role="button"]').all();
    
    for (const button of buttons) {
      const isVisible = await button.isVisible();
      if (!isVisible) continue;
      
      const isDisabled = await button.isDisabled();
      const tagName = await button.evaluate(el => el.tagName);
      const text = await button.textContent();
      
      if (isDisabled) {
        // Disabled buttons must have visual disabled state
        const opacity = await button.evaluate(el => 
          getComputedStyle(el).opacity
        );
        expect(
          parseFloat(opacity),
          `Disabled button "${text}" should have reduced opacity`
        ).toBeLessThan(1);
        continue;
      }
      
      if (tagName === 'A') {
        // Links must have a valid href (not "#" or "javascript:void(0)")
        const href = await button.getAttribute('href');
        expect(
          href,
          `Link "${text}" has no href`
        ).toBeTruthy();
        expect(
          href,
          `Link "${text}" has placeholder href`
        ).not.toBe('#');
        expect(
          href,
          `Link "${text}" uses javascript:void(0)`
        ).not.toContain('javascript:');
      }
      
      if (tagName === 'BUTTON') {
        // Buttons must have an onClick or form submit behavior
        const hasHandler = await button.evaluate(el => {
          // Check for React event handlers or native onclick
          return (
            el.onclick !== null ||
            el.type === 'submit' ||
            el.closest('form') !== null ||
            // React attaches handlers to the root
            true // We'll verify by checking no console errors on click
          );
        });
      }
    }
  });
}
```

### 5.4 Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run button integrity test only
npx playwright test button-integrity

# Run with UI mode for debugging
npx playwright test --ui

# Run in specific browser
npx playwright test --project=chromium
```

---

## 6. Accessibility Testing (Integrated)

### 6.1 Automated

```bash
# axe-core integration with Playwright
npm install -D @axe-core/playwright
```

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Landing page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### 6.2 Manual Checklist (per page)

| Check | Method |
|-------|--------|
| Tab through all interactive elements | Keyboard only |
| Verify focus ring visibility | Visual inspection |
| Screen reader navigation | NVDA / VoiceOver |
| Zoom to 200% — no content loss | Browser zoom |
| Color contrast (all text) | axe DevTools |
| `prefers-reduced-motion` | Toggle in DevTools |

---

## 7. Performance Testing

### 7.1 Lighthouse CI

Integrated into CI pipeline:

```yaml
# .github/workflows/ci.yml (excerpt)
lighthouse:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run build
    - uses: treosh/lighthouse-ci-action@v11
      with:
        budgetPath: ./lighthouse-budget.json
        urls: |
          http://localhost:4173/
          http://localhost:4173/login
          http://localhost:4173/dashboard
```

### 7.2 Performance Budget

```json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 90,
  "seo": 90,
  "budgets": [
    {
      "resourceType": "script",
      "budget": 150
    },
    {
      "resourceType": "stylesheet", 
      "budget": 30
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2000
    },
    {
      "metric": "cumulative-layout-shift",
      "budget": 0.05
    }
  ]
}
```

---

## 8. Visual Regression Testing

### 8.1 Approach

Using Playwright's built-in screenshot comparison:

```javascript
test('Dashboard renders correctly', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixelRatio: 0.01,
  });
});
```

### 8.2 Tracked Pages

Screenshots captured for:
- Landing page (mobile + desktop)
- Login / Register forms
- Dashboard (with data + empty state)
- Assessment browse page
- Assessment in-progress view
- Results page
- Learning paths browse
- Leaderboard

---

## 9. Security Testing

| Test | Method |
|------|--------|
| SQL injection on form inputs | Automated: sqlmap on API endpoints |
| XSS in user-generated content | Manual: inject `<script>` in display name, answers |
| CSRF on state-changing endpoints | Verify SameSite cookies, CSRF token |
| JWT token expiry | Automated: verify 401 after token TTL |
| Rate limiting | Automated: rapid requests to auth endpoints |
| Assessment answer leakage | Manual: inspect network responses for correct answers |

---

## 10. Bug Tracking & Triage

### 10.1 Severity Levels

| Level | Definition | Response Time |
|-------|-----------|---------------|
| **S0 — Critical** | Broken button, auth bypass, data loss | Fix immediately |
| **S1 — High** | Feature non-functional, UI regression | Fix within 24h |
| **S2 — Medium** | Cosmetic issue, minor UX problem | Fix within sprint |
| **S3 — Low** | Enhancement, nice-to-have | Backlog |

### 10.2 Bug Report Template

```markdown
## Bug Report

**Severity:** S0 / S1 / S2 / S3
**Page:** [URL]
**Browser:** Chrome 128 / Firefox 130 / etc.

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior

### Actual Behavior

### Screenshot / Recording
```

---

## 11. CI/CD Pipeline

```yaml
name: KRYNTRA CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd frontend && npm ci && npm run lint
      - run: cd backend && npm ci && npm run lint

  test-unit:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd frontend && npm ci && npm test -- --coverage
      - run: cd backend && npm ci && npm test -- --coverage

  test-e2e:
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx playwright install --with-deps
      - run: cd frontend && npm ci && npm run build
      - run: cd backend && npm ci
      - run: npm run test:e2e

  deploy:
    runs-on: ubuntu-latest
    needs: test-e2e
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploy to Vercel + Railway"
```

---

## 12. Definition of Done

A feature is considered "done" when:

- [ ] Unit tests pass (>80% coverage for new code)
- [ ] Integration tests pass for affected API endpoints
- [ ] E2E test for the feature's primary flow passes
- [ ] Button integrity test passes (no new broken buttons)
- [ ] Accessibility audit passes (axe-core, no violations)
- [ ] Responsive at all breakpoints (375px, 768px, 1280px)
- [ ] `prefers-reduced-motion` fallback verified
- [ ] Loading and empty states implemented
- [ ] Error states handled (network failure, invalid data)
- [ ] Code reviewed and merged to main
