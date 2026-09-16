/**
 * ORPHEUS ENGINE & PORTFOLIO INTERACTION CONTROLLER
 * Full memory lifecycle management, high-performance physics & dynamic lighting.
 */

// ==========================================================================
// 1. AMBIENT BACKGROUND CANVAS (PASSIVE GRAPHICS)
// ==========================================================================
class AmbientCanvas {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 40;

        this.resize();
        this.initParticles();
        this.bindEvents();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#bf1725';

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(this.animate);
    }
}

// ==========================================================================
// 2. ORPHEUS 3D CAR / HYBRID ENGINE (THREE.JS)
// ==========================================================================
class OrpheusEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.animationFrameId = null;

        // Vehicle Dynamics State
        this.speed = 0;
        this.maxSpeed = 1.2;
        this.acceleration = 0.015;
        this.friction = 0.96;
        this.steering = 0;
        this.turnSpeed = 0.03;

        // Key Input State
        this.keys = { Forward: false, Backward: false, Left: false, Right: false, Brake: false };

        this.initScene();
        this.buildWorld();
        this.buildVehicle();
        this.bindEvents();
    }

    initScene() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x030509);
        this.scene.fog = new THREE.FogExp2(0x030509, 0.03);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 3, -7);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Dynamic Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        this.spotLight = new THREE.SpotLight(0xbf1725, 2);
        this.spotLight.position.set(0, 10, 0);
        this.spotLight.angle = Math.PI / 4;
        this.spotLight.penumbra = 0.8;
        this.scene.add(this.spotLight);
    }

    buildWorld() {
        // Endless Grid Ground
        const gridHelper = new THREE.GridHelper(200, 80, 0xbf1725, 0x1a202c);
        gridHelper.position.y = -0.01;
        this.scene.add(gridHelper);

        // Void Pylons Architecture
        this.pylons = [];
        const pylonGeo = new THREE.BoxGeometry(1.5, 12, 1.5);
        const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.2 });

        for (let i = 0; i < 30; i++) {
            const pylon = new THREE.Mesh(pylonGeo, pylonMat);
            pylon.position.set(
                (Math.random() - 0.5) * 80,
                6,
                (Math.random() - 0.5) * 80
            );
            this.scene.add(pylon);
            this.pylons.push(pylon);
        }
    }

    buildVehicle() {
        // Procedural Vehicle Body
        this.vehicleGroup = new THREE.Group();

        const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 3.2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x060910, metalness: 0.8, roughness: 0.2 });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.position.y = 0.5;
        this.vehicleGroup.add(bodyMesh);

        // Red Tail Lights Glow
        const lightGeo = new THREE.BoxGeometry(0.4, 0.1, 0.1);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xbf1725 });
        const leftLight = new THREE.Mesh(lightGeo, lightMat);
        leftLight.position.set(-0.5, 0.6, -1.6);
        const rightLight = leftLight.clone();
        rightLight.position.x = 0.5;

        this.vehicleGroup.add(leftLight);
        this.vehicleGroup.add(rightLight);

        this.scene.add(this.vehicleGroup);
    }

    bindEvents() {
        this.onKeyDown = (e) => this.handleKeys(e, true);
        this.onKeyUp = (e) => this.handleKeys(e, false);
        this.onResize = () => {
            if (!this.container) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        };

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('resize', this.onResize);
    }

    handleKeys(e, isDown) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': this.keys.Forward = isDown; break;
            case 'KeyS': case 'ArrowDown': this.keys.Backward = isDown; break;
            case 'KeyA': case 'ArrowLeft': this.keys.Left = isDown; break;
            case 'KeyD': case 'ArrowRight': this.keys.Right = isDown; break;
            case 'Space': this.keys.Brake = isDown; break;
        }
    }

    updatePhysics() {
        if (this.keys.Forward) this.speed += this.acceleration;
        if (this.keys.Backward) this.speed -= this.acceleration * 0.5;

        // Friction & Braking
        if (this.keys.Brake) this.speed *= 0.85;
        else this.speed *= this.friction;

        // Clamp Max Speed
        this.speed = Math.max(-this.maxSpeed * 0.4, Math.min(this.speed, this.maxSpeed));

        // Steering
        if (Math.abs(this.speed) > 0.001) {
            const dir = this.speed > 0 ? 1 : -1;
            if (this.keys.Left) this.vehicleGroup.rotation.y += this.turnSpeed * dir;
            if (this.keys.Right) this.vehicleGroup.rotation.y -= this.turnSpeed * dir;
        }

        // Apply Vector Movement
        this.vehicleGroup.translateZ(this.speed);

        // Update Camera Tracking
        const relativeOffset = new THREE.Vector3(0, 2.5, -6);
        const cameraOffset = relativeOffset.applyMatrix4(this.vehicleGroup.matrixWorld);
        this.camera.position.lerp(cameraOffset, 0.1);
        this.camera.lookAt(this.vehicleGroup.position.clone().add(new THREE.Vector3(0, 0.8, 0)));

        // Synchronize Light Focus
        this.spotLight.position.copy(this.vehicleGroup.position).add(new THREE.Vector3(0, 8, 0));
        this.spotLight.target = this.vehicleGroup;

        // UI Display Update
        const speedKmh = Math.floor(Math.abs(this.speed) * 160);
        document.getElementById('speed-display').innerText = speedKmh.toString().padStart(3, '0');
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const renderLoop = () => {
            if (!this.isRunning) return;
            this.updatePhysics();
            this.renderer.render(this.scene, this.camera);
            this.animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    dispose() {
        this.stop();
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('resize', this.onResize);

        // Clean up GPU resources
        this.scene.traverse((object) => {
            if (!object.isMesh) return;
            object.geometry.dispose();
            if (object.material.isMaterial) {
                object.material.dispose();
            }
        });

        this.renderer.dispose();
        if (this.renderer.domElement) this.renderer.domElement.remove();
    }
}

// ==========================================================================
// 3. LIFECYCLE MANAGEMENT & EVENT BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Start Ambient Background
    new AmbientCanvas();

    // Game Control Instance initialization
    let engineInstance = null;
    const startBtn = document.getElementById('btn-start-game');
    const overlay = document.getElementById('game-controls-overlay');

    startBtn.addEventListener('click', () => {
        if (!engineInstance) {
            engineInstance = new OrpheusEngine('game-container');
        }
        engineInstance.start();
        overlay.style.opacity = '0.2'; // Dim control overlay during drive
    });

    // Mobile Navbar Navigation Toggle
    const mobileBtn = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#030509';
            navLinks.style.padding = '1rem';
        });
    }
});
