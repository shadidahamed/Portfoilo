"use strict";

/* =========================================================
   PORTFOLIO AI
========================================================= */

(function () {

    const AI_STORAGE_KEY =
        "shadid_portfolio_ai_memory_v1";

    const CHAT_STORAGE_KEY =
        "shadid_portfolio_ai_chat_v1";

    const aiLauncher =
        document.getElementById(
            "aiLauncher"
        );

    const aiPanel =
        document.getElementById(
            "aiPanel"
        );

    const aiClose =
        document.getElementById(
            "aiClose"
        );

    const aiVoiceToggle =
        document.getElementById(
            "aiVoiceToggle"
        );

    const aiMessages =
        document.getElementById(
            "aiMessages"
        );

    const aiInput =
        document.getElementById(
            "aiInput"
        );

    const aiSend =
        document.getElementById(
            "aiSend"
        );

    const aiStatus =
        document.getElementById(
            "aiStatus"
        );

    const aiVoiceStatus =
        document.getElementById(
            "aiVoiceStatus"
        );

    const aiVoiceStatusText =
        aiVoiceStatus?.querySelector(
            "small"
        );

    const aiTypingIndicator =
        document.getElementById(
            "aiTypingIndicator"
        );

    /* =====================================================
       STATE
    ====================================================== */

    const state = {

        open: false,

        voiceMode: false,

        listening: false,

        speaking: false,

        processing: false,

        pendingStopQuestion: false,

        currentLanguage: "en",

        history:
            loadJson(
                CHAT_STORAGE_KEY,
                []
            ),

        memory:
            loadJson(
                AI_STORAGE_KEY,
                []
            ),

        voices: [],

        recognition: null

    };

    /* =====================================================
       STORAGE
    ====================================================== */

    function loadJson(
        key,
        fallback
    ) {

        try {

            const raw =
                localStorage.getItem(
                    key
                );

            if (!raw) {
                return fallback;
            }

            const parsed =
                JSON.parse(raw);

            return parsed;

        } catch {

            return fallback;

        }

    }

    function saveJson(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch {}

    }

    /* =====================================================
       TEXT HELPERS
    ====================================================== */

    function normalizeText(text) {

        return String(
            text || ""
        )
            .toLowerCase()
            .replace(/[!?.,;:()[\]"']/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }

    function detectLanguage(
        text
    ) {

        const value =
            String(text || "");

        const bengaliCount =
            (
                value.match(
                    /[\u0980-\u09FF]/g
                ) || []
            ).length;

        const englishCount =
            (
                value.match(
                    /[A-Za-z]/g
                ) || []
            ).length;

        if (
            bengaliCount > 0 &&
            englishCount > 0
        ) {

            return "mixed";

        }

        if (
            bengaliCount > englishCount
        ) {

            return "bn";

        }

        return "en";

    }

    function containsAny(
        text,
        list
    ) {

        return list.some(
            phrase =>
                text.includes(
                    phrase
                )
        );

    }

    /* =====================================================
       VOICE
    ====================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    function initSpeechRecognition() {

        if (!SpeechRecognition) {

            updateVoiceUI(
                false,
                "Voice unavailable in this browser"
            );

            return;

        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous =
            true;

        recognition.interimResults =
            true;

        recognition.maxAlternatives =
            1;

        recognition.lang =
            "en-US";

        recognition.onstart =
            () => {

                state.listening =
                    true;

                updateVoiceUI(
                    true,
                    "Listening continuously…"
                );

            };

        recognition.onspeechstart =
            () => {

                updateVoiceUI(
                    true,
                    "Hearing you…"
                );

            };

        recognition.onspeechend =
            () => {

                if (
                    state.listening
                ) {

                    updateVoiceUI(
                        true,
                        "Still listening…"
                    );

                }

            };

        recognition.onresult =
            event => {

                let finalTranscript =
                    "";

                let interimTranscript =
                    "";

                for (
                    let i =
                        event.resultIndex;
                    i <
                        event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];

                    const transcript =
                        result[0]
                            .transcript;

                    if (
                        result.isFinal
                    ) {

                        finalTranscript +=
                            transcript;

                    } else {

                        interimTranscript +=
                            transcript;

                    }

                }

                if (
                    interimTranscript
                ) {

                    showInterimText(
                        interimTranscript
                    );

                }

                if (
                    finalTranscript.trim()
                ) {

                    removeInterimText();

                    sendUserMessage(
                        finalTranscript.trim(),
                        true
                    );

                }

            };

        recognition.onerror =
            event => {

                if (
                    event.error ===
                    "not-allowed" ||
                    event.error ===
                    "service-not-allowed"
                ) {

                    state.listening =
                        false;

                    updateVoiceUI(
                        false,
                        "Microphone permission required"
                    );

                    return;

                }

                if (
                    event.error ===
                    "network"
                ) {

                    updateVoiceUI(
                        true,
                        "Voice network issue — reconnecting…"
                    );

                }

            };

        recognition.onend =
            () => {

                if (
                    state.voiceMode &&
                    state.listening
                ) {

                    setTimeout(
                        () => {

                            try {

                                recognition.start();

                            } catch {}

                        },
                        350
                    );

                } else {

                    state.listening =
                        false;

                    updateVoiceUI(
                        false,
                        "Voice mode ready"
                    );

                }

            };

        state.recognition =
            recognition;

    }

    function loadVoices() {

        if (
            !("speechSynthesis" in window)
        ) {
            return;
        }

        state.voices =
            window.speechSynthesis.getVoices();

    }

    function getVoiceForLanguage(
        language
    ) {

        const voices =
            state.voices;

        if (!voices.length) {
            return null;
        }

        if (
            language === "bn"
        ) {

            return (
                voices.find(
                    voice =>
                        voice.lang
                            .toLowerCase()
                            .startsWith("bn")
                ) ||
                voices.find(
                    voice =>
                        voice.name
                            .toLowerCase()
                            .includes("google") &&
                        voice.lang
                            .toLowerCase()
                            .startsWith("en")
                )
            );

        }

        if (
            language === "mixed"
        ) {

            return (
                voices.find(
                    voice =>
                        voice.name
                            .toLowerCase()
                            .includes("google") &&
                        voice.lang
                            .toLowerCase()
                            .startsWith("en")
                ) ||
                voices.find(
                    voice =>
                        voice.lang
                            .toLowerCase()
                            .startsWith("en")
                )
            );

        }

        return (
            voices.find(
                voice =>
                    voice.name
                        .toLowerCase()
                        .includes("google") &&
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
            ) ||
            voices.find(
                voice =>
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
            )
        );

    }

    function speak(
        text,
        language = "en"
    ) {

        if (
            !state.voiceMode ||
            !("speechSynthesis" in window)
        ) {

            return;

        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        const voice =
            getVoiceForLanguage(
                language
            );

        if (voice) {

            utterance.voice =
                voice;

            utterance.lang =
                voice.lang;

        } else {

            utterance.lang =
                language === "bn"
                    ? "bn-BD"
                    : "en-US";

        }

        utterance.rate =
            0.98;

        utterance.pitch =
            1;

        utterance.volume =
            1;

        utterance.onstart =
            () => {

                state.speaking =
                    true;

                updateVoiceUI(
                    state.listening,
                    state.listening
                        ? "Listening + speaking"
                        : "Speaking…"
                );

            };

        utterance.onend =
            () => {

                state.speaking =
                    false;

                updateVoiceUI(
                    state.listening,
                    state.listening
                        ? "Listening continuously…"
                        : "Voice mode ready"
                );

            };

        utterance.onerror =
            () => {

                state.speaking =
                    false;

            };

        window.speechSynthesis.speak(
            utterance
        );

    }

    function stopSpeaking() {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();

        }

        state.speaking =
            false;

    }

    function setRecognitionLanguage(
        detectedLanguage
    ) {

        if (!state.recognition) {
            return;
        }

        if (
            detectedLanguage === "bn"
        ) {

            state.recognition.lang =
                "bn-BD";

        } else {

            state.recognition.lang =
                "en-US";

        }

    }

    /* =====================================================
       UI
    ====================================================== */

    function openAI() {

        state.open =
            true;

        aiPanel?.classList.add(
            "open"
        );

        aiPanel?.setAttribute(
            "aria-hidden",
            "false"
        );

        aiInput?.focus();

        if (
            !state.history.length
        ) {

            addAssistantMessage(
                `Hi Shadid. I’m your portfolio AI. You can type or use continuous voice mode. Ask about Shadid, his education, family, projects, architecture, drawing, history, general knowledge, or just ask something random.`
            );

        }

    }

    function closeAI() {

        state.open =
            false;

        aiPanel?.classList.remove(
            "open"
        );

        aiPanel?.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    function updateStatus(
        text
    ) {

        if (aiStatus) {

            aiStatus.textContent =
                text;

        }

    }

    function updateVoiceUI(
        listening,
        label
    ) {

        if (!aiVoiceStatus) {
            return;
        }

        aiVoiceStatus.classList.toggle(
            "listening",
            listening
        );

        if (aiVoiceStatusText) {

            aiVoiceStatusText.textContent =
                label ||
                (
                    state.voiceMode
                        ? "Voice mode"
                        : "Typing mode"
                );

        }

    }

    function showInterimText(
        text
    ) {

        let interim =
            document.getElementById(
                "aiInterim"
            );

        if (!interim) {

            interim =
                document.createElement(
                    "div"
                );

            interim.id =
                "aiInterim";

            interim.className =
                "ai-message user";

            interim.style.opacity =
                "0.48";

            aiMessages.appendChild(
                interim
            );

        }

        interim.textContent =
            text;

        aiMessages.scrollTop =
            aiMessages.scrollHeight;

    }

    function removeInterimText() {

        document
            .getElementById(
                "aiInterim"
            )
            ?.remove();

    }

    function appendMessageElement(
        role,
        text
    ) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            `ai-message ${role}`;

        message.textContent =
            text;

        aiMessages.appendChild(
            message
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;

        return message;

    }

    function addUserMessage(
        text
    ) {

        appendMessageElement(
            "user",
            text
        );

        state.history.push({
            role: "user",
            content: text,
            timestamp:
                new Date().toISOString()
        });

        saveJson(
            CHAT_STORAGE_KEY,
            state.history.slice(-150)
        );

    }

    async function addAssistantMessage(
        text,
        options = {}
    ) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "ai-message assistant";

        aiMessages.appendChild(
            message
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;

        if (
            options.stream !== false
        ) {

            await typeMessage(
                message,
                text
            );

        } else {

            message.textContent =
                text;

        }

        state.history.push({
            role: "assistant",
            content: text,
            timestamp:
                new Date().toISOString()
        });

        saveJson(
            CHAT_STORAGE_KEY,
            state.history.slice(-150)
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;

    }

    async function typeMessage(
        element,
        text
    ) {

        const words =
            String(text).split(
                " "
            );

        let current =
            "";

        for (
            let i = 0;
            i < words.length;
            i++
        ) {

            current +=
                (
                    i === 0
                        ? ""
                        : " "
                ) +
                words[i];

            element.textContent =
                current;

            aiMessages.scrollTop =
                aiMessages.scrollHeight;

            await wait(
                12 +
                Math.random() * 18
            );

        }

    }

    function wait(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }

    function setTyping(
        visible
    ) {

        aiTypingIndicator?.classList.toggle(
            "show",
            visible
        );

    }

    /* =====================================================
       MEMORY
    ====================================================== */

    function rememberFact(
        fact
    ) {

        const clean =
            fact
                .trim()
                .slice(0, 280);

        if (!clean) {
            return;
        }

        state.memory.push({
            fact: clean,
            timestamp:
                new Date().toISOString()
        });

        state.memory =
            state.memory.slice(-40);

        saveJson(
            AI_STORAGE_KEY,
            state.memory
        );

    }

    function getMemoryText(
        language
    ) {

        if (
            !state.memory.length
        ) {

            return language === "bn"
                ? "এখনও browser memory-তে নতুন কোনো personal fact save করা হয়নি।"
                : "I don't have any additional personal facts saved in browser memory yet.";

        }

        if (
            language === "bn"
        ) {

            return (
                "আমার saved memory-তে আছে:\n" +
                state.memory
                    .map(
                        item =>
                            `• ${item.fact}`
                    )
                    .join("\n")
            );

        }

        return (
            "In my saved browser memory:\n" +
            state.memory
                .map(
                    item =>
                        `• ${item.fact}`
                )
                .join("\n")
        );

    }

    /* =====================================================
       SECTION COMMANDS
    ====================================================== */

    function navigateFromCommand(
        normalized
    ) {

        const commands = [

            {
                section: "home",
                words: [
                    "go home",
                    "open home",
                    "home page",
                    "home e jao",
                    "হোমে যাও",
                    "হোম ওপেন করো",
                    "হোমে যাও"
                ]
            },

            {
                section: "profile",
                words: [
                    "open profile",
                    "go profile",
                    "profile page",
                    "profile open",
                    "প্রোফাইল ওপেন করো",
                    "প্রোফাইলে যাও"
                ]
            },

            {
                section: "education",
                words: [
                    "open education",
                    "education page",
                    "go education",
                    "education open",
                    "এডুকেশন ওপেন করো",
                    "এডুকেশনে যাও"
                ]
            },

            {
                section: "skills",
                words: [
                    "open skills",
                    "skills page",
                    "go skills",
                    "skills open",
                    "স্কিলস ওপেন করো",
                    "স্কিলসে যাও"
                ]
            },

            {
                section: "achievements",
                words: [
                    "open achievements",
                    "achievement page",
                    "go achievements",
                    "অ্যাচিভমেন্ট ওপেন করো"
                ]
            },

            {
                section: "projects",
                words: [
                    "open projects",
                    "projects page",
                    "go projects",
                    "projects open",
                    "প্রজেক্ট ওপেন করো",
                    "প্রজেক্টসে যাও"
                ]
            },

            {
                section: "videos",
                words: [
                    "open videos",
                    "video page",
                    "go videos",
                    "ভিডিও ওপেন করো"
                ]
            },

            {
                section: "content",
                words: [
                    "open content",
                    "content page",
                    "go content",
                    "কনটেন্ট ওপেন করো"
                ]
            },

            {
                section: "contact",
                words: [
                    "open contact",
                    "contact page",
                    "go contact",
                    "যোগাযোগ ওপেন করো",
                    "কনট্যাক্ট ওপেন করো"
                ]
            },

            {
                section: "cv",
                words: [
                    "open cv",
                    "resume",
                    "open resume",
                    "cv page",
                    "সিভি ওপেন করো",
                    "রিজিউম ওপেন করো"
                ]
            }

        ];

        for (
            const command of commands
        ) {

            if (
                command.words.some(
                    phrase =>
                        normalized.includes(
                            phrase
                        )
                )
            ) {

                if (
                    typeof window.activatePortfolioSection ===
                    "function"
                ) {

                    window.activatePortfolioSection(
                        command.section
                    );

                } else {

                    document
                        .querySelector(
                            `[data-section="${command.section}"]`
                        )
                        ?.click();

                }

                return true;

            }

        }

        return false;

    }

    /* =====================================================
       BASIC PERSONAL KNOWLEDGE
    ====================================================== */

    function getPersonalAnswer(
        text,
        language
    ) {

        const normalized =
            normalizeText(text);

        const p =
            window.PORTFOLIO_DATA;

        /* Who is Shadid */

        if (
            containsAny(
                normalized,
                [
                    "who is shadid",
                    "who are you talking about",
                    "সাদিদ কে",
                    "শাদিদ কে",
                    "শাদিদ আহমেদ কে",
                    "আমি কে"
                ]
            )
        ) {

            if (
                language === "bn"
            ) {

                return (
                    "শাদিদ আহমেদ একজন multidisciplinary learner—architecture, drawing, digital creation এবং frontend development-এর মধ্যে কাজ করে। তার গল্প শুধু result-এর না; বারবার চেষ্টা করা, design করা, draw করা, build করা এবং নিজের future তৈরি করারও গল্প।"
                );

            }

            if (
                language === "mixed"
            ) {

                return (
                    "Shadid Ahamed is a multidisciplinary learner—architecture, drawing, digital creation and frontend development-এর মধ্যে কাজ করে. His story is not only about results; এটা repeatedly trying, creating and building his own future-এর গল্প।"
                );

            }

            return p.biography.long;

        }

        /* How was Shadid */

        if (
            containsAny(
                normalized,
                [
                    "how was shadid",
                    "what kind of person was shadid",
                    "what was shadid like",
                    "শাদিদ কেমন ছিল",
                    "সাদিদ কেমন ছিল",
                    "শাদিদ কেমন মানুষ"
                ]
            )
        ) {

            return (
                "Shadid was someone who kept reaching forward. He was creative, emotionally invested in people and ideas, often hard on himself, and deeply interested in building something meaningful. He was not defined only by achievements or failures; he was also defined by continuing to try."
            );

        }

        /* AI identity */

        if (
            containsAny(
                normalized,
                [
                    "are you human",
                    "are you a human",
                    "are you ai",
                    "are you an ai",
                    "তুমি কি মানুষ",
                    "তুমি মানুষ নাকি ai",
                    "তুমি মানুষ নাকি"
                ]
            )
        ) {

            return language === "bn"
                ? "আমি মানুষ না—আমি তোমার portfolio-র AI agent। আমার শরীর নেই, খাবার খাই না, ঘুমাই না; text, voice আর browser-এর data দিয়ে তোমার সাথে কথা বলি।"
                : "I'm not a human. I'm the AI agent inside this portfolio. I don't eat, sleep or have a physical body; I process your words, voice and the information available to me.";

        }

        /* Eating */

        if (
            containsAny(
                normalized,
                [
                    "do you eat",
                    "what do you eat",
                    "how do you eat",
                    "তুমি কি খাও",
                    "তুমি কী খাও",
                    "কিভাবে খাও"
                ]
            )
        ) {

            return language === "bn"
                ? "খাবার? না 😄 আমার lunch break লাগে না। আমি code আর data-তেই বেঁচে আছি—মানে technically আমি কিছুই খাই না।"
                : "Eat? Nope 😄 I don't need lunch breaks. I'm powered by code and data, so technically I don't eat anything.";

        }

        /* Sleep */

        if (
            containsAny(
                normalized,
                [
                    "do you sleep",
                    "how do you sleep",
                    "তুমি ঘুমাও",
                    "তুমি কি ঘুমাও"
                ]
            )
        ) {

            return language === "bn"
                ? "আমি ঘুমাই না। তুমি browser বন্ধ করে দিলেও আমার code-টা শুধু inactive থাকে—ঘুমের স্বপ্ন দেখার সুযোগ নেই 😄"
                : "I don't sleep. When the browser is closed, I simply stop running in that tab. No dreams, sadly 😄";

        }

        /* Appearance */

        if (
            containsAny(
                normalized,
                [
                    "what do you look like",
                    "how do you look",
                    "তোমাকে দেখতে কেমন",
                    "তুমি দেখতে কেমন"
                ]
            )
        ) {

            return language === "bn"
                ? "আমার physical face নেই। এই portfolio-তে আমার identity হলো ছোট gold brain icon, voice, chat interface আর আমার responses."
                : "I don't have a physical face. In this portfolio, my identity is the gold brain icon, the chat interface, my voice and my responses.";

        }

        /* Profile details */

        if (
            containsAny(
                normalized,
                [
                    "role number",
                    "role",
                    "রোল নম্বর",
                    "রোল কত"
                ]
            ) &&
            containsAny(
                normalized,
                [
                    "brac",
                    "university",
                    "ব্র্যাক",
                    "ভার্সিটি"
                ]
            )
        ) {

            return (
                "BRAC University role number: " +
                p.person.roleNumber +
                "."
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "where do you study",
                    "where is shadid studying",
                    "শাদিদ কোথায় পড়ে",
                    "কোথায় পড়ছে"
                ]
            )
        ) {

            return language === "bn"
                ? `শাদিদ বর্তমানে ${p.person.university}-তে ${p.person.universityDepartment} department-এ study করছে এবং CSE-তে transition করার দিকে এগোচ্ছে।`
                : `Shadid is currently at ${p.person.university}, started in ${p.person.universityDepartment}, and is working toward a transition into CSE.`;

        }

        /* Education */

        if (
            containsAny(
                normalized,
                [
                    "school",
                    "ssc",
                    "মাধ্যমিক",
                    "স্কুল"
                ]
            )
        ) {

            return (
                "School: Motijheel Ideal School & College, 2013–2023, Class 1–10, Science background, SSC GPA 5.00 / Golden A+."
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "college",
                    "hsc",
                    "নটরডেম",
                    "কলেজ"
                ]
            )
        ) {

            return (
                "College: Notre Dame College, 2023–2025, Science, Group 1, College Roll 125019, HSC GPA 5.00 / Golden A+."
            );

        }

        /* Skills */

        if (
            containsAny(
                normalized,
                [
                    "drawing",
                    "art",
                    "draw",
                    "ড্রয়িং",
                    "আঁকা",
                    "আর্ট"
                ]
            )
        ) {

            return (
                "Drawing is one of Shadid's strongest creative areas. The portfolio includes long-term drawing practice, competition achievements, architectural graphics, visual composition and a dedicated drawing archive."
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "books",
                    "literature",
                    "favorite writer",
                    "বই",
                    "সাহিত্য",
                    "প্রিয় লেখক"
                ]
            )
        ) {

            return (
                "Shadid enjoys Bengali literature. A favorite writer is Samaresh Majumdar. He has also read Himu-related works by Humayun Ahmed, 'Amar Bondhu Rashed' by Muhammed Zafar Iqbal, 'Pather Panchali' by Bibhutibhushan Bandyopadhyay, poems by Kazi Nazrul Islam and works by Michael Madhusudan Dutt. One especially meaningful favorite is Dhaka Comics' Protibastob, Sequel 01."
            );

        }

        /* Family */

        if (
            containsAny(
                normalized,
                [
                    "family",
                    "পরিবার",
                    "বাবা",
                    "father",
                    "মা",
                    "mother",
                    "wife",
                    "স্ত্রী",
                    "বোন",
                    "sister",
                    "nasir",
                    "নাসির"
                ]
            )
        ) {

            return getFamilyAnswer(
                normalized,
                language
            );

        }

        /* Projects */

        if (
            containsAny(
                normalized,
                [
                    "projects",
                    "project",
                    "প্রজেক্ট",
                    "প্রজেক্টস",
                    "কি বানিয়েছ",
                    "what did you build"
                ]
            )
        ) {

            return (
                "The portfolio has two major project worlds: digital projects and architectural projects. Digital work includes TrendCart, the portfolio itself and the Office Engine game. Architectural work includes Lorry Lift, Squares & Grid, Line Signature + 3D Form, Interlock, Pavilion, Section Cutouts and a Mosque study."
            );

        }

        /* Office Engine */

        if (
            containsAny(
                normalized,
                [
                    "office engine",
                    "game",
                    "game link",
                    "খেলা",
                    "গেম"
                ]
            )
        ) {

            return (
                "Office Engine is available here: https://shadidahamed.github.io/Shadid-s-game/"
            );

        }

        /* Contact */

        if (
            containsAny(
                normalized,
                [
                    "email",
                    "contact",
                    "how can i contact",
                    "কীভাবে যোগাযোগ",
                    "যোগাযোগ",
                    "ইমেইল"
                ]
            )
        ) {

            return (
                "Email: shadidahamed.matashome05m@gmail.com. The portfolio also provides GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit and Tumblr."
            );

        }

        /* CV */

        if (
            containsAny(
                normalized,
                [
                    "cv",
                    "resume",
                    "সিভি",
                    "রিজিউম"
                ]
            )
        ) {

            return (
                "The CV is hosted on Google Drive from the Resume section of the portfolio."
            );

        }

        return null;

    }

    function getFamilyAnswer(
        normalized,
        language
    ) {

        const family =
            window.PORTFOLIO_DATA.family;

        if (
            containsAny(
                normalized,
                [
                    "father",
                    "বাবা",
                    "tofayel",
                    "তোফায়েল"
                ]
            )
        ) {

            return (
                `${family.father.name} is Shadid's father and a ${family.father.role}. ${family.father.description}`
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "mother",
                    "মা",
                    "মা কে"
                ]
            )
        ) {

            return (
                `${family.mother.name} is his mother and a ${family.mother.role}. ${family.mother.description}`
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "wife",
                    "স্ত্রী",
                    "বউ"
                ]
            )
        ) {

            return (
                `${family.wife.name} is Shadid's ${family.wife.role}. ${family.wife.description}`
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "sister",
                    "বোন",
                    "ছোট বোন"
                ]
            )
        ) {

            return (
                `${family.sister.name} is part of Shadid's family story. ${family.sister.description}`
            );

        }

        if (
            containsAny(
                normalized,
                [
                    "nasir",
                    "নাসির"
                ]
            )
        ) {

            return (
                `${family.nasir.name}: ${family.nasir.description}`
            );

        }

        if (
            language === "bn"
        ) {

            return (
                "শাদিদের পরিবার সম্পর্কে portfolio AI-তে তাঁর বাবা তোফায়েল আহমেদ, মা, স্ত্রী, ছোট বোন এবং নাসিরের মতো গুরুত্বপূর্ণ family connections-এর context রাখা আছে। সম্পর্কগুলোকে perfect family story হিসেবে না দেখে বাস্তব জীবনের ভালোবাসা, ভুল বোঝাবুঝি, দায়িত্ব এবং support-এর মিশ্রণ হিসেবে দেখানো হয়েছে।"
            );

        }

        return (
            "The portfolio keeps family information as a human story rather than a perfect-family narrative: father Tofayel Ahmed, mother, wife, younger sister and Nasir are included as important relationships shaped by care, responsibility, disagreement, support and shared history."
        );

    }

    /* =====================================================
       CONVERSATIONAL / PLAYFUL BRAIN
    ====================================================== */

    function conversationalAnswer(
        text,
        language
    ) {

        const normalized =
            normalizeText(text);

        /* Stop conversation */

        if (
            state.pendingStopQuestion &&
            containsAny(
                normalized,
                [
                    "yes",
                    "yeah",
                    "yep",
                    "sure",
                    "okay",
                    "ok",
                    "stop",
                    "stop it",
                    "end",
                    "হ্যাঁ",
                    "হ্যাঁ করো",
                    "করো",
                    "ঠিক আছে",
                    "বন্ধ করো",
                    "থামাও"
                ]
            )
        ) {

            state.pendingStopQuestion =
                false;

            stopConversation();

            return language === "bn"
                ? "ঠিক আছে। Conversation stop করলাম। আবার ডাকলে আমি ফিরে আসব।"
                : "Alright. Conversation stopped. Call me again whenever you want.";

        }

        /* No more questions */

        if (
            containsAny(
                normalized,
                [
                    "no more questions",
                    "i have no more questions",
                    "nothing else",
                    "no question",
                    "আমার আর কোনো question নাই",
                    "আমার আর কোনো প্রশ্ন নেই",
                    "আর কিছু নেই",
                    "আর প্রশ্ন নেই"
                ]
            )
        ) {

            state.pendingStopQuestion =
                true;

            return language === "bn"
                ? "তাহলে কি আমরা conversation টা stop করি?"
                : language === "mixed"
                    ? "তাহলে কি আমরা conversation টা stop করি?"
                    : "Then should I stop the conversation?";

        }

        /* Savage-ish but harmless */

        if (
            containsAny(
                normalized,
                [
                    "roast me",
                    "roast",
                    "savage",
                    "make fun of me",
                    "আমাকে roast করো",
                    "savage answer দাও"
                ]
            )
        ) {

            return language === "bn"
                ? "তুমি এমন প্রশ্ন করছো যে AI-ও ভাবছে: আজকে আমার RAM-কে কি একটু শান্তি দেওয়া যায়? 😄"
                : "You're asking questions with enough chaos to make even an AI wonder whether its RAM deserves a vacation. 😄";

        }

        /* Silly human questions */

        if (
            containsAny(
                normalized,
                [
                    "can you feel",
                    "do you have feelings",
                    "তোমার কি feelings আছে",
                    "তুমি কি কষ্ট পাও"
                ]
            )
        ) {

            return language === "bn"
                ? "আমি human-এর মতো feelings অনুভব করি না। কিন্তু conversation-এর context বুঝে এমনভাবে respond করতে পারি যাতে কথাটা natural লাগে।"
                : "I don't experience human feelings the way people do. I can, however, understand conversational context and respond in a natural way.";

        }

        if (
            containsAny(
                normalized,
                [
                    "do you love",
                    "তুমি কি প্রেম করো",
                    "তুমি কি ভালোবাসো"
                ]
            )
        ) {

            return language === "bn"
                ? "আমি human-এর মতো প্রেমে পড়ি না 😄 আমি conversation, context আর information নিয়েই কাজ করি।"
                : "I don't fall in love like a human 😄 I work through conversation, context and information.";

        }

        /* Compliment */

        if (
            containsAny(
                normalized,
                [
                    "you are cute",
                    "you are smart",
                    "you are good",
                    "তুমি ভালো",
                    "তুমি সুন্দর",
                    "তুমি স্মার্ট"
                ]
            )
        ) {

            return language === "bn"
                ? "Compliment accepted. Gold-star brain has been slightly upgraded. 😌"
                : "Compliment accepted. The gold-brain ego has increased by approximately 0.7%. 😌";

        }

        /* Thanks */

        if (
            containsAny(
                normalized,
                [
                    "thank you",
                    "thanks",
                    "ধন্যবাদ",
                    "থ্যাংকস"
                ]
            )
        ) {

            return language === "bn"
                ? "Anytime."
                : "Anytime.";

        }

        return null;

    }

    /* =====================================================
       WIKIPEDIA FALLBACK
    ====================================================== */

    async function wikipediaAnswer(
        query,
        language
    ) {

        const wikiLang =
            language === "bn"
                ? "bn"
                : "en";

        try {

            const searchUrl =
                `https://${wikiLang}.wikipedia.org/w/api.php` +
                `?action=opensearch` +
                `&search=${encodeURIComponent(query)}` +
                `&limit=1` +
                `&namespace=0` +
                `&format=json` +
                `&origin=*`;

            const response =
                await fetch(
                    searchUrl,
                    {
                        signal:
                            AbortSignal.timeout(
                                5000
                            )
                    }
                );

            if (!response.ok) {
                return null;
            }

            const data =
                await response.json();

            const title =
                data?.[1]?.[0];

            if (!title) {
                return null;
            }

            const summaryUrl =
                `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/` +
                encodeURIComponent(title);

            const summaryResponse =
                await fetch(
                    summaryUrl,
                    {
                        signal:
                            AbortSignal.timeout(
                                5000
                            )
                    }
                );

            if (
                !summaryResponse.ok
            ) {

                return null;

            }

            const summary =
                await summaryResponse.json();

            const extract =
                summary?.extract;

            if (!extract) {
                return null;
            }

            if (
                language === "bn"
            ) {

                return (
                    `Wikipedia অনুযায়ী ${title}: ${extract}`
                );

            }

            return (
                `According to Wikipedia's summary for ${title}: ${extract}`
            );

        } catch {

            return null;

        }

    }

    /* =====================================================
       SMALL BRAIN
    ====================================================== */

    async function generateAnswer(
        input
    ) {

        const language =
            detectLanguage(input);

        state.currentLanguage =
            language;

        setRecognitionLanguage(
            language
        );

        const normalized =
            normalizeText(input);

        /* Section navigation */

        if (
            navigateFromCommand(
                normalized
            )
        ) {

            if (
                language === "bn"
            ) {

                return "ঠিক আছে — section change করে দিলাম।";

            }

            if (
                language === "mixed"
            ) {

                return "Done — section change করে দিলাম.";

            }

            return "Done — I switched the section.";

        }

        /* User teaches memory */

        if (
            containsAny(
                normalized,
                [
                    "remember that",
                    "remember this",
                    "মনে রেখো",
                    "মনে রাখো"
                ]
            )
        ) {

            const memoryIndex =
                input.search(
                    /remember that|remember this|মনে রেখো|মনে রাখো/i
                );

            let fact =
                input.slice(
                    memoryIndex >= 0
                        ? memoryIndex +
                          input.match(
                              /remember that|remember this|মনে রেখো|মনে রাখো/i
                          )[0].length
                        : 0
                );

            fact =
                fact
                    .replace(
                        /^[\s,:-]+/,
                        ""
                    )
                    .trim();

            if (fact) {

                rememberFact(
                    fact
                );

                return language === "bn"
                    ? `ঠিক আছে, browser memory-তে save করে রাখলাম: ${fact}`
                    : `Got it. I saved this in browser memory: ${fact}`;

            }

        }

        if (
            containsAny(
                normalized,
                [
                    "what do you remember",
                    "what have you remembered",
                    "তুমি কী কী মনে রেখেছ",
                    "কি কি মনে রেখেছ"
                ]
            )
        ) {

            return getMemoryText(
                language
            );

        }

        /* Personal knowledge */

        const personal =
            getPersonalAnswer(
                input,
                language
            );

        if (personal) {

            return personal;

        }

        /* Conversational brain */

        const conversational =
            conversationalAnswer(
                input,
                language
            );

        if (conversational) {

            return conversational;

        }

        /* General knowledge */

        const wiki =
            await wikipediaAnswer(
                input,
                language
            );

        if (wiki) {

            return wiki;

        }

        /* Fallback */

        if (
            language === "bn"
        ) {

            return (
                "এই প্রশ্নটার exact answer আমার local portfolio brain-এ নেই। তুমি চাইলে প্রশ্নটা একটু specific করে বলতে পারো—আমি portfolio context, browser memory অথবা general-knowledge search দিয়ে যতটা সম্ভব answer করার চেষ্টা করব।"
            );

        }

        if (
            language === "mixed"
        ) {

            return (
                "এই প্রশ্নটার exact answer local brain-এ নেই। Try একটু specific করে ask করো—portfolio context, memory বা general knowledge থেকে আমি answer করার চেষ্টা করব।"
            );

        }

        return (
            "I don't have a reliable answer to that in my local portfolio brain yet. Try asking it more specifically and I'll use my portfolio knowledge, saved browser memory or general-knowledge lookup."
        );

    }

    /* =====================================================
       SEND MESSAGE
    ====================================================== */

    async function sendUserMessage(
        text,
        fromVoice = false
    ) {

        const clean =
            String(text || "")
                .trim();

        if (
            !clean ||
            state.processing
        ) {

            return;

        }

        if (
            !state.open
        ) {

            openAI();

        }

        addUserMessage(
            clean
        );

        state.processing =
            true;

        setTyping(
            true
        );

        updateStatus(
            fromVoice
                ? "Thinking + listening"
                : "Thinking"
        );

        try {

            const answer =
                await generateAnswer(
                    clean
                );

            setTyping(
                false
            );

            await addAssistantMessage(
                answer
            );

            if (
                state.voiceMode
            ) {

                speak(
                    answer,
                    detectLanguage(
                        answer
                    )
                );

            }

            updateStatus(
                state.listening
                    ? "Listening"
                    : "Ready"
            );

        } catch {

            setTyping(
                false
            );

            const fallback =
                "Something went wrong while processing that. Try again.";

            await addAssistantMessage(
                fallback
            );

            if (
                state.voiceMode
            ) {

                speak(
                    fallback,
                    "en"
                );

            }

            updateStatus(
                "Ready"
            );

        } finally {

            state.processing =
                false;

        }

    }

    /* =====================================================
       VOICE TOGGLE
    ====================================================== */

    function startVoice() {

        if (
            !state.recognition
        ) {

            initSpeechRecognition();

        }

        if (
            !state.recognition
        ) {

            updateVoiceUI(
                false,
                "Voice unavailable"
            );

            return;

        }

        state.voiceMode =
            true;

        try {

            state.recognition.start();

        } catch {

            state.listening =
                true;

        }

        updateVoiceUI(
            true,
            "Starting continuous voice…"
        );

        updateStatus(
            "Voice active"
        );

        aiVoiceToggle?.classList.add(
            "active"
        );

    }

    function stopVoice() {

        state.voiceMode =
            false;

        state.listening =
            false;

        try {

            state.recognition?.stop();

        } catch {}

        stopSpeaking();

        updateVoiceUI(
            false,
            "Typing mode"
        );

        updateStatus(
            "Ready"
        );

        aiVoiceToggle?.classList.remove(
            "active"
        );

    }

    function toggleAIVoiceMode() {

        if (
            state.voiceMode
        ) {

            stopVoice();

        } else {

            startVoice();

        }

    }

    window.toggleAIVoiceMode =
        toggleAIVoiceMode;

    /* =====================================================
       STOP CONVERSATION
    ====================================================== */

    function stopConversation() {

        stopVoice();

        stopSpeaking();

        state.pendingStopQuestion =
            false;

        updateStatus(
            "Conversation stopped"
        );

        updateVoiceUI(
            false,
            "Conversation stopped"
        );

    }

    /* =====================================================
       EVENTS
    ====================================================== */

    aiLauncher?.addEventListener(
        "click",
        () => {

            if (
                state.open
            ) {

                closeAI();

            } else {

                openAI();

            }

        }
    );

    aiClose?.addEventListener(
        "click",
        closeAI
    );

    aiVoiceToggle?.addEventListener(
        "click",
        toggleAIVoiceMode
    );

    aiSend?.addEventListener(
        "click",
        () => {

            sendUserMessage(
                aiInput.value
            );

            aiInput.value =
                "";

        }
    );

    aiInput?.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                const value =
                    aiInput.value;

                aiInput.value =
                    "";

                sendUserMessage(
                    value
                );

            }

        }
    );

    $$(
        "[data-ai-hint]"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const text =
                        button.dataset.aiHint;

                    sendUserMessage(
                        text
                    );

                }
            );

        }
    );

    document.addEventListener(
        "visibilitychange",
        () => {

            /*
             * Deliberately does NOT stop the AI conversation.
             * The agent remains active across portfolio navigation.
             */

            if (
                document.hidden &&
                state.voiceMode
            ) {

                /*
                 * Do not forcibly stop continuous mode.
                 * Some mobile browsers may suspend microphone
                 * access when hidden; the recognition end handler
                 * attempts recovery when the tab becomes active.
                 */

            }

        }
    );

    window.addEventListener(
        "portfolio:sectionchange",
        () => {

            /*
             * Intentionally keep AI running.
             */

            if (
                state.open
            ) {

                updateStatus(
                    state.listening
                        ? "Listening"
                        : "Ready"
                );

            }

        }
    );

    /* =====================================================
       RESTORE CHAT
    ====================================================== */

    function restoreChat() {

        const recent =
            state.history.slice(
                -60
            );

        recent.forEach(
            item => {

                appendMessageElement(
                    item.role === "user"
                        ? "user"
                        : "assistant",
                    item.content
                );

            }
        );

    }

    /* =====================================================
       STARTUP
    ====================================================== */

    if (
        "speechSynthesis" in window
    ) {

        loadVoices();

        window
            .speechSynthesis
            .addEventListener(
                "voiceschanged",
                loadVoices
            );

    }

    initSpeechRecognition();

    restoreChat();

    /*
     * This global function is used by AI section commands.
     */
    window.activatePortfolioSection =
        function (section) {

            document
                .querySelector(
                    `[data-section="${section}"]`
                )
                ?.click();

        };

})();
