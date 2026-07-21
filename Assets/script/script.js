(function () {
    // DOM elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');
    const quoteForm = document.getElementById('quoteForm');
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const fadeElements = document.querySelectorAll('.fade-in');
    const statNumbers = document.querySelectorAll('.stat-number');
    const themeToggle = document.getElementById('themeToggle');

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isActive));
    });
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Back to top visibility (throttled to avoid work on every scroll event)
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    backToTop?.classList.add('visible');
                } else {
                    backToTop?.classList.remove('visible');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    });

    // Fade-in on scroll (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeElements.forEach(el => observer.observe(el));

    // Simple counter animation for statistics
    let countersAnimated = false;
    const statsSection = document.querySelector('.stat-item')?.parentElement;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        const duration = 1400;
        const startTime = performance.now();

        function updateFrame(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            statNumbers.forEach(stat => {
                const target = Number.parseInt(stat.getAttribute('data-target'), 10);
                const suffix = target === 98 ? '%' : '+';
                const current = Math.round(target * progress);
                stat.textContent = current + suffix;
            });

            if (progress < 1) {
                window.requestAnimationFrame(updateFrame);
            }
        }

        window.requestAnimationFrame(updateFrame);
    }
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Form submission (prevent default, show feedback)
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = quoteForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Request Sent!';
            btn.style.background = '#16a34a';
            quoteForm.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2500);
        }, 1200);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top, behavior: 'auto' });
            }
        });
    });
})();

