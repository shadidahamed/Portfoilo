/**
 * Galaxy / Spiral Star Field
 * Smooth, cinematic, matching the reference spiral galaxies
 */
(function () {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, stars = [], animationId;

    const STAR_COUNT = 1100;
    const ARMS = 3;
    const ARM_SPREAD = 0.48;
    const CORE_RADIUS = 48;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const cx = width / 2;
        const cy = height / 2;
        const maxDist = Math.min(width, height) * 0.52;

        for (let i = 0; i < STAR_COUNT; i++) {
            const arm = i % ARMS;
            const dist = Math.pow(Math.random(), 0.68) * maxDist;
            const angle = (arm / ARMS) * Math.PI * 2 +
                          (dist / maxDist) * 4.5 +
                          (Math.random() - 0.5) * ARM_SPREAD;

            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist * 0.70;

            const size = Math.random() * 1.9 + 0.25;
            const brightness = Math.random();
            const colorRoll = Math.random();

            let r, g, b, a;
            if (colorRoll > 0.88) {
                // warm gold / orange
                r = 255; g = 195; b = 110;
                a = 0.45 + brightness * 0.5;
            } else if (colorRoll > 0.72) {
                // cool blue-white
                r = 175; g = 205; b = 255;
                a = 0.4 + brightness * 0.5;
            } else {
                // pure white
                r = 255; g = 255; b = 255;
                a = 0.3 + brightness * 0.55;
            }

            stars.push({
                baseAngle: angle,
                dist,
                size,
                r, g, b, a,
                twinkle: Math.random() * Math.PI * 2,
                speed: 0.0007 + Math.random() * 0.0011,
                x, y
            });
        }
    }

    function draw() {
        // soft trail for cinematic feel
        ctx.fillStyle = 'rgba(5, 5, 8, 0.18)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // core glow
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, CORE_RADIUS * 5);
        gradient.addColorStop(0, 'rgba(255, 235, 190, 0.16)');
        gradient.addColorStop(0.25, 'rgba(212, 175, 55, 0.055)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // stars
        for (const s of stars) {
            s.baseAngle += s.speed;
            s.x = cx + Math.cos(s.baseAngle) * s.dist;
            s.y = cy + Math.sin(s.baseAngle) * s.dist * 0.70;

            s.twinkle += 0.028;
            const alphaMod = 0.6 + Math.sin(s.twinkle) * 0.4;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${s.a * alphaMod})`;
            ctx.fill();

            // soft glow for larger stars
            if (s.size > 1.25) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${s.a * alphaMod * 0.12})`;
                ctx.fill();
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    function init() {
        resize();
        createStars();
        draw();
    }

    window.addEventListener('resize', () => {
        resize();
        createStars();
    });

    // respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        resize();
        createStars();
        // draw once
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);
        const cx = width / 2, cy = height / 2;
        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${s.a})`;
            ctx.fill();
        }
    } else {
        init();
    }
})();
