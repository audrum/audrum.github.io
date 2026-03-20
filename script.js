document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    // Stat counter animation
    function animateCounter(el) {
        const raw = el.textContent.trim();
        const hasSuffix = raw.endsWith('+');
        const target = parseInt(raw);
        if (isNaN(target)) return;
        const duration = 1500;
        let startTime = null;

        el.textContent = '0' + (hasSuffix ? '+' : '');

        function tick(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + (hasSuffix ? '+' : '');
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.about-stat-value').forEach(animateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.about-stats');
    if (statsEl) statsObserver.observe(statsEl);

    // Optional: Add smooth scroll for safely handling older browsers or complex anchors if needed
    // (CSS scroll-behavior: smooth is already active, but this adds a safety layer if we wanted custom easing)

    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 13, 20, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
        } else {
            header.style.background = 'rgba(10, 13, 20, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // Background Canvas Animation (Dot Grid Pulse)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        // Respect reduced-motion preference — skip animation entirely
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.display = 'none';
        } else {

        const ctx = canvas.getContext('2d');
        let width, height, dots = [];
        let animationPaused = false;
        let time = 0;

        const isMobile = window.innerWidth <= 768;
        const SPACING    = isMobile ? 48 : 36;
        const DOT_RADIUS = 1;
        const BASE_ALPHA = 0.08;
        const WAVE_ALPHA = 0.22;

        // Pause when tab is hidden to save battery
        document.addEventListener('visibilitychange', () => {
            animationPaused = document.hidden;
        });

        // Subtle mouse influence on wave phase
        let mouse = { nx: 0.5, ny: 0.5 };
        window.addEventListener('mousemove', (e) => {
            mouse.nx = e.clientX / width;
            mouse.ny = e.clientY / height;
        });

        function buildGrid() {
            dots = [];
            const cols = Math.ceil(width  / SPACING) + 1;
            const rows = Math.ceil(height / SPACING) + 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    dots.push({ x: c * SPACING, y: r * SPACING });
                }
            }
        }

        function resize() {
            width  = canvas.width  = window.innerWidth;
            height = canvas.height = window.innerHeight;
            buildGrid();
        }

        function animate() {
            if (!animationPaused) {
                ctx.clearRect(0, 0, width, height);
                time += 0.006;

                // Two overlapping plane waves at different angles + subtle mouse shift
                const phaseShiftX = mouse.nx * Math.PI * 0.5;
                const phaseShiftY = mouse.ny * Math.PI * 0.5;

                for (let i = 0; i < dots.length; i++) {
                    const { x, y } = dots[i];
                    const wave1 = Math.sin(x * 0.030 + y * 0.018 - time       + phaseShiftX);
                    const wave2 = Math.sin(x * 0.016 - y * 0.030 + time * 0.6 + phaseShiftY);
                    const alpha = BASE_ALPHA + WAVE_ALPHA * ((wave1 + wave2) / 2 + 1) / 2;

                    ctx.beginPath();
                    ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(33, 208, 195, ${alpha.toFixed(3)})`;
                    ctx.fill();
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();

        } // end prefers-reduced-motion else
    }

    // --- Language Switcher ---
    window.switchLang = function (lang) {
        const enContent = document.getElementById('philosophy-en');
        const esContent = document.getElementById('philosophy-es');

        // Buttons
        const btns = document.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
            if (btn.textContent.trim().toLowerCase() === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Content
        if (lang === 'en') {
            if (enContent) enContent.style.display = 'block';
            if (esContent) esContent.style.display = 'none';
        } else if (lang === 'es') {
            if (enContent) enContent.style.display = 'none';
            if (esContent) esContent.style.display = 'block';
        }

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    };

    // Initialize Language from URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && (langParam === 'en' || langParam === 'es')) {
        switchLang(langParam);
    }

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
                '  origin:    Bogota, Colombia',
                '  ventures:  Dhaki, GenPWD, HNWI Private Cybersecurity',
            ],
            focus: [
                '  active:    Dhaki — luxury smart automation (Co-Founder)',
                '  active:    GenPWD — secure password generator (Creator)',
                '  building:  HNWI Private Cybersecurity (Founder)',
                '  exploring: privacy-first infrastructure',
                '             AI-assisted security systems',
            ],
            philosophy: [
                '  "I am driven by curiosity — not as a habit, but as a system.',
                '   If something cannot be explored, tested, or improved,',
                '   it does not hold my attention for long.',
                '  ',
                '   I am a hacker by mindset. Not to bypass rules,',
                '   but to understand systems deeply enough to redesign them.',
                '  ',
                '   I build because ideas without execution are incomplete.',
                '   Iteration is not failure. Stagnation is.',
                '  ',
                '   If something can be better, it should be.',
                '   If something can be smarter, it must be."',
            ],
            systems: [
                '  — Smart home & IoT architecture',
                '  — AI & automation pipelines',
                '  — Cloud infrastructure & DevOps',
                '  — Cybersecurity & hardening',
                '  — Systems engineering',
            ],
            contact: [
                { text: '  email:     andresbolivar@proton.me', href: 'mailto:andresbolivar@proton.me' },
                { text: '  telegram:  t.me/audrum',             href: 'https://t.me/audrum' },
                { text: '  linkedin:  linkedin.com/in/anemboca', href: 'https://linkedin.com/in/anemboca' },
                { text: '  github:    github.com/audrum',        href: 'https://github.com/audrum' },
            ],
            help: [
                '  available commands:',
                '  about       — who I am',
                '  focus       — what I\'m working on',
                '  philosophy  — how I think',
                '  systems     — what I build',
                '  contact     — how to reach me',
                '  vcard       — download contact card',
                '  clear       — clear the terminal',
                '  exit        — close the terminal',
            ],
        };

        const cmdHistory = []; let historyIndex = -1;

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
            const entry = lines[lineIndex];
            const text = typeof entry === 'string' ? entry : entry.text;
            const href = typeof entry === 'object' && entry.href ? entry.href : null;
            const line = document.createElement('div');
            line.className = 'cli-line-out';
            cliOutput.appendChild(line);
            let charIndex = 0;
            const interval = setInterval(() => {
                line.textContent = text.slice(0, charIndex + 1);
                charIndex++;
                cliOutput.scrollTop = cliOutput.scrollHeight;
                if (charIndex >= text.length) {
                    clearInterval(interval);
                    if (href) {
                        line.textContent = '';
                        const a = document.createElement('a');
                        a.href = href;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.textContent = text;
                        line.appendChild(a);
                        line.classList.add('cli-line-link');
                    }
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

            if (cmd === 'vcard') {
                appendLine('  downloading Andres Bolivar.vcf...', 'cli-line-out');
                const a = document.createElement('a');
                a.href = 'assets/contact.vcf';
                a.download = 'Andres Bolivar.vcf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
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
                if (val.trim()) {
                    cmdHistory.push(val.trim());
                    if (cmdHistory.length > 100) cmdHistory.shift();
                    historyIndex = -1;
                }
                handleCommand(val);
            }
            if (e.key === 'Escape') {
                closeCLI();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    cliInput.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
                }
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    cliInput.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
                } else if (historyIndex === 0) {
                    historyIndex = -1;
                    cliInput.value = '';
                }
            }
        });

        if (cliCloseBtn) {
            cliCloseBtn.addEventListener('click', closeCLI);
        }

        const cliFab = document.getElementById('cli-fab');
        if (cliFab) {
            cliFab.addEventListener('click', () => {
                if (cliOverlay.classList.contains('cli-open')) {
                    closeCLI();
                } else {
                    openCLI();
                }
            });
        }

        cliOverlay.addEventListener('click', (e) => {
            if (e.target === cliOverlay) closeCLI();
        });
    }

    // Mobile nav hamburger
    const navHamburger = document.getElementById('nav-hamburger');
    const navEl = document.querySelector('.main-header nav');
    if (navHamburger && navEl) {
        navHamburger.addEventListener('click', () => {
            const isOpen = navEl.classList.toggle('nav-open');
            navHamburger.classList.toggle('open', isOpen);
            navHamburger.setAttribute('aria-expanded', isOpen.toString());
        });
        // Close nav when a link is clicked
        navEl.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navEl.classList.remove('nav-open');
                navHamburger.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Page fade transition
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        // Only intercept internal page navigations (not anchors, not external, not mailto)
        if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('//') || href.startsWith('javascript')) return;
        if (href.endsWith('.vcf')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 250);
        });
    });

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
});

