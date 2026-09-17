/**
 * SHADID AHAMED PORTFOLIO
 * Navigation Controller
 *
 * Responsibilities:
 * - Section navigation
 * - Active navigation state
 * - Mobile navigation
 * - Hash-based routing
 * - Browser back/forward support
 * - Smooth scrolling
 * - Navigation command support for the AI system
 *
 * No global variables are created.
 */

const Navigation = (() => {
    "use strict";

    const CONFIG = {
        sectionSelector: "[data-section]",
        navLinkSelector: "[data-nav]",
        menuToggleSelector: "[data-menu-toggle]",
        mobileMenuSelector: "[data-mobile-menu]",
        overlaySelector: "[data-menu-overlay]",
        headerSelector: "[data-header]",
        activeClass: "is-active",
        openClass: "is-open",
        offset: 80,
        defaultSection: "home"
    };

    let initialized = false;
    let elements = {
        sections: [],
        navLinks: [],
        menuToggle: null,
        mobileMenu: null,
        overlay: null,
        header: null
    };

    let currentSection = CONFIG.defaultSection;

    /**
     * ----------------------------------------
     * INITIALIZATION
     * ----------------------------------------
     */

    function init() {
        if (initialized) return;

        cacheElements();
        bindEvents();

        const initialSection = getInitialSection();

        navigate(initialSection, {
            updateHash: false,
            smooth: false,
            closeMenu: false
        });

        initialized = true;
    }

    /**
     * ----------------------------------------
     * CACHE DOM
     * ----------------------------------------
     */

    function cacheElements() {
        elements.sections = Array.from(
            document.querySelectorAll(CONFIG.sectionSelector)
        );

        elements.navLinks = Array.from(
            document.querySelectorAll(CONFIG.navLinkSelector)
        );

        elements.menuToggle = document.querySelector(
            CONFIG.menuToggleSelector
        );

        elements.mobileMenu = document.querySelector(
            CONFIG.mobileMenuSelector
        );

        elements.overlay = document.querySelector(
            CONFIG.overlaySelector
        );

        elements.header = document.querySelector(
            CONFIG.headerSelector
        );
    }

    /**
     * ----------------------------------------
     * EVENTS
     * ----------------------------------------
     */

    function bindEvents() {
        elements.navLinks.forEach(link => {
            link.addEventListener("click", handleNavClick);
        });

        if (elements.menuToggle) {
            elements.menuToggle.addEventListener(
                "click",
                toggleMobileMenu
            );
        }

        if (elements.overlay) {
            elements.overlay.addEventListener(
                "click",
                closeMobileMenu
            );
        }

        window.addEventListener(
            "hashchange",
            handleHashChange
        );

        window.addEventListener(
            "popstate",
            handlePopState
        );

        document.addEventListener(
            "keydown",
            handleKeyboard
        );

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
    }

    /**
     * ----------------------------------------
     * NAVIGATION CLICK
     * ----------------------------------------
     */

    function handleNavClick(event) {
        const link = event.currentTarget;

        const target =
            link.getAttribute("data-nav") ||
            link.getAttribute("href");

        if (!target) return;

        const sectionId = normalizeSectionId(target);

        if (!sectionId) return;

        event.preventDefault();

        navigate(sectionId, {
            updateHash: true,
            smooth: true,
            closeMenu: true
        });
    }

    /**
     * ----------------------------------------
     * NAVIGATE
     * ----------------------------------------
     */

    function navigate(
        sectionId,
        options = {}
    ) {
        const {
            updateHash = true,
            smooth = true,
            closeMenu = true,
            replace = false
        } = options;

        const normalizedId =
            normalizeSectionId(sectionId);

        if (!normalizedId) return false;

        const target =
            document.getElementById(normalizedId);

        if (!target) {
            console.warn(
                `[Navigation] Section "${normalizedId}" not found.`
            );

            return false;
        }

        currentSection = normalizedId;

        updateActiveNavigation(normalizedId);
        updateSectionState(normalizedId);

        if (updateHash) {
            updateURL(normalizedId, replace);
        }

        scrollToSection(target, smooth);

        if (closeMenu) {
            closeMobileMenu();
        }

        document.dispatchEvent(
            new CustomEvent("portfolio:navigate", {
                detail: {
                    section: normalizedId
                }
            })
        );

        return true;
    }

    /**
     * ----------------------------------------
     * URL / HASH
     * ----------------------------------------
     */

    function updateURL(sectionId, replace = false) {
        const newHash = `#${sectionId}`;

        if (window.location.hash === newHash) {
            return;
        }

        if (replace) {
            history.replaceState(
                { section: sectionId },
                "",
                newHash
            );
        } else {
            history.pushState(
                { section: sectionId },
                "",
                newHash
            );
        }
    }

    function getInitialSection() {
        const hash =
            window.location.hash.replace("#", "");

        if (
            hash &&
            document.getElementById(hash)
        ) {
            return hash;
        }

        return CONFIG.defaultSection;
    }

    function handleHashChange() {
        const sectionId =
            window.location.hash.replace("#", "");

        if (!sectionId) {
            navigate(CONFIG.defaultSection, {
                updateHash: false,
                smooth: true,
                closeMenu: true
            });

            return;
        }

        navigate(sectionId, {
            updateHash: false,
            smooth: true,
            closeMenu: true
        });
    }

    function handlePopState(event) {
        const stateSection =
            event.state?.section;

        const hashSection =
            window.location.hash.replace("#", "");

        const section =
            stateSection ||
            hashSection ||
            CONFIG.defaultSection;

        navigate(section, {
            updateHash: false,
            smooth: true,
            closeMenu: true
        });
    }

    /**
     * ----------------------------------------
     * SECTION SCROLL
     * ----------------------------------------
     */

    function scrollToSection(
        target,
        smooth = true
    ) {
        if (!target) return;

        const headerHeight =
            elements.header
                ? elements.header.offsetHeight
                : CONFIG.offset;

        const rect =
            target.getBoundingClientRect();

        const absoluteTop =
            window.scrollY +
            rect.top -
            headerHeight;

        window.scrollTo({
            top: Math.max(0, absoluteTop),
            behavior: smooth
                ? getScrollBehavior()
                : "auto"
        });
    }

    function getScrollBehavior() {
        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return "auto";
        }

        return "smooth";
    }

    /**
     * ----------------------------------------
     * ACTIVE NAVIGATION
     * ----------------------------------------
     */

    function updateActiveNavigation(
        sectionId
    ) {
        elements.navLinks.forEach(link => {
            const linkTarget =
                normalizeSectionId(
                    link.getAttribute("data-nav") ||
                    link.getAttribute("href") ||
                    ""
                );

            const isActive =
                linkTarget === sectionId;

            link.classList.toggle(
                CONFIG.activeClass,
                isActive
            );

            link.setAttribute(
                "aria-current",
                isActive
                    ? "page"
                    : "false"
            );
        });
    }

    /**
     * ----------------------------------------
     * SECTION STATE
     * ----------------------------------------
     */

    function updateSectionState(
        activeId
    ) {
        elements.sections.forEach(section => {
            const isActive =
                section.id === activeId;

            section.classList.toggle(
                CONFIG.activeClass,
                isActive
            );

            section.setAttribute(
                "aria-hidden",
                isActive
                    ? "false"
                    : "false"
            );
        });
    }

    /**
     * ----------------------------------------
     * MOBILE MENU
     * ----------------------------------------
     */

    function toggleMobileMenu() {
        if (!elements.mobileMenu) return;

        const isOpen =
            elements.mobileMenu.classList.contains(
                CONFIG.openClass
            );

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        if (!elements.mobileMenu) return;

        elements.mobileMenu.classList.add(
            CONFIG.openClass
        );

        elements.mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        if (elements.menuToggle) {
            elements.menuToggle.classList.add(
                CONFIG.openClass
            );

            elements.menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        if (elements.overlay) {
            elements.overlay.classList.add(
                CONFIG.openClass
            );
        }

        document.body.classList.add(
            "menu-open"
        );

        document.dispatchEvent(
            new CustomEvent(
                "portfolio:menu-open"
            )
        );
    }

    function closeMobileMenu() {
        if (!elements.mobileMenu) return;

        elements.mobileMenu.classList.remove(
            CONFIG.openClass
        );

        elements.mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        if (elements.menuToggle) {
            elements.menuToggle.classList.remove(
                CONFIG.openClass
            );

            elements.menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (elements.overlay) {
            elements.overlay.classList.remove(
                CONFIG.openClass
            );
        }

        document.body.classList.remove(
            "menu-open"
        );

        document.dispatchEvent(
            new CustomEvent(
                "portfolio:menu-close"
            )
        );
    }

    /**
     * ----------------------------------------
     * KEYBOARD
     * ----------------------------------------
     */

    function handleKeyboard(event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    }

    /**
     * ----------------------------------------
     * SCROLL STATE
     * ----------------------------------------
     */

    let scrollTicking = false;

    function handleScroll() {
        if (scrollTicking) return;

        scrollTicking = true;

        window.requestAnimationFrame(() => {
            updateHeaderState();
            detectVisibleSection();

            scrollTicking = false;
        });
    }

    function updateHeaderState() {
        if (!elements.header) return;

        const scrolled =
            window.scrollY > 30;

        elements.header.classList.toggle(
            "is-scrolled",
            scrolled
        );
    }

    /**
     * Detect the section currently occupying
     * the viewport.
     */

    function detectVisibleSection() {
        if (!elements.sections.length) return;

        const viewportPoint =
            window.innerHeight * 0.35;

        let visibleSection = null;

        for (const section of elements.sections) {
            const rect =
                section.getBoundingClientRect();

            if (
                rect.top <= viewportPoint &&
                rect.bottom >= viewportPoint
            ) {
                visibleSection = section;
                break;
            }
        }

        if (
            visibleSection &&
            visibleSection.id !== currentSection
        ) {
            currentSection =
                visibleSection.id;

            updateActiveNavigation(
                currentSection
            );
        }
    }

    /**
     * ----------------------------------------
     * RESIZE
     * ----------------------------------------
     */

    function handleResize() {
        if (
            window.innerWidth > 900
        ) {
            closeMobileMenu();
        }
    }

    /**
     * ----------------------------------------
     * NORMALIZATION
     * ----------------------------------------
     */

    function normalizeSectionId(
        value
    ) {
        if (!value) return null;

        let normalized =
            String(value).trim();

        if (
            normalized.startsWith("#")
        ) {
            normalized =
                normalized.substring(1);
        }

        if (
            normalized.startsWith("/")
        ) {
            normalized =
                normalized.substring(1);
        }

        normalized =
            normalized
                .split("?")[0]
                .split("&")[0]
                .trim()
                .toLowerCase();

        /*
         * Allow AI/navigation commands such as:
         * "go to profile"
         * "open projects"
         * "contact"
         */

        const aliases = {
            home: "home",
            start: "home",
            landing: "home",

            about: "profile",
            me: "profile",
            profile: "profile",

            education: "education",
            academic: "education",
            academics: "education",

            skill: "skills",
            skills: "skills",

            project: "projects",
            projects: "projects",
            portfolio: "projects",

            video: "videos",
            videos: "videos",

            content: "content",
            social: "content",

            contact: "contact",
            contacts: "contact",

            cv: "cv",
            resume: "cv"
        };

        return aliases[normalized] ||
            normalized;
    }

    /**
     * ----------------------------------------
     * PUBLIC API
     * ----------------------------------------
     */

    return Object.freeze({
        init,

        navigate,

        openMenu: openMobileMenu,

        closeMenu: closeMobileMenu,

        toggleMenu: toggleMobileMenu,

        getCurrentSection() {
            return currentSection;
        },

        getSections() {
            return elements.sections.map(
                section => section.id
            );
        }
    });
})();

/**
 * Initialize after DOM is ready.
 */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        Navigation.init,
        { once: true }
    );
} else {
    Navigation.init();
}

/**
 * Make the navigation controller available
 * to other ES modules without polluting
 * the global window object unnecessarily.
 */
export default Navigation;
