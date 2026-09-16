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
      addMsg("Hey. I'm the assistant living inside Shadid's portfolio. Ask me anything — about him, his work, his story, or just whatever's on your mind.", 'bot');
    }
  }
});
closeBtn?.addEventListener('click', () => panel.hidden = true);

function typeWriter(text, element, speed = 18) {
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

  if (/(hi|hello|hey|salam|assalam|good morning|good evening)/.test(lower)) {
    return "Hey. Good to meet you. I'm the assistant inside Shadid's portfolio. What would you like to know?";
  }

  if (/(who is shadid|tell me about shadid|who are you talking about|describe him|his story|about shadid)/.test(lower)) {
    return "If I had to tell someone who Shadid is, I wouldn't start with marks or results. I'd start with how hard he kept trying. He wanted a future badly enough to keep reaching for it even when life kept putting obstacles in front of him. He fought through academic pressure, disappointment, loneliness, financial stress, and heartbreak — and still kept studying, drawing, designing, and creating. Behind every drawing was patience. Behind every plan was hope. Behind every 'I'll try again' was someone who had already been through a lot. He's still becoming the person he wants to be. That matters.";
  }

  if (/(struggle|hard time|difficult|pain|fight|fighter|obstacle|pressure|disappointment|failed|failure)/.test(lower)) {
    return "He fought. Through academic pressure, through closed doors, through financial stress, through heartbreak, through loneliness. There were many moments that hurt more than he usually let people see. But he kept going. That refusal to quit is one of the most important things about him.";
  }

  if (/(draw|drawing|art|create|design|imagine|portfolio|website|game|orpheus)/.test(lower)) {
    return "He creates. He draws, designs spaces, imagines furniture, builds websites, works on games, and constantly tries new ideas. Making something beautiful and meaningful actually matters to him. Details are not optional for him — they're the point.";
  }

  if (/(education|university|college|school|brac|notre dame|motijheel|ssc|hsc|arch)/.test(lower)) {
    return "He studied at Motijheel Ideal School & College (SSC 2023, GPA 5.00), then Notre Dame College (HSC 2025, GPA 5.00), and is now at BRAC University in the Department of Architecture, Summer 2026 batch. Current course: ARCH 101. Roll: 14061008.";
  }

  if (/(skill|what can he do|abilities|good at)/.test(lower)) {
    return "Literature, freehand writing, English speaking, drawing, sketching, C++, HTML, JavaScript, and programming. He moves between artistic and technical work quite naturally.";
  }

  if (/(project|work|portfolio|ecommerce|task tracker|orpheus)/.test(lower)) {
    return "You can look at his Architecture projects, Art & Drawing section, Graphics works, Task Tracker App, the E-commerce website (TrendCart), and Orpheus Engine. Everything is in the portfolio sections above.";
  }

  if (/(contact|email|reach|message|whatsapp|instagram|github|linkedin)/.test(lower)) {
    return "All real links are in the Contact section: Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit, and Tumblr. Feel free to reach out.";
  }

  if (/(cv|resume|curriculum)/.test(lower)) {
    return "You can both View and Download his CV from the Documents section. The Drive links are already connected.";
  }

  if (/(location|where|dhaka|bangladesh|live)/.test(lower)) {
    return "He is based in Dhaka, Bangladesh.";
  }

  if (/(personality|character|kind of person|what is he like)/.test(lower)) {
    return "Someone who still cares even after being hurt. Someone who still tries after failing. Someone who still dreams when tired. He is defined less by the things he has already achieved and more by the fact that he keeps reaching forward.";
  }

  if (/(future|dream|goal|ambition|want to become)/.test(lower)) {
    return "He is still becoming the person he wants to be. Architecture, design, creation, and building a future that actually feels like his own — those are the directions he keeps moving toward.";
  }

  if (/(advice|motivate|inspire|how does he keep going)/.test(lower)) {
    return "He just keeps trying. When one door closes he looks for another. When he is exhausted he still studies or draws. The real achievement was everything he had to overcome to keep going.";
  }

  if (/(favorite|like|love|hobby|interest)/.test(lower)) {
    return "Drawing, sketching, literature, writing, English, programming, designing spaces and digital things. Creating is not a side activity for him — it's central.";
  }

  if (/(thank|thanks|appreciate)/.test(lower)) {
    return "You're welcome. Anything else you want to know?";
  }

  if (/(bye|goodbye|see you|take care)/.test(lower)) {
    return "Take care. Come back anytime.";
  }

  return "I can tell you about Shadid's story, his education, skills, projects, struggles, creativity, contact details, CV, or location. Ask me whatever you want — I'll answer honestly.";
}

input?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    const q = input.value.trim();
    addMsg(q, 'user');
    input.value = '';
    setTimeout(() => addMsg(getReply(q)), 450);
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
