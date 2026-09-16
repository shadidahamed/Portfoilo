const trigger = document.getElementById('aiTrigger');
const panel = document.getElementById('aiPanel');
const closeBtn = document.getElementById('aiClose');
const messages = document.getElementById('aiMessages');
const input = document.getElementById('aiInput');
const voiceBtn = document.getElementById('aiVoice');
const voiceIndicator = document.getElementById('voiceIndicator');

trigger?.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  if (!panel.hidden) {
    input.focus();
    if (messages.children.length === 0) {
      addMsg("Hey. I'm the assistant living inside Shadid's portfolio. You can ask me about his story, his struggles, his work, his dreams — or just talk. I'm here.", 'bot');
    }
  }
});
closeBtn?.addEventListener('click', () => panel.hidden = true);

function typeWriter(text, element, speed = 17) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      messages.scrollTop = messages.scrollHeight;
      setTimeout(type, speed);
    }
  }
  type();
}

function addMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.style.margin = '10px 0';
  div.style.lineHeight = '1.55';
  div.style.color = who === 'user' ? 'var(--gold-light)' : 'var(--silver)';
  messages.appendChild(div);

  if (who === 'bot') {
    typeWriter('✦ ' + text, div);
  } else {
    div.textContent = 'You: ' + text;
  }
  messages.scrollTop = messages.scrollHeight;
}

function getReply(q) {
  const lower = q.toLowerCase().trim();

  // Greetings
  if (/(hi|hello|hey|salam|assalamualaikum|good morning|good evening|what's up)/.test(lower)) {
    return "Hey. Good to meet you. What would you like to know about Shadid?";
  }

  // Core story
  if (/(who is shadid|tell me about him|his story|about shadid|describe him|who is he)/.test(lower)) {
    return "If I had to tell someone who Shadid is, I wouldn't start with marks or results. I would begin with how hard he kept trying. He wanted a future badly enough to keep reaching for it even when life kept putting obstacles in front of him. He fought through academic pressure, disappointment, loneliness, financial stress, and heartbreak — and still kept studying, drawing, designing, and creating. Behind every drawing was patience. Behind every plan was hope. Behind every “I'll try again” was someone who had already been through a lot. He's still becoming the person he wants to be. That matters.";
  }

  // Struggles
  if (/(struggle|hard|difficult|pain|hurt|fight|fighter|obstacle|pressure|disappointment|failed|failure|tired|worn)/.test(lower)) {
    return "He fought. Through academic pressure, closed doors, financial stress, heartbreak, and loneliness. There were many moments that hurt more than he usually let people see. But he kept going. That refusal to quit is one of the most important things about him.";
  }

  // Creativity
  if (/(draw|drawing|art|create|design|imagine|portfolio|make|build)/.test(lower)) {
    return "He creates. He draws, designs spaces, imagines furniture, builds websites, works on games, and constantly tries new ideas. Making something beautiful and meaningful actually matters to him. Details are not optional for him — they're the point.";
  }

  // Education
  if (/(education|university|college|school|brac|notre dame|motijheel|ssc|hsc|architecture|arch)/.test(lower)) {
    return "He studied at Motijheel Ideal School & College (SSC 2023, GPA 5.00), then Notre Dame College (HSC 2025, GPA 5.00), and is now at BRAC University in the Department of Architecture, Summer 2026 batch. Current course: ARCH 101. Roll: 14061008.";
  }

  // Skills
  if (/(skill|what can he do|abilities|good at|know)/.test(lower)) {
    return "Literature, freehand writing, English speaking, drawing, sketching, C++, HTML, JavaScript, and programming. He moves between artistic and technical work quite naturally.";
  }

  // Projects
  if (/(project|work|portfolio|ecommerce|task tracker|orpheus|website)/.test(lower)) {
    return "You can look at his Architecture projects, Art & Drawing section, Graphics works, Task Tracker App, the E-commerce website (TrendCart), and Orpheus Engine. Everything is already in the sections above.";
  }

  // Contact
  if (/(contact|email|reach|message|whatsapp|instagram|github|linkedin|talk to him)/.test(lower)) {
    return "All real links are in the Contact section — Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit, and Tumblr. Feel free to reach out.";
  }

  // CV
  if (/(cv|resume|curriculum)/.test(lower)) {
    return "You can both View and Download his CV from the Documents section. The links are already connected.";
  }

  // Location
  if (/(location|where|dhaka|bangladesh|live|from)/.test(lower)) {
    return "He is based in Dhaka, Bangladesh.";
  }

  // Personality
  if (/(personality|character|kind of person|what is he like|nature)/.test(lower)) {
    return "Someone who still cares even after being hurt. Someone who still tries after failing. Someone who still dreams when tired. He is defined less by what he has already achieved and more by the fact that he keeps reaching forward.";
  }

  // Future
  if (/(future|dream|goal|ambition|want to become|hope)/.test(lower)) {
    return "He is still becoming the person he wants to be. Architecture, design, creation, and building a future that actually feels like his own — those are the directions he keeps moving toward.";
  }

  // Motivation
  if (/(advice|motivate|inspire|how does he keep going|strength)/.test(lower)) {
    return "He just keeps trying. When one door closes he looks for another. When he is exhausted he still studies or draws. The real achievement was everything he had to overcome just to keep going.";
  }

  // Soft / emotional
  if (/(lonely|alone|sad|heartbreak|hurt|love|relationship)/.test(lower)) {
    return "He has known loneliness and heartbreak. He has felt worn down. But even after being hurt, he still cared. Even after failing, he still tried again. That quiet persistence is part of who he is.";
  }

  // Thanks / Bye
  if (/(thank|thanks|appreciate)/.test(lower)) {
    return "You're welcome. Ask me anything else if you want.";
  }
  if (/(bye|goodbye|see you|take care)/.test(lower)) {
    return "Take care. Come back anytime.";
  }

  // Default
  return "I can tell you about Shadid's story, his struggles, his creativity, education, skills, projects, contact details, CV, or location. Ask me whatever you want — I'll answer honestly.";
}

input?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    const q = input.value.trim();
    addMsg(q, 'user');
    input.value = '';
    setTimeout(() => addMsg(getReply(q)), 420);
  }
});

voiceBtn?.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addMsg("Voice recognition is not supported in this browser.");
    return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = 'en-US';
  rec.continuous = false;

  voiceIndicator.classList.add('active');
  rec.onresult = e => {
    const transcript = e.results[0][0].transcript;
    input.value = transcript;
    voiceIndicator.classList.remove('active');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  };
  rec.onerror = () => voiceIndicator.classList.remove('active');
  rec.onend = () => voiceIndicator.classList.remove('active');
  rec.start();
});
