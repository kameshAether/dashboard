# Minimal Matte Black Dashboard Theme — Implementation Plan

> **Status:** Planned, not executed. Ready for implementation.  
> **Scope:** Replace the vintage "Reading Nook" theme (`index.html` only). No new files or dependencies.

---

## 1. Goal & Context

Replace the current parchment/vintage aesthetic with a **minimal matte black** design, featuring subtle animations and effects.

### Why this will work (past failure `2733f79` was reverted)

| Past attempt (`2733f79` — reverted) | This plan (improvements) |
|---|---|
| Flat, lifeless dark | Rich **cyan/teal accent** (`#00E5CC`) on pure black — visual interest |
| No animations beyond basic hover | **Pulse dot, scroll reveal, card lift** — motion adds depth |
| No accessibility consideration | **WCAG AA contrast**, `prefers-reduced-motion`, visible focus rings |
| Heavy drop shadows | **Liquid-glass cards** (blur + alpha) — modern, lightweight |

### Current state

- File: `/root/data/projects/dashboard/index.html` (441 lines, 15.5KB)
- **Uncommitted local changes** exist on `index.html` and `CHANGELOG.md` — must `git stash` before starting
- Past dark theme commit: `2733f79` (later reverted to vintage in `b04b5ea`)

---

## 2. Design System

### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Background | `#0A0A0A` | Page background |
| Surface | `#141414` | Card backgrounds |
| Border (rest) | `#2A2A2A` | Card borders, dividers |
| Border (hover) | `#00E5CC` | Card hover accent |
| Text Primary | `#EAEAEA` | Headings, body text |
| Text Secondary | `#888888` | Descriptions, metadata |
| Accent | `#00E5CC` | Links, buttons, hover states |
| Accent Hover | `#40E0D0` | Hover, focus |
| Status Green | `#10B981` | Live dot |

### Typography

- Primary: **Inter** (Google Fonts, weights 400, 600) — replaces Cinzel/EB Garamond
- Headings: Inter 600
- Body: Inter 400
- Monospace: JetBrains Mono (for technical elements if needed)

### Spacing

- Page padding: `80px` top, `48px` horizontal
- Card border-radius: `12px`
- Card gap: `24px`
- Max-width: `1200px`

---

## 3. Component Specifications

### Card (Liquid-Glass Style)

```css
.card {
  background: rgba(20, 20, 20, 0.6);        /* #141414 at 60% opacity */
  backdrop-filter: blur(16px);                /* Frosted glass effect */
  border: 1px solid rgba(42, 42, 42, 0.6);   /* #2A2A2A at 60% opacity */
  border-radius: 12px;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  border-color: rgba(0, 229, 204, 0.5);      /* Cyan accent at 50% */
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 229, 204, 0.08);
}
```

### Button

```css
.btn {
  background: #00E5CC;
  color: #0A0A0A;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  background: #40E0D0;
  transform: translateY(-2px);
}

.btn:focus-visible {
  outline: 2px solid #00E5CC;
  outline-offset: 3px;
}
```

### Status Dot (Pulse Animation)

```css
.status-dot {
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  position: relative;
}

.status-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #10B981;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}
```

### Scroll Reveal (Staggered)

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Back-to-Top Button

- Fixed position, bottom-right
- Appears after scroll > 400px
- Hover: translateY(-3px), opacity 0.7 → 1
- Focus ring: 2px solid `#00E5CC`

---

## 4. HTML Structure Changes

### `<head>` Updates

1. **Fonts**: Replace Cinzel/EB Garamond/Playfair with Inter
2. **Theme color**: Update `meta name="theme-color"` from `#4a3728` → `#0A0A0A`
3. **Description**: Keep current copy

### `<body>` Restyle

| Element | Current | New |
|---|---|---|
| Background | `#fdfbf7` (ivory) | `#0A0A0A` (matte black) |
| Texture overlays | Paper texture + age overlay | Remove (clean) |
| Header | Centered, gold underline | Left-aligned, no underline, subtle accent |
| Category labels | "Words & Worlds", "Games" | Keep, restyle with accent underline |
| Cards | Parchment with tan border | Liquid glass (blur + alpha) |
| Buttons | Gold pill | Cyan rounded rect |
| Footer | Centered, italic | Centered, minimal |

---

## 5. Step-by-Step Implementation

### Step 1: Stash Local Changes

```bash
cd /root/data/projects/dashboard
git stash push -m "Before matte-black theme rewrite"
```

### Step 2: Replace `<head>` Content

- Swap Google Fonts link to Inter (400, 600)
- Update `theme-color` meta
- Keep all OG/Twitter meta tags
- Keep viewport and description

### Step 3: Replace CSS (Complete Rewrite)

- Remove: all vintage variables (`--ivory`, `--cream`, `--parchment`, `--tan`, `--sepia`, `--saddle`, `--chocolate`, `--espresso`, `--gold`, `--gold-light`, `--copper`, `--wine`, `--forest`)
- Remove: `.paper-texture`, `.age-overlay`, `.leather-binding`, `.leather-binding-bottom`
- Add: new dark color variables
- Add: liquid-glass card styles
- Add: button, status dot, back-to-top styles
- Keep: `.grid`, `.card-content`, `.reveal` (modified)
- Keep: responsive media query (update values)

### Step 4: Update HTML Structure

- Replace `<body>` class/styles
- Restructure header: remove gold underline, add accent rule
- Keep all 6 project cards with same content
- Restyle card images with new gradient classes
- Replace button classes
- Keep footer year JS

### Step 5: Update JavaScript

- Keep: `document.getElementById('year')`
- Keep: IntersectionObserver scroll reveal (update timing/stagger)
- Keep: Back-to-top visibility toggle

---

## 6. Accessibility

| Feature | Implementation |
|---|---|
| `prefers-reduced-motion` | Disable all transforms/animations, only opacity changes |
| Focus rings | 2px solid `#00E5CC`, `outline-offset: 3px` on all interactive elements |
| Color contrast | Body text `#EAEAEA` on `#0A0A0A` = ~15.6:1 (passes AAA) |
| Keyboard nav | All cards and buttons focusable with visible ring |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Testing Checklist

Before commit:

- [ ] All 6 cards render with liquid-glass effect
- [ ] Card hover: border turns cyan, lifts up
- [ ] Status dot pulses green
- [ ] Scroll reveal staggers cards (100ms apart)
- [ ] Buttons: cyan → brighter cyan on hover
- [ ] Back-to-top appears after 400px scroll
- [ ] Mobile: single column, 16px padding
- [ ] Keyboard: visible focus ring on all interactive elements
- [ ] `prefers-reduced-motion`: no animations (Firefox dev tools → "Reduce motion")
- [ ] `git diff` shows only `index.html` changed

---

## 8. Git Workflow

```bash
# After testing
git add index.html
git commit -m "feat: minimal matte-black theme with liquid glass cards

- Replace vintage palette with #0A0A0A matte black
- Add liquid-g solidity via backdrop-filter
- Cyan accent (#00E5CC) on hover and focus
- Staggered scroll reveal animation
- Pulse status dots
- prefers-reduced-motion support
- WCAG AA contrast compliance"

git push origin main
```

---

## 9. Rollback Path

If the theme doesn't work out:

```bash
git stash pop          # Restore uncommitted changes before this
git revert HEAD        # Or revert the commit
```

---

**Plan saved to:** `.hermes/plans/2026-07-04_202907-dashboard-minimal-matte-black-theme.md`