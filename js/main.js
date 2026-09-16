document.addEventListener('DOMContentLoaded', () => {
  // Nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // ===== WHEEL SYSTEM =====
  function initWheels() {
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

      function updateFront() {
        items.forEach((item, i) => item.classList.toggle('active', i === current));
        if (caption && data[current]) {
          caption.textContent = data[current].title || '';
          caption.classList.add('visible');
        }
      }

      updateFront();

      setInterval(() => {
        current = (current + 1) % data.length;
        updateFront();
      }, 1800);
    });
  }
  initWheels();

  // Skill tilt
  document.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('mousemove', e => {
      const r = node.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      node.style.transform = `translateZ(18px) rotateX(${y * -7}deg) rotateY(${x * 7}deg)`;
    });
    node.addEventListener('mouseleave', () => node.style.transform = '');
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
    setTimeout(() => { lightbox.hidden = true; lbImg.src = ''; }, 340);
  }

  document.querySelectorAll('.art-card, .graphics-card, .cert-card, .project-card').forEach(card => {
    card.addEventListener('click', () => {
      const activeImg = card.querySelector('.wheel-item.active img');
      const src = activeImg?.src || card.dataset.src;
      if (src) openLightbox(src);
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

  lightbox.addEventListener('wheel', e => {
    if (!lightbox.classList.contains('active')) return;
    e.preventDefault();
    scale = e.deltaY < 0 ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 0.5);
    lbImg.style.transform = `scale(${scale})`;
  }, { passive: false });

  // CV
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.modal;
      if (src.endsWith('.pdf')) window.open(src, '_blank');
      else openLightbox(src);
    });
  });
});
