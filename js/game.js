document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('gameIntro');
  const wrap = document.getElementById('gameCanvasWrap');
  const canvas = document.getElementById('gameCanvas');
  const startBtn = document.getElementById('startGameBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, running = false;
  let car = { x: 0, y: 0, speed: 0, angle: 0 };
  let keys = {};
  let roadOffset = 0;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight || 500;
    car.x = w / 2;
    car.y = h * 0.7;
  }

  startBtn?.addEventListener('click', () => {
    intro.hidden = true;
    wrap.hidden = false;
    resize();
    running = true;
    loop();
  });

  window.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Escape') {
      running = false;
      wrap.hidden = true;
      intro.hidden = false;
    }
    if (e.key.toLowerCase() === 'r') {
      car.speed = 0;
      car.angle = 0;
      roadOffset = 0;
    }
  });
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  // Mobile buttons
  document.getElementById('btnLeft')?.addEventListener('touchstart', e => { e.preventDefault(); keys['arrowleft'] = true; });
  document.getElementById('btnLeft')?.addEventListener('touchend', () => keys['arrowleft'] = false);
  document.getElementById('btnRight')?.addEventListener('touchstart', e => { e.preventDefault(); keys['arrowright'] = true; });
  document.getElementById('btnRight')?.addEventListener('touchend', () => keys['arrowright'] = false);
  document.getElementById('btnBrake')?.addEventListener('touchstart', e => { e.preventDefault(); keys[' '] = true; });
  document.getElementById('btnBrake')?.addEventListener('touchend', () => keys[' '] = false);

  function loop() {
    if (!running) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if (keys['arrowleft'] || keys['a']) car.angle -= 0.04;
    if (keys['arrowright'] || keys['d']) car.angle += 0.04;
    if (keys['arrowup'] || keys['w']) car.speed = Math.min(car.speed + 0.15, 8);
    if (keys['arrowdown'] || keys['s'] || keys[' ']) car.speed = Math.max(car.speed - 0.25, 0);

    car.speed *= 0.98; // friction
    roadOffset += car.speed;
    car.x += Math.sin(car.angle) * car.speed * 0.8;
    car.x = Math.max(40, Math.min(w - 40, car.x));
  }

  function draw() {
    // Sky / ground
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);

    // Road
    ctx.fillStyle = '#222';
    ctx.fillRect(w*0.2, 0, w*0.6, h);

    // Road lines
    ctx.strokeStyle = '#c9a87c';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);
    ctx.beginPath();
    ctx.moveTo(w/2, -roadOffset % 60);
    ctx.lineTo(w/2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Car (simple 2.5D)
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = '#c9a87c';
    ctx.fillRect(-18, -30, 36, 55);
    ctx.fillStyle = '#111';
    ctx.fillRect(-14, -22, 28, 20);
    ctx.restore();
  }

  window.addEventListener('resize', resize);
});
