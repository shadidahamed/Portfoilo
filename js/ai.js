const trigger = document.getElementById('aiTrigger');
const panel = document.getElementById('aiPanel');
const closeBtn = document.getElementById('aiClose');
const messages = document.getElementById('aiMessages');
const input = document.getElementById('aiInput');
const voiceBtn = document.getElementById('aiVoice');
const voiceIndicator = document.getElementById('voiceIndicator');

let isOpen = false;

trigger?.addEventListener('click', () => {
  isOpen = !isOpen;
  panel.hidden = !isOpen;
  if (isOpen) {
    input.focus();
    if (messages.children.length === 0) {
      speakAndShow("Hey. I'm the assistant inside Shadid's portfolio. You can talk to me about him, his family, his work, or anything else.");
    }
  }
});

closeBtn?.addEventListener('click', () => {
  isOpen = false;
  panel.hidden = true;
});

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1;
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }
}

function typeWriter(text, el, speed = 16) {
  let i = 0;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      messages.scrollTop = messages.scrollHeight;
      setTimeout(type, speed);
    }
  }
  type();
}

function speakAndShow(text) {
  const div = document.createElement('div');
  div.style.margin = '10px 0';
  div.style.color = 'var(--silver)';
  div.style.lineHeight = '1.55';
  messages.appendChild(div);
  typeWriter('✦ ' + text, div);
  speak(text);
}

function addUser(text) {
  const div = document.createElement('div');
  div.style.margin = '10px 0';
  div.style.color = 'var(--gold-light)';
  div.textContent = 'You: ' + text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function getReply(q) {
  const l = q.toLowerCase();

  if (/(hi|hello|hey|salam)/.test(l)) return "Hey. Good to meet you. What would you like to know?";
  if (/(who is shadid|about shadid|his story)/.test(l)) return "If I had to tell someone who Shadid is, I wouldn't start with marks. I would start with how hard he kept trying. He wanted a future badly enough to keep reaching even when life put obstacles in front of him. He fought through pressure, disappointment, loneliness and heartbreak — and still kept creating. He's still becoming the person he wants to be.";
  if (/(family|father|mother|wife|sister|parents)/.test(l)) return "His family is very real to him. His father Tofael Ahmed is a Police Inspector — a man of duty and discipline. His mother is a housewife whose quiet presence holds the home. He has a wife who is his chosen companion, and a younger sister. Their relationships have love, pressure, misunderstandings and care — all mixed together. He wants them one day to see that he never gave up.";
  if (/(father|baba|tofael)/.test(l)) return "His father Tofael Ahmed is a Police Inspector. Shadid sees him as a strict but responsible man. Their relationship has had tension, but also deep care expressed through duty and concern for the future.";
  if (/(mother|maa|ma)/.test(l)) return "His mother is a housewife. She may not know every technical detail of architecture, but she feels his moods and struggles before he speaks. Their bond has both love and the ordinary frictions of family life.";
  if (/(education|university|college|brac)/.test(l)) return "He completed SSC from Motijheel Ideal School & College with GPA 5.00, HSC from Notre Dame College with GPA 5.00, and is now studying Architecture at BRAC University, Summer 2026 batch.";
  if (/(skill)/.test(l)) return "Literature, freehand writing, English speaking, drawing, sketching, C++, HTML, JavaScript and programming.";
  if (/(project|work)/.test(l)) return "You can see his architecture projects, artworks, graphics, Task Tracker, TrendCart e-commerce site, and Orpheus Engine in the portfolio sections.";
  if (/(contact|email|reach)/.test(l)) return "All real contact links are in the Contact section — Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X and others.";
  if (/(game)/.test(l)) return "There's a little driving game in the Game section. You can play it for fun.";
  if (/(thank)/.test(l)) return "You're welcome. Ask me anything else.";
  if (/(bye|goodbye)/.test(l)) return "Take care. Come back anytime.";

  return "I can talk about Shadid's story, his family, education, skills, projects, struggles, dreams, or more general things. What would you like to know?";
}

input?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    const q = input.value.trim();
    addUser(q);
    input.value = '';
    setTimeout(() => speakAndShow(getReply(q)), 400);
  }
});

voiceBtn?.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    speakAndShow("Voice recognition is not supported in this browser.");
    return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = 'en-US';
  voiceIndicator.classList.add('active');
  rec.onresult = e => {
    const t = e.results[0][0].transcript;
    input.value = t;
    voiceIndicator.classList.remove('active');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  };
  rec.onerror = () => voiceIndicator.classList.remove('active');
  rec.onend = () => voiceIndicator.classList.remove('active');
  rec.start();
});
