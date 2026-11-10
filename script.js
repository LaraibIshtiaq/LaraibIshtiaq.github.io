document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* ---------- Theme toggle ---------- */
    const toggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = () => root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');

    const syncThemeColor = () => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', currentTheme() === 'dark' ? '#140b10' : '#faf6f8');
    };
    syncThemeColor();

    toggle?.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncThemeColor();
    });

    /* ---------- Nav: shadow on scroll + active link ---------- */
    const navWrap = document.querySelector('.nav-wrap');
    const navLinks = document.querySelectorAll('.nav-links a');
    const onScroll = () => navWrap.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

    /* ---------- Reveal on scroll ---------- */
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
        // stagger siblings that reveal together
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        revealObserver.observe(el);
    });

    /* ---------- Screenshot carousels ---------- */
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const images = [...carousel.querySelectorAll('img')];
        const dotsWrap = carousel.parentElement.querySelector('.carousel-dots');
        if (images.length < 2) return;

        let index = 0;
        const dots = images.map((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', `Show screenshot ${i + 1}`);
            b.addEventListener('click', () => { show(i); restart(); });
            dotsWrap?.appendChild(b);
            return b;
        });

        const show = (i) => {
            index = (i + images.length) % images.length;
            images.forEach((img, j) => img.classList.toggle('active', j === index));
            dots.forEach((d, j) => d.classList.toggle('active', j === index));
        };

        let timer;
        const restart = () => {
            clearInterval(timer);
            timer = setInterval(() => show(index + 1), 4500);
        };

        show(0);
        restart();
    });

    /* ---------- Footer year ---------- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
