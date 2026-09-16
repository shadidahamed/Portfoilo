/* =========================================================
   SHADID AHAMED — PORTFOLIO CORE CONTROLLER
   File: js/main.js
   Version: ASTRA / MYTHOS Core
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     GLOBAL CONFIGURATION
     ======================================================= */

  const CONFIG = {
    selectors: {
      body: "body",
      nav: "nav",
      navLinks: "[data-section], nav a[href^='#']",
      sections: "main section[id], section[id]",
      menuToggle: "#menuToggle, .menu-toggle, [data-menu-toggle]",
      backTop: "#backTop, #backToTop, [data-back-top]",
      cursor: ".cursor, #cursor",
      cursorFollower: ".cursor-follower, #cursorFollower",
      galaxy: "#galaxy"
    },

    classes: {
      active: "active",
      visible: "visible",
      hidden: "hidden",
      menuOpen: "menu-open",
      transitioning: "is-transitioning",
      reducedMotion: "reduced-motion",
      cursorHover: "cursor-hover",
      loaded: "site-loaded"
    },

    transitionDuration: 650,
    scrollOffset: 90,
    cursorSpeed: 0.18
  };


  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    currentSection: null,
    previousSection: null,
    isTransitioning: false,
    mobileMenuOpen: false,
    reducedMotion: false,
    mouse: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      followerX: window.innerWidth / 2,
      followerY: window.innerHeight / 2
    }
  };


  /* =======================================================
     DOM CACHE
     ======================================================= */

  const DOM = {
    body: document.body,
    nav: document.querySelector(CONFIG.selectors.nav),
    sections: [...document.querySelectorAll(CONFIG.selectors.sections)],
    navLinks: [...document.querySelectorAll(CONFIG.selectors.navLinks)],
    menuToggle: document.querySelector(CONFIG.selectors.menuToggle),
    backTop: document.querySelector(CONFIG.selectors.backTop),
    cursor: document.querySelector(CONFIG.selectors.cursor),
    cursorFollower: document.querySelector(CONFIG.selectors.cursorFollower),
    galaxy: document.querySelector(CONFIG.selectors.galaxy)
  };


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function init() {
    state.reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (state.reducedMotion) {
      DOM.body.classList.add(CONFIG.classes.reducedMotion);
    }

    prepareSections();
    prepareNavigation();
    prepareMobileNavigation();
    prepareBackToTop();
    prepareCursor();
    prepareKeyboardNavigation();
    prepareScrollObserver();
    prepareGlobalEvents();
    prepareExternalModuleHooks();

    initializeInitialSection();
    initializePageState();

    requestAnimationFrame(() => {
      DOM.body.classList.add(CONFIG.classes.loaded);
    });
  }


  /* =======================================================
     PAGE INITIAL STATE
     ======================================================= */

  function initializePageState() {
    document.documentElement.style.setProperty(
      "--viewport-height",
      `${window.innerHeight}px`
    );

    document.documentElement.style.setProperty(
      "--scroll-y",
      `${window.scrollY}px`
    );
  }


  /* =======================================================
     SECTION PREPARATION
     ======================================================= */

  function prepareSections() {
    DOM.sections.forEach((section, index) => {
      section.dataset.sectionIndex = String(index);

      if (!section.hasAttribute("tabindex")) {
        section.setAttribute("tabindex", "-1");
      }

      /*
       * We do not force visibility here.
       * CSS remains responsible for the visual page system.
       */
      section.classList.add("portfolio-section");
    });
  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  function prepareNavigation() {
    DOM.navLinks.forEach((link) => {
      link.addEventListener("click", handleNavigationClick);

      /*
       * Accessibility
       */
      if (!link.getAttribute("aria-label")) {
        const text = link.textContent.trim();

        if (text) {
          link.setAttribute("aria-label", text);
        }
      }
    });
  }


  function handleNavigationClick(event) {
    const link = event.currentTarget;

    let targetId = null;

    /*
     * Supports:
     * href="#profile"
     * data-section="profile"
     */
    if (link.dataset.section) {
      targetId = link.dataset.section;
    }

    if (!targetId) {
      const href = link.getAttribute("href");

      if (href && href.startsWith("#")) {
        targetId = href.substring(1);
      }
    }

    if (!targetId) return;

    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();

    navigateTo(targetId);

    closeMobileMenu();
  }


  /* =======================================================
     NAVIGATE TO SECTION
     ======================================================= */

  function navigateTo(sectionId, options = {}) {
    const target = document.getElementById(sectionId);

    if (!target) {
      console.warn(`[Portfolio] Section not found: ${sectionId}`);
      return false;
    }

    if (state.isTransitioning && !options.force) {
      return false;
    }

    state.previousSection = state.currentSection;
    state.currentSection = sectionId;

    updateActiveNavigation(sectionId);
    runSectionLifecycle(target);

    /*
     * If the project uses a full-page section system,
     * allow CSS to handle the visual state.
     */
    DOM.body.classList.add(CONFIG.classes.transitioning);

    const behavior = state.reducedMotion ? "auto" : "smooth";

    const navHeight =
      DOM.nav?.getBoundingClientRect().height ||
      CONFIG.scrollOffset;

    const targetTop =
      window.scrollY +
      target.getBoundingClientRect().top -
      navHeight;

    state.isTransitioning = true;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior
    });

    window.setTimeout(() => {
      state.isTransitioning = false;
      DOM.body.classList.remove(CONFIG.classes.transitioning);

      target.focus({
        preventScroll: true
      });

      emit("portfolio:navigate", {
        from: state.previousSection,
        to: state.currentSection
      });
    }, state.reducedMotion ? 0 : CONFIG.transitionDuration);

    return true;
  }


  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  function updateActiveNavigation(sectionId) {
    DOM.navLinks.forEach((link) => {
      let linkSection = link.dataset.section;

      if (!linkSection) {
        const href = link.getAttribute("href");

        if (href?.startsWith("#")) {
          linkSection = href.substring(1);
        }
      }

      const isActive = linkSection === sectionId;

      link.classList.toggle(CONFIG.classes.active, isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }


  /* =======================================================
     INITIAL SECTION
     ======================================================= */

  function initializeInitialSection() {
    const hash = window.location.hash.replace("#", "").trim();

    if (hash && document.getElementById(hash)) {
      state.currentSection = hash;

      updateActiveNavigation(hash);

      /*
       * Allow browser to finish initial rendering first.
       */
      requestAnimationFrame(() => {
        const target = document.getElementById(hash);

        if (target) {
          const navHeight =
            DOM.nav?.getBoundingClientRect().height || 0;

          window.scrollTo({
            top: Math.max(
              0,
              window.scrollY +
                target.getBoundingClientRect().top -
                navHeight
            ),
            behavior: "auto"
          });
        }
      });

      return;
    }

    const firstSection = DOM.sections[0];

    if (firstSection) {
      state.currentSection = firstSection.id;
      updateActiveNavigation(firstSection.id);
    }
  }


  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  function prepareMobileNavigation() {
    if (!DOM.menuToggle) return;

    DOM.menuToggle.addEventListener("click", () => {
      toggleMobileMenu();
    });

    /*
     * Close menu when clicking outside navigation.
     */
    document.addEventListener("click", (event) => {
      if (!state.mobileMenuOpen) return;

      const clickedInsideNav =
        DOM.nav?.contains(event.target);

      const clickedToggle =
        DOM.menuToggle?.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMobileMenu();
      }
    });
  }


  function toggleMobileMenu(force) {
    const shouldOpen =
      typeof force === "boolean"
        ? force
        : !state.mobileMenuOpen;

    state.mobileMenuOpen = shouldOpen;

    DOM.body.classList.toggle(
      CONFIG.classes.menuOpen,
      shouldOpen
    );

    DOM.menuToggle?.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    DOM.menuToggle?.setAttribute(
      "aria-label",
      shouldOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    emit("portfolio:menu", {
      open: shouldOpen
    });
  }


  function closeMobileMenu() {
    toggleMobileMenu(false);
  }


  /* =======================================================
     BACK TO TOP
     ======================================================= */

  function prepareBackToTop() {
    if (!DOM.backTop) return;

    DOM.backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: state.reducedMotion ? "auto" : "smooth"
      });
    });

    updateBackToTop();
  }


  function updateBackToTop() {
    if (!DOM.backTop) return;

    const visible = window.scrollY > 500;

    DOM.backTop.classList.toggle(
      CONFIG.classes.visible,
      visible
    );

    DOM.backTop.setAttribute(
      "aria-hidden",
      String(!visible)
    );
  }


  /* =======================================================
     SCROLL OBSERVER
     ======================================================= */

  function prepareScrollObserver() {
    if (!DOM.sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        /*
         * Find the section currently occupying the most
         * relevant viewport area.
         */
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (!visibleSections.length) return;

        const section =
          visibleSections[0].target;

        if (!section.id) return;

        state.previousSection = state.currentSection;
        state.currentSection = section.id;

        updateActiveNavigation(section.id);

        runSectionLifecycle(section);
      },
      {
        threshold: [0.15, 0.3, 0.5, 0.7],
        rootMargin: "-10% 0px -20% 0px"
      }
    );

    DOM.sections.forEach((section) => {
      observer.observe(section);
    });
  }


  /* =======================================================
     SECTION LIFECYCLE
     ======================================================= */

  function runSectionLifecycle(section) {
    if (!section) return;

    section.classList.add(CONFIG.classes.visible);

    /*
     * Give each section an event so other modules can react.
     *
     * Example:
     * AI can detect when Profile opens.
     * Game can initialize only when Game opens.
     * Art can load only when Art opens.
     */
    emit("portfolio:section-enter", {
      id: section.id,
      element: section
    });

    /*
     * Optional lifecycle methods exposed by sections.
     */
    if (typeof section.onEnter === "function") {
      try {
        section.onEnter();
      } catch (error) {
        console.error(
          `[Portfolio] Section lifecycle error:`,
          error
        );
      }
    }
  }


  /* =======================================================
     CURSOR SYSTEM
     ======================================================= */

  function prepareCursor() {
    /*
     * Do not force custom cursor on touch devices.
     */
    if (
      !DOM.cursor &&
      !DOM.cursorFollower
    ) {
      return;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      DOM.cursor?.classList.add(CONFIG.classes.hidden);
      DOM.cursorFollower?.classList.add(
        CONFIG.classes.hidden
      );

      return;
    }

    document.addEventListener("mousemove", (event) => {
      state.mouse.x = event.clientX;
      state.mouse.y = event.clientY;

      updateCursor();
    });

    document.addEventListener("mouseenter", () => {
      DOM.cursor?.classList.add(CONFIG.classes.visible);
      DOM.cursorFollower?.classList.add(
        CONFIG.classes.visible
      );
    });

    document.addEventListener("mouseleave", () => {
      DOM.cursor?.classList.remove(
        CONFIG.classes.visible
      );

      DOM.cursorFollower?.classList.remove(
        CONFIG.classes.visible
      );
    });

    prepareCursorHoverStates();

    requestAnimationFrame(cursorAnimationLoop);
  }


  function updateCursor() {
    if (DOM.cursor) {
      DOM.cursor.style.transform =
        `translate3d(${state.mouse.x}px, ${state.mouse.y}px, 0)`;
    }
  }


  function cursorAnimationLoop() {
    const speed = CONFIG.cursorSpeed;

    state.mouse.followerX +=
      (state.mouse.x - state.mouse.followerX) * speed;

    state.mouse.followerY +=
      (state.mouse.y - state.mouse.followerY) * speed;

    if (DOM.cursorFollower) {
      DOM.cursorFollower.style.transform =
        `translate3d(${state.mouse.followerX}px, ${state.mouse.followerY}px, 0)`;
    }

    requestAnimationFrame(cursorAnimationLoop);
  }


  function prepareCursorHoverStates() {
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, [role='button'], [data-cursor]"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        DOM.body.classList.add(
          CONFIG.classes.cursorHover
        );

        const cursorType =
          element.dataset.cursor;

        if (cursorType && DOM.cursor) {
          DOM.cursor.dataset.type = cursorType;
        }
      });

      element.addEventListener("mouseleave", () => {
        DOM.body.classList.remove(
          CONFIG.classes.cursorHover
        );

        if (DOM.cursor) {
          delete DOM.cursor.dataset.type;
        }
      });
    });
  }


  /* =======================================================
     KEYBOARD NAVIGATION
     ======================================================= */

  function prepareKeyboardNavigation() {
    document.addEventListener("keydown", (event) => {
      /*
       * Escape
       */
      if (event.key === "Escape") {
        closeMobileMenu();

        emit("portfolio:escape");

        return;
      }

      /*
       * Ignore shortcuts while typing.
       */
      const tag =
        document.activeElement?.tagName;

      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        document.activeElement?.isContentEditable;

      if (isTyping) return;

      /*
       * Home
       */
      if (event.key === "Home") {
        event.preventDefault();

        navigateTo(
          DOM.sections[0]?.id,
          { force: true }
        );

        return;
      }

      /*
       * End
       */
      if (event.key === "End") {
        event.preventDefault();

        const last =
          DOM.sections[DOM.sections.length - 1];

        navigateTo(
          last?.id,
          { force: true }
        );

        return;
      }

      /*
       * Arrow navigation
       */
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown"
      ) {
        event.preventDefault();

        navigateRelative(1);

        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();

        navigateRelative(-1);
      }
    });
  }


  function navigateRelative(direction) {
    if (!DOM.sections.length) return;

    const currentIndex =
      DOM.sections.findIndex(
        (section) =>
          section.id === state.currentSection
      );

    let nextIndex =
      currentIndex === -1
        ? 0
        : currentIndex + direction;

    nextIndex = Math.max(
      0,
      Math.min(
        DOM.sections.length - 1,
        nextIndex
      )
    );

    const target =
      DOM.sections[nextIndex];

    if (target) {
      navigateTo(target.id, {
        force: true
      });
    }
  }


  /* =======================================================
     GLOBAL EVENTS
     ======================================================= */

  function prepareGlobalEvents() {
    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize,
      { passive: true }
    );

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    window.addEventListener(
      "orientationchange",
      handleResize
    );
  }


  function handleScroll() {
    document.documentElement.style.setProperty(
      "--scroll-y",
      `${window.scrollY}px`
    );

    updateBackToTop();
  }


  function handleResize() {
    document.documentElement.style.setProperty(
      "--viewport-height",
      `${window.innerHeight}px`
    );

    /*
     * Prevent a mobile menu from remaining visually
     * locked after switching to desktop.
     */
    if (
      window.innerWidth > 900 &&
      state.mobileMenuOpen
    ) {
      closeMobileMenu();
    }
  }


  function handleHashChange() {
    const id =
      window.location.hash
        .replace("#", "")
        .trim();

    if (
      id &&
      document.getElementById(id)
    ) {
      navigateTo(id, {
        force: true
      });
    }
  }


  /* =======================================================
     EXTERNAL MODULE INTEGRATION
     ======================================================= */

  function prepareExternalModuleHooks() {
    /*
     * AI
     */
    emit("portfolio:ready", {
      sections: DOM.sections.map(
        (section) => ({
          id: section.id,
          title:
            section.dataset.title ||
            section.querySelector("h1,h2,h3")
              ?.textContent
              ?.trim() ||
            section.id
        })
      )
    });

    /*
     * Game
     */
    emit("portfolio:game-ready", {
      gameSection:
        document.getElementById("game")
    });

    /*
     * Effects
     */
    emit("portfolio:effects-ready", {
      sections: DOM.sections
    });
  }


  /* =======================================================
     EVENT BUS
     ======================================================= */

  function emit(eventName, detail = {}) {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail
      })
    );
  }


  /* =======================================================
     PUBLIC PORTFOLIO API
     ======================================================= */

  window.ShadidPortfolio = {
    version: "ASTRA-MYTHOS-CORE",

    state,

    navigateTo,

    next() {
      navigateRelative(1);
    },

    previous() {
      navigateRelative(-1);
    },

    openMenu() {
      toggleMobileMenu(true);
    },

    closeMenu() {
      closeMobileMenu();
    },

    toggleMenu() {
      toggleMobileMenu();
    },

    getCurrentSection() {
      return state.currentSection;
    },

    getSections() {
      return DOM.sections.map(
        (section) => ({
          id: section.id,
          element: section
        })
      );
    },

    emit,

    refresh() {
      /*
       * Useful after dynamically inserting content.
       */
      DOM.sections = [
        ...document.querySelectorAll(
          CONFIG.selectors.sections
        )
      ];

      DOM.navLinks = [
        ...document.querySelectorAll(
          CONFIG.selectors.navLinks
        )
      ];

      prepareSections();
      prepareNavigation();
      prepareCursorHoverStates();
      prepareScrollObserver();

      emit("portfolio:refresh");
    }
  };


  /* =======================================================
     START
     ======================================================= */

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
