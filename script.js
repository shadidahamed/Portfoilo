"use strict";

/* =========================================================
   PORTFOLIO DATA
========================================================= */

window.PORTFOLIO_DATA = {

    person: {
        name: "Shadid Ahamed",

        roleNumber: "1000061008",

        academicSession: "Summer 2026",

        university: "BRAC University",

        universityDepartment:
            "Architecture",

        currentDirection:
            "Currently studying in Architecture and working toward a transition into Computer Science & Engineering (CSE).",

        expectedGraduation:
            "Expected passing year: 2032",

        currentCourse:
            "ARC 101 — Design Studio",

        location:
            "Paltan, Dhaka, Bangladesh"
    },

    biography: {
        short:
            "A multidisciplinary learner working across architecture, art, digital design and frontend development.",

        long:
            "Shadid Ahamed is someone who kept building despite academic pressure, disappointment, financial pressure, relationships, personal loss and uncertainty. He worked toward architecture, practiced drawing, built portfolios, experimented with web projects, designed physical objects, learned new technologies and kept looking for another door whenever one closed.",

        tribute:
            "Behind every drawing was patience, behind every plan was hope, behind every attempt was effort, and behind every 'I'll try again' was someone who had already been through a lot."
    },

    family: {
        father: {
            name: "Tofayel Ahmed",
            role: "Police Inspector",
            description:
                "A disciplined and duty-oriented father whose approach to family has often involved responsibility, security, rules and concern for the future."
        },

        mother: {
            name: "Mother",
            role: "Homemaker",
            description:
                "A homemaker whose presence has been a central part of Shadid's home life, care and emotional world."
        },

        wife: {
            name: "Wife",
            role: "Life partner",
            description:
                "A chosen life partner connected to Shadid's hopes around love, responsibility, education, financial pressure and building a future together."
        },

        sister: {
            name: "Younger Sister",
            role: "Sibling",
            description:
                "A childhood and family connection shaped by the normal mix of affection, arguments, humour, distance and support."
        },

        nasir: {
            name: "Nasir",
            role: "Important family connection",
            description:
                "A person whose name has appeared within the wider family story and relationships shared over time."
        }
    },

    education: [

        {
            type: "school",

            label: "SCHOOL",

            title:
                "Motijheel Ideal School & College",

            period:
                "2013 — 2023",

            location:
                "Motijheel, Dhaka, Bangladesh",

            mapUrl:
                "https://www.google.com/maps/search/?api=1&query=Motijheel%20Ideal%20School%20and%20College%2C%20Dhaka%2C%20Bangladesh",

            description:
                "Studied from Class 1 through Class 10 and completed SSC from Motijheel Ideal School & College with a science background.",

            facts: [
                ["LEVEL", "Class 1 — 10"],
                ["STREAM", "Science"],
                ["SSC", "Completed"],
                ["RESULT", "GPA 5.00 / Golden A+"]
            ],

            images: [
                "./image/school/school-01.jpg",
                "./image/school/school-02.jpg",
                "./image/school/school-03.jpg",
                "./image/IMG scetch 1.jpg"
            ]
        },

        {
            type: "college",

            label: "COLLEGE",

            title:
                "Notre Dame College",

            period:
                "2023 — 2025",

            location:
                "Motijheel, Dhaka, Bangladesh",

            description:
                "Joined Notre Dame College in 2023 and completed HSC in 2025 as a science student.",

            facts: [
                ["BATCH", "2025"],
                ["GROUP", "Group 1"],
                ["COLLEGE ROLL", "125019"],
                ["RESULT", "GPA 5.00 / Golden A+"]
            ],

            images: [
                "./image/college/college-01.jpg",
                "./image/college/college-02.jpg",
                "./image/college/college-03.jpg",
                "./image/college/college-04.jpg"
            ]
        },

        {
            type: "university",

            label: "UNIVERSITY",

            title:
                "BRAC University",

            period:
                "Started 2026",

            location:
                "Dhaka, Bangladesh",

            description:
                "Currently studying at BRAC University. Started in Architecture and is now working toward a transition into Computer Science & Engineering.",

            facts: [
                ["CURRENT DEPARTMENT", "Architecture"],
                ["CURRENT SEMESTER", "First Semester"],
                ["ROLE", "1000061008"],
                ["EXPECTED PASSING YEAR", "2032"]
            ],

            images: [
                "./image/university/university-01.jpg",
                "./image/university/university-02.jpg",
                "./image/university/university-03.jpg",
                "./image/university/university-04.jpg"
            ]
        }

    ],

    drawings: [
        "./image/IMG scetch 1.jpg",
        "./image/image sketch 1.jpg",
        "./image/image sketch 2.jpg",
        "./image/image ipad 1.png",
        "./image/image colour 1.jpg",
        "./image/image pc 1.png",
        "./image/image sketch 3.jpg",

        "./image/drawings/drawing-08.jpg",
        "./image/drawings/drawing-09.jpg",
        "./image/drawings/drawing-10.jpg",
        "./image/drawings/drawing-11.jpg",
        "./image/drawings/drawing-12.jpg",
        "./image/drawings/drawing-13.jpg",
        "./image/drawings/drawing-14.jpg",
        "./image/drawings/drawing-15.jpg",
        "./image/drawings/drawing-16.jpg",
        "./image/drawings/drawing-17.jpg",
        "./image/drawings/drawing-18.jpg",
        "./image/drawings/drawing-19.jpg",
        "./image/drawings/drawing-20.jpg"
    ],

    achievements: [

        {
            icon: "fa-palette",

            title:
                "Bangladesh Shishu Academy",

            description:
                "Recognized through the Bangladesh Shishu Academy drawing competition pathway, including first-place achievement.",

            badge:
                "DRAWING"
        },

        {
            icon: "fa-ranking-star",

            title:
                "Bangladesh Children's Drawing Competition — 2023",

            description:
                "1st position at Thana level, 1st position at District level and 2nd position at Division level.",

            badge:
                "2023 — ART COMPETITION"
        },

        {
            icon: "fa-person-running",

            title:
                "5 KM Running",

            description:
                "Runner-up in a 5-kilometre running event.",

            badge:
                "PHYSICAL FITNESS",

            image:
                "./image/achievements/5km-medal.jpg"
        },

        {
            icon: "fa-school",

            title:
                "Notre Dame College",

            description:
                "Notre Dame College academic journey, including HSC 2025 achievement.",

            badge:
                "COLLEGE",

            image:
                "./image/achievements/ndc-crest.jpg"
        },

        {
            icon: "fa-award",

            title:
                "SSC GPA 5 Recognition",

            description:
                "Recognition received for achieving GPA 5.00 in SSC.",

            badge:
                "SSC",

            image:
                "./image/achievements/ssc-crest.jpg"
        },

        {
            icon: "fa-award",

            title:
                "HSC GPA 5 Recognition",

            description:
                "Recognition received for achieving GPA 5.00 in HSC.",

            badge:
                "HSC",

            image:
                "./image/achievements/hsc-crest.jpg"
        },

        {
            icon: "fa-table-tennis-paddle-ball",

            title:
                "Police Badminton Club — Referee",

            description:
                "Served as a badminton referee and received recognition for the role.",

            badge:
                "SPORTS",
            image:
                "./image/achievements/badminton-medal.jpg"
        },

        {
            icon: "fa-certificate",

            title:
                "Certificates",

            description:
                "Selected certificates are intended to be presented in a viewer-only mode.",

            badge:
                "VIEW CERTIFICATES",

            certificate:
                "YOUR_GOOGLE_DRIVE_CERTIFICATE_VIEWER_LINK"
        }

    ],

    digitalProjects: [

        {
            number: "DIGITAL 01",

            title:
                "Portfolio Website",

            description:
                "A high-contrast, interactive portfolio combining architecture, drawing, digital work, navigation, AI assistance and 3D visual background systems.",

            link:
                "https://shadidahamed.github.io/",

            action:
                "Visit Portfolio"
        },

        {
            number: "DIGITAL 02",

            title:
                "TrendCart",

            description:
                "E-commerce and affiliate-style web project with a focus on modern interface design and digital shopping flow.",

            link:
                "https://shadidahamed.github.io/trendcart/",

            action:
                "Open TrendCart"
        },

        {
            number: "DIGITAL 03",

            title:
                "Office Engine",

            description:
                "A browser-based experimental game and 3D interaction project built around HTML, CSS and JavaScript.",

            link:
                "https://shadidahamed.github.io/Shadid-s-game/",

            action:
                "Play the Game"
        }

    ],

    architectureProjects: [

        {
            name:
                "Lorry Lift",

            category:
                "FORM + MODEL STUDY",

            description:
                "A physical form study involving structural exploration and a Plaster of Paris version.",

            images: [
                "./image/architecture/lorry-lift-01.jpg",
                "./image/architecture/lorry-lift-plaster.jpg"
            ]
        },

        {
            name:
                "Squares & Grid",

            category:
                "GRID STUDY",

            description:
                "A geometry and composition study based on squares, repetition and structured grid relationships.",

            images: [
                "./image/architecture/squares-grid.jpg"
            ]
        },

        {
            name:
                "Line Signature + 3D Form",

            category:
                "GRAPHICAL EXPLORATION",

            description:
                "Black-and-white line work and three-dimensional form studies presented as a combined visual sequence.",

            images: [
                "./image/architecture/line-signature-01.jpg",
                "./image/architecture/line-signature-02.jpg",
                "./image/architecture/line-signature-03.jpg"
            ]
        },

        {
            name:
                "Interlock",

            category:
                "FORM STUDY",

            description:
                "Interlocking form exploration presented through top, side and axonometric views.",

            images: [
                "./image/architecture/interlock-top.jpg",
                "./image/architecture/interlock-axonometric.jpg",
                "./image/architecture/interlock-side.jpg"
            ]
        },

        {
            name:
                "Pavilion",

            category:
                "FINAL ARCHITECTURE PROJECT",

            description:
                "A pavilion project developed as a final architectural exploration with both physical work and recorded presentation material.",

            images: [
                "./image/architecture/pavilion.jpg"
            ],

            video:
                "YOUR_PAVILION_VIDEO_LINK"
        },

        {
            name:
                "Section Cutouts",

            category:
                "SECTION + CUTOUT STUDY",

            description:
                "A prism-based study involving grid development and extraction of section cutout forms.",

            images: [
                "./image/architecture/section-cutouts.jpg"
            ]
        },

        {
            name:
                "Mosque Study",

            category:
                "ARCHITECTURAL SITE / MODEL WORK",

            description:
                "A mosque-related collaborative architectural activity documented through working-process images.",

            images: [
                "./image/architecture/mosque-01.jpg",
                "./image/architecture/mosque-02.jpg"
            ]
        }

    ],

    graphics: Array.from(
        { length: 18 },
        (_, index) => {

            const number =
                String(index + 1).padStart(2, "0");

            return {

                name:
                    `Graphics ${number}`,

                images: [
                    `./image/graphics/graphics-${number}-01.jpg`,
                    `./image/graphics/graphics-${number}-02.jpg`,
                    `./image/graphics/graphics-${number}-03.jpg`,
                    `./image/graphics/graphics-${number}-04.jpg`
                ]
            };
        }
    ),

    videos: [

        {
            title:
                "Modifiers — English",

            description:
                "English lesson / educational content.",

            youtube:
                "MCj4pNiJR_Q",

            link:
                "https://youtu.be/MCj4pNiJR_Q?si=pOBr9xrs4MTIZYPS"
        },

        {
            title:
                "Connectors — English",

            description:
                "English lesson / educational content.",

            youtube:
                "K29JNurQr9c",

            link:
                "https://youtu.be/K29JNurQr9c?si=WhIaSmjzuS6xFA1I"
        },

        {
            title:
                "Subject-Verb Agreement",

            description:
                "English lesson / educational content.",

            youtube:
                "0ba53jWZy5o",

            link:
                "https://youtu.be/0ba53jWZy5o?si=CoT3J1wrEhQz7OPg"
        }

    ],

    contacts: [

        {
            label: "Email",
            icon: "fa-envelope",
            link: "mailto:shadidahamed.matashome05m@gmail.com"
        },

        {
            label: "GitHub",
            icon: "fa-github",
            link: "https://github.com/shadidahamed"
        },

        {
            label: "LinkedIn",
            icon: "fa-linkedin",
            link: "https://www.linkedin.com/in/shadid-ahamed-41a0703b2/"
        },

        {
            label: "Instagram",
            icon: "fa-instagram",
            link: "https://www.instagram.com/shade_ed25"
        },

        {
            label: "Facebook",
            icon: "fa-facebook",
            link: "https://www.facebook.com/share/1C2KcQfwvn/"
        },

        {
            label: "WhatsApp",
            icon: "fa-whatsapp",
            link: "https://wa.me/8801326162684"
        },

        {
            label: "X",
            icon: "fa-x-twitter",
            link: "https://x.com/ShadidAhamed"
        },

        {
            label: "Pinterest",
            icon: "fa-pinterest",
            link: "https://pin.it/4Z5y34R2T"
        },

        {
            label: "Reddit",
            icon: "fa-reddit",
            link: "https://www.reddit.com/user/Shade_ed25"
        },

        {
            label: "Tumblr",
            icon: "fa-tumblr",
            link: "https://www.tumblr.com/"
        }

    ]

};

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

/* =========================================================
   SAFE IMAGE FALLBACK
========================================================= */

function createFallbackSvg(text = "IMAGE") {

    const safeText =
        String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .slice(0, 26);

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1200"
            height="800"
            viewBox="0 0 1200 800"
        >
            <defs>
                <radialGradient id="g" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stop-color="#191919"/>
                    <stop offset="100%" stop-color="#050505"/>
                </radialGradient>
            </defs>

            <rect width="1200" height="800" fill="url(#g)"/>

            <circle
                cx="600"
                cy="400"
                r="170"
                fill="none"
                stroke="#f5c85b"
                stroke-opacity=".22"
                stroke-width="2"
            />

            <circle
                cx="600"
                cy="400"
                r="4"
                fill="#f5c85b"
            />

            <text
                x="600"
                y="470"
                text-anchor="middle"
                fill="#f5c85b"
                font-family="Arial, sans-serif"
                font-size="26"
                letter-spacing="5"
            >
                ${safeText}
            </text>
        </svg>
    `;

    return `
        data:image/svg+xml;charset=UTF-8,
        ${encodeURIComponent(svg)}
    `.replace(/\n/g, "");
}

function bindImageFallback(img) {

    if (!img) return;

    img.addEventListener(
        "error",
        function handleError() {

            if (img.dataset.fallbackApplied === "true") {
                return;
            }

            img.dataset.fallbackApplied = "true";

            img.src =
                createFallbackSvg(
                    img.dataset.fallback ||
                    img.alt ||
                    "IMAGE"
                );
        }
    );
}

function bindAllImageFallbacks() {

    $$("img").forEach(bindImageFallback);

}

/* =========================================================
   NAVIGATION
========================================================= */

const sections =
    $$(".page-section");

const navButtons =
    $$("[data-section]");

function activateSection(sectionId, updateHash = true) {

    const target =
        document.getElementById(sectionId);

    if (!target) return;

    sections.forEach(section => {

        section.classList.toggle(
            "active-section",
            section.id === sectionId
        );

    });

    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionId
        );

    });

    if (updateHash) {

        history.replaceState(
            null,
            "",
            `#${sectionId}`
        );

    }

    document.title =
        sectionId === "home"
            ? "Shadid Ahamed — Portfolio"
            : `${sectionId.charAt(0).toUpperCase()}${sectionId.slice(1)} — Shadid Ahamed`;

    window.dispatchEvent(
        new CustomEvent(
            "portfolio:sectionchange",
            {
                detail: {
                    section: sectionId
                }
            }
        )
    );
}

navButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const section =
                button.dataset.section;

            activateSection(section);

        }
    );

});

function loadInitialSection() {

    const requested =
        window.location.hash
            .replace("#", "")
            .trim();

    const valid =
        sections.some(
            section =>
                section.id === requested
        );

    activateSection(
        valid ? requested : "home",
        false
    );
}

window.addEventListener(
    "hashchange",
    () => {

        const section =
            window.location.hash
                .replace("#", "")
                .trim();

        if (section) {
            activateSection(section, false);
        }

    }
);

/* =========================================================
   CURSOR
========================================================= */

function initCursor() {

    const dot =
        $(".custom-cursor-dot");

    const ring =
        $(".custom-cursor-ring");

    if (!dot || !ring) return;

    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        document.body.classList.add(
            "touch-device"
        );

        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener(
        "mousemove",
        event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            dot.style.transform =
                `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        }
    );

    function animateRing() {

        ringX +=
            (mouseX - ringX) * 0.18;

        ringY +=
            (mouseY - ringY) * 0.18;

        ring.style.transform =
            `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(
            animateRing
        );
    }

    animateRing();

    document.addEventListener(
        "mouseover",
        event => {

            const interactive =
                event.target.closest(
                    "a, button, input, img, .cube-face"
                );

            document.body.classList.toggle(
                "cursor-hover",
                Boolean(interactive)
            );

        }
    );

}

/* =========================================================
   3D GALAXY
========================================================= */

function initGalaxy() {

    const canvas =
        document.getElementById(
            "galaxyCanvas"
        );

    if (
        !canvas ||
        typeof THREE === "undefined"
    ) {
        return;
    }

    const scene =
        new THREE.Scene();

    const camera =
        new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            5000
        );

    camera.position.z = 850;

    const renderer =
        new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.75)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    const galaxyGroup =
        new THREE.Group();

    scene.add(galaxyGroup);

    const isMobile =
        window.innerWidth < 800;

    const starCount =
        isMobile
            ? 2600
            : 5600;

    const positions =
        new Float32Array(
            starCount * 3
        );

    const sizes =
        new Float32Array(
            starCount
        );

    const armCount = 4;

    for (
        let i = 0;
        i < starCount;
        i++
    ) {

        const radius =
            Math.pow(
                Math.random(),
                0.52
            ) * 850;

        const arm =
            i % armCount;

        const armOffset =
            (arm / armCount) *
            Math.PI *
            2;

        const twist =
            radius * 0.0054;

        const randomSpread =
            (Math.random() - 0.5)
            * (0.7 + radius / 900);

        const angle =
            armOffset +
            twist +
            randomSpread;

        const vertical =
            (Math.random() - 0.5)
            *
            Math.max(
                25,
                110 - radius * 0.07
            );

        const centerPull =
            Math.random() * 0.28;

        const x =
            Math.cos(angle) *
            radius;

        const z =
            Math.sin(angle) *
            radius;

        const y =
            vertical *
            (0.25 + centerPull);

        const index =
            i * 3;

        positions[index] =
            x;

        positions[index + 1] =
            y;

        positions[index + 2] =
            z;

        sizes[i] =
            Math.random() *
            0.85
            + 0.35;
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );

    const material =
        new THREE.PointsMaterial({

            color:
                new THREE.Color(
                    "#f5c85b"
                ),

            size:
                isMobile
                    ? 2.25
                    : 2.8,

            transparent: true,

            opacity: 0.74,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    galaxyGroup.add(points);

    const dustCount =
        isMobile
            ? 500
            : 1100;

    const dustPositions =
        new Float32Array(
            dustCount * 3
        );

    for (
        let i = 0;
        i < dustCount;
        i++
    ) {

        const r =
            160 +
            Math.random() *
            640;

        const a =
            Math.random() *
            Math.PI *
            2;

        const idx =
            i * 3;

        dustPositions[idx] =
            Math.cos(a) *
            r;

        dustPositions[idx + 1] =
            (
                Math.random() -
                0.5
            ) *
            170;

        dustPositions[idx + 2] =
            Math.sin(a) *
            r;
    }

    const dustGeometry =
        new THREE.BufferGeometry();

    dustGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            dustPositions,
            3
        )
    );

    const dustMaterial =
        new THREE.PointsMaterial({

            color:
                new THREE.Color(
                    "#fff0be"
                ),

            size:
                isMobile
                    ? 1.4
                    : 1.65,

            transparent: true,

            opacity: 0.2,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });

    const dust =
        new THREE.Points(
            dustGeometry,
            dustMaterial
        );

    galaxyGroup.add(dust);

    const coreGeometry =
        new THREE.SphereGeometry(
            70,
            32,
            32
        );

    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: "#e9be52",
            transparent: true,
            opacity: 0.045
        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    galaxyGroup.add(core);

    const ambientGlowGeometry =
        new THREE.SphereGeometry(
            160,
            32,
            32
        );

    const ambientGlowMaterial =
        new THREE.MeshBasicMaterial({
            color: "#d9a537",
            transparent: true,
            opacity: 0.013
        });

    const ambientGlow =
        new THREE.Mesh(
            ambientGlowGeometry,
            ambientGlowMaterial
        );

    galaxyGroup.add(ambientGlow);

    let rotationTarget =
        0;

    window.addEventListener(
        "mousemove",
        event => {

            rotationTarget =
                (event.clientX /
                    window.innerWidth -
                    0.5) *
                0.08;

        }
    );

    function animate() {

        requestAnimationFrame(
            animate
        );

        galaxyGroup.rotation.y +=
            0.00028;

        galaxyGroup.rotation.x +=
            0.00003;

        galaxyGroup.rotation.y +=
            (
                rotationTarget -
                galaxyGroup.rotation.y *
                0.00003
            ) * 0.002;

        core.scale.setScalar(
            1 +
            Math.sin(
                performance.now() *
                0.0008
            ) * 0.035
        );

        renderer.render(
            scene,
            camera
        );
    }

    animate();

    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    1.75
                )
            );

        }
    );

}

/* =========================================================
   3D CUBE GALLERY GENERATOR
========================================================= */

let activeCubeTimers =
    new Map();

function buildCubeGallery(
    images,
    title,
    options = {}
) {

    const root =
        document.createElement(
            "div"
        );

    root.className =
        options.className ||
        "cube-gallery";

    const scene =
        document.createElement(
            "div"
        );

    scene.className =
        "cube-scene";

    const cube =
        document.createElement(
            "div"
        );

    cube.className =
        "image-cube";

    const safeImages =
        Array.from({
            length: 4
        }, (_, index) => {

            return (
                images[index] ||
                images[
                    index %
                    Math.max(images.length, 1)
                ] ||
                ""
            );

        });

    safeImages.forEach(
        (src, index) => {

            const face =
                document.createElement(
                    "figure"
                );

            face.className =
                "cube-face";

            const img =
                document.createElement(
                    "img"
                );

            img.src = src;

            img.alt =
                `${title} — Image ${index + 1}`;

            img.dataset.fallback =
                title;

            face.appendChild(img);

            face.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openMediaViewer(
                        img.src,
                        img.alt
                    );

                }
            );

            cube.appendChild(face);

            bindImageFallback(
                img
            );

        }
    );

    scene.appendChild(cube);

    root.appendChild(scene);

    const caption =
        document.createElement(
            "div"
        );

    caption.className =
        "cube-caption";

    caption.innerHTML = `
        <span>ROTATING ARCHIVE</span>
        <strong>${title}</strong>
    `;

    root.appendChild(
        caption
    );

    let rotation =
        0;

    const timer =
        setInterval(
            () => {

                rotation += 90;

                cube.style.transform =
                    `rotateY(${rotation}deg)`;

            },
            2000
        );

    activeCubeTimers.set(
        root,
        timer
    );

    return root;
}

/* =========================================================
   EDUCATION RENDER
========================================================= */

function renderEducation() {

    const container =
        $("#educationContainer");

    if (!container) return;

    const stack =
        document.createElement(
            "div"
        );

    stack.className =
        "education-stack";

    window.PORTFOLIO_DATA.education.forEach(
        education => {

            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "education-card glass-card";

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "education-info";

            const facts =
                education.facts
                    .map(
                        fact => `
                            <div class="education-fact">
                                <span>${fact[0]}</span>
                                <strong>${fact[1]}</strong>
                            </div>
                        `
                    )
                    .join("");

            info.innerHTML = `
                <div>
                    <div class="education-card-header">

                        <div>
                            <span class="small-label">
                                ${education.label}
                            </span>

                            <h3>
                                ${education.title}
                                <span>.</span>
                            </h3>
                        </div>

                        <div class="education-period">
                            ${education.period}
                        </div>

                    </div>

                    <p class="education-description">
                        ${education.description}
                    </p>

                    <div class="education-facts">
                        ${facts}
                    </div>

                    ${
                        education.mapUrl
                            ? `
                                <a
                                    class="secondary-button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="${education.mapUrl}"
                                    style="margin-top:18px;width:max-content"
                                >
                                    <i class="fa-solid fa-location-dot"></i>
                                    View Location
                                </a>
                            `
                            : ""
                    }

                </div>
            `;

            const gallery =
                document.createElement(
                    "div"
                );

            gallery.className =
                "education-gallery";

            gallery.appendChild(
                buildCubeGallery(
                    education.images,
                    education.title
                )
            );

            article.appendChild(info);
            article.appendChild(gallery);

            stack.appendChild(article);

        }
    );

    container.appendChild(stack);

}

/* =========================================================
   DRAWINGS
========================================================= */

function renderDrawings() {

    const container =
        $("#drawingGallery");

    if (!container) return;

    window.PORTFOLIO_DATA.drawings
        .slice(0, 20)
        .forEach(
            (src, index) => {

                const img =
                    document.createElement(
                        "img"
                    );

                img.src = src;

                img.alt =
                    `Drawing ${index + 1}`;

                img.dataset.fallback =
                    `DRAWING ${index + 1}`;

                img.addEventListener(
                    "click",
                    () => {

                        openMediaViewer(
                            img.src,
                            img.alt
                        );

                    }
                );

                bindImageFallback(
                    img
                );

                container.appendChild(
                    img
                );

            }
        );

}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements() {

    const container =
        $("#achievementGrid");

    if (!container) return;

    window.PORTFOLIO_DATA.achievements.forEach(
        item => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "achievement-card glass-card";

            card.innerHTML = `
                <div>
                    <div class="achievement-card-icon">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>

                    <h3>${item.title}</h3>

                    <p>
                        ${item.description}
                    </p>

                    <span class="achievement-badge">
                        ${item.badge}
                    </span>

                    ${
                        item.certificate &&
                        item.certificate !==
                        "YOUR_GOOGLE_DRIVE_CERTIFICATE_VIEWER_LINK"
                            ? `
                                <a
                                    class="secondary-button"
                                    style="margin-top:14px"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="${item.certificate}"
                                >
                                    View Certificate
                                </a>
                            `
                            : ""
                    }

                </div>

                ${
                    item.image
                        ? `
                            <img
                                class="achievement-image"
                                src="${item.image}"
                                alt="${item.title}"
                                data-fallback="${item.title}"
                            >
                        `
                        : ""
                }

            `;

            const image =
                $("img", card);

            if (image) {

                bindImageFallback(
                    image
                );

                image.addEventListener(
                    "click",
                    () => {

                        openMediaViewer(
                            image.src,
                            image.alt
                        );

                    }
                );

            }

            container.appendChild(
                card
            );

        }
    );

}

/* =========================================================
   DIGITAL PROJECTS
========================================================= */

function renderDigitalProjects() {

    const container =
        $("#digitalProjects");

    if (!container) return;

    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "digital-project-grid";

    window.PORTFOLIO_DATA.digitalProjects.forEach(
        (project, index) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "digital-project-card glass-card";

            card.innerHTML = `
                <div>

                    <span class="project-number">
                        ${project.number}
                    </span>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                </div>

                <div class="project-actions">

                    <a
                        class="project-link"
                        href="${project.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        ${project.action}
                    </a>

                </div>
            `;

            grid.appendChild(
                card
            );

        }
    );

    container.appendChild(
        grid
    );

}

/* =========================================================
   ARCHITECTURE PROJECTS
========================================================= */

function renderArchitectureProjects() {

    const container =
        $("#architectureProjects");

    if (!container) return;

    window.PORTFOLIO_DATA.architectureProjects.forEach(
        (project, index) => {

            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "architecture-project glass-card";

            if (
                index % 2 === 1
            ) {
                article.classList.add(
                    "reverse"
                );
            }

            const media =
                document.createElement(
                    "div"
                );

            media.className =
                "architecture-media";

            const imageStack =
                document.createElement(
                    "div"
                );

            imageStack.className =
                "project-image-stack";

            if (
                project.images.length === 1
            ) {

                imageStack.classList.add(
                    "single"
                );

            }

            project.images.forEach(
                (src, imageIndex) => {

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src = src;

                    img.alt =
                        `${project.name} — Image ${imageIndex + 1}`;

                    img.dataset.fallback =
                        project.name;

                    img.addEventListener(
                        "click",
                        () => {

                            openMediaViewer(
                                img.src,
                                img.alt
                            );

                        }
                    );

                    bindImageFallback(
                        img
                    );

                    imageStack.appendChild(
                        img
                    );

                }
            );

            media.appendChild(
                imageStack
            );

            if (
                project.video &&
                project.video !==
                "YOUR_PAVILION_VIDEO_LINK"
            ) {

                const videoButton =
                    document.createElement(
                        "a"
                    );

                videoButton.className =
                    "secondary-button";

                videoButton.style.marginTop =
                    "10px";

                videoButton.href =
                    project.video;

                videoButton.target =
                    "_blank";

                videoButton.rel =
                    "noopener noreferrer";

                videoButton.innerHTML = `
                    <i class="fa-solid fa-play"></i>
                    Watch Project Video
                `;

                media.appendChild(
                    videoButton
                );

            }

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "project-info";

            info.innerHTML = `
                <span>
                    ${project.category}
                </span>

                <h3>
                    ${project.name}
                </h3>

                <p>
                    ${project.description}
                </p>
            `;

            article.appendChild(
                media
            );

            article.appendChild(
                info
            );

            container.appendChild(
                article
            );

        }
    );

}

/* =========================================================
   GRAPHICS
========================================================= */

function renderGraphics() {

    const container =
        $("#graphicsGallery");

    if (!container) return;

    window.PORTFOLIO_DATA.graphics.forEach(
        item => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "graphics-card glass-card";

            card.appendChild(
                buildCubeGallery(
                    item.images,
                    item.name,
                    {
                        className:
                            "cube-gallery graphics-carousel"
                    }
                )
            );

            container.appendChild(
                card
            );

        }
    );

}

/* =========================================================
   VIDEOS
========================================================= */

function renderVideos() {

    const container =
        $("#videoGrid");

    if (!container) return;

    window.PORTFOLIO_DATA.videos.forEach(
        video => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "video-card";

            card.innerHTML = `
                <div class="video-frame">

                    <iframe
                        src="https://www.youtube.com/embed/${video.youtube}"
                        title="${video.title}"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>

                </div>

                <div class="video-card-content">

                    <h3>
                        ${video.title}
                    </h3>

                    <p>
                        ${video.description}
                    </p>

                    <a
                        class="video-watch"
                        href="${video.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open YouTube
                        <i
                            class="fa-solid fa-arrow-up-right-from-square"
                            style="margin-left:5px"
                        ></i>
                    </a>

                </div>
            `;

            container.appendChild(
                card
            );

        }
    );

}

/* =========================================================
   CONTACTS
========================================================= */

function renderContacts() {

    const container =
        $("#contactLinkGrid");

    if (!container) return;

    window.PORTFOLIO_DATA.contacts.forEach(
        contact => {

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                contact.link;

            link.className =
                "contact-link-card";

            if (
                !contact.link.startsWith(
                    "mailto:"
                )
            ) {

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            }

            link.innerHTML = `
                <i class="fa-brands ${contact.icon}"></i>
                <span>${contact.label}</span>
            `;

            container.appendChild(
                link
            );

        }
    );

}

/* =========================================================
   CONTENT ICON GRID
========================================================= */

function renderContentIcons() {

    const container =
        $("#contentIconGrid");

    if (!container) return;

    window.PORTFOLIO_DATA.contacts
        .forEach(
            contact => {

                const item =
                    document.createElement(
                        "a"
                    );

                item.className =
                    "content-icon-card";

                item.href =
                    contact.link;

                item.title =
                    contact.label;

                item.setAttribute(
                    "aria-label",
                    contact.label
                );

                if (
                    !contact.link.startsWith(
                        "mailto:"
                    )
                ) {

                    item.target =
                        "_blank";

                    item.rel =
                        "noopener noreferrer";

                }

                item.innerHTML = `
                    <i class="fa-brands ${contact.icon}"></i>
                    <small>
                        ${contact.label}
                    </small>
                `;

                container.appendChild(
                    item
                );

            }
        );

}

/* =========================================================
   IMAGE VIEWER / ZOOM / PAN
========================================================= */

const viewer =
    $("#mediaViewer");

const viewerImage =
    $("#viewerImage");

const zoomLabel =
    $("#viewerZoomLabel");

let viewerScale = 1;
let viewerTranslateX = 0;
let viewerTranslateY = 0;

let dragActive = false;
let dragStartX = 0;
let dragStartY = 0;

function updateViewerTransform(
    animate = true
) {

    if (!viewerImage) return;

    viewerImage.style.transition =
        animate
            ? "transform .25s ease"
            : "none";

    viewerImage.style.transform =
        `
        translate3d(
            ${viewerTranslateX}px,
            ${viewerTranslateY}px,
            0
        )
        scale(${viewerScale})
        `;

    if (zoomLabel) {

        zoomLabel.textContent =
            `${Math.round(viewerScale * 100)}%`;

    }

}

function openMediaViewer(
    source,
    alt = ""
) {

    if (!viewer || !viewerImage) {
        return;
    }

    viewerImage.src =
        source;

    viewerImage.alt =
        alt;

    viewerScale =
        1;

    viewerTranslateX =
        0;

    viewerTranslateY =
        0;

    updateViewerTransform(
        false
    );

    viewer.classList.add(
        "open"
    );

    viewer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}

function closeMediaViewer() {

    if (!viewer) return;

    viewer.classList.remove(
        "open"
    );

    viewer.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}

function zoomViewer(
    amount
) {

    viewerScale =
        Math.min(
            4,
            Math.max(
                0.65,
                viewerScale + amount
            )
        );

    updateViewerTransform();
}

$("#viewerClose")?.addEventListener(
    "click",
    closeMediaViewer
);

$("#viewerZoomIn")?.addEventListener(
    "click",
    () => zoomViewer(0.25)
);

$("#viewerZoomOut")?.addEventListener(
    "click",
    () => zoomViewer(-0.25)
);

viewer?.addEventListener(
    "click",
    event => {

        if (
            event.target === viewer ||
            event.target === $("#mediaStage")
        ) {

            closeMediaViewer();

        }

    }
);

viewerImage?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        if (
            viewerScale <= 1.02
        ) {

            viewerScale =
                1.7;

        } else {

            viewerScale =
                1;

            viewerTranslateX =
                0;

            viewerTranslateY =
                0;

        }

        updateViewerTransform();

    }
);

viewerImage?.addEventListener(
    "wheel",
    event => {

        event.preventDefault();

        zoomViewer(
            event.deltaY > 0
                ? -0.12
                : 0.12
        );

    },
    {
        passive: false
    }
);

viewerImage?.addEventListener(
    "pointerdown",
    event => {

        dragActive =
            true;

        dragStartX =
            event.clientX -
            viewerTranslateX;

        dragStartY =
            event.clientY -
            viewerTranslateY;

        viewerImage.classList.add(
            "dragging"
        );

        viewerImage.setPointerCapture(
            event.pointerId
        );

    }
);

viewerImage?.addEventListener(
    "pointermove",
    event => {

        if (!dragActive) return;

        viewerTranslateX =
            event.clientX -
            dragStartX;

        viewerTranslateY =
            event.clientY -
            dragStartY;

        updateViewerTransform(
            false
        );

    }
);

viewerImage?.addEventListener(
    "pointerup",
    event => {

        dragActive =
            false;

        viewerImage.classList.remove(
            "dragging"
        );

        try {

            viewerImage.releasePointerCapture(
                event.pointerId
            );

        } catch {}

    }
);

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMediaViewer();

        }

        if (
            event.key === "e" ||
            event.key === "E"
        ) {

            if (
                typeof window.toggleAIVoiceMode ===
                "function"
            ) {

                window.toggleAIVoiceMode();

            }

        }

    }
);

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initCursor();

        initGalaxy();

        renderEducation();

        renderDrawings();

        renderAchievements();

        renderDigitalProjects();

        renderArchitectureProjects();

        renderGraphics();

        renderVideos();

        renderContacts();

        renderContentIcons();

        bindAllImageFallbacks();

        loadInitialSection();

    }
);
