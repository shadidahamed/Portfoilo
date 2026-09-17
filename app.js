/* =========================================================
   SHADID AHAMED PORTFOLIO APP
========================================================= */

class PortfolioApp {

    constructor() {

        this.sections = document.querySelectorAll(".page-section");
        this.navButtons = document.querySelectorAll("[data-section]");
        this.mobileMenuBtn = document.getElementById("mobileMenuBtn");
        this.mainNav = document.getElementById("mainNav");

        this.cursorDot = document.getElementById("cursor-dot");
        this.cursorRing = document.getElementById("cursor-ring");

        this.spaceCanvas = document.getElementById("spaceCanvas");

        this.projectModal = document.getElementById("projectModal");
        this.projectModalImage = document.getElementById("projectModalImage");
        this.projectModalCategory = document.getElementById("projectModalCategory");
        this.projectModalTitle = document.getElementById("projectModalTitle");
        this.projectModalDescription = document.getElementById("projectModalDescription");
        this.projectModalMeta = document.getElementById("projectModalMeta");
        this.projectModalGallery = document.getElementById("projectModalGallery");
        this.projectModalClose = document.getElementById("projectModalClose");

        this.lightbox = document.getElementById("lightbox");
        this.lightboxImage = document.getElementById("lightboxImage");
        this.lightboxStage = document.getElementById("lightboxStage");
        this.lightboxClose = document.getElementById("lightboxClose");
        this.zoomIn = document.getElementById("zoomIn");
        this.zoomOut = document.getElementById("zoomOut");

        this.lightboxScale = 1;

        this.galleryInstances = [];

        this.init();
    }


    init() {

        this.setupNavigation();
        this.setupMobileMenu();
        this.setupCursor();

        this.setupRevealObserver();

        this.setupImageFallbacks();

        this.renderDrawingGallery();
        this.renderArchitectureProjects();
        this.renderGraphics();

        this.setupProjectModal();
        this.setupLightbox();

        this.setupOrbitGalleries();

        this.setupSpace();

        this.registerServiceWorker();

        this.restoreSection();
    }


    /* =====================================================
       NAVIGATION
    ====================================================== */

    setupNavigation() {

        this.navButtons.forEach((button) => {

            button.addEventListener("click", () => {

                const target = button.dataset.section;

                if (!target) {
                    return;
                }

                this.showSection(target);

            });

        });

    }


    showSection(sectionName) {

        const target = document.getElementById(`section-${sectionName}`);

        if (!target) {
            return;
        }

        this.sections.forEach((section) => {
            section.classList.remove("active-section");
        });

        target.classList.add("active-section");

        this.navButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );

        });

        if (this.mainNav) {
            this.mainNav.classList.remove("open");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        localStorage.setItem(
            "shadid_active_section",
            sectionName
        );

        setTimeout(() => {
            this.revealCurrentSection();
        }, 60);

    }


    restoreSection() {

        const saved =
            localStorage.getItem("shadid_active_section");

        if (saved && document.getElementById(`section-${saved}`)) {
            this.showSection(saved);
        } else {
            this.showSection("home");
        }

    }


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    setupMobileMenu() {

        if (!this.mobileMenuBtn) {
            return;
        }

        this.mobileMenuBtn.addEventListener("click", () => {

            this.mainNav.classList.toggle("open");

            const icon =
                this.mobileMenuBtn.querySelector("i");

            if (this.mainNav.classList.contains("open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }

        });

    }


    /* =====================================================
       CURSOR
    ====================================================== */

    setupCursor() {

        if (!this.cursorDot || !this.cursorRing) {
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            this.cursorDot.style.left = `${mouseX}px`;
            this.cursorDot.style.top = `${mouseY}px`;

        });

        const animateCursor = () => {

            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;

            this.cursorRing.style.left = `${ringX}px`;
            this.cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursor);

        };

        animateCursor();

        document.addEventListener("mouseover", (event) => {

            const interactive =
                event.target.closest(
                    "button, a, input, .drawing-card, .architecture-project-card, .orbit-gallery, img"
                );

            document.body.classList.toggle(
                "cursor-hover",
                Boolean(interactive)
            );

        });

    }


    /* =====================================================
       REVEAL
    ====================================================== */

    setupRevealObserver() {

        this.revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                        }

                    });

                },
                {
                    threshold: 0.08
                }
            );

        document
            .querySelectorAll(".reveal")
            .forEach((element) => {

                this.revealObserver.observe(element);

            });

    }


    revealCurrentSection() {

        const current =
            document.querySelector(".active-section");

        if (!current) {
            return;
        }

        current
            .querySelectorAll(".reveal")
            .forEach((element) => {
                element.classList.add("visible");
            });

    }


    /* =====================================================
       IMAGE FALLBACKS
    ====================================================== */

    setupImageFallbacks() {

        document
            .querySelectorAll("img[data-fallback]")
            .forEach((image) => {

                image.addEventListener("error", () => {

                    image.removeAttribute("src");

                    image.classList.add("image-fallback");

                    const parent = image.parentElement;

                    if (parent) {

                        parent.classList.add("image-fallback");

                        parent.insertAdjacentHTML(
                            "beforeend",
                            `<span>IMAGE PLACEHOLDER<br>ADD YOUR IMAGE</span>`
                        );

                    }

                });

            });

    }


    /* =====================================================
       DRAWING GALLERY
    ====================================================== */

    renderDrawingGallery() {

        const grid =
            document.getElementById("drawingGrid");

        if (!grid) {
            return;
        }

        grid.innerHTML = "";

        PORTFOLIO_DATA.drawings.forEach((src, index) => {

            const card =
                document.createElement("div");

            card.className = "drawing-card";

            card.innerHTML = `
                <img
                    src="${src}"
                    alt="Drawing ${index + 1}"
                />
                <span>DRAWING ${String(index + 1).padStart(2, "0")}</span>
            `;

            const image = card.querySelector("img");

            image.addEventListener("error", () => {

                image.removeAttribute("src");
                image.classList.add("image-fallback");

                card.insertAdjacentHTML(
                    "beforeend",
                    `<span class="fallback-text">ADD IMAGE</span>`
                );

            });

            card.addEventListener("click", () => {

                this.openLightbox(
                    src,
                    `Drawing ${index + 1}`
                );

            });

            grid.appendChild(card);

        });

    }


    /* =====================================================
       ARCHITECTURE PROJECTS
    ====================================================== */

    renderArchitectureProjects() {

        const container =
            document.getElementById("architectureProjects");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        PORTFOLIO_DATA.architectureProjects
            .forEach((project, index) => {

                const card =
                    document.createElement("article");

                card.className =
                    "architecture-project-card reveal";

                card.dataset.projectId =
                    project.id;

                card.innerHTML = `
                    <div class="architecture-project-image">
                        <img
                            src="${project.image}"
                            alt="${project.title}"
                        />

                        <div class="architecture-project-overlay">
                            <span>
                                ${project.category}
                            </span>
                        </div>
                    </div>

                    <div class="architecture-project-copy">

                        <span class="eyebrow">
                            PROJECT ${String(index + 1).padStart(2, "0")}
                        </span>

                        <h3>${project.title}</h3>

                        <p>
                            ${project.description}
                        </p>

                        <div class="project-meta-tags">
                            ${project.meta.map(
                                tag => `<span>${tag}</span>`
                            ).join("")}
                        </div>

                        <span class="project-link">
                            Open project
                            <i class="fa-solid fa-arrow-right"></i>
                        </span>

                    </div>
                `;

                const image =
                    card.querySelector("img");

                image.addEventListener("error", () => {

                    image.removeAttribute("src");
                    image.classList.add("image-fallback");

                    const parent = image.parentElement;

                    parent.insertAdjacentHTML(
                        "beforeend",
                        `<span class="fallback-project-label">ADD PROJECT IMAGE</span>`
                    );

                });

                card.addEventListener("click", () => {

                    this.openProjectModal(
                        project.id
                    );

                });

                container.appendChild(card);

                this.revealObserver.observe(card);

            });

    }


    /* =====================================================
       PROJECT MODAL
    ====================================================== */

    setupProjectModal() {

        if (!this.projectModalClose) {
            return;
        }

        this.projectModalClose.addEventListener(
            "click",
            () => this.closeProjectModal()
        );

        const backdrop =
            this.projectModal.querySelector(
                ".project-modal-backdrop"
            );

        if (backdrop) {

            backdrop.addEventListener(
                "click",
                () => this.closeProjectModal()
            );

        }

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                this.closeProjectModal();
            }

        });

    }


    openProjectModal(projectId) {

        const project =
            PORTFOLIO_DATA.architectureProjects
                .find(item => item.id === projectId);

        if (!project) {
            return;
        }

        this.projectModalCategory.textContent =
            project.category;

        this.projectModalTitle.textContent =
            project.title;

        this.projectModalDescription.textContent =
            project.description;

        this.projectModalImage.src =
            project.image;

        this.projectModalImage.alt =
            project.title;

        this.projectModalMeta.innerHTML =
            project.meta.map(
                tag => `<span>${tag}</span>`
            ).join("");

        this.projectModalGallery.innerHTML =
            project.gallery
                .map(
                    image => `
                        <img
                            src="${image}"
                            alt="${project.title}"
                            data-lightbox="${image}"
                        />
                    `
                )
                .join("");

        this.projectModalGallery
            .querySelectorAll("img")
            .forEach((image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.removeAttribute("src");
                        image.classList.add("image-fallback");

                    }
                );

                image.addEventListener(
                    "click",
                    () => {

                        this.openLightbox(
                            image.dataset.lightbox,
                            project.title
                        );

                    }
                );

            });

        this.projectModal.classList.add("open");

        document.body.classList.add("modal-open");

    }


    closeProjectModal() {

        this.projectModal.classList.remove("open");

        document.body.classList.remove("modal-open");

    }


    /* =====================================================
       ORBIT GALLERIES
    ====================================================== */

    setupOrbitGalleries() {

        document
            .querySelectorAll(".orbit-gallery")
            .forEach((element) => {

                const rawImages =
                    element.dataset.images || "";

                const images =
                    rawImages
                        .split(",")
                        .map(item => item.trim())
                        .filter(Boolean);

                if (!images.length) {
                    return;
                }

                const interval =
                    Number(element.dataset.interval || 2000);

                this.createOrbitGallery(
                    element,
                    images,
                    interval
                );

            });

    }


    createOrbitGallery(
        container,
        images,
        interval
    ) {

        container.innerHTML = "";

        const track =
            document.createElement("div");

        track.className =
            "orbit-gallery-track";

        const cards = [];

        images.forEach((src, index) => {

            const card =
                document.createElement("div");

            card.className =
                "orbit-gallery-card";

            const image =
                document.createElement("img");

            image.src = src;
            image.alt = `Gallery image ${index + 1}`;

            image.addEventListener(
                "error",
                () => {

                    image.removeAttribute("src");
                    image.classList.add("image-fallback");

                }
            );

            card.appendChild(image);

            const caption =
                document.createElement("div");

            caption.className =
                "orbit-gallery-caption";

            caption.textContent =
                `${index + 1} / ${images.length}`;

            card.appendChild(caption);

            track.appendChild(card);

            cards.push(card);

        });

        container.appendChild(track);

        let currentIndex = 0;

        const render = () => {

            const count = images.length;

            cards.forEach((card, index) => {

                const relative =
                    (index - currentIndex + count) % count;

                const angle =
                    relative * (360 / count);

                const radius =
                    Math.min(
                        245,
                        Math.max(160, count * 38)
                    );

                const scale =
                    relative === 0 ? 1 : .74;

                const opacity =
                    relative === 0 ? 1 : .35;

                card.style.transform =
                    `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`;

                card.style.opacity =
                    opacity;

                card.style.zIndex =
                    relative === 0 ? 5 : 1;

            });

            track.style.transform =
                `rotateY(${-currentIndex * (360 / count)}deg)`;

        };

        render();

        const timer =
            setInterval(() => {

                currentIndex =
                    (currentIndex + 1) % images.length;

                render();

            }, interval);

        container.addEventListener(
            "click",
            () => {

                const image =
                    images[currentIndex];

                this.openLightbox(
                    image,
                    `Gallery ${currentIndex + 1}`
                );

            }
        );

        this.galleryInstances.push({
            container,
            timer
        });

    }


    /* =====================================================
       GRAPHICS
    ====================================================== */

    renderGraphics() {

        const wrapper =
            document.getElementById(
                "graphicsOrbitWrapper"
            );

        if (!wrapper) {
            return;
        }

        const images =
            PORTFOLIO_DATA.architectureGraphics;

        wrapper.innerHTML = `
            <div class="graphics-orbit">
                <div class="graphics-orbit-track"></div>
            </div>
        `;

        const track =
            wrapper.querySelector(
                ".graphics-orbit-track"
            );

        const slides = [];

        images.forEach((src, index) => {

            const slide =
                document.createElement("div");

            slide.className =
                "graphics-slide";

            slide.innerHTML = `
                <img
                    src="${src}"
                    alt="Architecture Graphic ${index + 1}"
                />

                <div class="graphics-index">
                    GRAPHICS ${String(index + 1).padStart(2, "0")}
                </div>
            `;

            const image =
                slide.querySelector("img");

            image.addEventListener(
                "error",
                () => {

                    image.removeAttribute("src");

                    image.classList.add(
                        "image-fallback"
                    );

                }
            );

            slide.addEventListener(
                "click",
                () => {

                    this.openLightbox(
                        src,
                        `Graphics ${index + 1}`
                    );

                }
            );

            track.appendChild(slide);
            slides.push(slide);

        });

        let currentIndex = 0;

        const render = () => {

            const count = slides.length;
            const angleStep = 360 / count;

            slides.forEach((slide, index) => {

                const relative =
                    (index - currentIndex + count) % count;

                const angle =
                    relative * angleStep;

                const z =
                    relative === 0
                        ? 220
                        : 20;

                const scale =
                    relative === 0
                        ? 1
                        : .7;

                const opacity =
                    relative === 0
                        ? 1
                        : .28;

                slide.style.transform =
                    `rotateY(${angle}deg) translateZ(${z}px) scale(${scale})`;

                slide.style.opacity =
                    opacity;

                slide.style.zIndex =
                    relative === 0
                        ? 10
                        : 1;

            });

            track.style.transform =
                `rotateY(${-currentIndex * angleStep}deg)`;

        };

        render();

        setInterval(() => {

            currentIndex =
                (currentIndex + 1) % slides.length;

            render();

        }, 2000);

    }


    /* =====================================================
       LIGHTBOX
    ====================================================== */

    setupLightbox() {

        this.lightboxClose.addEventListener(
            "click",
            () => this.closeLightbox()
        );

        this.zoomIn.addEventListener(
            "click",
            () => this.changeLightboxScale(.25)
        );

        this.zoomOut.addEventListener(
            "click",
            () => this.changeLightboxScale(-.25)
        );

        this.lightboxImage.addEventListener(
            "click",
            () => {

                if (this.lightboxScale <= 1) {
                    this.changeLightboxScale(.55);
                } else {
                    this.resetLightboxScale();
                }

            }
        );

        this.lightboxStage.addEventListener(
            "wheel",
            (event) => {

                event.preventDefault();

                if (event.deltaY < 0) {
                    this.changeLightboxScale(.12);
                } else {
                    this.changeLightboxScale(-.12);
                }

            },
            {
                passive: false
            }
        );

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    this.closeLightbox();
                }

            }
        );

    }


    openLightbox(
        src,
        alt = "Image"
    ) {

        if (!src) {
            return;
        }

        this.lightboxImage.src = src;
        this.lightboxImage.alt = alt;

        this.resetLightboxScale();

        this.lightbox.classList.add("open");

    }


    closeLightbox() {

        this.lightbox.classList.remove("open");

    }


    changeLightboxScale(amount) {

        this.lightboxScale =
            Math.min(
                3.2,
                Math.max(
                    1,
                    this.lightboxScale + amount
                )
            );

        this.lightboxImage.style.transform =
            `scale(${this.lightboxScale})`;

    }


    resetLightboxScale() {

        this.lightboxScale = 1;

        this.lightboxImage.style.transform =
            "scale(1)";

    }


    /* =====================================================
       SPACE / GALAXY
    ====================================================== */

    setupSpace() {

        if (!this.spaceCanvas) {
            return;
        }

        const canvas =
            this.spaceCanvas;

        const ctx =
            canvas.getContext("2d");

        let width = 0;
        let height = 0;
        let dpr = 1;

        const stars = [];
        const starCount =
            Math.min(
                220,
                Math.max(
                    90,
                    Math.floor(
                        window.innerWidth / 7
                    )
                )
            );

        const resize = () => {

            dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            width =
                window.innerWidth;

            height =
                window.innerHeight;

            canvas.width =
                width * dpr;

            canvas.height =
                height * dpr;

            canvas.style.width =
                `${width}px`;

            canvas.style.height =
                `${height}px`;

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

        };

        resize();

        window.addEventListener(
            "resize",
            resize
        );

        for (let i = 0; i < starCount; i++) {

            stars.push({
                x:
                    Math.random() * width,

                y:
                    Math.random() * height,

                z:
                    Math.random(),

                r:
                    Math.random() * 1.4 + .25,

                drift:
                    (Math.random() - .5) * .18,

                twinkle:
                    Math.random() * Math.PI * 2
            });

        }

        let time = 0;

        const draw = () => {

            time += .005;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            /* subtle galaxy core */

            const centerX =
                width * .53;

            const centerY =
                height * .47;

            const gradient =
                ctx.createRadialGradient(
                    centerX,
                    centerY,
                    20,
                    centerX,
                    centerY,
                    Math.max(width, height) * .45
                );

            gradient.addColorStop(
                0,
                "rgba(246,196,83,.05)"
            );

            gradient.addColorStop(
                .35,
                "rgba(246,196,83,.018)"
            );

            gradient.addColorStop(
                1,
                "rgba(0,0,0,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            stars.forEach((star) => {

                star.x += star.drift;

                if (star.x < -5) {
                    star.x = width + 5;
                }

                if (star.x > width + 5) {
                    star.x = -5;
                }

                const twinkle =
                    .62 +
                    Math.sin(
                        time * 1.8 +
                        star.twinkle
                    ) * .2;

                ctx.beginPath();

                ctx.fillStyle =
                    `rgba(246,196,83,${Math.max(.08, star.z * twinkle)})`;

                ctx.arc(
                    star.x,
                    star.y,
                    star.r * (.55 + star.z),
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            });

            requestAnimationFrame(draw);

        };

        draw();

    }


    /* =====================================================
       SERVICE WORKER
    ====================================================== */

    registerServiceWorker() {

        if (
            "serviceWorker" in navigator
        ) {

            window.addEventListener(
                "load",
                () => {

                    navigator.serviceWorker
                        .register("./sw.js")
                        .catch(() => {
                            /* silent fallback */
                        });

                }
            );

        }

    }

}


/* =========================================================
   APP START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.portfolioApp =
            new PortfolioApp();

    }
);
