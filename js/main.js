document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll state
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));

  // Close mobile nav on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // Orbit galleries – populate images from data-images
  document.querySelectorAll('.orbit-gallery').forEach(gallery => {
    const track = gallery.querySelector('.orbit-track');
    const imgs = JSON.parse(gallery.dataset.images || '[]');
    imgs.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Institution';
      img.style.animationDelay = `${i * -6}s`;
      track.appendChild(img);
    });
  });

  // Skill nodes subtle 3D on mouse move
  document.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('mousemove', e => {
      const rect = node.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `translateZ(20px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });
    node.addEventListener('mouseleave', () => {
      node.style.transform = '';
    });
  });

  // Lightbox system (art, graphics, certs, projects)
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
    setTimeout(() => { lightbox.hidden = true; lbImg.src = ''; }, 350);
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

  // Wheel zoom inside lightbox
  lightbox.addEventListener('wheel', e => {
    if (!lightbox.classList.contains('active')) return;
    e.preventDefault();
    scale = e.deltaY < 0 ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 0.5);
    lbImg.style.transform = `scale(${scale})`;
  }, { passive: false });

  // CV modal (simple open)
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.modal;
      if (src.endsWith('.pdf')) window.open(src, '_blank');
      else openLightbox(src);
    });
  });

  // Smooth reveal on scroll (lightweight)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section, .edu-card, .art-card, .project-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});
