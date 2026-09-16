document.addEventListener('DOMContentLoaded', () => {
  // Custom gold cursor
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });

  // Nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Galaxy background
  const canvas = document.getElementById('galaxy');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], mouse = { x: 0, y: 0 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 2 + 0.5,
      o: Math.random()
    });
  }

  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / w - 0.5) * 2;
    mouse.y = (e.clientY / h - 0.5) * 2;
  });

  function drawGalaxy() {
    ctx.fillStyle = 'rgba(8,8,12,0.35)';
    ctx.fillRect(0, 0, w, h);
    stars.forEach(s => {
      s.x += mouse.x * s.z * 0.6;
      s.y += mouse.y * s.z * 0.6;
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h;
      if (s.y > h) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.z * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,124,${0.3 + s.o * 0.5})`;
      ctx.fill();
    });
    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();

  // Wheel system
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
      div.style.transform = `rotateZ(${angle}deg) translateX(${radius}px) rotateZ(-${angle}deg)`;
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
    }, 1800);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  let scale = 1;
  function openLightbox(src) {
    lbImg.src = src;
    scale = 1;
    lbImg.style.transform = 'scale(1)';
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('active'));
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => { lightbox.hidden = true; }, 340);
  }
  document.querySelectorAll('.art-card, .graphics-card, .project-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.wheel-item.active img');
      if (img) openLightbox(img.src);
    });
  });
  lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('zoomIn')?.addEventListener('click', () => {
    scale = Math.min(scale + 0.25, 3);
    lbImg.style.transform = `scale(${scale})`;
  });
  document.getElementById('zoomOut')?.addEventListener('click', () => {
    scale = Math.max(scale - 0.25, 0.5);
    lbImg.style.transform = `scale(${scale})`;
  });
});
