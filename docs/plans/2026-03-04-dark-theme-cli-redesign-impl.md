# Dark Theme, CLI Terminal & Interactive Enhancements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add dark theme, rotating hero tagline, attract+burst particles, and a "/" CLI terminal overlay to index.html and philosophy.html.

**Architecture:** Pure static site — no build step, no package manager. All changes touch `style.css`, `script.js`, `index.html`, and `philosophy.html`. Changes cascade: dark theme tokens in CSS affect both pages automatically.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla ES6 JS, Ionicons CDN, Inter via Google Fonts

---

## Task 1: Dark Theme — CSS Variables & Global Styles

**Files:**
- Modify: `style.css`

**Step 1: Replace the `:root` CSS variables block**

Replace the entire `:root { ... }` block (lines 6–42) with:

```css
:root {
    /* Dark Palette */
    --color-bg: #0A0D14;
    --color-bg-secondary: #111520;
    --color-text-primary: #E8ECF0;
    --color-text-secondary: #6B7A8D;
    --color-accent: #21D0C3;
    --color-border: rgba(255, 255, 255, 0.07);

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #21D0C3 0%, #1B67C6 100%);

    /* Typography */
    --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
    --font-body: 'Inter', system-ui, -apple-system, sans-serif;

    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 8rem;

    /* Layout */
    --container-width: 1200px;
    --header-height: 80px;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-smooth: 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
```

**Step 2: Update hardcoded light-color values in style.css**

a) `.main-header` background — replace:
```css
background: rgba(255, 255, 255, 0.95);
```
with:
```css
background: rgba(10, 13, 20, 0.85);
```
And its border:
```css
border-bottom: 1px solid rgba(0, 0, 0, 0.05);
```
with:
```css
border-bottom: 1px solid var(--color-border);
```

b) `.skill-card` — replace:
```css
background: white;
border: 1px solid rgba(0, 0, 0, 0.05);
```
with:
```css
background: var(--color-bg-secondary);
border: 1px solid var(--color-border);
```

c) `.venture-card` border — replace:
```css
border: 1px solid rgba(0, 0, 0, 0.05);
```
with:
```css
border: 1px solid var(--color-border);
```

d) `.cert-card` border — replace:
```css
border: 1px solid rgba(0, 0, 0, 0.05);
```
with:
```css
border: 1px solid var(--color-border);
```

e) `.btn-outline` hover — replace:
```css
background: var(--color-text-primary);
color: white;
```
with:
```css
background: var(--color-text-primary);
color: var(--color-bg);
```

f) `.hero-content h1` gradient — replace:
```css
background: linear-gradient(to right, var(--color-text-primary), #4a4a4a);
```
with:
```css
background: linear-gradient(to right, var(--color-text-primary), var(--color-text-secondary));
```

**Step 3: Update header scroll handler in script.js**

Find the scroll event handler and update both background values:
```js
// on scroll > 50:
header.style.background = 'rgba(10, 13, 20, 0.98)';
header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
// on scroll <= 50:
header.style.background = 'rgba(10, 13, 20, 0.85)';
header.style.boxShadow = 'none';
```

**Step 4: Verify in browser**

Open `index.html` in browser. Verify:
- [ ] Page background is `#0A0D14` (very dark blue-black)
- [ ] Text is light (`#E8ECF0`)
- [ ] Header nav is translucent dark
- [ ] Cards have subtle borders, dark backgrounds
- [ ] Accent color is teal (`#21D0C3`)
- [ ] Open `philosophy.html` — confirm same dark theme applies automatically

**Step 5: Commit**

```bash
git add style.css script.js
git commit -m "feat: apply dark theme palette"
```

---

## Task 2: Rotating Hero Tagline

**Files:**
- Modify: `index.html` (hero subtitle paragraph)
- Modify: `style.css` (add `.rotating-word` styles)
- Modify: `script.js` (add rotation logic)

**Step 1: Update index.html hero subtitle**

Find:
```html
<p class="hero-subtitle">Based in Dubai. Blending technical expertise with premium
                    design to transform how we live.</p>
```

Replace with:
```html
<p class="hero-subtitle">I build <span class="rotating-word" id="rotating-word">secure and private</span> systems for real-world environments.</p>
```

**Step 2: Add `.rotating-word` styles to style.css**

Add after the `.hero-subtitle` rule block:

```css
.rotating-word {
    background: var(--gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    transition: opacity 0.3s ease;
    font-style: italic;
}

.rotating-word.fade-out {
    opacity: 0;
}
```

**Step 3: Add rotation logic to script.js**

Inside `DOMContentLoaded`, before the final `});`, add:

```js
// Rotating tagline
const rotatingWords = [
    'secure and private',
    'AI-assisted',
    'automation-first',
    'resilient by design',
    'human-approved',
    'low-friction',
    'production-grade',
    'intelligently autonomous'
];
const rotatingEl = document.getElementById('rotating-word');
if (rotatingEl) {
    let rotatingIndex = 0;
    setInterval(() => {
        rotatingEl.classList.add('fade-out');
        setTimeout(() => {
            rotatingIndex = (rotatingIndex + 1) % rotatingWords.length;
            rotatingEl.textContent = rotatingWords[rotatingIndex];
            rotatingEl.classList.remove('fade-out');
        }, 300);
    }, 2500);
}
```

**Step 4: Verify in browser**

- [ ] Hero subtitle reads "I build [gradient word] systems for real-world environments."
- [ ] Word fades out, swaps, fades in every 2.5s
- [ ] All 8 terms cycle
- [ ] Gradient on word is teal → blue

**Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: rotating hero tagline with gradient accent word"
```

---

## Task 3: Interactive Particles — Attract & Click Burst

**Files:**
- Modify: `script.js`

**Step 1: Change mouse behavior from repel to attract**

In the `Particle.update()` method, find:
```js
// Repel
this.x -= directionX;
this.y -= directionY;
```

Replace with:
```js
// Attract
this.x += directionX * 0.8;
this.y += directionY * 0.8;
```

**Step 2: Update particle and line colors to teal**

In `Particle.draw()`, replace:
```js
ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
```
with:
```js
ctx.fillStyle = 'rgba(33, 208, 195, 0.85)';
```

In `animate()`, replace:
```js
ctx.strokeStyle = `rgba(0, 191, 255, ${0.4 - distance / 500})`;
```
with:
```js
ctx.strokeStyle = `rgba(33, 208, 195, ${0.35 - distance / 500})`;
```

**Step 3: Add BurstParticle class and click handler**

After the closing `}` of the `Particle` class, add:

```js
class BurstParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 1.5 + 1.5;
        this.alpha = 1;
        this.decay = 1 / (Math.random() * 20 + 20);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(33, 208, 195, ${this.alpha})`;
        ctx.fill();
    }

    isDead() {
        return this.alpha <= 0;
    }
}

let burstParticles = [];

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    for (let i = 0; i < 12; i++) {
        burstParticles.push(new BurstParticle(cx, cy));
    }
});
```

**Step 4: Add burst rendering to the animate loop**

In `animate()`, after the main particle loop, add:

```js
// Burst particles
burstParticles = burstParticles.filter(bp => !bp.isDead());
burstParticles.forEach(bp => {
    bp.update();
    bp.draw();
});
```

**Step 5: Verify in browser**

- [ ] Hovering near particles causes them to drift toward cursor
- [ ] Clicking spawns ~12 teal particles that fade out
- [ ] Burst particles have no connection lines
- [ ] All particles are teal

**Step 6: Commit**

```bash
git add script.js
git commit -m "feat: attract-on-hover and click-burst interactive particles"
```

---

## Task 4: CLI Terminal Overlay

**Files:**
- Modify: `index.html` (add overlay DOM)
- Modify: `style.css` (add CLI styles)
- Modify: `script.js` (add CLI logic)

**Step 1: Add CLI overlay HTML to index.html**

Immediately before `<script src="script.js"></script>`, add:

```html
<!-- CLI Terminal Overlay -->
<div id="cli-overlay" aria-hidden="true">
    <div class="cli-panel" role="dialog" aria-label="Terminal">
        <div class="cli-header">
            <span class="cli-title">andresbolivar.me — terminal</span>
            <button class="cli-close" id="cli-close" aria-label="Close terminal">&times;</button>
        </div>
        <div id="cli-output" class="cli-output"></div>
        <div class="cli-input-row">
            <span class="cli-prompt">user@andresbolivar:~$&nbsp;</span>
            <input type="text" id="cli-input" class="cli-input" autocomplete="off" spellcheck="false" aria-label="Terminal input" />
        </div>
    </div>
</div>
```

**Step 2: Add CLI styles to the end of style.css**

```css
/* ===================== CLI Terminal Overlay ===================== */
#cli-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.92);
    display: none;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

#cli-overlay.cli-open {
    display: flex;
}

.cli-panel {
    width: 100%;
    max-width: 700px;
    margin: 0 var(--spacing-sm);
    background: #0A0D14;
    border: 1px solid rgba(33, 208, 195, 0.25);
    border-radius: 8px;
    overflow: hidden;
    font-family: 'JetBrains Mono', 'Courier New', 'Lucida Console', monospace;
    box-shadow: 0 0 60px rgba(33, 208, 195, 0.08);
    animation: cli-appear 0.15s ease-out;
}

@keyframes cli-appear {
    from { transform: translateY(8px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
}

.cli-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cli-title {
    font-size: 0.75rem;
    color: #6B7A8D;
    letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
}

.cli-close {
    background: none;
    border: none;
    color: #6B7A8D;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
    transition: color var(--transition-fast);
    font-family: inherit;
}

.cli-close:hover {
    color: #E8ECF0;
}

.cli-output {
    padding: 16px;
    min-height: 260px;
    max-height: 55vh;
    overflow-y: auto;
    font-size: 0.82rem;
    line-height: 1.8;
    color: #E8ECF0;
}

.cli-output .cli-line-cmd {
    color: #6B7A8D;
    margin-top: 8px;
}

.cli-output .cli-line-cmd::before {
    content: 'user@andresbolivar:~$ ';
    color: #21D0C3;
}

.cli-output .cli-line-out {
    color: #E8ECF0;
    white-space: pre-wrap;
}

.cli-output .cli-line-err {
    color: #FF6B6B;
}

.cli-input-row {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    gap: 0;
}

.cli-prompt {
    color: #21D0C3;
    font-size: 0.82rem;
    white-space: nowrap;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
}

.cli-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: #E8ECF0;
    font-size: 0.82rem;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    caret-color: #21D0C3;
    padding: 0;
}
```

**Step 3: Add CLI logic to script.js**

Inside `DOMContentLoaded`, before the final `});`, add:

```js
// ===================== CLI Terminal =====================
const cliOverlay = document.getElementById('cli-overlay');
const cliInput = document.getElementById('cli-input');
const cliOutput = document.getElementById('cli-output');
const cliCloseBtn = document.getElementById('cli-close');

if (cliOverlay && cliInput && cliOutput) {

    const CLI_RESPONSES = {
        about: [
            '  name:      Andres Bolivar',
            '  role:      Engineer & Entrepreneur',
            '  location:  Dubai, UAE',
            '  origin:    Medellín, Colombia',
            '  founded:   Dhaki — luxury smart automation',
        ],
        focus: [
            '  current:   AI-assisted smart environments',
            '  active:    Dhaki — intelligent spaces platform',
            '  exploring: autonomous home robotics',
            '             edge AI deployment',
            '             privacy-first infrastructure',
        ],
        philosophy: [
            '  "I am driven by curiosity — not as a habit, but as a system.',
            '  I am a hacker by mindset. Not to bypass rules,',
            '  but to understand systems deeply enough to redesign them.',
            '  Technology is not an accessory. It is an extension of human capability.',
            '  If something can be better, it should be.',
            '  If something can be smarter, it must be."',
        ],
        systems: [
            '  — Smart home & IoT architecture',
            '  — AI & automation pipelines',
            '  — Cloud infrastructure & DevOps',
            '  — Cybersecurity & hardening',
            '  — Systems engineering',
        ],
        contact: [
            '  email:     andresbolivar@proton.me',
            '  telegram:  t.me/audrum',
            '  linkedin:  linkedin.com/in/anemboca',
            '  github:    github.com/audrum',
        ],
        help: [
            '  available commands:',
            '  about       — who I am',
            '  focus       — what I\'m working on',
            '  philosophy  — how I think',
            '  systems     — what I build',
            '  contact     — how to reach me',
            '  clear       — clear the terminal',
            '  exit        — close the terminal',
        ],
    };

    function openCLI() {
        cliOverlay.classList.add('cli-open');
        cliOverlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => cliInput.focus(), 50);
    }

    function closeCLI() {
        cliOverlay.classList.remove('cli-open');
        cliOverlay.setAttribute('aria-hidden', 'true');
        cliInput.value = '';
    }

    function appendLine(text, className) {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        cliOutput.appendChild(line);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function typeLines(lines, lineIndex) {
        if (lineIndex >= lines.length) return;
        const line = document.createElement('div');
        line.className = 'cli-line-out';
        cliOutput.appendChild(line);
        let charIndex = 0;
        const text = lines[lineIndex];
        const interval = setInterval(() => {
            line.textContent += text[charIndex];
            charIndex++;
            cliOutput.scrollTop = cliOutput.scrollHeight;
            if (charIndex >= text.length) {
                clearInterval(interval);
                typeLines(lines, lineIndex + 1);
            }
        }, 10);
    }

    function handleCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        appendLine(raw.trim(), 'cli-line-cmd');

        if (cmd === 'clear') {
            while (cliOutput.firstChild) cliOutput.removeChild(cliOutput.firstChild);
            return;
        }

        if (cmd === 'exit') {
            closeCLI();
            return;
        }

        const lines = CLI_RESPONSES[cmd];
        if (lines) {
            typeLines(lines, 0);
        } else {
            appendLine('bash: ' + cmd + ': command not found', 'cli-line-err');
        }
    }

    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;

        if (e.key === '/') {
            e.preventDefault();
            if (cliOverlay.classList.contains('cli-open')) {
                closeCLI();
            } else {
                openCLI();
            }
            return;
        }

        if (e.key === 'Escape' && cliOverlay.classList.contains('cli-open')) {
            closeCLI();
        }
    });

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = cliInput.value;
            cliInput.value = '';
            handleCommand(val);
        }
        if (e.key === 'Escape') {
            closeCLI();
        }
    });

    if (cliCloseBtn) {
        cliCloseBtn.addEventListener('click', closeCLI);
    }

    cliOverlay.addEventListener('click', (e) => {
        if (e.target === cliOverlay) closeCLI();
    });
}
```

**Note on clear command:** Uses `while (cliOutput.firstChild) cliOutput.removeChild(cliOutput.firstChild)` — safe DOM removal, no innerHTML.

**Step 4: Verify in browser**

- [ ] Press `/` — terminal overlay opens with dark panel, teal border, slide-in animation
- [ ] `help` + Enter — command list appears with typing animation
- [ ] `about`, `focus`, `philosophy`, `systems`, `contact` — all return correct output
- [ ] `clear` — wipes output
- [ ] `exit` — closes overlay
- [ ] `Escape` — closes overlay
- [ ] Second `/` — closes overlay
- [ ] Click outside panel — closes overlay
- [ ] Unknown command — red error message
- [ ] `/` inside CLI input does NOT toggle the overlay

**Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: CLI terminal overlay triggered by '/' key"
```

---

## Task 5: philosophy.html — Dark Theme Inline Style Fixes

**Files:**
- Modify: `philosophy.html`

**Step 1: Fix hardcoded light color in footer Email Me button**

Find:
```html
<a href="mailto:andresbolivar@proton.me" class="btn btn-primary"
    style="background: white; color: var(--color-text-primary);">Email Me</a>
```

Replace with:
```html
<a href="mailto:andresbolivar@proton.me" class="btn btn-primary"
    style="background: var(--color-text-primary); color: var(--color-bg);">Email Me</a>
```

**Step 2: Verify CLI works on philosophy.html**

- [ ] Press `/` on philosophy.html — terminal opens
- [ ] `philosophy` command returns manifesto excerpt

**Step 3: Commit**

```bash
git add philosophy.html
git commit -m "fix: dark theme inline overrides in philosophy.html"
```

---

## Task 6: Final QA Pass

**Step 1: index.html full visual check**

- [ ] Dark background throughout entire page
- [ ] Rotating tagline cycles with gradient teal word
- [ ] Particles attract toward cursor, burst on click (teal throughout)
- [ ] All cards readable with dark bg and subtle borders
- [ ] Buttons visible and legible
- [ ] Footer links and social icons readable

**Step 2: philosophy.html**

- [ ] Dark theme consistent with index.html
- [ ] EN/ES toggle works
- [ ] Manifesto text readable

**Step 3: CLI terminal**

- [ ] All 5 commands work
- [ ] Typing animation smooth
- [ ] No console errors

**Step 4: Responsive check (resize to 375px)**

- [ ] CLI panel readable on mobile
- [ ] Rotating word does not overflow
- [ ] Header stacks correctly

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: QA pass — final polish"
```
