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

    // Background Canvas Animation (Tech Particle Network)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Resize Canvas
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        let mouse = { x: null, y: null, radius: 200 };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Handle mouse leaving window
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            update() {
                // Mouse Interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        // Attract — gentle drift, no density scaling
                        this.x += forceDirectionX * force * 1.2;
                        this.y += forceDirectionY * force * 1.2;
                    } else {
                        // Return to normal movement flow if not impacted deeply, 
                        // but since these are free floating, we just let them drift.
                        // Optionally we could have them return to a 'base' position if it was a structured grid.
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(33, 208, 195, 0.85)';
                ctx.fill();
            }
        }

        class BurstParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 4;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = Math.random() * 2 + 2;
                this.alpha = 1;
                this.decay = 1 / (Math.random() * 30 + 45);
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.93;
                this.vy *= 0.93;
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

        window.addEventListener('mousedown', (e) => {
            for (let i = 0; i < 12; i++) {
                burstParticles.push(new BurstParticle(e.x, e.y));
            }
        });

        function initParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150); // Increased count
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    if (Math.abs(dx) > 150) continue;
                    const dy = particles[i].y - particles[j].y;
                    if (Math.abs(dy) > 150) continue;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(33, 208, 195, ${0.45 - distance / 500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            // Burst particles
            burstParticles = burstParticles.filter(bp => !bp.isDead());
            burstParticles.forEach(bp => {
                bp.update();
                bp.draw();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
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
                '  founded:   Dhaki — Smart and secure private environments',
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

