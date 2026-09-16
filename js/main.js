document.addEventListener('DOMContentLoaded', () => {
  // Nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // ===== DISK GALLERY BUILDER (Z-axis 90° circular disk) =====
  document.querySelectorAll('.disk-gallery').forEach(gallery => {
    const images = JSON.parse(gallery.dataset.images || '[]');
    if (!images.length) return;

    const disk = document.createElement('div');
    disk.className = 'disk';

    const count = images.length;
    const radius = gallery.classList.contains('small') ? 48 : 62;

    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      const angle = (360 / count) * i;
      img.style.transform = `rotateZ(${angle}deg) translateX(${radius}px) rotateZ(-${angle}deg)`;
      disk.appendChild(img);
    });

    gallery.appendChild(disk);
  });

  // Skill 3D tilt
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
      const src = card.dataset.src || card.querySelector('img')?.src;
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
