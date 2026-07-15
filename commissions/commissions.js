// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');
const themeIcon = document.querySelector('.theme-icon');

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    if (theme === 'auto') {
        theme = getSystemTheme();
    }
    
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.textContent = '🌙';
    }
}

const savedTheme = localStorage.getItem('theme') || 'auto';
setTheme(savedTheme);

themeOptions.forEach(option => {
    if (option.dataset.theme === savedTheme) {
        option.classList.add('active');
    }
    
    option.addEventListener('click', () => {
        const selectedTheme = option.dataset.theme;
        localStorage.setItem('theme', selectedTheme);
        
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        setTheme(selectedTheme);
        themeMenu.classList.remove('active');
    });
});

themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!themeMenu.contains(e.target) && e.target !== themeToggle) {
        themeMenu.classList.remove('active');
    }
});

// System theme change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    if (savedTheme === 'auto') {
        setTheme('auto');
    }
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 500);
});

// Smooth scroll for anchor links
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

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.price-card, .process-step, .term-item, .faq-item, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
