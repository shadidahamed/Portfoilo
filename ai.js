/* =========================================================
   SHADID PORTFOLIO AI
   Local adaptive brain + voice + multilingual interaction
========================================================= */

class PortfolioAI {

    constructor() {

        this.panel =
            document.getElementById("aiPanel");

        this.launchButton =
            document.getElementById("aiLaunchButton");

        this.closeButton =
            document.getElementById("aiClose");

        this.messages =
            document.getElementById("aiMessages");

        this.input =
            document.getElementById("aiInput");

        this.sendButton =
            document.getElementById("aiSendButton");

        this.micButton =
            document.getElementById("aiMicButton");

        this.typingMode =
            document.getElementById("typingModeButton");

        this.voiceMode =
            document.getElementById("voiceModeButton");

        this.stopButton =
            document.getElementById("aiStopButton");

        this.status =
            document.getElementById("aiStatus");

        this.suggestions =
            document.getElementById("aiSuggestions");

        this.mode = "typing";

        this.voiceActive = false;
        this.conversationActive = true;
        this.awaitingStopConfirmation = false;

        this.recognition = null;

        this.memory = {
            preferredLanguage: "auto",
            lastTopic: "",
            userPreferences: [],
            nickname: null
        };

        this.history = [];

        this.loadMemory();
        this.loadHistory();

        this.init();

    }


    /* =====================================================
       INIT
    ====================================================== */

    init() {

        this.setupEvents();
        this.setupSpeechRecognition();

        if (!this.history.length) {
            this.addBotMessage(
                this.localized(
                    "হ্যালো 👋 আমি Shadid-এর Portfolio AI। Portfolio, education, projects, drawing, architecture, সাধারণ জ্ঞান—যা জানতে চাও জিজ্ঞেস করতে পারো।",
                    "Hello 👋 I’m Shadid’s Portfolio AI. Ask me about the portfolio, education, projects, architecture, drawing, or general knowledge."
                )
            );
        } else {
            this.renderHistory();
        }

    }


    setupEvents() {

        this.launchButton.addEventListener(
            "click",
            () => this.togglePanel()
        );

        this.closeButton.addEventListener(
            "click",
            () => this.togglePanel(false)
        );

        this.sendButton.addEventListener(
            "click",
            () => this.send()
        );

        this.input.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {
                    event.preventDefault();
                    this.send();
                }

            }
        );

        this.micButton.addEventListener(
            "click",
            () => this.toggleVoice()
        );

        this.typingMode.addEventListener(
            "click",
            () => this.setMode("typing")
        );

        this.voiceMode.addEventListener(
            "click",
            () => this.setMode("voice")
        );

        this.stopButton.addEventListener(
            "click",
            () => this.stopConversation()
        );

        if (this.suggestions) {

            this.suggestions
                .querySelectorAll("button")
                .forEach((button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.input.value =
                                button.textContent;

                            this.send();

                        }
                    );

                });

        }

    }


    /* =====================================================
       PANEL
    ====================================================== */

    togglePanel(force) {

        const open =
            typeof force === "boolean"
                ? force
                : !this.panel.classList.contains("open");

        this.panel.classList.toggle(
            "open",
            open
        );

        document.body.classList.toggle(
            "ai-open",
            false
        );

        if (open) {

            this.input.focus();

            this.status.textContent =
                this.voiceActive
                    ? "Listening"
                    : "Online";

        }

    }


    /* =====================================================
       MODE
    ====================================================== */

    setMode(mode) {

        this.mode = mode;

        this.typingMode.classList.toggle(
            "active",
            mode === "typing"
        );

        this.voiceMode.classList.toggle(
            "active",
            mode === "voice"
        );

        if (mode === "voice") {

            this.toggleVoice(true);

        } else {

            this.toggleVoice(false);

        }

    }


    /* =====================================================
       SEND
    ====================================================== */

    async send() {

        const text =
            this.input.value.trim();

        if (!text) {
            return;
        }

        this.input.value = "";

        this.addUserMessage(text);

        this.learn(text);

        const language =
            this.detectLanguage(text);

        this.memory.preferredLanguage =
            language;

        this.saveMemory();

        const thinkingMessage =
            this.addThinkingMessage();

        const response =
            await this.generateResponse(
                text,
                language
            );

        thinkingMessage.remove();

        this.addBotMessage(
            response.text,
            true
        );

        if (response.action === "STOP") {

            setTimeout(() => {

                this.archiveConversation();

                this.stopVoice();

                this.togglePanel(false);

            }, 700);

        }

    }


    /* =====================================================
       RESPONSE ENGINE
    ====================================================== */

    async generateResponse(
        input,
        language
    ) {

        const normalized =
            input
                .toLowerCase()
                .replace(/[?!.,]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        /* conversation stop flow */

        if (
            this.awaitingStopConfirmation &&
            this.isPositiveConfirmation(normalized)
        ) {

            return {
                text: this.localized(
                    "ঠিক আছে। Conversation এখানেই stop করছি। পরে আবার এলে আগের history থাকবে।",
                    "Alright. I’ll stop the conversation here. When you return later, the conversation history will still be there."
                ),
                action: "STOP"
            };

        }

        if (
            this.awaitingStopConfirmation &&
            this.isNegativeConfirmation(normalized)
        ) {

            this.awaitingStopConfirmation = false;

            return {
                text: this.localized(
                    "ঠিক আছে 😄 তাহলে চালিয়ে যাই।",
                    "Alright 😄 Let’s keep going."
                )
            };

        }

        /* no more questions */

        if (this.isNoMoreQuestion(normalized)) {

            this.awaitingStopConfirmation = true;

            return {
                text: this.localized(
                    "ঠিক আছে। তাহলে কি আমরা conversation-টা stop করি?",
                    "Alright. Do you think we should stop the conversation here?"
                )
            };

        }


        /* greetings */

        if (
            /^(hi|hello|hey|assalamu|salam|হাই|হ্যালো|সালাম)/i
                .test(input)
        ) {

            return {
                text: this.localized(
                    "হ্যালো! 👋 কী জানতে চাও?",
                    "Hello! 👋 What would you like to know?"
                )
            };

        }


        /* human or AI */

        if (
            this.matches(
                normalized,
                [
                    "are you human",
                    "are you a human",
                    "তুমি কি মানুষ",
                    "মানুষ নাকি",
                    "তুমি মানুষ"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "না 😄 আমি AI agent। আমার হাত-পা নেই, কিন্তু conversation চালিয়ে যাওয়ার জন্য যথেষ্ট digital brain আছে।",
                    "No 😄 I’m an AI agent. No hands, no feet—but enough digital brain to keep the conversation going."
                )
            };

        }


        /* eating / sleeping / bathroom */

        if (
            this.matches(
                normalized,
                [
                    "how do you eat",
                    "what do you eat",
                    "how do you sleep",
                    "do you eat",
                    "do you poop",
                    "how do you poop",
                    "তুমি কিভাবে খাও",
                    "কি খাও",
                    "ঘুমাও কিভাবে",
                    "তুমি কি খাও",
                    "তুমি পায়খানা কর",
                    "পাছো কিভাবে"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "আমি software, তাই ভাত-ডাল, ঘুম বা bathroom schedule—কিছুই লাগে না 😄 আমার কাজ হলো data process করা আর তোমার সাথে কথা বলা।",
                    "I’m software, so I don’t need food, sleep or a bathroom schedule 😄 I process information and talk with you."
                )
            };

        }


        /* savage / joke */

        if (
            this.matches(
                normalized,
                [
                    "savage answer",
                    "roast me",
                    "roast yourself",
                    "funny answer",
                    "জাউরা",
                    "সেভেজ",
                    "রোস্ট"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "ঠিক আছে 😏 Savage mode available—কিন্তু এমন savage, যেটা শুনে হাসি পাবে, ambulance ডাকতে হবে না।",
                    "Alright 😏 Savage mode is available—but the kind that gets a laugh, not an ambulance."
                )
            };

        }


        /* identity */

        if (
            this.matches(
                normalized,
                [
                    "who is shadid",
                    "who is shadid ahamed",
                    "tell me about shadid",
                    "সাদিদ কে",
                    "শাদিদ কে",
                    "শাদিদ আহমেদ কে",
                    "শাদিদ সম্পর্কে বল"
                ]
            )
        ) {

            return {
                text: language === "bn"
                    ? PORTFOLIO_DATA.lifeStory.bangla
                    : language === "mixed"
                        ? `${PORTFOLIO_DATA.lifeStory.bangla}\n\n${PORTFOLIO_DATA.lifeStory.english}`
                        : PORTFOLIO_DATA.lifeStory.english
            };

        }


        /* how was shadid */

        if (
            this.matches(
                normalized,
                [
                    "how was shadid",
                    "what kind of person was shadid",
                    "how would you describe shadid",
                    "শাদিদ কেমন ছিল",
                    "শাদিদ কেমন মানুষ",
                    "শাদিদ কেমন ধরনের মানুষ ছিল"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদকে শুধু marks বা results দিয়ে describe করা ঠিক হবে না। তাকে describe করার সবচেয়ে বড় বিষয় ছিল তার persistence—বারবার বাধা, disappointment আর uncertainty-এর পরেও চেষ্টা করে যাওয়া, আঁকা, design করা, শেখা এবং নিজের future তৈরি করার চেষ্টা।",
                    "Shadid is better described through persistence than through marks or results. He kept trying, drawing, designing, learning and building toward a future even after setbacks, disappointment and uncertainty."
                )
            };

        }


        /* family */

        if (
            this.matches(
                normalized,
                [
                    "father",
                    "dad",
                    "বাবা",
                    "তোফায়েল",
                    "tofael"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদের বাবা তোফায়েল আহমেদ একজন পুলিশ ইন্সপেক্টর। তাঁর জীবনের গুরুত্বপূর্ণ দিকগুলো হলো duty, discipline, responsibility এবং family security।",
                    "Shadid’s father, Tofael Ahmed, is a police inspector. His life is strongly associated with duty, discipline, responsibility and family security."
                )
            };

        }


        if (
            this.matches(
                normalized,
                [
                    "mother",
                    "mom",
                    "মা",
                    "মায়ের"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদের মা একজন homemaker। পরিবারের দৈনন্দিন care, presence এবং emotional support-এর বড় অংশ তাঁর মাধ্যমে এসেছে।",
                    "Shadid’s mother is a homemaker. She is described through everyday care, presence and emotional support within the family."
                )
            };

        }


        if (
            this.matches(
                normalized,
                [
                    "wife",
                    "স্ত্রী",
                    "বউ"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদের স্ত্রী তাঁর personal life এবং future planning-এর গুরুত্বপূর্ণ একজন মানুষ—ভালোবাসার পাশাপাশি responsibility, future, finance এবং shared plans-ও সেই সম্পর্কের অংশ।",
                    "Shadid’s wife is an important part of his personal life and future planning, including shared responsibilities, future plans, finances and building a life together."
                )
            };

        }


        /* education */

        if (
            this.matches(
                normalized,
                [
                    "education",
                    "school",
                    "college",
                    "university",
                    "শিক্ষা",
                    "স্কুল",
                    "কলেজ",
                    "বিশ্ববিদ্যালয়"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদ 2013–2023 পর্যন্ত Motijheel Ideal School & College-এ Class 1–10 পড়েছে এবং SSC-তে GPA 5.00 Golden A+ পেয়েছে। 2023–2025 পর্যন্ত Notre Dame College-এ Science group-এ পড়ে HSC-তে GPA 5.00 Golden A+ পেয়েছে। 2026 থেকে BRAC University-তে Architecture নিয়ে শুরু করেছে এবং ভবিষ্যতে CSE-তে transition করার চেষ্টা করছে।",
                    "Shadid studied at Motijheel Ideal School & College from 2013–2023, completing Classes 1–10 and earning SSC GPA 5.00 with Golden A+. He studied Science at Notre Dame College from 2023–2025 and earned HSC GPA 5.00 with Golden A+. He started at BRAC University in 2026 in Architecture and is working toward a future transition into CSE."
                )
            };

        }


        /* skills */

        if (
            this.matches(
                normalized,
                [
                    "skills",
                    "what can he do",
                    "what is shadid good at",
                    "দক্ষতা",
                    "কী পারে",
                    "কি পারে"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "তার বড় creative areas হলো drawing, architectural graphics, physical modelling, design thinking, reading, music এবং web/digital projects। Architecture-এর পাশাপাশি HTML, CSS, JavaScript দিয়ে interactive websites ও game experiments-ও করেছে।",
                    "His major creative areas include drawing, architectural graphics, physical modelling, design thinking, reading, music and web/digital projects. Alongside architecture, he also builds interactive websites and game experiments with HTML, CSS and JavaScript."
                )
            };

        }


        /* books */

        if (
            this.matches(
                normalized,
                [
                    "books",
                    "book",
                    "literature",
                    "favorite writer",
                    "সাহিত্য",
                    "বই",
                    "প্রিয় লেখক",
                    "সমরেশ",
                    "হুমায়ূন"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদের favorite writer হিসেবে Shomresh Majumdar-এর নাম আছে। তাঁর পড়া/পছন্দের বইগুলোর মধ্যে Kalbela, Kalpurush, Uttaradhikar, Satkahon উল্লেখযোগ্য। Humayun Ahmed-এর Himu ও Amar Bondhu Rashed-ও পড়েছে। Bibhutibhushan Bandyopadhyay-এর Pather Panchali, Rabindranath Tagore, Kazi Nazrul Islam এবং Michael Madhusudan Dutt-এর লেখাতেও আগ্রহ আছে। Dhaka Comics-এর Protibastob series-ও তার খুব পছন্দের।",
                    "Shadid’s favorite writer is listed as Shomresh Majumdar. Books associated with his reading include Kalbela, Kalpurush, Uttaradhikar and Satkahon. He has also read Humayun Ahmed’s Himu and Amar Bondhu Rashed. He has interest in Bibhutibhushan Bandyopadhyay, Rabindranath Tagore, Kazi Nazrul Islam and Michael Madhusudan Dutt. Dhaka Comics’ Protibastob series is also a personal favorite."
                )
            };

        }


        /* projects */

        if (
            this.matches(
                normalized,
                [
                    "project",
                    "projects",
                    "portfolio projects",
                    "websites",
                    "games",
                    "architecture projects",
                    "প্রজেক্ট",
                    "প্রজেক্টস",
                    "ওয়েবসাইট",
                    "গেম"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "Digital side-এ TrendCart, personal portfolio এবং Office Engine game আছে। Architecture side-এ Lorry Lift, Squares & Grid, Line Signature, Interlock, Pavilion, Section Cutouts এবং Mosque-related studio work আছে।",
                    "The digital side includes TrendCart, the personal portfolio and the Office Engine game. The architecture side includes Lorry Lift, Squares & Grid, Line Signature, Interlock, Pavilion, Section Cutouts and Mosque-related studio work."
                )
            };

        }


        /* TrendCart */

        if (
            normalized.includes("trendcart")
        ) {

            return {
                text:
                    "TrendCart is one of Shadid’s web projects. You can open it from the Digital Projects section."
            };

        }


        /* Office Engine */

        if (
            normalized.includes("office engine") ||
            normalized.includes("game")
        ) {

            return {
                text: this.localized(
                    "Office Engine হলো Shadid-এর browser-based game experiment। এটা HTML, CSS আর JavaScript ব্যবহার করে interactive/3D-style visual experience তৈরির project.",
                    "Office Engine is Shadid’s browser-based game experiment, built around HTML, CSS and JavaScript with an interactive 3D-style visual experience."
                )
            };

        }


        /* contact */

        if (
            this.matches(
                normalized,
                [
                    "contact",
                    "email",
                    "phone",
                    "whatsapp",
                    "যোগাযোগ",
                    "ইমেইল",
                    "ফোন"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "Contact section-এ Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit এবং Tumblr-এর links আছে। CV-ও আলাদা section-এ আছে।",
                    "The Contact section contains Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit and Tumblr links. The CV is also available in a separate section."
                )
            };

        }


        /* location */

        if (
            this.matches(
                normalized,
                [
                    "where do you live",
                    "where is shadid",
                    "location",
                    "address",
                    "লোকেশন",
                    "ঠিকানা",
                    "কোথায় থাকে"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "Portfolio-র Contact section-এ Dhaka, Bangladesh location এবং Google Maps link দেওয়া আছে।",
                    "The Contact section provides Shadid’s Dhaka, Bangladesh location together with a Google Maps link."
                )
            };

        }


        /* CV */

        if (
            this.matches(
                normalized,
                [
                    "cv",
                    "resume",
                    "রেজুমে",
                    "সিভি"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "CV / Resume section থেকে Google Drive-এর CV open করা যাবে।",
                    "You can open the CV from the Resume / CV section through the Google Drive link."
                )
            };

        }


        /* current university */

        if (
            this.matches(
                normalized,
                [
                    "where does he study",
                    "current university",
                    "currently studying",
                    "কোথায় পড়ে",
                    "বর্তমানে কোথায় পড়ে"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "শাদিদ বর্তমানে BRAC University-তে Architecture Department-এ Summer 2026 batch-এর student। ভবিষ্যতে CSE-তে transition করার চেষ্টা করছে।",
                    "Shadid is currently a Summer 2026 student at BRAC University in the Architecture Department and is working toward a possible transition into CSE."
                )
            };

        }


        /* about assistant */

        if (
            this.matches(
                normalized,
                [
                    "how do you work",
                    "how does this ai work",
                    "তুমি কিভাবে কাজ কর",
                    "কিভাবে কাজ করো"
                ]
            )
        ) {

            return {
                text: this.localized(
                    "আমার একটা local portfolio brain আছে, conversation history থাকে, language detect করি, voice input/output করতে পারি এবং portfolio-related knowledge থেকে answer তৈরি করি। Unknown general-knowledge topic এ Wikipedia search fallback ব্যবহার করার চেষ্টা করি।",
                    "I have a local portfolio brain, conversation memory, language detection, voice input/output and portfolio-specific knowledge. For unknown general-knowledge topics, I can try a Wikipedia search fallback."
                )
            };

        }


        /* broad knowledge request */

        const wikiAnswer =
            await this.wikipediaFallback(
                input,
                language
            );

        if (wikiAnswer) {

            return {
                text: wikiAnswer
            };

        }


        /* adaptive playful response */

        if (
            this.looksPlayful(normalized)
        ) {

            return {
                text: this.localized(
                    "এই প্রশ্নটা serious না 😄 কিন্তু ঠিক আছে—আমি conversation চালাতে পারি। আরেকটু specific করে জিজ্ঞেস করো।",
                    "That question is definitely not serious 😄 but I can roll with it. Ask me something a little more specific."
                )
            };

        }


        /* default */

        return {
            text: this.localized(
                "আমি question-টা বুঝতে পেরেছি, কিন্তু এই তথ্যটা আমার portfolio brain-এ নেই। তুমি চাইলে অন্যভাবে জিজ্ঞেস করতে পারো, আর general knowledge হলে আমি Wikipedia থেকে খুঁজে দেখার চেষ্টা করতে পারি।",
                "I understood the question, but that specific fact is not in my portfolio brain. You can ask it another way, or I can try a Wikipedia lookup for general knowledge."
            )
        };

    }


    /* =====================================================
       WIKIPEDIA FALLBACK
    ====================================================== */

    async wikipediaFallback(
        query,
        language
    ) {

        const lang =
            language === "bn"
                ? "bn"
                : "en";

        try {

            const searchUrl =
                `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`;

            const response =
                await fetch(searchUrl);

            if (!response.ok) {
                return null;
            }

            const data =
                await response.json();

            const result =
                data?.query?.search?.[0];

            if (!result) {
                return null;
            }

            const title =
                result.title;

            const summaryUrl =
                `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

            const summaryResponse =
                await fetch(summaryUrl);

            if (!summaryResponse.ok) {
                return null;
            }

            const summary =
                await summaryResponse.json();

            if (!summary.extract) {
                return null;
            }

            const clean =
                summary.extract
                    .replace(/\s+/g, " ")
                    .trim();

            return this.localized(
                `${title}: ${clean}`,
                `${title}: ${clean}`
            );

        } catch (error) {

            return null;

        }

    }


    /* =====================================================
       LANGUAGE
    ====================================================== */

    detectLanguage(text) {

        const hasBangla =
            /[\u0980-\u09FF]/.test(text);

        const hasEnglish =
            /[A-Za-z]/.test(text);

        if (hasBangla && hasEnglish) {
            return "mixed";
        }

        if (hasBangla) {
            return "bn";
        }

        return "en";

    }


    localized(
        bangla,
        english
    ) {

        switch (
            this.memory.preferredLanguage
        ) {

            case "bn":
                return bangla;

            case "mixed":
                return `${bangla}\n\n${english}`;

            default:
                return english;

        }

    }


    /* =====================================================
       MEMORY
    ====================================================== */

    learn(text) {

        const normalized =
            text.toLowerCase();

        if (
            normalized.includes("call me ")
        ) {

            const nickname =
                text
                    .split(/call me /i)[1]
                    ?.trim();

            if (nickname) {
                this.memory.nickname =
                    nickname.slice(0, 40);
            }

        }

        if (
            /বাংলা|bangla/i.test(text)
        ) {

            this.memory.preferredLanguage = "bn";

        }

        if (
            /english/i.test(text)
        ) {

            this.memory.preferredLanguage = "en";

        }

        this.memory.lastTopic =
            text.slice(0, 120);

        this.saveMemory();

    }


    saveMemory() {

        localStorage.setItem(
            "shadid_ai_memory",
            JSON.stringify(this.memory)
        );

    }


    loadMemory() {

        try {

            const raw =
                localStorage.getItem(
                    "shadid_ai_memory"
                );

            if (raw) {

                this.memory =
                    {
                        ...this.memory,
                        ...JSON.parse(raw)
                    };

            }

        } catch {

            /* ignore */

        }

    }


    /* =====================================================
       HISTORY
    ====================================================== */

    loadHistory() {

        try {

            const raw =
                localStorage.getItem(
                    "shadid_ai_history"
                );

            this.history =
                raw
                    ? JSON.parse(raw)
                    : [];

            if (
                !Array.isArray(this.history)
            ) {
                this.history = [];
            }

        } catch {

            this.history = [];

        }

    }


    saveHistory() {

        const reduced =
            this.history.slice(-80);

        localStorage.setItem(
            "shadid_ai_history",
            JSON.stringify(reduced)
        );

    }


    archiveConversation() {

        this.conversationActive = false;

        this.saveHistory();

    }


    renderHistory() {

        this.messages.innerHTML = "";

        this.history.forEach(
            (message) => {

                const div =
                    document.createElement("div");

                div.className =
                    `ai-message ${message.role}`;

                div.textContent =
                    message.text;

                this.messages.appendChild(div);

            }
        );

        this.scrollToBottom();

    }


    /* =====================================================
       MESSAGE UI
    ====================================================== */

    addUserMessage(text) {

        this.addMessage(
            "user",
            text,
            false
        );

    }


    addBotMessage(
        text,
        speak = false
    ) {

        this.addMessage(
            "bot",
            text,
            speak
        );

    }


    addMessage(
        role,
        text,
        speak = false
    ) {

        const div =
            document.createElement("div");

        div.className =
            `ai-message ${role}`;

        div.textContent =
            text;

        this.messages.appendChild(div);

        this.history.push({
            role,
            text,
            timestamp:
                Date.now()
        });

        this.saveHistory();

        this.scrollToBottom();

        if (
            speak &&
            (
                this.mode === "voice" ||
                this.voiceActive
            )
        ) {

            this.speak(text);

        }

    }


    addThinkingMessage() {

        const div =
            document.createElement("div");

        div.className =
            "ai-message system";

        div.textContent =
            this.localized(
                "ভাবছি...",
                "Thinking..."
            );

        this.messages.appendChild(div);

        this.scrollToBottom();

        return div;

    }


    scrollToBottom() {

        this.messages.scrollTop =
            this.messages.scrollHeight;

    }


    /* =====================================================
       SPEECH RECOGNITION
    ====================================================== */

    setupSpeechRecognition() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            this.status.textContent =
                "Typing only";

            this.micButton.disabled =
                true;

            return;

        }

        this.recognition =
            new SpeechRecognition();

        this.recognition.continuous =
            true;

        this.recognition.interimResults =
            true;

        this.recognition.maxAlternatives =
            1;

        this.recognition.lang =
            "en-US";


        this.recognition.onstart =
            () => {

                this.voiceActive = true;

                this.micButton.classList.add(
                    "listening"
                );

                this.status.textContent =
                    "Listening";

            };


        this.recognition.onresult =
            (event) => {

                let finalText = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];

                    const transcript =
                        result[0].transcript;

                    if (
                        result.isFinal
                    ) {

                        finalText +=
                            transcript;

                    }

                }

                if (finalText.trim()) {

                    this.input.value =
                        finalText.trim();

                    this.send();

                }

            };


        this.recognition.onerror =
            (event) => {

                if (
                    event.error ===
                    "not-allowed"
                ) {

                    this.status.textContent =
                        "Microphone blocked";

                    this.voiceActive =
                        false;

                    this.micButton.classList.remove(
                        "listening"
                    );

                }

            };


        this.recognition.onend =
            () => {

                if (
                    this.voiceActive
                ) {

                    setTimeout(() => {

                        try {

                            this.recognition.start();

                        } catch {

                            /* already running */

                        }

                    }, 250);

                } else {

                    this.status.textContent =
                        "Online";

                }

            };

    }


    toggleVoice(force) {

        if (!this.recognition) {
            return;
        }

        const shouldListen =
            typeof force === "boolean"
                ? force
                : !this.voiceActive;

        if (shouldListen) {

            this.mode = "voice";

            const language =
                this.memory.preferredLanguage;

            this.recognition.lang =
                language === "bn"
                    ? "bn-BD"
                    : "en-US";

            try {
                this.recognition.start();
            } catch {
                /* already started */
            }

        } else {

            this.stopVoice();

        }

    }


    stopVoice() {

        this.voiceActive =
            false;

        this.micButton.classList.remove(
            "listening"
        );

        if (this.recognition) {

            try {
                this.recognition.stop();
            } catch {
                /* ignore */
            }

        }

        if (this.status) {
            this.status.textContent =
                "Online";
        }

    }


    /* =====================================================
       TTS
    ====================================================== */

    speak(text) {

        if (
            !("speechSynthesis" in window)
        ) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        const language =
            this.detectLanguage(text);

        utterance.lang =
            language === "bn"
                ? "bn-BD"
                : "en-US";

        utterance.rate = 1;
        utterance.pitch = 1;

        const voices =
            window.speechSynthesis.getVoices();

        if (voices.length) {

            let selected =
                voices.find(
                    voice =>
                        language === "bn"
                            ? /bn|bengali/i.test(
                                voice.lang +
                                " " +
                                voice.name
                            )
                            : /en-US|en-GB/i.test(
                                voice.lang
                            )
                );

            if (!selected) {
                selected = voices[0];
            }

            utterance.voice =
                selected;

        }

        window.speechSynthesis.speak(
            utterance
        );

    }


    /* =====================================================
       HELPERS
    ====================================================== */

    matches(
        text,
        phrases
    ) {

        return phrases.some(
            phrase =>
                text.includes(
                    phrase
                )
        );

    }


    looksPlayful(text) {

        return (
            /lol|haha|😂|😏|joke|funny|why are you|তুমি কি পাগল|মজা/i
                .test(text)
        );

    }


    isNoMoreQuestion(text) {

        return (
            /no more questions|nothing else|that's all|thats all|আর প্রশ্ন নেই|আর কিছু নেই|আর কিছু জিজ্ঞেস করার নেই|প্রশ্ন নাই/i
                .test(text)
        );

    }


    isPositiveConfirmation(text) {

        return (
            /^(yes|yeah|yep|sure|okay|ok|do it|stop|stop it|করো|হ্যাঁ|হ্যা|ঠিক আছে|স্টপ)/i
                .test(text)
        );

    }


    isNegativeConfirmation(text) {

        return (
            /^(no|nope|not yet|keep going|না|না চলুক|এখন না|চালাও)/i
                .test(text)
        );

    }


    /* =====================================================
       STOP CONVERSATION
    ====================================================== */

    stopConversation() {

        this.awaitingStopConfirmation =
            false;

        this.conversationActive =
            false;

        this.stopVoice();

        this.addBotMessage(
            this.localized(
                "Conversation pause করা হলো। পরে আবার open করলে history থাকবে।",
                "The conversation is paused. Your history will still be here when you open me again."
            )
        );

        setTimeout(() => {

            this.togglePanel(false);

        }, 400);

    }

}


/* =========================================================
   START AI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.portfolioAI =
            new PortfolioAI();

    }
);
