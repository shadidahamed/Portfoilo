document.addEventListener('DOMContentLoaded', () => {
  // Custom Gold Cursor
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  document.addEventListener('mousemove', e => {
    if (dot && ring) {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }
  });

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
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Advanced Galaxy Background
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

    for (let i = 0; i < 220; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(w, h) * 0.45;
      stars.push({
        angle,
        radius,
        speed: 0.0008 + Math.random() * 0.0015,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.7 + 0.3,
        z: Math.random()
      });
    }

    document.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / w - 0.5) * 2;
      mouse.y = (e.clientY / h - 0.5) * 2;
    });

    function drawGalaxy() {
      ctx.fillStyle = 'rgba(6,6,10,0.28)';
      ctx.fillRect(0, 0, w, h);

      stars.forEach(s => {
        s.angle += s.speed;
        const x = center.x + Math.cos(s.angle) * s.radius + mouse.x * 40 * s.z;
        const y = center.y + Math.sin(s.angle) * s.radius * 0.55 + mouse.y * 30 * s.z;

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,124,${s.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(drawGalaxy);
    }
    drawGalaxy();
  }

  // Wheel System (Vertical Disk)
  document.querySelectorAll('.wheel').forEach(wheelEl => {
    const data = JSON.parse(wheelEl.dataset.images || '[]');
    if (!data.length) return;

    const caption = wheelEl.parentElement.querySelector('.wheel-caption');
    const isSmall = wheelEl.closest('.wheel-box')?.classList.contains('small');
    const radius = isSmall ? 85 : 115;
    let current = 0;

    data.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'wheel-item';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title || '';
      div.appendChild(img);

      const angle = (360 / data.length) * i;
      div.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      wheelEl.appendChild(div);
    });

    const items = wheelEl.querySelectorAll('.wheel-item');

    function update() {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === current);
      });
      if (caption && data[current]) {
        caption.textContent = data[current].title || '';
        caption.classList.add('visible');
      }
    }

    update();

    setInterval(() => {
      current = (current + 1) % data.length;
      update();
    }, 1800);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  let scale = 1;

  function openLightbox(src) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    scale = 1;
    lbImg.style.transform = 'scale(1)';
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('active'));
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.hidden = true;
    }, 340);
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

  document.getElementById('zoomIn')?.addEventListener('click', () => {
    scale = Math.min(scale + 0.25, 3);
    if (lbImg) lbImg.style.transform = `scale(${scale})`;
  });

  document.getElementById('zoomOut')?.addEventListener('click', () => {
    scale = Math.max(scale - 0.25, 0.5);
    if (lbImg) lbImg.style.transform = `scale(${scale})`;
  });

  // Keyboard support for lightbox
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
