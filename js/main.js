document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });
  }

  // Navigation
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links?.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // Back to Top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Galaxy
  const canvas = document.getElementById('galaxy');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], mouse = { x: 0, y: 0 };
    const center = { x: 0, y: 0 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      center.x = w / 2;
      center.y = h / 2;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(w, h) * 0.42;
      stars.push({
        angle, radius,
        speed: 0.0007 + Math.random() * 0.0014,
        size: Math.random() * 1.7 + 0.4,
        opacity: Math.random() * 0.65 + 0.3,
        z: Math.random()
      });
    }

    document.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / w - 0.5) * 2;
      mouse.y = (e.clientY / h - 0.5) * 2;
    });

    function draw() {
      ctx.fillStyle = 'rgba(6,6,10,0.3)';
      ctx.fillRect(0, 0, w, h);
      stars.forEach(s => {
        s.angle += s.speed;
        const x = center.x + Math.cos(s.angle) * s.radius + mouse.x * 35 * s.z;
        const y = center.y + Math.sin(s.angle) * s.radius * 0.55 + mouse.y * 25 * s.z;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,124,${s.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // Wheel System
  document.querySelectorAll('.wheel').forEach(wheelEl => {
    const data = JSON.parse(wheelEl.dataset.images || '[]');
    if (!data.length) return;

    const caption = wheelEl.parentElement.querySelector('.wheel-caption');
    const isSmall = wheelEl.closest('.wheel-box')?.classList.contains('small');
    const radius = isSmall ? 80 : 110;
    let current = 0;

    data.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'wheel-item';
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title || '';
      img.loading = 'lazy';
      div.appendChild(img);
      const angle = (360 / data.length) * i;
      div.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      wheelEl.appendChild(div);
    });

    const items = wheelEl.querySelectorAll('.wheel-item');
    function update() {
      items.forEach((item, i) => item.classList.toggle('active', i === current));
      if (caption && data[current]) {
        caption.textContent = data[current].title || '';
        caption.classList.add('visible');
      }
    }
    update();
    setInterval(() => {
      current = (current + 1) % data.length;
      update();
    }, 2000);
  });

  // Lightbox (clean open/close)
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');

  function openLightbox(src) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('active'));
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    setTimeout(() => { lightbox.hidden = true; }, 350);
  }

  document.querySelectorAll('.art-card, .graphics-card, .project-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.wheel-item.active img');
      if (img) openLightbox(img.src);
    });
  });

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});
