// ============================================
// SILLY KART WII - INTERACTIVE JAVASCRIPT
// ============================================

// Console Welcome Message
console.log('%c🎪 SILLY KART WII 🎪', 'font-size: 32px; font-weight: bold; color: #944CB3; text-shadow: 0 0 10px #944CB3;');
console.log('%cWelcome to the official Silly Kart Wii website!', 'font-size: 16px; color: #00FF00;');
console.log('%cBuilt with 💜 by Weebo64', 'font-size: 14px; color: #c4b5d4;');
console.log('%c\n🎮 Try the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 12px; color: #944CB3;');

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-box, .gameplay-card, .feature-highlight-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Active Navigation Link Based on Scroll
const sections = document.querySelectorAll('section[id]');
const navButtons = document.querySelectorAll('.nav-button');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navButtons.forEach(btn => {
        btn.style.background = 'linear-gradient(135deg, #944CB3, #6B3585)';
        if (btn.getAttribute('href') === `#${current}`) {
            btn.style.background = 'linear-gradient(135deg, #00FF00, #00cc00)';
        }
    });
});

// Parallax Effect on Hero Section
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-content');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                hero.style.opacity = 1 - (scrolled / 800);
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Logo Click Counter Easter Egg
let logoClickCount = 0;
const logo = document.querySelector('.main-logo');
if (logo) {
    logo.addEventListener('click', () => {
        logoClickCount++;
        logo.style.transform = `scale(1.2) rotate(${logoClickCount * 45}deg)`;
        
        setTimeout(() => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        if (logoClickCount === 5) {
            showNotification('🎪 SILLY MODE UNLOCKED! 🎪', '#944CB3');
            activateRainbowMode();
            logoClickCount = 0;
        }
    });
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateTurboMode();
        konamiCode = [];
    }
});

// Notification System
function showNotification(message, color = '#944CB3') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, ${color}, #6B3585);
        color: white;
        padding: 30px 60px;
        border-radius: 30px;
        font-family: 'Bowlby One', sans-serif;
        font-size: 1.8rem;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        animation: popup 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        border: 4px solid #00FF00;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'popout 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add popup animations
const style = document.createElement('style');
style.textContent = `
    @keyframes popup {
        to { transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes popout {
        to { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Rainbow Mode (Logo Easter Egg)
function activateRainbowMode() {
    const rainbowStyle = document.createElement('style');
    rainbowStyle.id = 'rainbow-mode';
    rainbowStyle.textContent = `
        @keyframes rainbow-shift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        .section-title, .hero-title, .feature-icon-big, .gameplay-icon {
            animation: rainbow-shift 3s linear infinite !important;
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
        const rainbow = document.getElementById('rainbow-mode');
        if (rainbow) rainbow.remove();
    }, 10000);
}

// Turbo Mode (Konami Code Easter Egg)
function activateTurboMode() {
    showNotification('⚡ TURBO MODE ACTIVATED! ⚡', '#00FF00');
    
    const turboStyle = document.createElement('style');
    turboStyle.id = 'turbo-mode';
    turboStyle.textContent = `
        @keyframes turbo-spin {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.2); }
            50% { transform: rotate(180deg) scale(1); }
            75% { transform: rotate(270deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
        .main-logo {
            animation: turbo-spin 1s ease-in-out infinite !important;
        }
        * {
            transition-duration: 0.1s !important;
            animation-duration: 0.5s !important;
        }
    `;
    document.head.appendChild(turboStyle);
    
    setTimeout(() => {
        const turbo = document.getElementById('turbo-mode');
        if (turbo) turbo.remove();
        showNotification('⚡ TURBO MODE DEACTIVATED ⚡', '#944CB3');
    }, 8000);
}

// Button Hover Sound Effect (Visual Feedback)
document.querySelectorAll('.mkwii-button, .nav-button, .feature-box').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
});

// Stats Counter Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'scale(1.2)';
                    stat.style.color = '#00FF00';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                        stat.style.color = '#00FF00';
                    }, 200);
                }, index * 150);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsTicker = document.querySelector('.stats-ticker');
if (statsTicker) {
    statsTicker.querySelectorAll('.stat-value').forEach(val => {
        val.style.transition = 'all 0.3s ease';
    });
    statsObserver.observe(statsTicker);
}

// Feature Cards Hover Effects
document.querySelectorAll('.feature-box').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Download Button Special Effect
document.querySelectorAll('.mkwii-button.primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create sparkle effect
        for (let i = 0; i < 12; i++) {
            createSparkle(e.clientX, e.clientY);
        }
    });
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '⭐';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 9999;
        animation: sparkle-fly ${0.5 + Math.random() * 0.5}s ease-out forwards;
    `;
    
    const angle = (Math.PI * 2 * Math.random());
    const distance = 50 + Math.random() * 100;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;
    
    sparkle.style.setProperty('--end-x', `${endX}px`);
    sparkle.style.setProperty('--end-y', `${endY}px`);
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-fly {
        0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(var(--end-x) - 100vw), 
                calc(var(--end-y) - 100vh)
            ) scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Gameplay Cards Pulse on Hover
document.querySelectorAll('.gameplay-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.gameplay-icon');
        if (icon) {
            icon.style.animation = 'pulse-icon 0.6s ease infinite';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.gameplay-icon');
        if (icon) {
            icon.style.animation = 'none';
        }
    });
});

const pulseIconStyle = document.createElement('style');
pulseIconStyle.textContent = `
    @keyframes pulse-icon {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(pulseIconStyle);

// Install Steps Animation
const installSteps = document.querySelectorAll('.install-step');
const installObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const steps = entry.target.parentElement.querySelectorAll('.install-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.opacity = '1';
                    step.style.transform = 'translateX(0)';
                    const number = step.querySelector('.step-number');
                    if (number) {
                        number.style.animation = 'number-bounce 0.6s ease';
                    }
                }, index * 200);
            });
            installObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (installSteps.length > 0) {
    installSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = 'all 0.5s ease';
    });
    installObserver.observe(installSteps[0]);
}

const numberBounceStyle = document.createElement('style');
numberBounceStyle.textContent = `
    @keyframes number-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(numberBounceStyle);

// Credits Grid Interactive
document.querySelectorAll('.credit-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.background = 'linear-gradient(135deg, #944CB3, #6B3585)';
        this.style.color = '#00FF00';
        this.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            this.style.background = '#0f0518';
            this.style.color = '#c4b5d4';
            this.style.transform = 'translateX(5px)';
        }, 500);
    });
});

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #944CB3, #00FF00);
    z-index: 10001;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px #00FF00;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Dynamic Item Box Generation
function createFloatingItemBox() {
    const itemBox = document.createElement('div');
    const size = 40 + Math.random() * 30;
    
    // Create MKWii Item Box SVG (Rainbow polka-dot pattern)
    itemBox.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Rainbow gradient for the box -->
                <linearGradient id="rainbow-grad-${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF0000;stop-opacity:0.7" />
                    <stop offset="16%" style="stop-color:#FF7F00;stop-opacity:0.7" />
                    <stop offset="33%" style="stop-color:#FFFF00;stop-opacity:0.7" />
                    <stop offset="50%" style="stop-color:#00FF00;stop-opacity:0.7" />
                    <stop offset="66%" style="stop-color:#0000FF;stop-opacity:0.7" />
                    <stop offset="83%" style="stop-color:#4B0082;stop-opacity:0.7" />
                    <stop offset="100%" style="stop-color:#9400D3;stop-opacity:0.7" />
                </linearGradient>
                
                <!-- Pattern for polka dots -->
                <pattern id="polka-${Date.now()}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="2" fill="white" opacity="0.4"/>
                    <circle cx="15" cy="15" r="2" fill="white" opacity="0.4"/>
                </pattern>
            </defs>
            
            <!-- Main cube body with rounded corners -->
            <rect x="15" y="15" width="70" height="70" rx="8" ry="8" 
                  fill="url(#rainbow-grad-${Date.now()})" 
                  stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
            
            <!-- Polka dot overlay -->
            <rect x="15" y="15" width="70" height="70" rx="8" ry="8" 
                  fill="url(#polka-${Date.now()})"/>
            
            <!-- Glass shine effect (top-left) -->
            <ellipse cx="30" cy="30" rx="15" ry="20" fill="white" opacity="0.3"/>
            
            <!-- Question mark -->
            <text x="50" y="68" font-family="Arial, sans-serif" font-size="50" 
                  font-weight="bold" fill="white" text-anchor="middle" 
                  stroke="rgba(0,0,0,0.5)" stroke-width="3">?</text>
        </svg>
    `;
    
    itemBox.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.25;
        animation: float-away ${5 + Math.random() * 5}s ease-in-out forwards, item-box-spin ${3 + Math.random() * 2}s linear infinite;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        filter: drop-shadow(0 0 15px rgba(148, 76, 179, 0.4));
    `;
    
    document.body.appendChild(itemBox);
    setTimeout(() => itemBox.remove(), 10000);
}

const floatAwayStyle = document.createElement('style');
floatAwayStyle.textContent = `
    @keyframes float-away {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.25;
        }
        100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes item-box-spin {
        0% {
            transform: rotateY(0deg);
        }
        100% {
            transform: rotateY(360deg);
        }
    }
`;
document.head.appendChild(floatAwayStyle);

// Generate item boxes periodically
setInterval(createFloatingItemBox, 8000);

// Initialize - Create first item box
createFloatingItemBox();

// Mobile Menu Toggle (if needed)
const navLinks = document.querySelector('.nav-links');
const navContent = document.querySelector('.nav-content');

if (window.innerWidth <= 768 && navLinks) {
    const menuToggle = document.createElement('button');
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        font-size: 2rem;
        background: none;
        border: none;
        color: #00FF00;
        cursor: pointer;
        display: none;
    `;
    
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'block';
        navContent.insertBefore(menuToggle, navLinks);
        navLinks.style.display = 'none';
        
        menuToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'none') {
                navLinks.style.display = 'flex';
                menuToggle.innerHTML = '✕';
            } else {
                navLinks.style.display = 'none';
                menuToggle.innerHTML = '☰';
            }
        });
    }
}

// Performance: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-speed', '0.5s');
}

// Easter Egg: Secret Developer Mode
let devModeClicks = 0;
const footer = document.querySelector('.mkwii-footer');
if (footer) {
    footer.addEventListener('click', () => {
        devModeClicks++;
        if (devModeClicks === 7) {
            showNotification('🔧 DEVELOPER MODE ACTIVATED 🔧', '#00FF00');
            console.log('%c═══════════════════════════════════════', 'color: #944CB3;');
            console.log('%c🎮 SILLY KART WII - DEVELOPER INFO 🎮', 'color: #00FF00; font-size: 16px; font-weight: bold;');
            console.log('%c═══════════════════════════════════════', 'color: #944CB3;');
            console.log('%cEngine: Pulladium (Pulsar Fork)', 'color: #c4b5d4;');
            console.log('%cFramework: Kamek Code Injection', 'color: #c4b5d4;');
            console.log('%cLanguage: C++ & JavaScript', 'color: #c4b5d4;');
            console.log('%cWebsite: Custom HTML/CSS/JS', 'color: #c4b5d4;');
            console.log('%cColors: #944CB3 (Purple) & #00FF00 (Neon Green)', 'color: #c4b5d4;');
            console.log('%c═══════════════════════════════════════', 'color: #944CB3;');
            console.log('%cGitHub: https://github.com/Weebo64/SillyKartWii', 'color: #00FF00;');
            console.log('%c═══════════════════════════════════════', 'color: #944CB3;');
            devModeClicks = 0;
        }
    });
}

// Page Load Animation
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease, transform 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Prevent context menu on logo (protection)
if (logo) {
    logo.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNotification('🎪 Nice try! 🎪', '#944CB3');
    });
}

console.log('%c✓ Silly Kart Wii JavaScript Loaded Successfully', 'color: #00FF00; font-weight: bold;');
console.log('%cEnjoy the chaos! 🎪', 'color: #944CB3; font-style: italic;');
