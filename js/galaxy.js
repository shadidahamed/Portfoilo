import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class GalaxyEngine {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    this.particleCount = window.innerWidth < 768 ? 15000 : 45000;
    this.parameters = {
      radius: 5,
      branches: 4,
      spin: 1,
      randomness: 0.5,
      power: 3,
      insideColor: '#f7c948', // Muted Gold Accent
      outsideColor: '#0d1117'  // Deep Charcoal Space
    };

    this.geometry = null;
    this.material = null;
    this.points = null;
    
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 3, 6);
    this.camera.lookAt(0, 0, 0);

    this.generateGalaxy();
    this.addEvents();
    this.animate();
  }

  generateGalaxy() {
    if (this.points !== null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
    }

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    const colorInside = new THREE.Color(this.parameters.insideColor);
    const colorOutside = new THREE.Color(this.parameters.outsideColor);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Position along spiral arm
      const radius = Math.random() * this.parameters.radius;
      const spinAngle = radius * this.parameters.spin;
      const branchAngle = ((i % this.parameters.branches) / this.parameters.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), this.parameters.power) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), this.parameters.power) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), this.parameters.power) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color interpolation (Gold Core to Dark Outer Arms)
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  updateEnvironmentForSection(sectionId) {
    const targetState = {
      home: { radius: 5, cameraZ: 6, rotSpeed: 0.0005 },
      profile: { radius: 7, cameraZ: 8, rotSpeed: 0.0003 },
      education: { radius: 4, cameraZ: 5, rotSpeed: 0.0008 },
      skills: { radius: 6, cameraZ: 7, rotSpeed: 0.0004 },
      projects: { radius: 8, cameraZ: 9, rotSpeed: 0.0002 },
      videos: { radius: 5, cameraZ: 6, rotSpeed: 0.0005 },
      contact: { radius: 3, cameraZ: 4, rotSpeed: 0.0001 }
    };

    const config = targetState[sectionId] || targetState.home;
    gsap.to(this.camera.position, { z: config.cameraZ, duration: 2, ease: "power2.out" });
    this.currentRotSpeed = config.rotSpeed;
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.points) {
      this.points.rotation.y += this.currentRotSpeed || 0.0005;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
