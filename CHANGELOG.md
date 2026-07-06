# Changelog

All notable changes to Kamesh Aether's Project Dashboard will be documented in this file.

## [Unreleased] - 2026-07-04

### Added
- Boutique Cyber-Noir "Deep Space" aesthetic replacing matte-black theme
- Ambient orbs (`#7000FF`, `#00F5FF`) with `requestAnimationFrame` drift animation
- SVG noise overlay for cinematic film grain texture
- Bento Box grid layout with 1 hero card and adaptive responsive breakpoints
- Glassmorphism 2.0 cards with `backdrop-filter: blur(24px) saturate(180%)` and glint sweep effect
- Light-sweep buttons with mouse-tracking radial gradient
- Magnetic hover effect on cards using lerp-based JS physics
- Micro-scale scroll reveal animation (`scale(0.95)` → `scale(1)`)

### Changed
- Color palette: `#050507` background, `#0D0D12` surface, `#00F5FF` accent, `#7000FF` secondary
- Typography: Inter 700 headings, ultra-tight `-0.04em` letter-spacing, labels at `0.28em`
- Borders: ultra-subtle `rgba(255,255,255,0.08)` replacing solid borders
- Status dots: cyan glow rings replacing matte green dots
- Back-to-top: dark glass surface with cyan accent states
- All card gradients deepened for atmospheric depth
- Layout: removed category label wrappers, integrated into grid flow

### Accessibility
- `prefers-reduced-motion` fully disables orbs, reveals, and transitions
- WCAG AA contrast maintained at ~15:1+ on deep space background

## [1.0.0] - 2025-01-01

### Added
- Initial portfolio dashboard: "Kamesh Aether Dashboard"
- Vintage book-aesthetic with leather-binding bars, paper texture, and age overlays
- Project cards: AI Today Blog (📝), Harry Potter Chronicle (⚡), Road Rash (🏍️), Snake Game (🐍), Super Mario Clone (🍄)
- Gold-accented buttons linking to live GitHub Pages demos
- Dynamic footer year via JavaScript
- Responsive grid (auto-fit minmax, mobile fallback)
