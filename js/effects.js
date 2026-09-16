/* =========================================================
   SHADID AHAMED — PORTFOLIO EFFECTS ENGINE
   FILE: js/effects.js
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     GLOBAL CONFIG
     --------------------------------------------------------- */

  const CONFIG = {
    revealThreshold: 0.12,
    tiltMax: 7,
    magneticStrength: 0.18,
    parallaxStrength: 0.035,
    transitionDuration: 650,
    maxParticles: 90
  };

  const state = {
    reducedMotion: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches,

    pointerX: window.innerWidth / 2,
    pointerY: window.innerHeight / 2,

    initialized: false
  };

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const lerp = (a, b, amount) =>
    a + (b - a) * amount;

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     BASE EFFECT STYLES
     --------------------------------------------------------- */

  function injectEffectStyles() {
    if ($("#shadid-effects-style")) return;

    const style = document.createElement("style");
    style.id = "shadid-effects-style";

    style.textContent = `
      /* ==========================================
         REVEAL SYSTEM
         ========================================== */

      [data-reveal],
      .reveal,
      .scroll-reveal {
        opacity: 0;
        transform: translate3d(0, 28px, 0);
        transition:
          opacity ${CONFIG.transitionDuration}ms cubic-bezier(.2,.7,.2,1),
          transform ${CONFIG.transitionDuration}ms cubic-bezier(.2,.7,.2,1);
        will-change: opacity, transform;
      }

      [data-reveal="left"] {
        transform: translate3d(-40px, 0, 0);
      }

      [data-reveal="right"] {
        transform: translate3d(40px, 0, 0);
      }

      [data-reveal="scale"] {
        transform: scale(.92);
      }

      [data-reveal="blur"] {
        transform: translate3d(0, 20px, 0);
        filter: blur(10px);
      }

      [data-reveal].is-visible,
      .reveal.is-visible,
      .scroll-reveal.is-visible {
        opacity: 1;
        transform: none;
        filter: none;
      }

      /* ==========================================
         GLASS SPOTLIGHT
         ========================================== */

      .glass-spotlight {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .glass-spotlight::before {
        content: "";
        position: absolute;
        width: 260px;
        height: 260px;
        left: var(--spot-x, 50%);
        top: var(--spot-y, 50%);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;

        background:
          radial-gradient(
            circle,
            rgba(255,255,255,.13) 0%,
            rgba(255,255,255,.05) 25%,
            transparent 70%
          );

        opacity: 0;
        transition: opacity .35s ease;
      }

      .glass-spotlight:hover::before {
        opacity: 1;
      }

      /* ==========================================
         TILT CARDS
         ========================================== */

      .tilt-card {
        transform-style: preserve-3d;
        will-change: transform;
      }

      .tilt-card > * {
        transform: translateZ(0);
      }

      .tilt-depth {
        transform: translateZ(28px);
      }

      /* ==========================================
         MAGNETIC ELEMENT
         ========================================== */

      .magnetic {
        will-change: transform;
      }

      /* ==========================================
         IMAGE LOADING
         ========================================== */

      img[data-lazy] {
        opacity: 0;
        transition: opacity .55s ease;
      }

      img[data-lazy].loaded {
        opacity: 1;
      }

      /* ==========================================
         EXPANDABLE CARDS
         ========================================== */

      .expandable-card {
        cursor: pointer;
      }

      .expandable-card .expand-content {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition:
          max-height .55s cubic-bezier(.2,.7,.2,1),
          opacity .35s ease,
          margin .35s ease;
        margin-top: 0;
      }

      .expandable-card.is-expanded .expand-content {
        max-height: 1200px;
        opacity: 1;
        margin-top: 1rem;
      }

      .expandable-card .expand-icon {
        transition: transform .4s ease;
      }

      .expandable-card.is-expanded .expand-icon {
        transform: rotate(180deg);
      }

      /* ==========================================
         3D ROTATING CAROUSEL
         ========================================== */

      .shadid-carousel {
        position: relative;
        perspective: 1400px;
        transform-style: preserve-3d;
      }

      .shadid-carousel-track {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
      }

      .shadid-carousel-item {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        transition:
          transform .8s cubic-bezier(.2,.75,.2,1),
          opacity .6s ease,
          filter .6s ease;
      }

      .shadid-carousel-item.is-active {
        z-index: 10;
      }

      .shadid-carousel-item.is-hidden {
        opacity: .2;
        filter: blur(2px);
      }

      /* ==========================================
         IMAGE ZOOM
         ========================================== */

      .image-zoom {
        overflow: hidden;
      }

      .image-zoom img {
        transition:
          transform .8s cubic-bezier(.2,.7,.2,1);
      }

      .image-zoom:hover img {
        transform: scale(1.045);
      }

      /* ==========================================
         AMBIENT GLOW
         ========================================== */

      .ambient-glow {
        position: relative;
        isolation: isolate;
      }

      .ambient-glow::after {
        content: "";
        position: absolute;
        inset: -25%;
        pointer-events: none;
        z-index: -2;

        background:
          radial-gradient(
            circle at 30% 30%,
            rgba(255,255,255,.055),
            transparent 35%
          ),
          radial-gradient(
            circle at 70% 70%,
            rgba(255,210,120,.035),
            transparent 40%
          );

        filter: blur(35px);
        animation: shadidAmbient 10s ease-in-out infinite alternate;
      }

      @keyframes shadidAmbient {
        from {
          transform: translate3d(-2%, -1%, 0) scale(1);
        }

        to {
          transform: translate3d(2%, 1%, 0) scale(1.08);
        }
      }

      /* ==========================================
         FLOATING ELEMENTS
         ========================================== */

      .float-soft {
        animation: shadidFloat 5s ease-in-out infinite;
      }

      @keyframes shadidFloat {
        0%, 100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-8px);
        }
      }

      /* ==========================================
         COUNTERS
         ========================================== */

      .counter-number {
        font-variant-numeric: tabular-nums;
      }

      /* ==========================================
         REDUCED MOTION
         ========================================== */

      @media (prefers-reduced-motion: reduce) {
        [data-reveal],
        .reveal,
        .scroll-reveal {
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
          transition: none !important;
        }

        .float-soft,
        .ambient-glow::after {
          animation: none !important;
        }

        .image-zoom img {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------- */

  function initRevealSystem() {
    const elements = $$(
      "[data-reveal], .reveal, .scroll-reveal"
    );

    if (!elements.length) return;

    if (state.reducedMotion) {
      elements.forEach(el =>
        el.classList.add("is-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: CONFIG.revealThreshold,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    elements.forEach((el, index) => {
      if (!el.dataset.revealDelay) {
        el.style.transitionDelay =
          `${Math.min(index * 35, 350)}ms`;
      }

      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     GLASS SPOTLIGHT
     --------------------------------------------------------- */

  function initSpotlights() {
    const cards = $$(".glass-spotlight");

    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener(
        "pointermove",
        event => {
          const rect = card.getBoundingClientRect();

          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          card.style.setProperty(
            "--spot-x",
            `${x}px`
          );

          card.style.setProperty(
            "--spot-y",
            `${y}px`
          );
        },
        { passive: true }
      );
    });
  }

  /* ---------------------------------------------------------
     3D GLASS TILT
     --------------------------------------------------------- */

  function initTiltCards() {
    if (state.reducedMotion) return;

    const cards = $$(".tilt-card");

    cards.forEach(card => {
      let raf = null;

      const update = event => {
        if (raf) cancelAnimationFrame(raf);

        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const px =
            (event.clientX - rect.left) /
            rect.width;

          const py =
            (event.clientY - rect.top) /
            rect.height;

          const rotateY =
            (px - 0.5) * CONFIG.tiltMax * 2;

          const rotateX =
            (0.5 - py) * CONFIG.tiltMax * 2;

          card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateZ(0)`;
        });
      };

      card.addEventListener(
        "pointermove",
        update,
        { passive: true }
      );

      card.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);

        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS
     --------------------------------------------------------- */

  function initMagneticElements() {
    if (state.reducedMotion) return;

    const elements = $$(".magnetic");

    elements.forEach(element => {
      element.addEventListener(
        "pointermove",
        event => {
          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            (rect.left + rect.width / 2);

          const y =
            event.clientY -
            (rect.top + rect.height / 2);

          element.style.transform =
            `translate3d(
              ${x * CONFIG.magneticStrength}px,
              ${y * CONFIG.magneticStrength}px,
              0
            )`;
        },
        { passive: true }
      );

      element.addEventListener(
        "pointerleave",
        () => {
          element.style.transform =
            "translate3d(0,0,0)";
        }
      );
    });
  }

  /* ---------------------------------------------------------
     PARALLAX
     --------------------------------------------------------- */

  function initParallax() {
    if (state.reducedMotion) return;

    const elements = $$("[data-parallax]");

    if (!elements.length) return;

    let ticking = false;

    const update = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        elements.forEach(element => {
          const speed =
            parseFloat(
              element.dataset.parallax
            ) || CONFIG.parallaxStrength;

          const rect =
            element.getBoundingClientRect();

          const offset =
            (rect.top + scrollY) * speed;

          element.style.transform =
            `translate3d(0, ${-offset}px, 0)`;
        });

        ticking = false;
      });
    };

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

    update();
  }

  /* ---------------------------------------------------------
     IMAGE LAZY LOADING
     --------------------------------------------------------- */

  function initLazyImages() {
    const images = $$(
      "img[data-lazy], img[loading='lazy']"
    );

    if (!images.length) return;

    if ("IntersectionObserver" in window) {
      const observer =
        new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;

              const img = entry.target;

              if (img.dataset.src) {
                img.src = img.dataset.src;
              }

              if (img.dataset.srcset) {
                img.srcset =
                  img.dataset.srcset;
              }

              img.addEventListener(
                "load",
                () => {
                  img.classList.add("loaded");
                },
                { once: true }
              );

              observer.unobserve(img);
            });
          },
          {
            rootMargin: "300px"
          }
        );

      images.forEach(img =>
        observer.observe(img)
      );
    } else {
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        img.classList.add("loaded");
      });
    }
  }

  /* ---------------------------------------------------------
     IMAGE ERROR FALLBACK
     --------------------------------------------------------- */

  function initImageFallbacks() {
    $$("img").forEach(img => {
      img.addEventListener("error", () => {
        img.classList.add("image-load-error");

        img.setAttribute(
          "aria-label",
          img.alt || "Image unavailable"
        );
      });
    });
  }

  /* ---------------------------------------------------------
     EXPANDABLE CARDS
     --------------------------------------------------------- */

  function initExpandableCards() {
    const cards = $$(
      ".expandable-card, [data-expandable]"
    );

    cards.forEach(card => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute(
        "aria-expanded",
        "false"
      );

      const toggle = () => {
        const expanded =
          card.classList.toggle(
            "is-expanded"
          );

        card.setAttribute(
          "aria-expanded",
          String(expanded)
        );
      };

      card.addEventListener(
        "click",
        event => {
          const interactive =
            event.target.closest(
              "a, button, input, textarea, select"
            );

          if (interactive) return;

          toggle();
        }
      );

      card.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            toggle();
          }
        }
      );
    });
  }

  /* ---------------------------------------------------------
     DYNAMIC COUNTERS
     --------------------------------------------------------- */

  function initCounters() {
    const counters = $$(
      "[data-counter], .counter-number"
    );

    if (!counters.length) return;

    const animateCounter = element => {
      const target =
        parseFloat(
          element.dataset.counter ||
          element.textContent
        );

      if (!Number.isFinite(target)) return;

      const duration =
        parseInt(
          element.dataset.counterDuration,
          10
        ) || 1200;

      const decimals =
        parseInt(
          element.dataset.decimals,
          10
        ) || 0;

      if (state.reducedMotion) {
        element.textContent =
          target.toFixed(decimals);
        return;
      }

      const startTime = performance.now();

      const tick = now => {
        const progress =
          clamp(
            (now - startTime) / duration,
            0,
            1
          );

        const eased =
          1 -
          Math.pow(1 - progress, 3);

        const current =
          target * eased;

        element.textContent =
          current.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.5
        }
      );

    counters.forEach(counter =>
      observer.observe(counter)
    );
  }

  /* ---------------------------------------------------------
     3D CAROUSEL ENGINE
     --------------------------------------------------------- */

  class ShadidCarousel {
    constructor(root, options = {}) {
      this.root = root;

      this.items =
        $$(".shadid-carousel-item", root);

      this.index = 0;

      this.options = {
        autoRotate: true,
        interval: 4000,
        depth: 320,
        ...options
      };

      this.timer = null;

      this.init();
    }

    init() {
      if (!this.items.length) return;

      this.root.classList.add(
        "shadid-carousel"
      );

      this.createTrack();
      this.render();
      this.bindControls();

      if (
        this.options.autoRotate &&
        !state.reducedMotion
      ) {
        this.start();
      }
    }

    createTrack() {
      let track =
        $(".shadid-carousel-track", this.root);

      if (!track) {
        track = document.createElement("div");
        track.className =
          "shadid-carousel-track";

        this.items.forEach(item =>
          track.appendChild(item)
        );

        this.root.appendChild(track);
      }

      this.track = track;

      this.items =
        $$(".shadid-carousel-item", track);
    }

    render() {
      const total = this.items.length;

      if (!total) return;

      const angleStep =
        360 / total;

      this.items.forEach((item, i) => {
        let relative =
          i - this.index;

        if (relative > total / 2) {
          relative -= total;
        }

        if (relative < -total / 2) {
          relative += total;
        }

        const angle =
          relative * angleStep;

        const distance =
          Math.abs(relative);

        const scale =
          distance === 0
            ? 1
            : Math.max(
                0.68,
                1 - distance * 0.12
              );

        const opacity =
          distance > 2
            ? 0
            : Math.max(
                0.25,
                1 - distance * 0.25
              );

        item.style.transform =
          `rotateY(${angle}deg)
           translateZ(${this.options.depth}px)
           scale(${scale})`;

        item.style.opacity =
          opacity;

        item.classList.toggle(
          "is-active",
          relative === 0
        );

        item.classList.toggle(
          "is-hidden",
          distance > 1
        );
      });
    }

    next() {
      this.index =
        (this.index + 1) %
        this.items.length;

      this.render();
    }

    previous() {
      this.index =
        (this.index - 1 +
          this.items.length) %
        this.items.length;

      this.render();
    }

    start() {
      this.stop();

      this.timer =
        setInterval(
          () => this.next(),
          this.options.interval
        );
    }

    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    bindControls() {
      const next =
        $("[data-carousel-next]", this.root);

      const previous =
        $("[data-carousel-prev]", this.root);

      next?.addEventListener(
        "click",
        () => {
          this.next();
          this.start();
        }
      );

      previous?.addEventListener(
        "click",
        () => {
          this.previous();
          this.start();
        }
      );

      this.root.addEventListener(
        "mouseenter",
        () => this.stop()
      );

      this.root.addEventListener(
        "mouseleave",
        () => {
          if (!state.reducedMotion) {
            this.start();
          }
        }
      );

      this.root.addEventListener(
        "keydown",
        event => {
          if (event.key === "ArrowRight") {
            this.next();
            this.start();
          }

          if (event.key === "ArrowLeft") {
            this.previous();
            this.start();
          }
        }
      );
    }
  }

  /* ---------------------------------------------------------
     AUTO-DETECT CAROUSELS
     --------------------------------------------------------- */

  function initCarousels() {
    $$("[data-carousel]").forEach(root => {
      const interval =
        parseInt(
          root.dataset.carouselInterval,
          10
        ) || CONFIG.carouselInterval || 4000;

      new ShadidCarousel(root, {
        interval
      });
    });

    window.ShadidCarousel =
      ShadidCarousel;
  }

  /* ---------------------------------------------------------
     CURSOR PARTICLE TRAIL
     --------------------------------------------------------- */

  function initCursorTrail() {
    if (state.reducedMotion) return;

    if (
      window.matchMedia("(pointer: coarse)")
        .matches
    ) {
      return;
    }

    const container =
      document.createElement("div");

    container.className =
      "shadid-cursor-trail";

    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    `;

    document.body.appendChild(container);

    const dots = [];
    const maxDots = 14;

    let lastX = state.pointerX;
    let lastY = state.pointerY;

    window.addEventListener(
      "pointermove",
      event => {
        state.pointerX =
          event.clientX;

        state.pointerY =
          event.clientY;

        const distance =
          Math.hypot(
            event.clientX - lastX,
            event.clientY - lastY
          );

        if (distance < 18) return;

        lastX = event.clientX;
        lastY = event.clientY;

        const dot =
          document.createElement("span");

        dot.style.cssText = `
          position:absolute;
          left:${event.clientX}px;
          top:${event.clientY}px;
          width:4px;
          height:4px;
          border-radius:50%;
          background:rgba(255,255,255,.6);
          transform:translate(-50%,-50%);
          pointer-events:none;
          opacity:.8;
          filter:blur(.2px);
        `;

        container.appendChild(dot);
        dots.push(dot);

        setTimeout(() => {
          dot.style.transition =
            "opacity .55s ease, transform .55s ease";

          dot.style.opacity = "0";
          dot.style.transform =
            "translate(-50%,-50%) scale(.2)";
        }, 20);

        setTimeout(() => {
          dot.remove();

          const index =
            dots.indexOf(dot);

          if (index !== -1) {
            dots.splice(index, 1);
          }
        }, 650);

        while (dots.length > maxDots) {
          dots.shift()?.remove();
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------
     SECTION AMBIENT EFFECT
     --------------------------------------------------------- */

  function initAmbientSections() {
    const sections = $$(
      "section, .page, .portfolio-section"
    );

    sections.forEach(section => {
      if (
        !section.classList.contains(
          "ambient-glow"
        )
      ) {
        section.classList.add(
          "ambient-glow"
        );
      }
    });
  }

  /* ---------------------------------------------------------
     STAGGER CHILDREN
     --------------------------------------------------------- */

  function initStaggerGroups() {
    $$("[data-stagger]").forEach(group => {
      const children =
        Array.from(group.children);

      children.forEach((child, index) => {
        child.style.transitionDelay =
          `${Math.min(index * 70, 700)}ms`;

        child.classList.add(
          "scroll-reveal"
        );
      });
    });
  }

  /* ---------------------------------------------------------
     IMAGE HOVER DEPTH
     --------------------------------------------------------- */

  function initImageDepth() {
    if (state.reducedMotion) return;

    $$(".image-depth").forEach(wrapper => {
      const image =
        $("img", wrapper);

      if (!image) return;

      wrapper.addEventListener(
        "pointermove",
        event => {
          const rect =
            wrapper.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

          image.style.transform =
            `scale(1.04)
             translate3d(
               ${x * -8}px,
               ${y * -8}px,
               0
             )`;
        },
        { passive: true }
      );

      wrapper.addEventListener(
        "pointerleave",
        () => {
          image.style.transform =
            "scale(1) translate3d(0,0,0)";
        }
      );
    });
  }

  /* ---------------------------------------------------------
     KEYBOARD VISUAL FEEDBACK
     --------------------------------------------------------- */

  function initKeyboardFeedback() {
    window.addEventListener("keydown", event => {
      document.body.dataset.lastKey =
        event.key;

      clearTimeout(
        document.body._keyTimer
      );

      document.body._keyTimer =
        setTimeout(() => {
          delete document.body.dataset.lastKey;
        }, 500);
    });
  }

  /* ---------------------------------------------------------
     PAGE TRANSITION HELPER
     --------------------------------------------------------- */

  function initPageTransitions() {
    document.body.classList.add(
      "effects-ready"
    );

    window.ShadidEffects =
      window.ShadidEffects || {};

    window.ShadidEffects.fadeTo = (
      callback
    ) => {
      if (state.reducedMotion) {
        callback?.();
        return;
      }

      document.body.style.transition =
        "opacity .25s ease";

      document.body.style.opacity = ".35";

      setTimeout(() => {
        callback?.();

        requestAnimationFrame(() => {
          document.body.style.opacity = "1";
        });
      }, 180);
    };
  }

  /* ---------------------------------------------------------
     DATA INTEGRATION
     --------------------------------------------------------- */

  function connectToPortfolioData() {
    const data =
      window.ShadidData;

    if (!data) return;

    document.dispatchEvent(
      new CustomEvent(
        "portfolio:effects-ready",
        {
          detail: {
            data
          }
        }
      )
    );
  }

  /* ---------------------------------------------------------
     REFRESH DYNAMIC EFFECTS
     Useful when AI / JS generates new cards.
     --------------------------------------------------------- */

  function refresh() {
    initRevealSystem();
    initSpotlights();
    initTiltCards();
    initMagneticElements();
    initLazyImages();
    initExpandableCards();
    initCounters();
    initImageDepth();
    initStaggerGroups();
  }

  /* ---------------------------------------------------------
     MAIN INITIALIZATION
     --------------------------------------------------------- */

  function init() {
    if (state.initialized) return;

    state.initialized = true;

    state.reducedMotion =
      prefersReducedMotion();

    injectEffectStyles();

    initRevealSystem();
    initSpotlights();
    initTiltCards();
    initMagneticElements();
    initParallax();
    initLazyImages();
    initImageFallbacks();
    initExpandableCards();
    initCounters();
    initCarousels();
    initCursorTrail();
    initAmbientSections();
    initStaggerGroups();
    initImageDepth();
    initKeyboardFeedback();
    initPageTransitions();
    connectToPortfolioData();

    window.ShadidEffects = {
      refresh,
      state,
      CONFIG
    };

    document.dispatchEvent(
      new CustomEvent(
        "portfolio:effects-initialized"
      )
    );
  }

  /* ---------------------------------------------------------
     DOM READY
     --------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
