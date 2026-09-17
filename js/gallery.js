/**
 * SHADID AHAMED PORTFOLIO
 * Gallery + Lightbox Controller
 *
 * Handles:
 * - Drawing portfolio
 * - Architectural graphics
 * - Architecture project galleries
 * - Lightbox
 * - Zoom
 * - Pan
 * - Previous / Next
 * - Fullscreen
 * - Keyboard controls
 * - Touch swipe
 * - Touch pinch zoom
 * - Dynamic gallery content
 *
 * No external gallery library required.
 */

const Gallery = (() => {
    "use strict";

    const CONFIG = {
        itemSelector: "[data-gallery-item]",
        gallerySelector: "[data-gallery]",
        lightboxSelector: "[data-lightbox]",
        imageSelector: "[data-gallery-image]",

        classes: {
            open: "is-open",
            zoomed: "is-zoomed",
            dragging: "is-dragging",
            hidden: "is-hidden"
        },

        zoom: {
            min: 1,
            max: 4,
            step: 0.25
        },

        swipe: {
            threshold: 60
        }
    };

    let initialized = false;

    let elements = {
        lightbox: null,
        lightboxImage: null,
        lightboxTitle: null,
        lightboxCounter: null,
        closeButton: null,
        previousButton: null,
        nextButton: null,
        zoomInButton: null,
        zoomOutButton: null,
        resetButton: null,
        fullscreenButton: null
    };

    let galleryItems = [];
    let currentIndex = 0;
    let currentZoom = 1;

    let pan = {
        x: 0,
        y: 0
    };

    let pointerState = {
        active: false,
        startX: 0,
        startY: 0,
        startPanX: 0,
        startPanY: 0
    };

    let touchState = {
        startX: 0,
        startY: 0,
        startTime: 0,

        pinchActive: false,
        initialDistance: 0,
        initialZoom: 1
    };

    /**
     * ----------------------------------------
     * INITIALIZATION
     * ----------------------------------------
     */

    function init() {
        if (initialized) return;

        cacheElements();
        collectItems();
        bindEvents();

        initialized = true;
    }

    /**
     * ----------------------------------------
     * CACHE ELEMENTS
     * ----------------------------------------
     */

    function cacheElements() {
        elements.lightbox =
            document.querySelector(
                CONFIG.lightboxSelector
            );

        if (!elements.lightbox) {
            createLightbox();
        }

        elements.lightbox =
            document.querySelector(
                CONFIG.lightboxSelector
            );

        if (!elements.lightbox) return;

        elements.lightboxImage =
            elements.lightbox.querySelector(
                "[data-lightbox-image]"
            );

        elements.lightboxTitle =
            elements.lightbox.querySelector(
                "[data-lightbox-title]"
            );

        elements.lightboxCounter =
            elements.lightbox.querySelector(
                "[data-lightbox-counter]"
            );

        elements.closeButton =
            elements.lightbox.querySelector(
                "[data-lightbox-close]"
            );

        elements.previousButton =
            elements.lightbox.querySelector(
                "[data-lightbox-prev]"
            );

        elements.nextButton =
            elements.lightbox.querySelector(
                "[data-lightbox-next]"
            );

        elements.zoomInButton =
            elements.lightbox.querySelector(
                "[data-lightbox-zoom-in]"
            );

        elements.zoomOutButton =
            elements.lightbox.querySelector(
                "[data-lightbox-zoom-out]"
            );

        elements.resetButton =
            elements.lightbox.querySelector(
                "[data-lightbox-reset]"
            );

        elements.fullscreenButton =
            elements.lightbox.querySelector(
                "[data-lightbox-fullscreen]"
            );
    }

    /**
     * ----------------------------------------
     * CREATE LIGHTBOX
     * ----------------------------------------
     */

    function createLightbox() {
        const wrapper =
            document.createElement("div");

        wrapper.className = "lightbox";

        wrapper.setAttribute(
            "data-lightbox",
            ""
        );

        wrapper.setAttribute(
            "aria-hidden",
            "true"
        );

        wrapper.innerHTML = `
            <div
                class="lightbox__backdrop"
                data-lightbox-close
            ></div>

            <div
                class="lightbox__dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
            >

                <div class="lightbox__topbar">

                    <div
                        class="lightbox__counter"
                        data-lightbox-counter
                    ></div>

                    <div
                        class="lightbox__title"
                        data-lightbox-title
                    ></div>

                    <button
                        type="button"
                        class="lightbox__button"
                        data-lightbox-close
                        aria-label="Close image viewer"
                    >
                        <span aria-hidden="true">
                            ×
                        </span>
                    </button>

                </div>

                <div class="lightbox__viewport">

                    <button
                        type="button"
                        class="lightbox__nav lightbox__nav--previous"
                        data-lightbox-prev
                        aria-label="Previous image"
                    >
                        ‹
                    </button>

                    <div
                        class="lightbox__image-container"
                        data-lightbox-image-container
                    >
                        <img
                            class="lightbox__image"
                            data-lightbox-image
                            alt=""
                            draggable="false"
                        >
                    </div>

                    <button
                        type="button"
                        class="lightbox__nav lightbox__nav--next"
                        data-lightbox-next
                        aria-label="Next image"
                    >
                        ›
                    </button>

                </div>

                <div class="lightbox__toolbar">

                    <button
                        type="button"
                        class="lightbox__button"
                        data-lightbox-zoom-out
                        aria-label="Zoom out"
                    >
                        −
                    </button>

                    <button
                        type="button"
                        class="lightbox__button"
                        data-lightbox-reset
                        aria-label="Reset zoom"
                    >
                        100%
                    </button>

                    <button
                        type="button"
                        class="lightbox__button"
                        data-lightbox-zoom-in
                        aria-label="Zoom in"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        class="lightbox__button"
                        data-lightbox-fullscreen
                        aria-label="Enter fullscreen"
                    >
                        ⛶
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(wrapper);
    }

    /**
     * ----------------------------------------
     * COLLECT GALLERY ITEMS
     * ----------------------------------------
     */

    function collectItems() {
        galleryItems = Array.from(
            document.querySelectorAll(
                CONFIG.itemSelector
            )
        );
    }

    /**
     * ----------------------------------------
     * EVENTS
     * ----------------------------------------
     */

    function bindEvents() {
        galleryItems.forEach(
            (item, index) => {
                item.addEventListener(
                    "click",
                    event => {
                        handleItemClick(
                            event,
                            index
                        );
                    }
                );

                item.addEventListener(
                    "keydown",
                    event => {
                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {
                            event.preventDefault();

                            open(index);
                        }
                    }
                );
            }
        );

        if (!elements.lightbox) return;

        elements.closeButton?.addEventListener(
            "click",
            close
        );

        elements.previousButton?.addEventListener(
            "click",
            previous
        );

        elements.nextButton?.addEventListener(
            "click",
            next
        );

        elements.zoomInButton?.addEventListener(
            "click",
            zoomIn
        );

        elements.zoomOutButton?.addEventListener(
            "click",
            zoomOut
        );

        elements.resetButton?.addEventListener(
            "click",
            resetZoom
        );

        elements.fullscreenButton?.addEventListener(
            "click",
            toggleFullscreen
        );

        elements.lightboxImage?.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        elements.lightboxImage?.addEventListener(
            "pointermove",
            handlePointerMove
        );

        elements.lightboxImage?.addEventListener(
            "pointerup",
            handlePointerUp
        );

        elements.lightboxImage?.addEventListener(
            "pointercancel",
            handlePointerUp
        );

        elements.lightboxImage?.addEventListener(
            "touchstart",
            handleTouchStart,
            { passive: false }
        );

        elements.lightboxImage?.addEventListener(
            "touchmove",
            handleTouchMove,
            { passive: false }
        );

        elements.lightboxImage?.addEventListener(
            "touchend",
            handleTouchEnd,
            { passive: false }
        );

        document.addEventListener(
            "keydown",
            handleKeyboard
        );
    }

    /**
     * ----------------------------------------
     * ITEM CLICK
     * ----------------------------------------
     */

    function handleItemClick(
        event,
        index
    ) {
        const interactive =
            event.target.closest(
                "a, button"
            );

        if (
            interactive &&
            interactive !== event.currentTarget
        ) {
            return;
        }

        event.preventDefault();

        open(index);
    }

    /**
     * ----------------------------------------
     * OPEN
     * ----------------------------------------
     */

    function open(index = 0) {
        if (
            !galleryItems.length ||
            !elements.lightbox
        ) {
            return;
        }

        currentIndex =
            clamp(
                index,
                0,
                galleryItems.length - 1
            );

        resetZoom();
        updateLightbox();

        elements.lightbox.classList.add(
            CONFIG.classes.open
        );

        elements.lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        /*
         * Prevent background page scrolling.
         */

        document.documentElement.style
            .scrollBehavior = "auto";

        elements.closeButton?.focus();

        document.dispatchEvent(
            new CustomEvent(
                "portfolio:gallery-open",
                {
                    detail: {
                        index: currentIndex,
                        item:
                            galleryItems[
                                currentIndex
                            ]
                    }
                }
            )
        );
    }

    /**
     * ----------------------------------------
     * CLOSE
     * ----------------------------------------
     */

    function close() {
        if (!elements.lightbox) return;

        elements.lightbox.classList.remove(
            CONFIG.classes.open
        );

        elements.lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

        resetZoom();

        document.dispatchEvent(
            new CustomEvent(
                "portfolio:gallery-close"
            )
        );
    }

    /**
     * ----------------------------------------
     * UPDATE LIGHTBOX
     * ----------------------------------------
     */

    function updateLightbox() {
        const item =
            galleryItems[currentIndex];

        if (!item) return;

        const image =
            getItemImage(item);

        const title =
            item.dataset.title ||
            item.getAttribute(
                "aria-label"
            ) ||
            image?.alt ||
            `Artwork ${currentIndex + 1}`;

        const source =
            item.dataset.src ||
            image?.currentSrc ||
            image?.src;

        const alt =
            item.dataset.alt ||
            image?.alt ||
            title;

        if (
            !elements.lightboxImage ||
            !source
        ) {
            return;
        }

        elements.lightboxImage.src =
            source;

        elements.lightboxImage.alt =
            alt;

        if (
            elements.lightboxTitle
        ) {
            elements.lightboxTitle.textContent =
                title;
        }

        if (
            elements.lightboxCounter
        ) {
            elements.lightboxCounter.textContent =
                `${currentIndex + 1} / ${galleryItems.length}`;
        }

        updateNavigationButtons();
    }

    /**
     * ----------------------------------------
     * GET IMAGE
     * ----------------------------------------
     */

    function getItemImage(item) {
        if (!item) return null;

        if (
            item.matches(
                "img"
            )
        ) {
            return item;
        }

        return item.querySelector(
            CONFIG.imageSelector
        ) ||
        item.querySelector(
            "img"
        );
    }

    /**
     * ----------------------------------------
     * NEXT
     * ----------------------------------------
     */

    function next() {
        if (!galleryItems.length) return;

        currentIndex =
            (currentIndex + 1) %
            galleryItems.length;

        resetZoom();
        updateLightbox();
    }

    /**
     * ----------------------------------------
     * PREVIOUS
     * ----------------------------------------
     */

    function previous() {
        if (!galleryItems.length) return;

        currentIndex =
            (
                currentIndex -
                1 +
                galleryItems.length
            ) %
            galleryItems.length;

        resetZoom();
        updateLightbox();
    }

    /**
     * ----------------------------------------
     * NAVIGATION BUTTONS
     * ----------------------------------------
     */

    function updateNavigationButtons() {
        /*
         * The gallery loops continuously,
         * therefore both controls remain usable.
         */

        elements.previousButton?.removeAttribute(
            "disabled"
        );

        elements.nextButton?.removeAttribute(
            "disabled"
        );
    }

    /**
     * ----------------------------------------
     * ZOOM
     * ----------------------------------------
     */

    function zoomIn() {
        setZoom(
            currentZoom +
            CONFIG.zoom.step
        );
    }

    function zoomOut() {
        setZoom(
            currentZoom -
            CONFIG.zoom.step
        );
    }

    function setZoom(value) {
        currentZoom =
            clamp(
                value,
                CONFIG.zoom.min,
                CONFIG.zoom.max
            );

        if (
            currentZoom ===
            CONFIG.zoom.min
        ) {
            pan.x = 0;
            pan.y = 0;
        }

        applyTransform();
        updateZoomButton();
    }

    function resetZoom() {
        currentZoom = 1;

        pan.x = 0;
        pan.y = 0;

        applyTransform();
        updateZoomButton();
    }

    function updateZoomButton() {
        if (
            elements.resetButton
        ) {
            elements.resetButton.textContent =
                `${Math.round(
                    currentZoom * 100
                )}%`;
        }

        elements.lightbox?.classList.toggle(
            CONFIG.classes.zoomed,
            currentZoom > 1
        );
    }

    /**
     * ----------------------------------------
     * TRANSFORM
     * ----------------------------------------
     */

    function applyTransform() {
        if (
            !elements.lightboxImage
        ) {
            return;
        }

        elements.lightboxImage.style.transform =
            `translate3d(
                ${pan.x}px,
                ${pan.y}px,
                0
            ) scale(${currentZoom})`;
    }

    /**
     * ----------------------------------------
     * POINTER PAN
     * ----------------------------------------
     */

    function handlePointerDown(event) {
        if (
            currentZoom <= 1
        ) {
            return;
        }

        pointerState.active = true;

        pointerState.startX =
            event.clientX;

        pointerState.startY =
            event.clientY;

        pointerState.startPanX =
            pan.x;

        pointerState.startPanY =
            pan.y;

        elements.lightboxImage?.setPointerCapture(
            event.pointerId
        );

        elements.lightboxImage?.classList.add(
            CONFIG.classes.dragging
        );
    }

    function handlePointerMove(event) {
        if (
            !pointerState.active
        ) {
            return;
        }

        const dx =
            event.clientX -
            pointerState.startX;

        const dy =
            event.clientY -
            pointerState.startY;

        pan.x =
            pointerState.startPanX +
            dx;

        pan.y =
            pointerState.startPanY +
            dy;

        applyTransform();
    }

    function handlePointerUp() {
        pointerState.active = false;

        elements.lightboxImage?.classList.remove(
            CONFIG.classes.dragging
        );
    }

    /**
     * ----------------------------------------
     * TOUCH SWIPE + PINCH
     * ----------------------------------------
     */

    function handleTouchStart(event) {
        if (!event.touches.length) return;

        if (
            event.touches.length === 1
        ) {
            const touch =
                event.touches[0];

            touchState.startX =
                touch.clientX;

            touchState.startY =
                touch.clientY;

            touchState.startTime =
                performance.now();

            return;
        }

        if (
            event.touches.length === 2
        ) {
            event.preventDefault();

            touchState.pinchActive =
                true;

            touchState.initialDistance =
                getTouchDistance(
                    event.touches[0],
                    event.touches[1]
                );

            touchState.initialZoom =
                currentZoom;
        }
    }

    function handleTouchMove(event) {
        if (
            event.touches.length !== 2 ||
            !touchState.pinchActive
        ) {
            return;
        }

        event.preventDefault();

        const distance =
            getTouchDistance(
                event.touches[0],
                event.touches[1]
            );

        if (
            touchState.initialDistance <= 0
        ) {
            return;
        }

        const ratio =
            distance /
            touchState.initialDistance;

        setZoom(
            touchState.initialZoom *
            ratio
        );
    }

    function handleTouchEnd(event) {
        if (
            touchState.pinchActive
        ) {
            touchState.pinchActive =
