/**
 * ClarityTimer Marketing Website
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();

    // Smooth Scroll for Anchor Links
    initSmoothScroll();

    // Scroll-based Navbar Styling
    initScrollNavbar();

    // Intersection Observer for Animations
    initScrollAnimations();

    // Timer Demo Animation
    initTimerDemo();

    // Breathing Pattern Animations
    initBreathingAnimations();

    // Theme Swatch Interactions
    initThemeSwatches();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-based Navbar Styling
 */
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .pattern-card, .bell-card, .stat-box, .streak-item, .history-feature'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Timer Demo Animation
 */
function initTimerDemo() {
    const timerTime = document.querySelector('.timer-time');
    const timerProgress = document.querySelector('.timer-progress');
    const timerItems = document.querySelectorAll('.timer-item');

    if (!timerTime || !timerProgress || !timerItems.length) return;

    const timers = [
        { name: '5-Minute Quick', time: '5:00', progress: 0 },
        { name: '10-Minute Focus', time: '10:00', progress: 0 },
        { name: '15-Minute Deep', time: '15:00', progress: 25 },
        { name: '20-Minute Standard', time: '20:00', progress: 0 },
        { name: '30-Minute Extended', time: '30:00', progress: 0 },
        { name: '45-Minute Long', time: '45:00', progress: 0 },
        { name: '1-Hour Deep Dive', time: '60:00', progress: 0 }
    ];

    let currentIndex = 2; // Start with 15-Minute Deep

    function updateTimer(index) {
        const timer = timers[index];

        // Update time display
        timerTime.textContent = timer.time;

        // Update progress ring (565.48 is the circumference)
        const offset = 565.48 * (1 - timer.progress / 100);
        timerProgress.style.strokeDashoffset = offset;

        // Update active state
        timerItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Click handlers for timer items
    timerItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            // Simulate random progress
            timers[index].progress = Math.floor(Math.random() * 80) + 10;
            updateTimer(index);
        });

        item.addEventListener('mouseenter', () => {
            item.style.cursor = 'pointer';
        });
    });

    // Animate the default timer progress
    setTimeout(() => {
        animateProgress(25);
    }, 1000);

    function animateProgress(targetProgress) {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            const offset = 565.48 * (1 - currentProgress / 100);
            timerProgress.style.strokeDashoffset = offset;

            if (currentProgress >= targetProgress) {
                clearInterval(interval);
            }
        }, 30);
    }
}

/**
 * Breathing Pattern Animations
 */
function initBreathingAnimations() {
    const patternCircles = document.querySelectorAll('.pattern-circle');

    patternCircles.forEach(circle => {
        const pattern = circle.dataset.pattern;
        if (!pattern) return;

        const phases = pattern.split('-').map(Number);
        const phaseText = circle.querySelector('.pattern-phase');

        let currentPhase = 0;
        const phaseNames = ['Inhale', 'Hold', 'Exhale', 'Hold'];

        // Create unique animation for each pattern
        const totalDuration = phases.reduce((a, b) => a + b, 0);
        const animationName = `breathe-${pattern.replace(/-/g, '')}`;

        // Build keyframes
        let keyframes = '@keyframes ' + animationName + ' {\n';
        let percentOffset = 0;

        phases.forEach((duration, index) => {
            if (duration === 0) return;

            const startPercent = (percentOffset / totalDuration) * 100;
            const endPercent = ((percentOffset + duration) / totalDuration) * 100;

            if (index === 0) { // Inhale
                keyframes += `  ${startPercent}% { transform: scale(0.85); opacity: 0.7; }\n`;
                keyframes += `  ${endPercent}% { transform: scale(1.1); opacity: 1; }\n`;
            } else if (index === 2) { // Exhale
                keyframes += `  ${startPercent}% { transform: scale(1.1); opacity: 1; }\n`;
                keyframes += `  ${endPercent}% { transform: scale(0.85); opacity: 0.7; }\n`;
            }
            // Hold phases maintain current state

            percentOffset += duration;
        });

        keyframes += '}';

        // Add keyframes to document
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        // Apply animation
        circle.style.animation = `${animationName} ${totalDuration}s ease-in-out infinite`;

        // Update phase text
        function updatePhaseText() {
            if (phaseText && phases[currentPhase] > 0) {
                phaseText.textContent = phaseNames[currentPhase];
            }
            currentPhase = (currentPhase + 1) % 4;

            // Skip zero-duration phases
            while (phases[currentPhase] === 0) {
                currentPhase = (currentPhase + 1) % 4;
            }
        }

        // Cycle through phases
        let phaseIndex = 0;
        function cyclePhases() {
            if (phases[phaseIndex] > 0) {
                if (phaseText) {
                    phaseText.textContent = phaseNames[phaseIndex];
                }
                setTimeout(() => {
                    phaseIndex = (phaseIndex + 1) % 4;
                    cyclePhases();
                }, phases[phaseIndex] * 1000);
            } else {
                phaseIndex = (phaseIndex + 1) % 4;
                cyclePhases();
            }
        }

        cyclePhases();
    });
}

/**
 * Theme Swatch Interactions
 */
function initThemeSwatches() {
    const swatches = document.querySelectorAll('.theme-swatch');
    const root = document.documentElement;

    swatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = getComputedStyle(this).getPropertyValue('--theme-color').trim();

            // Temporarily change the primary color
            root.style.setProperty('--color-primary', color);

            // Visual feedback
            swatches.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');

            // Add selected indicator style
            const inner = this.querySelector('.swatch-inner');
            if (inner) {
                inner.style.transform = 'scale(1.1)';
                inner.style.boxShadow = `0 0 0 4px ${color}40`;

                setTimeout(() => {
                    inner.style.transform = '';
                    inner.style.boxShadow = '';
                }, 300);
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number, .stat-value, .streak-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;

                // Check if it's a number we can animate
                if (!isNaN(parseInt(finalValue))) {
                    animateNumber(target, parseInt(finalValue));
                }

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateNumber(element, target) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeProgress);

        // Format with commas for large numbers
        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Ensure final value matches original
            if (target >= 1000) {
                element.textContent = target.toLocaleString();
            }
        }
    }

    requestAnimationFrame(update);
}

// Initialize stats counter when DOM is ready
document.addEventListener('DOMContentLoaded', initStatsCounter);
