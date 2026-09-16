/*
=========================================================
 SHADID AHAMED — PORTFOLIO AI AGENT
 File: js/ai.js
=========================================================

This is the LOCAL AI/AGENT layer for the portfolio.

It can:
- Understand portfolio sections
- Answer questions about Shadid's portfolio
- Search portfolio content
- Give contextual suggestions
- Remember conversation context during the session
- Detect what the visitor is asking about
- Use ShadidData when available
- Speak responses using browser speech synthesis
- Accept voice input where supported
- Provide a clean bridge for a future real AI API

IMPORTANT:
This browser-side agent does NOT pretend to be an
unrestricted autonomous AI or bypass security systems.

For a real LLM, connect the backend/API adapter near
the bottom of this file. Never place secret API keys
directly in this JavaScript file.

=========================================================
*/

(function () {
    "use strict";

    /* =====================================================
       GLOBAL REFERENCES
    ===================================================== */

    const win = window;
    const doc = document;

    const AI_NAME = "ASTRA";
    const STORAGE_KEY = "shadid_ai_session";

    let portfolioData = null;
    let conversation = [];
    let recognition = null;
    let isListening = false;
    let isSpeaking = false;


    /* =====================================================
       BASIC UTILITIES
    ===================================================== */

    const $ = (selector, parent = doc) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = doc) =>
        Array.from(parent.querySelectorAll(selector));

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFKC")
            .replace(/\s+/g, " ")
            .trim();
    }

    function escapeHTML(text) {
        const div = doc.createElement("div");
        div.textContent = String(text ?? "");
        return div.innerHTML;
    }

    function wait(ms) {
        return new Promise(resolve =>
            setTimeout(resolve, ms)
        );
    }


    /* =====================================================
       LOAD PORTFOLIO DATA
    ===================================================== */

    function loadPortfolioData() {
        if (win.ShadidData) {
            portfolioData = win.ShadidData;
            return;
        }

        /*
         * data.js announces itself through this event.
         */
        win.addEventListener(
            "portfolio:data-ready",
            () => {
                portfolioData = win.ShadidData || null;
            },
            { once: true }
        );
    }


    /* =====================================================
       SESSION MEMORY
       -----------------------------------------------------
       This is intentionally local to the visitor's browser.
    ===================================================== */

    function loadSession() {
        try {
            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) return;

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {
                conversation = parsed.slice(-20);
            }
        } catch (_) {
            conversation = [];
        }
    }


    function saveSession() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    conversation.slice(-20)
                )
            );
        } catch (_) {
            /*
             * Private browsing or blocked storage.
             */
        }
    }


    function addConversation(role, text) {
        conversation.push({
            role,
            text: String(text),
            timestamp: Date.now()
        });

        conversation =
            conversation.slice(-20);

        saveSession();
    }


    /* =====================================================
       PORTFOLIO DATA SEARCH
    ===================================================== */

    function flattenData(value, path = "", result = []) {
        if (value === null || value === undefined) {
            return result;
        }

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            result.push({
                path,
                value: String(value)
            });

            return result;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                flattenData(
                    item,
                    `${path}[${index}]`,
                    result
                );
            });

            return result;
        }

        if (typeof value === "object") {
            Object.keys(value).forEach(key => {
                const nextPath =
                    path
                        ? `${path}.${key}`
                        : key;

                flattenData(
                    value[key],
                    nextPath,
                    result
                );
            });
        }

        return result;
    }


    function searchPortfolio(query) {
        if (!portfolioData) {
            return [];
        }

        const terms =
            normalize(query)
                .split(" ")
                .filter(word => word.length > 2);

        if (!terms.length) {
            return [];
        }

        const flattened =
            flattenData(portfolioData);

        const scored = [];

        flattened.forEach(item => {
            const haystack =
                normalize(
                    `${item.path} ${item.value}`
                );

            let score = 0;

            terms.forEach(term => {
                if (haystack.includes(term)) {
                    score += 1;

                    /*
                     * Exact path/key matches get a boost.
                     */
                    if (
                        normalize(item.path)
                            .includes(term)
                    ) {
                        score += 0.5;
                    }
                }
            });

            if (score > 0) {
                scored.push({
                    ...item,
                    score
                });
            }
        });

        return scored
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .slice(0, 12);
    }


    function getDataValue(path) {
        if (!portfolioData || !path) {
            return undefined;
        }

        return path
            .split(".")
            .reduce(
                (current, key) => {
                    if (
                        current === undefined ||
                        current === null
                    ) {
                        return undefined;
                    }

                    return current[key];
                },
                portfolioData
            );
    }


    /* =====================================================
       INTENT DETECTION
    ===================================================== */

    function detectIntent(input) {
        const text = normalize(input);

        if (!text) {
            return "empty";
        }

        if (
            /^(hi|hello|hey|yo|hola|assalam|salam)\b/
                .test(text)
        ) {
            return "greeting";
        }

        if (
            text.includes("who is shadid") ||
            text.includes("about shadid") ||
            text.includes("who are you") ||
            text.includes("tell me about him") ||
            text.includes("tell me about shadid")
        ) {
            return "identity";
        }

        if (
            text.includes("education") ||
            text.includes("school") ||
            text.includes("college") ||
            text.includes("university") ||
            text.includes("study")
        ) {
            return "education";
        }

        if (
            text.includes("art") ||
            text.includes("drawing") ||
            text.includes("painting") ||
            text.includes("artist") ||
            text.includes("artwork")
        ) {
            return "art";
        }

        if (
            text.includes("architecture") ||
            text.includes("architect") ||
            text.includes("project") ||
            text.includes("pavilion") ||
            text.includes("relief") ||
            text.includes("grid")
        ) {
            return "architecture";
        }

        if (
            text.includes("digital") ||
            text.includes("website") ||
            text.includes("web") ||
            text.includes("marketing") ||
            text.includes("ecommerce") ||
            text.includes("affiliate")
        ) {
            return "digital";
        }

        if (
            text.includes("game") ||
            text.includes("gaming") ||
            text.includes("play")
        ) {
            return "game";
        }

        if (
            text.includes("video") ||
            text.includes("teaching") ||
            text.includes("teacher")
        ) {
            return "videos";
        }

        if (
            text.includes("cv") ||
            text.includes("resume") ||
            text.includes("document") ||
            text.includes("certificate")
        ) {
            return "documents";
        }

        if (
            text.includes("contact") ||
            text.includes("email") ||
            text.includes("github") ||
            text.includes("linkedin") ||
            text.includes("instagram") ||
            text.includes("facebook") ||
            text.includes("whatsapp")
        ) {
            return "contact";
        }

        if (
            text.includes("skill") ||
            text.includes("can he do") ||
            text.includes("can shadid do")
        ) {
            return "skills";
        }

        if (
            text.includes("improve") ||
            text.includes("improvement") ||
            text.includes("suggest") ||
            text.includes("suggestion") ||
            text.includes("better") ||
            text.includes("feedback")
        ) {
            return "improvement";
        }

        if (
            text.includes("portfolio") ||
            text.includes("site") ||
            text.includes("website")
        ) {
            return "portfolio";
        }

        if (
            text.includes("clear") ||
            text.includes("forget") ||
            text.includes("memory")
        ) {
            return "memory";
        }

        return "search";
    }


    /* =====================================================
       RESPONSE GENERATION
    ===================================================== */

    function generateResponse(input) {
        const intent =
            detectIntent(input);

        switch (intent) {

            case "empty":
                return {
                    text:
                        "Give me something to explore. " +
                        "Ask me about Shadid, his architecture, " +
                        "art, education, digital work, videos, " +
                        "or this portfolio.",
                    intent
                };


            case "greeting":
                return {
                    text:
                        `Hello. I'm ${AI_NAME}, the portfolio intelligence layer. ` +
                        `Ask me anything about Shadid's work, education, ` +
                        `art, architecture, digital projects, or this site.`,
                    intent
                };


            case "identity":
                return identityResponse(intent);


            case "education":
                return educationResponse(intent);


            case "art":
                return artResponse(intent);


            case "architecture":
                return architectureResponse(intent);


            case "digital":
                return digitalResponse(intent);


            case "game":
                return gameResponse(intent);


            case "videos":
                return videosResponse(intent);


            case "documents":
                return documentsResponse(intent);


            case "skills":
                return skillsResponse(intent);


            case "contact":
                return contactResponse(intent);


            case "portfolio":
                return portfolioResponse(intent);


            case "improvement":
                return improvementResponse(intent);


            case "memory":
                return memoryResponse(intent);


            default:
                return searchResponse(
                    input,
                    intent
                );
        }
    }


    /* =====================================================
       IDENTITY RESPONSE
    ===================================================== */

    function identityResponse(intent) {
        const identity =
            portfolioData?.identity || {};

        const name =
            identity.name ||
            "Shadid Ahamed";

        const role =
            identity.title ||
            "Architecture Student · Visual Artist · Creative Technologist";

        const institution =
            identity.institution ||
            "BRAC University";

        const department =
            identity.department ||
            "Architecture";

        return {
            intent,

            text:
                `${name} is presented here as a ` +
                `${role}. He is studying ${department} ` +
                `at ${institution}. This portfolio brings ` +
                `together his architectural work, visual art, ` +
                `digital experiments, teaching experience, ` +
                `and creative technology projects.`
        };
    }


    /* =====================================================
       EDUCATION RESPONSE
    ===================================================== */

    function educationResponse(intent) {
        const education =
            portfolioData?.education;

        if (!education) {
            return {
                intent,
                text:
                    "The education data module is not loaded yet."
            };
        }

        const list =
            Array.isArray(education)
                ? education
                : Object.values(education);

        const entries =
            list.filter(
                item =>
                    item &&
                    typeof item === "object"
            );

        if (!entries.length) {
            return {
                intent,
                text:
                    "Education information is available, " +
                    "but its structured entries are not ready."
            };
        }

        const lines =
            entries
                .slice(0, 6)
                .map(item => {

                    const institution =
                        item.institution ||
                        item.name ||
                        item.school ||
                        "Institution";

                    const period =
                        item.period ||
                        item.years ||
                        (
                            item.start && item.end
                                ? `${item.start}–${item.end}`
                                : ""
                        );

                    const program =
                        item.program ||
                        item.degree ||
                        item.level ||
                        "";

                    return `${institution}` +
                        `${period ? ` (${period})` : ""}` +
                        `${program ? ` — ${program}` : ""}.`;
                });

        return {
            intent,

            text:
                "The education journey presented in the portfolio includes:\n\n" +
                lines.join("\n")
        };
    }


    /* =====================================================
       ART RESPONSE
    ===================================================== */

    function artResponse(intent) {
        const artworks =
            portfolioData?.artworks ||
            portfolioData?.art ||
            [];

        if (!Array.isArray(artworks) ||
            !artworks.length) {
            return {
                intent,
                text:
                    "The artwork module is available, " +
                    "but the artwork entries have not been loaded yet."
            };
        }

        const featured =
            artworks
                .slice(0, 6)
                .map((artwork, index) => {

                    const title =
                        artwork.title ||
                        `Artwork ${index + 1}`;

                    const description =
                        artwork.description ||
                        artwork.explanation ||
                        "";

                    return `${index + 1}. ${title}` +
                        (
                            description
                                ? ` — ${description}`
                                : ""
                        );
                });

        return {
            intent,

            text:
                "The art collection is presented as an evolving " +
                "visual archive. Some of the featured works are:\n\n" +
                featured.join("\n")
        };
    }


    /* =====================================================
       ARCHITECTURE RESPONSE
    ===================================================== */

    function architectureResponse(intent) {
        const projects =
            portfolioData?.architectureProjects ||
            portfolioData?.architecture ||
            [];

        if (!Array.isArray(projects) ||
            !projects.length) {
            return {
                intent,
                text:
                    "The architecture section is ready for " +
                    "project data, but no structured project list " +
                    "is currently available."
            };
        }

        const lines =
            projects
                .slice(0, 8)
                .map((project, index) => {

                    const title =
                        project.title ||
                        project.name ||
                        `Project ${index + 1}`;

                    const description =
                        project.description ||
                        "";

                    return `${index + 1}. ${title}` +
                        (
                            description
                                ? ` — ${description}`
                                : ""
                        );
                });

        return {
            intent,

            text:
                "The architecture portfolio focuses on " +
                "design thinking, visual composition, spatial " +
                "experimentation, and project development.\n\n" +
                lines.join("\n")
        };
    }


    /* =====================================================
       DIGITAL RESPONSE
    ===================================================== */

    function digitalResponse(intent) {
        const projects =
            portfolioData?.digitalProjects ||
            portfolioData?.digital ||
            [];

        if (!Array.isArray(projects) ||
            !projects.length) {
            return {
                intent,
                text:
                    "The digital-work section includes web, " +
                    "creative technology, and experimental projects. " +
                    "Its detailed project data is not currently loaded."
            };
        }

        const lines =
            projects
                .slice(0, 8)
                .map((project, index) => {

                    const title =
                        project.title ||
                        project.name ||
                        `Project ${index + 1}`;

                    const description =
                        project.description ||
                        "";

                    return `${index + 1}. ${title}` +
                        (
                            description
                                ? ` — ${description}`
                                : ""
                        );
                });

        return {
            intent,

            text:
                "Digital projects in the portfolio include:\n\n" +
                lines.join("\n")
        };
    }


    /* =====================================================
       GAME RESPONSE
    ===================================================== */

    function gameResponse(intent) {
        const game =
            portfolioData?.game;

        if (!game) {
            return {
                intent,
                text:
                    "There is a dedicated interactive game " +
                    "experience in the portfolio. The game metadata " +
                    "is not currently loaded."
            };
        }

        return {
            intent,

            text:
                `${game.title || "The portfolio game"} is an " +
                `${game.description || "interactive browser game"}`
        };
    }


    /* =====================================================
       VIDEO RESPONSE
    ===================================================== */

    function videosResponse(intent) {
        const videos =
            portfolioData?.videos;

        if (!Array.isArray(videos) ||
            !videos.length) {
            return {
                intent,
                text:
                    "The video section contains teaching and " +
                    "science/physics-related content, but its " +
                    "structured entries are not currently loaded."
            };
        }

        const lines =
            videos
                .slice(0, 8)
                .map((video, index) => {

                    const title =
                        video.title ||
                        video.name ||
                        `Video ${index + 1}`;

                    const description =
                        video.description ||
                        "";

                    return `${index + 1}. ${title}` +
                        (
                            description
                                ? ` — ${description}`
                                : ""
                        );
                });

        return {
            intent,

            text:
                "Selected videos:\n\n" +
                lines.join("\n")
        };
    }


    /* =====================================================
       DOCUMENT RESPONSE
    ===================================================== */

    function documentsResponse(intent) {
        const documents =
            portfolioData?.documents;

        if (!Array.isArray(documents) ||
            !documents.length) {
            return {
                intent,
                text:
                    "The document area is designed for " +
                    "portfolio-related documents such as the CV " +
                    "and identification material."
            };
        }

        const lines =
            documents
                .slice(0, 8)
                .map((document, index) => {

                    const title =
                        document.title ||
                        document.name ||
                        `Document ${index + 1}`;

                    const description =
                        document.description ||
                        "";

                    return `${index + 1}. ${title}` +
                        (
                            description
                                ? ` — ${description}`
                                : ""
                        );
                });

        return {
            intent,

            text:
                "Available document categories:\n\n" +
                lines.join("\n")
        };
    }


    /* =====================================================
       SKILLS RESPONSE
    ===================================================== */

    function skillsResponse(intent) {
        const skills =
            portfolioData?.skills;

        if (!skills) {
            return {
                intent,
                text:
                    "The portfolio combines architecture, " +
                    "drawing, visual communication, digital " +
                    "experimentation, and creative technology."
            };
        }

        let skillList = [];

        if (Array.isArray(skills)) {
            skillList = skills;
        } else if (
            typeof skills === "object"
        ) {
            skillList =
                Object.values(skills)
                    .flat()
                    .filter(
                        item =>
                            typeof item === "string"
                    );
        }

        if (!skillList.length) {
            return {
                intent,
                text:
                    "The portfolio combines visual, architectural, " +
                    "digital, and creative-technology skills."
            };
        }

        return {
            intent,

            text:
                "The skill profile spans:\n\n" +
                skillList
                    .slice(0, 20)
                    .map(
                        (skill, index) =>
                            `${index + 1}. ${skill}`
                    )
                    .join("\n")
        };
    }


    /* =====================================================
       CONTACT RESPONSE
    ===================================================== */

    function contactResponse(intent) {
        const socials =
            portfolioData?.socials ||
            portfolioData?.social ||
            {};

        const available = [];

        Object.keys(socials).forEach(key => {
            const value = socials[key];

            if (
                typeof value === "string" &&
                value.trim()
            ) {
                available.push(
                    `${key}: ${value}`
                );
            }
        });

        if (!available.length) {
            return {
                intent,
                text:
                    "The contact section contains the portfolio's " +
                    "available communication and social channels. " +
                    "Some links are intentionally waiting for their " +
                    "final verified URLs."
            };
        }

        return {
            intent,

            text:
                "Available contact/social channels:\n\n" +
                available.join("\n")
        };
    }


    /* =====================================================
       PORTFOLIO RESPONSE
    ===================================================== */

    function portfolioResponse(intent) {
        return {
            intent,

            text:
                "This is designed as more than a conventional " +
                "portfolio page. It acts as a digital archive of " +
                "architecture, art, education, creative technology, " +
                "teaching, experiments, documents, and interactive work."
        };
    }


    /* =====================================================
       IMPROVEMENT ENGINE
       -----------------------------------------------------
       This is a rule-based local evaluator.

       It does NOT pretend to be a human design critic.
       It provides actionable heuristics based on the
       current DOM.
    ===================================================== */

    function improvementResponse(intent) {
        const suggestions = [];

        const images =
            $$("img");

        const buttons =
            $$("button, a");

        const headings =
            $$("h1, h2, h3");

        const sections =
            $$("section");

        if (!sections.length) {
            suggestions.push(
                "Create a clear section hierarchy before adding more visual effects."
            );
        }

        if (!headings.some(
            heading =>
                normalize(heading.textContent)
                    .includes("architecture")
        )) {
            suggestions.push(
                "Make the Architecture section easy to discover from the main navigation."
            );
        }

        if (
            images.length &&
            images.some(
                image =>
                    !image.alt ||
                    !image.alt.trim()
            )
        ) {
            suggestions.push(
                "Add meaningful alt text to portfolio images for accessibility."
            );
        }

        if (buttons.length > 0) {
            const emptyButtons =
                buttons.filter(
                    element =>
                        !element.textContent.trim() &&
                        !element.getAttribute("aria-label")
                );

            if (emptyButtons.length) {
                suggestions.push(
                    "Add accessible labels to icon-only controls."
                );
            }
        }

        suggestions.push(
            "Keep the strongest architectural and artwork pieces visually dominant rather than giving every item equal emphasis."
        );

        suggestions.push(
            "Use consistent project metadata: title, year, medium/type, role, and a short design explanation."
        );

        suggestions.push(
            "Keep motion purposeful: transitions should communicate navigation, depth, or hierarchy rather than simply adding movement."
        );

        return {
            intent,

            text:
                "My current portfolio audit suggests:\n\n" +
                suggestions
                    .map(
                        (item, index) =>
                            `${index + 1}. ${item}`
                    )
                    .join("\n")
        };
    }


    /* =====================================================
       MEMORY RESPONSE
    ===================================================== */

    function memoryResponse(intent) {
        return {
            intent,

            text:
                `I keep a small session history in this browser ` +
                `so I can maintain context while you explore the portfolio. ` +
                `It is not a hidden server-side memory system. ` +
                `You can clear this session with the "Clear AI" control.`
        };
    }


    /* =====================================================
       GENERIC SEARCH RESPONSE
    ===================================================== */

    function searchResponse(input, intent) {
        const results =
            searchPortfolio(input);

        if (!results.length) {
            return {
                intent,

                text:
                    "I couldn't find a strong match in the " +
                    "portfolio data. Try asking about Shadid's " +
                    "education, architecture, art, digital work, " +
                    "game, videos, skills, or contact information."
            };
        }

        const grouped =
            results
                .slice(0, 8)
                .map(
                    item =>
                        `• ${item.path}: ${item.value}`
                );

        return {
            intent,

            text:
                "I found these relevant portfolio records:\n\n" +
                grouped.join("\n")
        };
    }


    /* =====================================================
       OPTIONAL REAL AI BACKEND ADAPTER
       =====================================================

       To connect a real LLM later, use a SERVER endpoint.

       Example architecture:

           Browser
              ↓
           /api/ai
              ↓
           Your server
              ↓
           AI provider

       NEVER do this:

           const API_KEY = "secret-key-here";

       A browser can expose that key.

       The adapter below expects a backend endpoint that
       accepts:

           {
               message,
               context,
               history
           }

       and returns:

           {
               reply: "..."
           }

    ===================================================== */

    async function askBackendAI(message) {
        const endpoint =
            win.SHADID_AI_ENDPOINT;

        if (!endpoint) {
            return null;
        }

        try {
            const context = {
                identity:
                    portfolioData?.identity || null,

                currentSection:
                    getCurrentSection(),

                relevantData:
                    searchPortfolio(message)
                        .slice(0, 10)
            };

            const response =
                await fetch(
                    endpoint,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message,
                            context,
                            history:
                                conversation
                                    .slice(-10)
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `AI backend returned ${response.status}`
                );
            }

            const data =
                await response.json();

            if (
                data &&
                typeof data.reply === "string" &&
                data.reply.trim()
            ) {
                return data.reply.trim();
            }

        } catch (error) {
            console.warn(
                "[ASTRA] Backend AI unavailable:",
                error
            );
        }

        return null;
    }


    /* =====================================================
       CURRENT SECTION DETECTION
    ===================================================== */

    function getCurrentSection() {
        const active =
            $(
                ".nav-link.active, " +
                ".nav-item.active, " +
                "[aria-current='page']"
            );

        if (active) {
            return (
                active.dataset.section ||
                active.getAttribute("href") ||
                active.textContent.trim()
            );
        }

        const sections =
            $$("section[id]");

        let closest = null;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const rect =
                section.getBoundingClientRect();

            const distance =
                Math.abs(
                    rect.top -
                    win.innerHeight * 0.25
                );

            if (
                distance <
                closestDistance
            ) {
                closestDistance = distance;
                closest = section.id;
            }
        });

        return closest;
    }


    /* =====================================================
       MAIN ASK FUNCTION
    ===================================================== */

    async function ask(message, options = {}) {
        const input =
            String(message || "").trim();

        if (!input) {
            return generateResponse("");
        }

        addConversation(
            "user",
            input
        );

        /*
         * If a backend is explicitly configured,
         * try it first.
         */
        if (!options.localOnly) {
            const backendReply =
                await askBackendAI(input);

            if (backendReply) {
                addConversation(
                    "assistant",
                    backendReply
                );

                return {
                    text: backendReply,
                    source: "backend",
                    intent: detectIntent(input)
                };
            }
        }

        /*
         * Fall back to the local intelligence layer.
         */
        const response =
            generateResponse(input);

        addConversation(
            "assistant",
            response.text
        );

        return {
            ...response,
            source: "local"
        };
    }


    /* =====================================================
       SPEECH SYNTHESIS
    ===================================================== */

    function speak(text) {
        if (
            !("speechSynthesis" in win)
        ) {
            return false;
        }

        stopSpeaking();

        const utterance =
            new SpeechSynthesisUtterance(
                String(text)
            );

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            isSpeaking = true;

            doc.body.classList.add(
                "ai-speaking"
            );

            win.dispatchEvent(
                new CustomEvent(
                    "portfolio:ai-speaking",
                    {
                        detail: {
                            speaking: true
                        }
                    }
                )
            );
        };

        utterance.onend =
        utterance.onerror = () => {
            isSpeaking = false;

            doc.body.classList.remove(
                "ai-speaking"
            );

            win.dispatchEvent(
                new CustomEvent(
                    "portfolio:ai-speaking",
                    {
                        detail: {
                            speaking: false
                        }
                    }
                )
            );
        };

        win.speechSynthesis.speak(
            utterance
        );

        return true;
    }


    function stopSpeaking() {
        if (
            "speechSynthesis" in win
        ) {
            win.speechSynthesis.cancel();
        }

        isSpeaking = false;

        doc.body.classList.remove(
            "ai-speaking"
        );
    }


    /* =====================================================
       VOICE INPUT
    ===================================================== */

    function setupSpeechRecognition() {
        const Recognition =
            win.SpeechRecognition ||
            win.webkitSpeechRecognition;

        if (!Recognition) {
            return false;
        }

        recognition =
            new Recognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.lang =
            doc.documentElement.lang ||
            "en-US";

        recognition.onstart = () => {
            isListening = true;

            doc.body.classList.add(
                "ai-listening"
            );

            win.dispatchEvent(
                new CustomEvent(
                    "portfolio:ai-listening",
                    {
                        detail: {
                            listening: true
                        }
                    }
                )
            );
        };

        recognition.onend = () => {
            isListening = false;

            doc.body.classList.remove(
                "ai-listening"
            );

            win.dispatchEvent(
                new CustomEvent(
                    "portfolio:ai-listening",
                    {
                        detail: {
                            listening: false
                        }
                    }
                )
            );
        };

        recognition.onerror = error => {
            isListening = false;

            console.warn(
                "[ASTRA] Voice input:",
                error
            );
        };

        recognition.onresult = event => {
            const transcript =
                event.results?.[0]?.[0]?.transcript ||
                "";

            if (!transcript.trim()) {
                return;
            }

            win.dispatchEvent(
                new CustomEvent(
                    "portfolio:ai-voice-result",
                    {
                        detail: {
                            text: transcript
                        }
                    }
                )
            );
        };

        return true;
    }


    function startListening() {
        if (!recognition) {
            setupSpeechRecognition();
        }

        if (!recognition) {
            return false;
        }

        if (isListening) {
            return true;
        }

        try {
            recognition.start();
            return true;
        } catch (_) {
            return false;
        }
    }


    function stopListening() {
        if (!recognition) return;

        try {
            recognition.stop();
        } catch (_) {}
    }


    /* =====================================================
       AI UI CONNECTION
       -----------------------------------------------------
       Supports multiple possible markup styles so the
       future index.html can use whichever layout fits
       the ASTRA interface.
    ===================================================== */

    function findAIInput() {
        return $(
            "#aiInput, " +
            "#ai-input, " +
            "[data-ai-input]"
        );
    }


    function findAISubmit() {
        return $(
            "#aiSend, " +
            "#ai-send, " +
            "[data-ai-send]"
        );
    }


    function findAIOutput() {
        return $(
            "#aiMessages, " +
            "#ai-messages, " +
            "[data-ai-messages]"
        );
    }


    function findAISpeakButton() {
        return $(
            "#aiSpeak, " +
            "#ai-speak, " +
            "[data-ai-speak]"
        );
    }


    function findAIListenButton() {
        return $(
            "#aiListen, " +
            "#ai-listen, " +
            "[data-ai-listen]"
        );
    }


    function findAIClearButton() {
        return $(
            "#aiClear, " +
            "#ai-clear, " +
            "[data-ai-clear]"
        );
    }


    function appendMessage(role, text) {
        const output =
            findAIOutput();

        if (!output) return;

        const message =
            doc.createElement("div");

        message.className =
            `ai-message ai-message-${role}`;

        message.setAttribute(
            "data-ai-role",
            role
        );

        message.innerHTML =
            `<div class="ai-message-content">${
                escapeHTML(text)
                    .replace(
                        /\n/g,
                        "<br>"
                    )
            }</div>`;

        output.appendChild(message);

        /*
         * Scroll only the AI panel, not the entire page.
         */
        output.scrollTop =
            output.scrollHeight;
    }


    function showThinking() {
        const output =
            findAIOutput();

        if (!output) return null;

        const thinking =
            doc.createElement("div");

        thinking.className =
            "ai-message ai-message-assistant ai-thinking";

        thinking.innerHTML =
            `
                <div class="ai-message-content">
                    <span class="ai-thinking-dot"></span>
                    <span class="ai-thinking-dot"></span>
                    <span class="ai-thinking-dot"></span>
                </div>
            `;

        output.appendChild(thinking);

        output.scrollTop =
            output.scrollHeight;

        return thinking;
    }


    /* =====================================================
       SUBMIT MESSAGE
    ===================================================== */

    async function submitMessage(
        message = null
    ) {
        const input =
            findAIInput();

        const text =
            message !== null
                ? String(message).trim()
                : input
                    ? input.value.trim()
                    : "";

        if (!text) return;

        if (input) {
            input.value = "";
        }

        appendMessage(
            "user",
            text
        );

        const thinking =
            showThinking();

        /*
         * Slight delay makes the local agent feel natural
         * without creating a long artificial loading screen.
         */
        await wait(120);

        const response =
            await ask(text);

        if (thinking) {
            thinking.remove();
        }

        appendMessage(
            "assistant",
            response.text
        );

        win.dispatchEvent(
            new CustomEvent(
                "portfolio:ai-response",
                {
                    detail: response
                }
            )
        );

        return response;
    }


    /* =====================================================
       UI EVENT BINDINGS
    ===================================================== */

    function bindUI() {
        const input =
            findAIInput();

        const submit =
            findAISubmit();

        const speakButton =
            findAISpeakButton();

        const listenButton =
            findAIListenButton();

        const clearButton =
            findAIClearButton();

        if (submit) {
            submit.addEventListener(
                "click",
                () => {
                    submitMessage();
                }
            );
        }

        if (input) {
            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {
                        event.preventDefault();
                        submitMessage();
                    }
                }
            );
        }

        if (speakButton) {
            speakButton.addEventListener(
                "click",
                () => {

                    const messages =
                        $$(
                            ".ai-message-assistant"
                        );

                    const last =
                        messages[
                            messages.length - 1
                        ];

                    if (!last) return;

                    const text =
                        last.textContent.trim();

                    if (text) {
                        speak(text);
                    }
                }
            );
        }

        if (listenButton) {
            listenButton.addEventListener(
                "click",
                () => {

                    if (isListening) {
                        stopListening();
                    } else {
                        startListening();
                    }
                }
            );
        }

        if (clearButton) {
            clearButton.addEventListener(
                "click",
                clearSession
            );
        }


        /*
         * Voice transcript enters the AI automatically.
         */
        win.addEventListener(
            "portfolio:ai-voice-result",
            event => {

                const text =
                    event.detail?.text;

                if (!text) return;

                const input =
                    findAIInput();

                if (input) {
                    input.value = text;
                }

                submitMessage(text);
            }
        );
    }


    /* =====================================================
       QUICK PROMPT BUTTONS
       -----------------------------------------------------
       Example:

       <button data-ai-prompt="Tell me about the art">
           Explore Art
       </button>
    ===================================================== */

    function setupQuickPrompts() {
        $$("[data-ai-prompt]")
            .forEach(button => {

                if (
                    button.dataset.aiPromptReady ===
                    "true"
                ) {
                    return;
                }

                button.dataset.aiPromptReady =
                    "true";

                button.addEventListener(
                    "click",
                    () => {

                        const prompt =
                            button.dataset.aiPrompt;

                        if (prompt) {
                            submitMessage(prompt);
                        }
                    }
                );
            });
    }


    /* =====================================================
       CLEAR SESSION
    ===================================================== */

    function clearSession() {
        conversation = [];

        try {
            localStorage.removeItem(
                STORAGE_KEY
            );
        } catch (_) {}

        const output =
            findAIOutput();

        if (output) {
            output.innerHTML = "";
        }

        appendMessage(
            "assistant",
            "Session memory cleared. We can start fresh."
        );
    }


    /* =====================================================
       AI PUBLIC API
    ===================================================== */

    const ShadidAI = {

        /*
         * Main function.
         *
         * Example:
         *
         * const answer =
         *     await ShadidAI.ask("Tell me about the art");
         */
        ask,

        /*
         * Directly generate a local answer without
         * contacting a configured backend.
         */
        localAsk(message) {
            const response =
                generateResponse(message);

            addConversation(
                "user",
                message
            );

            addConversation(
                "assistant",
                response.text
            );

            return response;
        },

        search: searchPortfolio,

        speak,

        stopSpeaking,

        startListening,

        stopListening,

        clearSession,

        getCurrentSection,

        getDataValue,

        get history() {
            return conversation.slice();
        },

        get isListening() {
            return isListening;
        },

        get isSpeaking() {
            return isSpeaking;
        },

        get name() {
            return AI_NAME;
        }
    };

    win.ShadidAI = ShadidAI;


    /* =====================================================
       DATA READY EVENT
    ===================================================== */

    win.addEventListener(
        "portfolio:data-ready",
        () => {
            portfolioData =
                win.ShadidData || null;
        }
    );


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {
        loadPortfolioData();
        loadSession();
        setupSpeechRecognition();
        bindUI();
        setupQuickPrompts();

        /*
         * Make ASTRA available to any other portfolio
         * module immediately.
         */
        win.dispatchEvent(
            new CustomEvent(
                "portfolio:ai-ready",
                {
                    detail: {
                        name: AI_NAME,
                        local: true,
                        voice:
                            Boolean(
                                recognition
                            )
                    }
                }
            )
        );

        console.info(
            `[${AI_NAME}] Portfolio AI initialized.`
        );
    }


    if (
        doc.readyState ===
        "loading"
    ) {
        doc.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );
    } else {
        init();
    }

})();
