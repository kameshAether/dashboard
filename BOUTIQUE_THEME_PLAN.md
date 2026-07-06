# Boutique Cyber-Noir Dashboard — Implementation Plan

> **Status:** Planning Stage (Refined Professional Version)  
> **Target:** Move from "basic dark mode" to "high-end boutique studio" aesthetic.

---

## 1. Design System: "The Deep Layered Aesthetic"

### Color Palette (The "Deep Space" Palette)
| Role | Hex | Usage |
|---|---|---|
| Background | `#050507` | The absolute base layer |
| Surface | `#0D0D12` | Card surfaces (translucent) |
| Accent | `#00F5FF` | Primary electric cyan (glow) |
| Secondary | `#7000FF` | Deep violet/indigo for ambient light orbs |
| Text Primary | `#F5F5F7` | High-contrast, clean white-gray |
| Text Secondary | `#86868B` | Muted, professional gray |
| Border | `rgba(255, 255, 255, 0.08)` | Ultra-subtle edge definition |

### Typography
- **Primary Font:** `Inter` (Variable)
- **Headings:** Heavy weight (700+), tight letter-spacing (`-0.04em`), high leading.
- **Body:** Regular weight (400), generous leading (`1.6`), increased tracking for readability.
- **Labels:** All-caps, ultra-spaced (`0.2em`) for professional metadata feel.

---

## 2. Component Specifications

### 🌌 Layer 0: Global Textures (The "Film" Look)
- **Global Noise:** A persistent, low-opacity (`0.03`) SVG noise filter overlaying the entire viewport.
- **Ambient Orbs:** Two large, extremely blurred (`150px` - `250px`) radial gradients (`#7000FF` and `#00F5FF`) that drift slowly in the background using `requestAnimationFrame`.

### 🍱 Layer 1: The Bento Grid
Instead of a uniform grid, we will implement a **Bento Box** layout.
- **Large Card:** For the "Hero" project (e.g., AI Today Blog).
- **Standard Cards:** For secondary projects.
- **Small/Square Cards:** For quick links or minor projects.
- *Implementation:* Use `grid-template-areas` or `grid-column: span X`.

### 💎 Layer 2: Glassmorphism 2.0 Cards
```css
.card {
  background: rgba(13, 13, 18, 0.7); /* Surface color with alpha */
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

/* The "Glint" effect */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.03) 50%, 
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.card:hover::before {
  transform: translateX(100%);
}
```

### 🖱️ Layer 3: High-End Interactions
- **Magnetic Hover:** Using JS to subtly pull the card or button toward the mouse cursor.
- **Light-Sweep Buttons:** A moving radial gradient that follows the mouse inside the button bounds.
- **Micro-scale Reveal:** Items don't just fade in; they "scale-up" slightly while fading (0.95 -> 1.0).

---

## 3. Implementation Roadmap

### Phase 1: The Foundation (Atmosphere)
- [ ] Update Google Fonts to include Inter Variable.
- [ ] Implement the `#050507` background.
- [ ] Inject the SVG Noise Overlay.
- [ ] Create the `AmbientOrbs` class and the JS logic for slow, drifting movement.

### Phase 2: Layout & Bento Grid
- [ ] Redesign the CSS Grid to support `span` functionality.
- [ ] Re-map the 6 project cards into a dynamic Bento structure (1 large, 2 medium, 3 small/standard).
- [ ] Clean up header/footer to be ultra-minimal (no borders, just spacing).

### Phase 3: Glass & Depth
- [ ] Apply the `backdrop-filter` and `rgba` surfaces to all cards.
- [ ] Implement the `card::before` glint effect.
- [ ] Update card images to use deeper, more atmospheric gradients.

### Phase 4: Polishing (The "Pro" Feel)
- [ ] Add the magnetic hover effect via JS.
- [ ] Refine typography (letter-spacing, weight, hierarchy).
- [ ] Implement the "Micro-scale" reveal for entry animations.
- [ ] Accessibility: Ensure `prefers-reduced-motion` kills the orbs and the scaling.

---

## 4. Testing Checklist

- [ ] **Visual Depth:** Do the orbs look like light *behind* the glass, not just on top of it?
- [ ] **Bento Balance:** Does the grid look intentional or messy?
- [ ] **Performance:** Does the noise and blur keep the FPS at 60? (Use `will-change: transform`).
- [ ] **Typography:** Is the hierarchy clear? (Can I tell what's a heading and what's body at a glance?)
- [ ] **Interaction:** Does the magnetic hover feel "smooth" or "jittery"? (Use lerp/damping).

---

**Plan saved to:** `/root/data/projects/dashboard/BOUTIQUE_THEME_PLAN.md`
