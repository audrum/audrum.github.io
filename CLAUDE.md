# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website for Andres Bolivar ([andresbolivar.me](https://andresbolivar.me)), deployed via GitHub Pages. **No build step, no framework, no package manager.** Pure HTML + CSS + vanilla JS.

To preview locally, open `index.html` in a browser or serve with any static file server (e.g., `python3 -m http.server`).

## Architecture

Two pages share a single CSS/JS pair:

- `index.html` — main page (hero, about, ventures, skills, contact/footer)
- `philosophy.html` — standalone bilingual (EN/ES) page; nav links prefix `index.html#`
- `style.css` — full design system (CSS variables, layout, components, responsive)
- `script.js` — all interactivity: dot grid canvas, scroll reveals, header effect, CLI terminal, language switcher

## Design System (master — dark theme)

| Token | Value |
|---|---|
| Background | `#0A0D14` primary, `#141A26` secondary |
| Text | `#E8ECF0` primary, `#8A97A8` secondary |
| Accent | `#21D0C3` (teal) |
| Gradient | `linear-gradient(135deg, #21D0C3, #1B67C6)` |
| Border | `rgba(255, 255, 255, 0.07)` |
| Font | Inter 300–700 + JetBrains Mono 400–500 via Google Fonts CDN |
| Icons | Ionicons 7.1 via unpkg CDN |

## Page Sections (index.html)

Hero → About → Ventures → Skills → Contact/Footer

### Hero
- Location badge: `.hero-badge` (pill with ionicon + "Dubai, UAE")
- Rotating tagline: `.rotating-word` fades every 2.5s through 8 terms
- CLI hint: `.cli-hint` with `<kbd>/</kbd>` — desktop only, hidden on mobile
- Mobile Save Contact button: `.mobile-contact-btn-wrapper` — hidden on desktop

### About
- 2-col grid: image left, text right
- Animated stat counters: `.about-stats` / `.about-stat-value` — count up on scroll via IntersectionObserver
- Stats: 15+ years, 4 countries, 1 venture

### Ventures
- Grid: `.ventures-grid` — `auto-fill, minmax(350px, 1fr)`, `justify-content: center`
- Cards: Dhaki, GenPWD, HNWI Private Cybersecurity, More to Come

### Skills
- 6 cards in `.skills-grid` — custom copy, no generic descriptions

## CSS Conventions

- Scroll reveal: `.reveal-on-scroll` → `.is-visible` (IntersectionObserver, fires once)
- Fixed nav: `.main-header` — gains box-shadow on scroll via JS
- Buttons: `.btn.btn-primary` / `.btn.btn-outline`
- Hero badge: `.hero-badge` — pill shape, teal icon, secondary text
- About stats: `.about-stats` / `.about-stat-value` (gradient text) / `.about-stat-label`
- Focus: `:focus` removes outline; `:focus-visible` shows 2px teal ring (keyboard-only)
- Text protection: `user-select: none` globally; right-click, drag, devtools shortcuts blocked in `script.js`

### Mobile Breakpoints

- `@media (max-width: 900px)` — grids collapse to 1-col, hero image reorders
- `@media (max-width: 768px)` — hamburger nav, CLI FAB visible, mobile save contact shown

### Mobile Nav Fix
The hamburger `.nav-hamburger` uses `order: 1` and `nav` uses `order: 2` to ensure logo + hamburger share the same flex line, with nav expanding below. Do not remove these order values.

## JS Architecture (`script.js`)

Single `DOMContentLoaded` listener handles:

1. **Year injection** — `#year`
2. **Scroll reveals** — IntersectionObserver on `.reveal-on-scroll` → `.is-visible`
3. **Stat counters** — IntersectionObserver on `.about-stats`, animates `.about-stat-value` from 0 on entry. Handles `+` suffix. Uses lazy `startTime` init on first rAF frame.
4. **Header scroll effect** — `.main-header` box-shadow via scroll listener
5. **Dot grid canvas** (`#bg-canvas`) — two overlapping sine waves ripple through a fixed grid of dots; mouse position subtly shifts wave phase. Respects `prefers-reduced-motion` (canvas hidden). Pauses on `visibilitychange`. Mobile uses larger spacing (48px vs 36px).
6. **CLI terminal** — `#cli-overlay` toggled by `/` key (desktop) or `#cli-fab` (mobile). Commands: `about`, `focus`, `philosophy`, `systems`, `contact`, `help`, `clear`, `exit`. `typeLines()` types at 10ms/char.
7. **Content protection** — contextmenu, dragstart, keydown blocks
8. **Language switcher** — `window.switchLang(lang)` for `philosophy.html`, `?lang=` URL param

## CLI Terminal

- Overlay: `#cli-overlay` → `.cli-open`
- Panel: `.cli-panel`, header `.cli-header`, output `#cli-output`, input `#cli-input`
- Prompt: `user@andresbolivar:~$`
- Font: JetBrains Mono
- Commands are defined in `CLI_RESPONSES` object in `script.js` — update there to change CLI content
- `clear` uses DOM `removeChild` loop (not `innerHTML = ''`)

## Branch Notes

Branch `redesign/dark-editorial` contains an older dark editorial redesign with different class names (`.reveal`/`.visible`, `.btn-gradient`/`.btn-ghost`, `.nav`/`#nav`). Do not mix conventions between branches.
