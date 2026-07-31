// ===== TOAST-УВЕДОМЛЕНИЯ =====
function showToast(message, icon = '🚀', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// ===== ТЕМА (светлая/тёмная) =====
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showToast(isDark ? "Включена тёмная тема" : "Включена светлая тема", isDark ? "🌙" : "☀️");
    });
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА (только для якорей на текущей странице) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href').includes('.html')) return;
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== АНИМАЦИЯ СЧЁТЧИКОВ =====
const statsSection = document.querySelector('.stats');
const counters = document.querySelectorAll('.stat-item h3');
const speed = 120;
const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                let current = 0;
                const increment = Math.ceil(target / speed);
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        counter.innerText = current;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            observer.unobserve(entry.target);
        }
    });
};
const statsObserver = new IntersectionObserver(animateCounters, { threshold: 0.3 });
if (statsSection) statsObserver.observe(statsSection);

// ===== ГЕНЕРАТОР ИНСАЙТОВ =====
const quotes = [
    "Каждый кубометр нашего воздуха содержит 99% чистой синергии и харизмы.",
    "Эффективность наших прогревов доказана ведущими диванными экспертами.",
    "Если долго и упорно гнать воздух, он неизбежно превратится в монетизируемый трафик.",
    "Наш девиз: Минимизируем полезные действия ради максимизации атмосферного давления!",
    "Инновационный медиа-продув — это не про слова, это про правильные колебания эфира.",
    "Мы не просто сотрясаем воздух, мы делаем это по строго сертифицированному ГОСТу.",
    "Вектор стратегического развития Воздухан Индастрис — тотальная вентиляция застоявшихся смыслов."
];
const airGenBtn = document.getElementById('air-gen-btn');
const airText = document.getElementById('air-text');
const insightSound = document.getElementById('insight-sound');

function playInsightSound() {
    try {
        if (!insightSound) return;
        insightSound.currentTime = 0;
        const playPromise = insightSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Не удалось воспроизвести звук инсайта:", error);
            });
        }
    } catch (error) {
        console.log("Ошибка воспроизведения звука:", error);
    }
}

if (airGenBtn) {
    airGenBtn.addEventListener('click', () => {
        playInsightSound();
        if (airText) {
            airText.style.opacity = '0';
            setTimeout(() => {
                airText.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
                airText.style.opacity = '1';
                showToast("Плотность воздуха оптимальна!", "🌬️");
            }, 200);
        }
    });
}

// ===== МУЗЫКА =====
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
if (musicToggle && bgMusic) {
    const musicIcon = musicToggle.querySelector('.music-icon');
    const muteIcon = musicToggle.querySelector('.mute-icon');
    let isPlaying = false;
    bgMusic.volume = 0.3;

    function updateMusicUI(playing) {
        if (playing) {
            musicIcon.style.display = 'none';
            muteIcon.style.display = 'block';
            musicToggle.classList.add('playing');
            musicToggle.title = 'Выключить музыку';
        } else {
            musicIcon.style.display = 'block';
            muteIcon.style.display = 'none';
            musicToggle.classList.remove('playing');
            musicToggle.title = 'Включить музыку';
        }
    }
    updateMusicUI(false);

    musicToggle.addEventListener('click', async () => {
        if (!isPlaying) {
            try {
                await bgMusic.play();
                isPlaying = true;
                updateMusicUI(true);
                showToast("🎵 Музыка включена", "🎧");
            } catch (error) {
                console.error("Ошибка воспроизведения:", error);
                showToast("Не удалось включить музыку", "⚠️");
            }
        } else {
            bgMusic.pause();
            isPlaying = false;
            updateMusicUI(false);
            showToast("🔇 Музыка выключена", "🎧");
        }
    });
}

// ===== ДИСКЛЕЙМЕР =====
const disclaimerBtn = document.getElementById('disclaimer-btn');
const disclaimerModal = document.getElementById('disclaimer-modal');
const disclaimerClose = document.querySelector('.disclaimer-close');
const disclaimerAccept = document.getElementById('disclaimer-accept');
const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');

if (disclaimerModal && !hasSeenDisclaimer) {
    setTimeout(() => {
        disclaimerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 1000);
}

if (disclaimerBtn) {
    disclaimerBtn.addEventListener('click', () => {
        disclaimerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function closeDisclaimer() {
    disclaimerModal.classList.remove('active');
    document.body.style.overflow = '';
    localStorage.setItem('hasSeenDisclaimer', 'true');
}

if (disclaimerClose) disclaimerClose.addEventListener('click', closeDisclaimer);
if (disclaimerAccept) disclaimerAccept.addEventListener('click', closeDisclaimer);
if (disclaimerModal) {
    disclaimerModal.addEventListener('click', (e) => {
        if (e.target === disclaimerModal) closeDisclaimer();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && disclaimerModal && disclaimerModal.classList.contains('active')) {
        closeDisclaimer();
    }
});
