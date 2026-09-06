# KRYNTRA — UI/UX Design System

**Version:** 1.0  
**Date:** August 5, 2026  
**Status:** Draft — Awaiting Review

---

## 1. Design Philosophy

KRYNTRA's interface follows three principles:

1. **Pastel-dark authority** — a deep, near-black base communicates security and seriousness, while muted pastel accents add approachability without feeling childish
2. **Asymmetric editorial layout** — content breathes through intentional whitespace and off-grid placement; nothing defaults to "center everything"
3. **Every element earns its place** — if removing a component doesn't hurt comprehension, remove it

---

## 2. Color System

### 2.1 Base Palette

```css
:root {
  /* ─── Base (dark foundation) ─── */
  --color-bg-primary:     hsl(225, 20%, 8%);    /* #111520 — main background */
  --color-bg-secondary:   hsl(225, 18%, 12%);   /* #181c2a — cards, panels */
  --color-bg-tertiary:    hsl(225, 16%, 16%);   /* #222738 — elevated surfaces */
  --color-bg-hover:       hsl(225, 14%, 20%);   /* #2c3146 — hover states */

  /* ─── Surface (glassmorphism layers) ─── */
  --color-surface-glass:  hsla(225, 20%, 18%, 0.6);  /* glass panels */
  --color-surface-border: hsla(225, 20%, 30%, 0.3);  /* subtle borders */

  /* ─── Text ─── */
  --color-text-primary:   hsl(220, 15%, 90%);   /* #e2e4ea — body text */
  --color-text-secondary: hsl(220, 10%, 60%);   /* #8f939f — muted text */
  --color-text-tertiary:  hsl(220, 8%, 42%);    /* #636673 — disabled/hint */
  --color-text-inverse:   hsl(225, 20%, 8%);    /* dark text on light bg */

  /* ─── Pastel Accents ─── */
  --color-accent-lavender:    hsl(260, 50%, 72%);  /* #a78bcc — primary accent */
  --color-accent-lavender-dim:hsl(260, 30%, 28%);  /* for backgrounds */
  --color-accent-sage:        hsl(150, 30%, 60%);  /* #7dba91 — success/positive */
  --color-accent-sage-dim:    hsl(150, 20%, 22%);
  --color-accent-peach:       hsl(15, 60%, 72%);   /* #d9a08a — warning/warm */
  --color-accent-peach-dim:   hsl(15, 30%, 24%);
  --color-accent-ice:         hsl(200, 50%, 68%);  /* #7bb8d4 — info/cool */
  --color-accent-ice-dim:     hsl(200, 25%, 22%);
  --color-accent-rose:        hsl(345, 50%, 68%);  /* #cc7b8f — error/danger */
  --color-accent-rose-dim:    hsl(345, 25%, 22%);

  /* ─── Semantic mapping ─── */
  --color-primary:   var(--color-accent-lavender);
  --color-success:   var(--color-accent-sage);
  --color-warning:   var(--color-accent-peach);
  --color-info:      var(--color-accent-ice);
  --color-danger:    var(--color-accent-rose);
}
```

### 2.2 Color Usage Rules

| Context | Color | Usage |
|---------|-------|-------|
| Primary CTA buttons, active nav, focus rings | Lavender | The single accent color for interactive elements |
| Success states, correct answers, completion | Sage | Score indicators, green checks |
| Warnings, expiring timers, medium scores | Peach | Timer warnings, partial-credit |
| Informational badges, links, tooltips | Ice blue | Help text, info badges |
| Error states, incorrect answers, alerts | Rose | Error messages, wrong-answer highlights |
| Body text | Text primary | All readable content |
| Labels, captions, timestamps | Text secondary | Supporting content |
| Disabled, placeholders | Text tertiary | Non-interactive text |

### 2.3 Gradient Usage

Gradients are used sparingly — only for hero sections and premium badges:

```css
/* Hero gradient overlay */
--gradient-hero: linear-gradient(
  135deg,
  hsla(260, 50%, 72%, 0.08) 0%,
  hsla(200, 50%, 68%, 0.04) 50%,
  transparent 100%
);

/* Badge shine */
--gradient-badge: linear-gradient(
  135deg,
  var(--color-accent-lavender) 0%,
  var(--color-accent-ice) 100%
);
```

---

## 3. Typography

### 3.1 Font Stack

```css
:root {
  --font-sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

Only **two** font families. Inter for all UI text, JetBrains Mono for code blocks and assessment IDs.

### 3.2 Type Scale

Using a **1.25 major third** scale from a 16px base:

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `--text-xs` | 12px / 0.75rem | 400 | 1.5 | Timestamps, badges |
| `--text-sm` | 14px / 0.875rem | 400 | 1.5 | Captions, meta |
| `--text-base` | 16px / 1rem | 400 | 1.6 | Body text |
| `--text-lg` | 20px / 1.25rem | 500 | 1.4 | Card titles |
| `--text-xl` | 24px / 1.5rem | 600 | 1.3 | Section headings |
| `--text-2xl` | 32px / 2rem | 600 | 1.2 | Page titles |
| `--text-3xl` | 40px / 2.5rem | 700 | 1.1 | Hero headline |
| `--text-4xl` | 56px / 3.5rem | 700 | 1.05 | Landing hero (desktop) |

### 3.3 Font Weight Usage

Only **three** weights across the entire platform:

| Weight | Token | Use |
|--------|-------|-----|
| 400 (Regular) | `--weight-regular` | Body, paragraphs, descriptions |
| 500 (Medium) | `--weight-medium` | Card titles, labels, nav items |
| 700 (Bold) | `--weight-bold` | Headings, hero text, CTAs |

---

## 4. Spacing System

8px base unit:

```css
:root {
  --space-1:  4px;   /* 0.25rem */
  --space-2:  8px;   /* 0.5rem  */
  --space-3:  12px;  /* 0.75rem */
  --space-4:  16px;  /* 1rem    */
  --space-5:  24px;  /* 1.5rem  */
  --space-6:  32px;  /* 2rem    */
  --space-7:  40px;  /* 2.5rem  */
  --space-8:  48px;  /* 3rem    */
  --space-10: 64px;  /* 4rem    */
  --space-12: 80px;  /* 5rem    */
  --space-16: 128px; /* 8rem    */
}
```

---

## 5. Layout Philosophy — NO Generic Centering

### 5.1 Grid System

The site uses a **12-column CSS Grid** with asymmetric content placement:

```css
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-5);
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### 5.2 Layout Patterns

**Hero Section** — Left-aligned, occupying columns 1–7 on desktop:
```
┌──────────────────────────────────────────────────────┐
│  col 1-7                            col 8-12         │
│                                                      │
│  KRYNTRA                           ┌──────────┐      │
│  Master cybersecurity              │          │      │
│  through real-world                │  Visual  │      │
│  assessments                       │  Element │      │
│                                    │          │      │
│  [Start Assessment]  [Learn More]  └──────────┘      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Feature Cards** — Staggered bento grid, NOT a uniform 3×3:
```
┌────────────────┐  ┌─────────┐
│                │  │         │
│   Large card   │  │  Small  │
│   (col 1-7)    │  │ (8-12)  │
│                │  │         │
├─────────┬──────┤  ├─────────┤
│ Medium  │ Med  │  │  Tall   │
│ (1-4)   │(5-8) │  │ (9-12)  │
│         │      │  │         │
└─────────┴──────┘  │         │
                    └─────────┘
```

**Dashboard** — Sidebar left (fixed 260px), content area uses offset grid:
```
┌──────────┬───────────────────────────────────────┐
│          │                                       │
│ Sidebar  │  ┌─────────┐  ┌─────────────────────┐│
│          │  │ Stat     │  │  Score History       ││
│ - Home   │  │ Card     │  │  (line chart)        ││
│ - Tests  │  └─────────┘  └─────────────────────┘│
│ - Paths  │                                       │
│ - Rank   │  ┌──────────────────┐  ┌────────────┐│
│ - Profile│  │ Skill Radar      │  │ Weak Areas ││
│          │  │ (radar chart)    │  │ (list)     ││
│          │  └──────────────────┘  └────────────┘│
│          │                                       │
└──────────┴───────────────────────────────────────┘
```

### 5.3 Text Alignment Rules

| Element | Alignment | Rationale |
|---------|-----------|-----------|
| Hero headline + subtext | **Left-aligned** | Editorial feel, reads naturally |
| Navigation items | **Left-aligned** in sidebar; **distributed** in top nav | Scannable hierarchy |
| Card titles | **Left-aligned** | Consistent anchor point |
| Stat numbers (scores, %) | **Left-aligned** with label above | Data-heavy context |
| CTA buttons | **Left-aligned** below their related text | Visual flow continuation |
| Form labels | **Left-aligned** above input | Standard usability |
| Footer columns | **Left-aligned** in multi-column grid | Magazine style |
| **Exception**: Badge icons, avatar, loading spinner | **Centered** within their container | These are intentionally centered decorative elements |

---

## 6. Component Library

### 6.1 Buttons

```
┌─────────────────────────────────────────────────┐
│ Variant        │ Style                           │
├─────────────────────────────────────────────────┤
│ Primary        │ Lavender bg, dark text          │
│ Secondary      │ Transparent, lavender border    │
│ Ghost          │ Transparent, text only          │
│ Danger         │ Rose bg, white text             │
│ Disabled       │ Tertiary bg, muted text,        │
│                │ cursor: not-allowed, no hover   │
└─────────────────────────────────────────────────┘
```

**Critical rule:** Every button has a real action or a `disabled` state. No button is ever wired to nothing.

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: 8px;
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
  transition: background-color 200ms ease-out,
              transform 150ms ease-out,
              box-shadow 200ms ease-out;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.3);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* prevents all interaction */
}

.btn-primary {
  background: var(--color-accent-lavender);
  color: var(--color-text-inverse);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-accent-lavender);
  color: var(--color-accent-lavender);
}
```

### 6.2 Cards

```css
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-surface-border);
  border-radius: 12px;
  padding: var(--space-5);
  transition: border-color 200ms ease-out,
              box-shadow 300ms ease-out;
}

.card:hover {
  border-color: hsla(260, 50%, 72%, 0.3);
  box-shadow: 0 8px 24px hsla(0, 0%, 0%, 0.2);
}

/* Glass variant */
.card-glass {
  background: var(--color-surface-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### 6.3 Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-surface-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  transition: border-color 200ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-lavender);
  box-shadow: 0 0 0 3px hsla(260, 50%, 72%, 0.15);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}
```

### 6.4 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: 100px;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.badge-beginner { background: var(--color-accent-sage-dim); color: var(--color-accent-sage); }
.badge-intermediate { background: var(--color-accent-peach-dim); color: var(--color-accent-peach); }
.badge-advanced { background: var(--color-accent-rose-dim); color: var(--color-accent-rose); }
```

### 6.5 Navigation

**Top navbar** — Fixed, full-width, minimal:
```
┌────────────────────────────────────────────────────────────┐
│  ◆ KRYNTRA          Assessments  Paths  Leaderboard    [→]│
└────────────────────────────────────────────────────────────┘
```

- Logo left-aligned
- Nav links distributed with `gap: var(--space-6)`
- Auth button right-aligned
- Background: `var(--color-bg-primary)` with bottom border `var(--color-surface-border)`
- On scroll: subtle `backdrop-filter: blur(8px)` activation

---

## 7. Motion & Animation

### 7.1 Micro-interactions

| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Button hover | `transform: translateY(-1px)` | 150ms | ease-out |
| Card hover | `border-color` + `box-shadow` | 200ms | ease-out |
| Input focus | `border-color` + `box-shadow` | 200ms | ease-out |
| Nav link hover | `color` | 150ms | ease-out |
| Toggle switch | `transform: translateX()` | 200ms | ease-in-out |

### 7.2 Page Transitions

Scroll-triggered entrance animations using `IntersectionObserver`:

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger > *:nth-child(2) { transition-delay: 80ms; }
.reveal-stagger > *:nth-child(3) { transition-delay: 160ms; }
.reveal-stagger > *:nth-child(4) { transition-delay: 240ms; }
```

### 7.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

---

## 8. Responsive Breakpoints

```css
/* Mobile first */
/* Default: < 640px (mobile) */

@media (min-width: 640px)  { /* sm — tablet portrait */ }
@media (min-width: 768px)  { /* md — tablet landscape */ }
@media (min-width: 1024px) { /* lg — desktop */ }
@media (min-width: 1280px) { /* xl — wide desktop */ }
```

### 8.1 Layout Adaptations

| Breakpoint | Hero | Cards | Sidebar | Nav |
|------------|------|-------|---------|-----|
| Mobile (<640px) | Full width, stacked | 1 column | Hidden (hamburger) | Bottom sheet |
| Tablet (640-1024px) | Full width, stacked | 2 columns | Overlay drawer | Top bar |
| Desktop (>1024px) | 7/5 split | Bento grid | Fixed left 260px | Top bar |

---

## 9. Iconography

Using **Lucide** icon set exclusively — 24px default, 1.5px stroke:

| Context | Icon | Name |
|---------|------|------|
| Assessments | 📋 | `clipboard-check` |
| Learning paths | 🛤️ | `route` |
| Leaderboard | 🏆 | `trophy` |
| Profile | 👤 | `user` |
| Timer | ⏱️ | `timer` |
| Score | 📊 | `bar-chart-3` |
| Lock (premium) | 🔒 | `lock` |
| Shield (security) | 🛡️ | `shield` |
| Correct answer | ✓ | `check-circle` |
| Wrong answer | ✗ | `x-circle` |

---

## 10. Accessibility Checklist

- [ ] All interactive elements keyboard-navigable (tab order, Enter/Space activation)
- [ ] Focus rings visible: `box-shadow: 0 0 0 3px hsla(260, 50%, 72%, 0.4)`
- [ ] Color contrast: all text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] ARIA labels on icon-only buttons
- [ ] `role="alert"` on error messages and score reveals
- [ ] `prefers-reduced-motion` fallback on every animation
- [ ] Skip-to-main-content link
- [ ] Form inputs have associated `<label>` elements
- [ ] Images have descriptive `alt` text
