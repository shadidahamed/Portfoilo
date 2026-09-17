import { SHADID_DATA } from './shadid-data.js';

export class AIAgent {
  constructor(galaxyEngineReference) {
    this.galaxy = galaxyEngineReference;
    this.history = [];
    this.isListening = false;
    this.isSpeaking = false;
    this.activeSession = true;

    this.recognition = null;
    this.synthesis = window.speechSynthesis;

    this.initSpeechEngine();
    this.bindUIEvents();
  }

  initSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const text = event.results[lastResultIndex][0].transcript.trim();
        this.processUserInput(text, 'voice');
      };

      this.recognition.onend = () => {
        if (this.isListening && this.activeSession) {
          this.recognition.start(); // Keep continuous session alive unless explicitly stopped
        }
      };
    }
  }

  bindUIEvents() {
    document.getElementById('ai-send-btn').addEventListener('click', () => {
      const inputEl = document.getElementById('ai-text-input');
      const val = inputEl.value.trim();
      if (val) {
        this.processUserInput(val, 'text');
        inputEl.value = '';
      }
    });

    document.getElementById('ai-voice-toggle').addEventListener('click', () => {
      this.toggleVoiceMode();
    });

    document.getElementById('ai-stop-session-btn').addEventListener('click', () => {
      this.terminateSession();
    });
  }

  toggleVoiceMode() {
    if (!this.recognition) {
      this.renderAIMessage("Voice recognition is not supported in this browser environment.");
      return;
    }

    if (this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      this.updateUIStatus("Ready");
    } else {
      this.isListening = true;
      this.activeSession = true;
      this.recognition.start();
      this.updateUIStatus("Listening...");
    }
  }

  processUserInput(text, sourceMode) {
    if (!this.activeSession) return;

    this.renderUserMessage(text);
    const lang = this.detectLanguage(text);
    const intent = this.classifyIntent(text);

    // Intent Action Execution
    if (intent.category === 'navigation') {
      this.handleNavigationIntent(intent.target);
    } else if (intent.category === 'stop') {
      this.terminateSession();
      return;
    }

    const responseText = this.generateResponse(intent, lang);
    this.renderAIMessage(responseText);

    if (sourceMode === 'voice' || this.isListening) {
      this.speakResponse(responseText, lang);
    }

    this.history.push({ role: 'user', content: text, lang, timestamp: Date.now() });
    this.history.push({ role: 'assistant', content: responseText, lang, timestamp: Date.now() });
  }

  detectLanguage(text) {
    const banglaRegex = /[\u0980-\u09FF]/;
    if (banglaRegex.test(text)) return 'bn';
    const banglishWords = ['kemon', 'kore', 'jabo', 'bolo', 'korbe', 'chao'];
    const isBanglish = banglishWords.some(w => text.toLowerCase().includes(w));
    return isBanglish ? 'banglish' : 'en';
  }

  classifyIntent(text) {
    const q = text.toLowerCase();

    if (q.includes('stop') || q.includes('বন্ধ করো') || q.includes('shutdown')) return { category: 'stop' };
    if (q.includes('profile') || q.includes('about')) return { category: 'navigation', target: 'profile' };
    if (q.includes('education') || q.includes('school') || q.includes('college')) return { category: 'navigation', target: 'education' };
    if (q.includes('project') || q.includes('game') || q.includes('trendcart')) return { category: 'projects' };
    if (q.includes('who are you') || q.includes('ke tumi') || q.includes('তুমি কে')) return { category: 'identity' };
    if (q.includes('shadid') || q.includes('who is shadid')) return { category: 'biography' };

    return { category: 'general' };
  }

  generateResponse(intent, lang) {
    if (intent.category === 'identity') {
      return lang === 'bn' 
        ? "আমি শাদীদ আহমেদের এআই সিস্টেম। পোর্টফোলিওর বিভিন্ন সেকশন এক্সপ্লোর করতে আমি সাহায্য করতে পারি।"
        : "I am Shadid Ahamed's AI Agent layer. I can navigate you through his portfolio and answer questions regarding his work.";
    }
    
    if (intent.category === 'biography') {
      return SHADID_DATA.profile.bioText;
    }

    if (intent.category === 'projects') {
      return lang === 'bn'
        ? "শাদীদের ডিজিটাল প্রজেক্টের মধ্যে রয়েছে TrendCart এবং Office Engine (Shadid's Game)। আপনি 'PROJECTS' সেকশনে গিয়ে দেখতে পারেন।"
        : "Shadid's primary digital builds include TrendCart and Office Engine (Shadid's Game). You can review them in the Projects tab.";
    }

    return lang === 'bn'
      ? "ধন্যবাদ আপনার প্রশ্নের জন্য। আমি শাদীদের পোর্টফোলিও সংক্রান্ত যেকোনো তথ্যে সহায়তা করছি।"
      : "Thank you for reaching out. I am fully available to assist with inquiries regarding Shadid's creative and technical portfolio.";
  }

  handleNavigationIntent(targetSection) {
    const sectionBtn = document.querySelector(`[data-section="${targetSection}"]`);
    if (sectionBtn) sectionBtn.click();
  }

  speakResponse(text, lang) {
    if (!this.synthesis) return;

    this.synthesis.cancel(); // Stop prior speech frames
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = this.synthesis.getVoices();
    if (lang === 'bn') {
      utterance.voice = voices.find(v => v.lang.includes('bn')) || voices[0];
    } else {
      utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
    }

    utterance.onstart = () => this.updateUIStatus("Speaking...");
    utterance.onend = () => this.updateUIStatus(this.isListening ? "Listening..." : "Ready");

    this.synthesis.speak(utterance);
  }

  terminateSession() {
    this.activeSession = false;
    this.isListening = false;
    if (this.recognition) this.recognition.stop();
    if (this.synthesis) this.synthesis.cancel();
    
    this.renderAIMessage("Conversation ended. Click the AI core to restart a session.");
    this.updateUIStatus("Offline");
  }

  renderUserMessage(msg) {
    const container = document.getElementById('ai-chat-messages');
    container.innerHTML += `<div class="msg user-msg"><p>${msg}</p></div>`;
    container.scrollTop = container.scrollHeight;
  }

  renderAIMessage(msg) {
    const container = document.getElementById('ai-chat-messages');
    container.innerHTML += `<div class="msg ai-msg"><p>${msg}</p></div>`;
    container.scrollTop = container.scrollHeight;
  }

  updateUIStatus(status) {
    document.getElementById('ai-status-indicator').innerText = status;
  }
}
