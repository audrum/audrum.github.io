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
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
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

                        // Repel
                        this.x -= directionX;
                        this.y -= directionY;
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
                ctx.fillStyle = 'rgba(0, 191, 255, 0.8)'; // More visible Vivid Blue
                ctx.fill();
            }
        }

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

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 191, 255, ${0.4 - distance / 500})`; // Increased line opacity
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // --- Content Protection ---

    // 1. Disable Right-Click Context Menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 2. Disable Image Dragging
    document.addEventListener('dragstart', (e) => {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // 3. Disable Developer Tools Shortcuts and Source View
    document.addEventListener('keydown', (e) => {
        // Prevent F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Prevent Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect), Ctrl+U (View Source)
        // Mac: Cmd+Option+I, Cmd+Option+J, Cmd+Option+C, Cmd+Option+U (Chrome/Safari mostly use Option instead of Shift, but we catch generic combinations)
        if (e.metaKey || e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'i': // Inspect
                case 'j': // Console
                case 'c': // Inspect Element
                case 'u': // View Source
                case 's': // Save Page
                    e.preventDefault();
                    return false;
            }
        }
    });

    // --- Language Switcher ---
    window.switchLang = function (lang) {
        const enContent = document.getElementById('manifesto-en');
        const esContent = document.getElementById('manifesto-es');

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
});

