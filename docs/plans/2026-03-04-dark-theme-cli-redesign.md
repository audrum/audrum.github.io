# Design Doc: Dark Theme, Rotating Tagline, Interactive Particles & CLI Terminal

**Date:** 2026-03-04
**Scope:** `index.html`, `style.css`, `script.js`, `philosophy.html`
**Approach:** Sequential single frontend dev → UX review → QA validation

---

## 1. Dark Theme (Fresh Palette)

Replace the current light palette in `style.css` CSS variables with:

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#0A0D14` | Page background |
| `--color-bg-secondary` | `#111520` | Section alternates, card surfaces |
| `--color-text-primary` | `#E8ECF0` | Body text |
| `--color-text-secondary` | `#6B7A8D` | Muted labels, secondary copy |
| `--color-accent` | `#21D0C3` | Links, icons, glow highlights |
| `--gradient-primary` | `linear-gradient(135deg, #21D0C3, #1B67C6)` | Buttons, accents |
| `--color-border` | `rgba(255,255,255,0.07)` | Card/section borders |

- Card backgrounds: `--color-bg-secondary` with `--color-border` border, no heavy box-shadow
- Header `backdrop-filter: blur(16px)` over `rgba(10,13,20,0.85)`
- Footer already dark — update text colors to match new palette
- About image: keep grayscale default, color on hover (hover glow becomes teal)

---

## 2. Rotating Hero Tagline

Replace `<p class="hero-subtitle">Based in Dubai. Blending technical expertise...</p>` with:

```html
<p class="hero-subtitle">
  I build <span class="rotating-word" id="rotating-word"></span> systems for real-world environments.
</p>
```

- 8 terms, 2.5s interval: `secure and private`, `AI-assisted`, `automation-first`, `resilient by design`, `human-approved`, `low-friction`, `production-grade`, `intelligently autonomous`
- Transition: fade-out (300ms) → swap text → fade-in (300ms)
- `.rotating-word` styled with `--gradient-primary` `background-clip: text` — matches accent
- Pure vanilla JS `setInterval`, no library

---

## 3. Interactive Particles (`script.js`)

**Cursor attract (replaces current repel):**
- Within `200px` radius, particles move *toward* the cursor
- Force: `(maxDistance - distance) / maxDistance * density * 0.8`

**Click burst:**
- On `mousedown`, emit 12 short-lived particles at click coordinates
- Each burst particle: random direction, speed 3–6, size 1.5–3px, alpha fades 1 → 0 over 800ms
- Burst particles do not form connection lines

**Colors updated to teal:**
- Particle fill: `rgba(33, 208, 195, 0.8)`
- Connection lines: `rgba(33, 208, 195, alpha)` fading with distance

---

## 4. CLI Terminal Overlay

**Trigger:** `"/"` keypress (anywhere on page, not inside an input)
**Dismiss:** `Escape` or pressing `"/"` again

**DOM structure:**
```
#cli-overlay (position: fixed, inset: 0, z-index: 9999, rgba(0,0,0,0.92))
  └── .cli-panel (centered, max-width: 700px, bg: #0A0D14, border: 1px solid rgba(255,255,255,0.1))
        ├── .cli-header ("andresbolivar.me — terminal" + × close button)
        ├── #cli-output (scrollable output area)
        └── .cli-input-row (prompt + input)
              ├── .cli-prompt "user@andresbolivar:~$"
              └── #cli-input (text input, monospace, no border)
```

**Styling:**
- Font: `'JetBrains Mono', 'Courier New', monospace`
- Background: `#0A0D14` panel on `rgba(0,0,0,0.92)` overlay
- Prompt color: `#21D0C3` (teal)
- Output text: `#E8ECF0`
- Error text: `#FF6B6B`
- Typing animation: 20ms per character via `setInterval`

**Commands and responses (field: value format):**

```
about
  name:      Andres Bolivar
  role:      Engineer & Entrepreneur
  location:  Dubai, UAE
  origin:    Medellín, Colombia
  founded:   Dhaki — luxury smart automation

focus
  current:   AI-assisted smart environments
  active:    Dhaki — intelligent spaces platform
  exploring: autonomous home robotics / edge AI / privacy-first infra

philosophy
  [condensed from philosophy.html EN content — first 5–8 lines of manifesto]

systems
  - Smart home & IoT architecture
  - Cloud infrastructure & DevOps
  - AI & automation pipelines
  - Cybersecurity & hardening
  - Systems engineering

contact
  email:     andresbolivar@proton.me
  telegram:  t.me/audrum
  linkedin:  linkedin.com/in/anemboca
  github:    github.com/audrum
```

**Special commands:**
- `help` → lists all available commands
- `clear` → wipes `#cli-output`
- `exit` → closes overlay
- Unknown → `bash: <cmd>: command not found` in red

---

## 5. philosophy.html — Dark Theme

- No file rename needed (spelling is already correct)
- Dark theme cascades automatically from `style.css` variable updates
- Nav links back to `index.html#anchor` remain unchanged
- Language switcher (EN/ES toggle) unchanged
- Verify `#philosophy-en` / `#philosophy-es` text colors render correctly in dark mode

---

## Team Structure

| Agent | Role |
|---|---|
| UX designer | Reviews design spec, provides feedback before implementation, reviews final output |
| Frontend developer | Implements all 5 changes sequentially in `style.css`, `script.js`, `index.html`, `philosophy.html` |
| QA agent | Validates each change: colors render, rotation works, particles attract+burst, CLI opens/closes/responds, philosophy.html dark |
