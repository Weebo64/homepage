// Mario Galaxy Inspired Birthday Page Script

// Audio Control
const audioTip = document.getElementById('audioTip');
const playButton = document.getElementById('playButton');
const bgMusic = document.getElementById('bgMusic');
const mainContainer = document.getElementById('mainContainer');

// Set volume to 50% (0.5)
bgMusic.volume = 0.25;

playButton.addEventListener('click', () => {
    // Try to play music
    bgMusic.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
    
    // Fade out tip overlay
    audioTip.style.transition = 'opacity 1s ease';
    audioTip.style.opacity = '0';
    
    setTimeout(() => {
        audioTip.style.display = 'none';
        // Fade in main content
        mainContainer.style.opacity = '1';
    }, 1000);
});

// Stars Background Generation
const starsBg = document.getElementById('starsBg');

function createStar() {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.background = 'white';
    star.style.borderRadius = '50%';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.opacity = Math.random() * 0.7 + 0.3;
    star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`;
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
    star.style.animationDelay = Math.random() * 3 + 's';
    
    starsBg.appendChild(star);
}

// Create starfield
for (let i = 0; i < 200; i++) {
    createStar();
}

// Floating Stars and Lumas (Mario Galaxy inspired)
const floatingBg = document.getElementById('floatingBg');

// Luma GIF URLs
const lumaGifs = [
    'https://media.tenor.com/4xXAsjTV6yoAAAAj/luma.gif',
    'https://cdna.artstation.com/p/assets/images/images/050/528/256/original/william-howard-1.gif?1655074222',
    'https://cdna.artstation.com/p/assets/images/images/050/528/258/original/william-howard-2.gif?1655074226',
    'https://cdnb.artstation.com/p/assets/images/images/050/528/261/original/william-howard-3.gif?1655074230',
    'https://cdna.artstation.com/p/assets/images/images/050/528/262/original/william-howard-4.gif?1655074235'
];

function createFloatingElement() {
    const element = document.createElement('img');
    const randomLuma = lumaGifs[Math.floor(Math.random() * lumaGifs.length)];
    element.src = randomLuma;
    element.style.position = 'absolute';
    element.style.width = Math.random() * 40 + 30 + 'px';
    element.style.height = 'auto';
    element.style.left = Math.random() * 100 + '%';
    element.style.top = Math.random() * 100 + '%';
    element.style.opacity = Math.random() * 0.5 + 0.5;
    element.style.animation = `floatRandom ${Math.random() * 15 + 10}s infinite ease-in-out`;
    element.style.pointerEvents = 'none';
    element.style.zIndex = '1';
    
    floatingBg.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 25000);
}

// Create initial floating elements (Lumas)
for (let i = 0; i < 8; i++) {
    setTimeout(() => createFloatingElement(), i * 300);
}

// Continue creating floating elements (less frequently)
setInterval(createFloatingElement, 2000);

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatRandom {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(50px, -50px) rotate(90deg);
        }
        50% {
            transform: translate(-30px, -100px) rotate(180deg);
        }
        75% {
            transform: translate(-60px, -50px) rotate(270deg);
        }
    }
`;
document.head.appendChild(style);

// Scroll reveal animations with Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.reason-card, .moment-card, .wish-item, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

// Enhanced card interactions
document.querySelectorAll('.reason-card, .moment-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add sparkle effect
        createSparkle(this);
    });
});

function createSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
    sparkle.style.zIndex = '100';
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-30px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.5);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Wish items interaction
document.querySelectorAll('.wish-item').forEach(wish => {
    wish.addEventListener('click', function() {
        this.style.transform = 'scale(1.05) translateX(15px)';
        
        // Create mini stars
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const miniStar = document.createElement('div');
                miniStar.textContent = '⭐';
                miniStar.style.position = 'fixed';
                miniStar.style.left = this.getBoundingClientRect().right + 'px';
                miniStar.style.top = (this.getBoundingClientRect().top + Math.random() * this.offsetHeight) + 'px';
                miniStar.style.fontSize = '1.2rem';
                miniStar.style.pointerEvents = 'none';
                miniStar.style.animation = 'wishStarFloat 1.5s ease-out forwards';
                miniStar.style.zIndex = '1000';
                document.body.appendChild(miniStar);
                
                setTimeout(() => miniStar.remove(), 1500);
            }, i * 100);
        }
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
});

// Wish star float animation
const wishStarStyle = document.createElement('style');
wishStarStyle.textContent = `
    @keyframes wishStarFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(100px, -100px) rotate(360deg);
        }
    }
`;
document.head.appendChild(wishStarStyle);

// Photo hover effect - orbital rings spin faster
const profilePhoto = document.querySelector('.profile-photo');
const orbitRings = document.querySelectorAll('.orbit-ring');

if (profilePhoto) {
    profilePhoto.addEventListener('mouseenter', () => {
        orbitRings.forEach(ring => {
            ring.style.animationDuration = '3s';
        });
    });
    
    profilePhoto.addEventListener('mouseleave', () => {
        orbitRings[0].style.animationDuration = '15s';
        if (orbitRings[1]) orbitRings[1].style.animationDuration = '20s';
    });
}

// Window resize handler
window.addEventListener('resize', () => {
    // Adjust any responsive elements if needed
});

// Console Easter Egg for Zelda
console.log('%c⭐ Happy Birthday Zelda! ⭐', 'font-size: 40px; color: #87CEEB; font-weight: bold; text-shadow: 0 0 20px #87CEEB;');
console.log('%c💙 Made with love across the galaxy 💙', 'font-size: 20px; color: #DDA0DD; font-weight: bold;');
console.log('%cFrom Germany 🇩🇪 to USA 🇺🇸', 'font-size: 16px; color: #B0C4DE;');
console.log('%cYou\'re my twin, my pookie, my everything! 👯', 'font-size: 14px; color: #FFB6C1;');
console.log('%cMay the boobs be with you 😏✨', 'font-size: 14px; color: #87CEEB;');
console.log('%c- Your German Twin', 'font-size: 12px; color: #fff; font-style: italic;');

// Gift Box Interaction
const giftBox = document.getElementById('giftBox');
const giftSurprise = document.getElementById('giftSurprise');

if (giftBox && giftSurprise) {
    giftBox.addEventListener('click', function() {
        // Add opening animation
        this.classList.add('opening');
        
        // Create sparkle explosion
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = ['⭐', '✨', '💫', '🌟', '💙', '🎁'][Math.floor(Math.random() * 6)];
                sparkle.style.position = 'fixed';
                sparkle.style.left = this.getBoundingClientRect().left + this.offsetWidth / 2 + 'px';
                sparkle.style.top = this.getBoundingClientRect().top + this.offsetHeight / 2 + 'px';
                sparkle.style.fontSize = Math.random() * 30 + 20 + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '10000';
                
                const angle = (Math.PI * 2 * i) / 30;
                const distance = Math.random() * 150 + 100;
                sparkle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
                sparkle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
                sparkle.style.animation = 'giftExplosion 1.5s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 30);
        }
        
        // Show surprise after animation
        setTimeout(() => {
            giftSurprise.style.display = 'block';
            giftSurprise.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide gift box
            setTimeout(() => {
                this.style.transition = 'opacity 1s ease';
                this.style.opacity = '0';
                setTimeout(() => this.style.display = 'none', 1000);
            }, 500);
        }, 1000);
    });
}

// Gift explosion animation
const giftExplosionStyle = document.createElement('style');
giftExplosionStyle.textContent = `
    @keyframes giftExplosion {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: translate(var(--x), var(--y)) scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(giftExplosionStyle);

// Password Lock for Secret Message
const passwordInput = document.getElementById('passwordInput');
const unlockButton = document.getElementById('unlockButton');
const wrongPassword = document.getElementById('wrongPassword');
const passwordLock = document.getElementById('passwordLock');
const secretMessageContent = document.getElementById('secretMessageContent');

if (unlockButton && passwordInput) {
    // Enter key to submit
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            unlockButton.click();
        }
    });
    
    unlockButton.addEventListener('click', () => {
        const password = passwordInput.value.trim();
        const correctPassword = 'Scruppy97';
        
        // Case-insensitive comparison
        if (password.toLowerCase() === correctPassword.toLowerCase()) {
            // Correct password!
            wrongPassword.style.display = 'none';
            
            // Create unlock animation
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.textContent = ['💙', '💌', '🔓', '✨'][Math.floor(Math.random() * 4)];
                    heart.style.position = 'fixed';
                    heart.style.left = passwordLock.getBoundingClientRect().left + passwordLock.offsetWidth / 2 + 'px';
                    heart.style.top = passwordLock.getBoundingClientRect().top + passwordLock.offsetHeight / 2 + 'px';
                    heart.style.fontSize = Math.random() * 25 + 20 + 'px';
                    heart.style.pointerEvents = 'none';
                    heart.style.zIndex = '10000';
                    
                    const angle = (Math.PI * 2 * i) / 20;
                    const distance = Math.random() * 100 + 50;
                    heart.style.setProperty('--x', Math.cos(angle) * distance + 'px');
                    heart.style.setProperty('--y', Math.sin(angle) * distance + 'px');
                    heart.style.animation = 'giftExplosion 1.5s ease-out forwards';
                    
                    document.body.appendChild(heart);
                    
                    setTimeout(() => heart.remove(), 1500);
                }, i * 50);
            }
            
            // Fade out lock, fade in message
            setTimeout(() => {
                passwordLock.style.transition = 'opacity 0.8s ease';
                passwordLock.style.opacity = '0';
                
                setTimeout(() => {
                    passwordLock.style.display = 'none';
                    secretMessageContent.style.display = 'block';
                }, 800);
            }, 1000);
            
        } else {
            // Wrong password
            wrongPassword.style.display = 'block';
            passwordInput.value = '';
            passwordInput.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    });
}

// Console Easter Egg for Zelda (below gift code)

// Secret: Press SPACE for surprise
let secretPressed = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !secretPressed) {
        secretPressed = true;
        createMassiveStarExplosion();
        setTimeout(() => secretPressed = false, 3000);
    }
});

function createMassiveStarExplosion() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.textContent = ['⭐', '✨', '💫', '🌟', '💙'][Math.floor(Math.random() * 5)];
            star.style.position = 'fixed';
            star.style.left = '50%';
            star.style.top = '50%';
            star.style.fontSize = Math.random() * 30 + 20 + 'px';
            star.style.pointerEvents = 'none';
            star.style.zIndex = '10000';
            star.style.animation = `explosionStar ${Math.random() * 2 + 1}s ease-out forwards`;
            star.style.transform = `translate(-50%, -50%)`;
            
            const angle = (Math.PI * 2 * i) / 50;
            const distance = Math.random() * 300 + 200;
            star.style.setProperty('--x', Math.cos(angle) * distance + 'px');
            star.style.setProperty('--y', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(star);
            
            setTimeout(() => star.remove(), 2000);
        }, i * 30);
    }
}

const explosionStyle = document.createElement('style');
explosionStyle.textContent = `
    @keyframes explosionStar {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            opacity: 1;
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(explosionStyle);

// Prevent audio from stopping on page navigation
window.addEventListener('beforeunload', () => {
    // Song will always start from beginning on reload
    bgMusic.pause();
    bgMusic.currentTime = 0;
});
