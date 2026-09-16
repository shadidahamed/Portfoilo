document.addEventListener('DOMContentLoaded', () => {
  // Cursor
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

  // Section Switching System
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-section]');

  function showSection(id) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Update active nav
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.nav-links a[data-section="${id}"]`)?.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
      // Close mobile menu
      document.querySelector('.nav-links')?.classList.remove('open');
    });
  });

  // Mobile nav toggle
  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Galaxy with mother star
  const canvas = document.getElementById('galaxy');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], mouse = { x: 0, y: 0 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Many stars
    for (let i = 0; i < 280; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.2
      });
    }

    document.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / w - 0.5) * 2;
      mouse.y = (e.clientY / h - 0.5) * 2;
    });

    function draw() {
      ctx.fillStyle = 'rgba(6,6,10,0.25)';
      ctx.fillRect(0, 0, w, h);

      // Mother star (center bright golden)
      const cx = w / 2 + mouse.x * 30;
      const cy = h / 2 + mouse.y * 20;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
      grd.addColorStop(0, 'rgba(232,213,181,0.95)');
      grd.addColorStop(0.3, 'rgba(201,168,124,0.4)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff8e7';
      ctx.fill();

      // Stars
      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > h) s.y = 0;
        s.x += mouse.x * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,124,${s.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }
});
