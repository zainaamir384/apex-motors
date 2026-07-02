(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  const themeButton = document.querySelector('#theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    themeButton.setAttribute('title', `Switch to ${nextTheme} theme`);
    themeMeta.setAttribute('content', theme === 'dark' ? '#080a09' : '#f4f5f1');
  };

  syncTheme(document.documentElement.dataset.theme || 'dark');
  themeButton.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    syncTheme(nextTheme);
    try { localStorage.setItem('apex-theme', nextTheme); } catch (_) { /* Storage can be unavailable in private contexts. */ }
  });

  const updatePage = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 42);
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

    if (!reducedMotion) {
      document.querySelectorAll('.parallax').forEach((item) => {
        item.style.transform = `translate3d(0,${y * Number(item.dataset.speed || 0)}px,0)`;
      });
    }
  };
  addEventListener('scroll', updatePage, { passive: true });
  updatePage();

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -35px' });

  document.querySelectorAll('.car-grid, .benefit-grid, .service-list').forEach((group) => {
    [...group.children].forEach((item, index) => item.style.setProperty('--delay', `${index * .09}s`));
  });
  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-links a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50%' });
  sections.forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll('.car-image button').forEach((button) => {
    button.addEventListener('click', () => {
      const saved = button.classList.toggle('saved');
      button.textContent = saved ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(saved));
    });
  });

  if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
    const glow = document.querySelector('.cursor-glow');
    addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        const x = event.clientX - box.left - box.width / 2;
        const y = event.clientY - box.top - box.height / 2;
        button.style.transform = `translate(${x * .08}px,${y * .12}px) scale(1.015)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    const heroCar = document.querySelector('.tilt-card');
    heroCar.addEventListener('pointermove', (event) => {
      const box = heroCar.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      heroCar.style.transform = `perspective(1100px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
    });
    heroCar.addEventListener('pointerleave', () => { heroCar.style.transform = ''; });
  }

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.style.display = 'none';
      image.parentElement.classList.add('image-unavailable');
    }, { once: true });
  });
})();
