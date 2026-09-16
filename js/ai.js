const trigger = document.getElementById('aiTrigger');
const panel = document.getElementById('aiPanel');
const closeBtn = document.getElementById('aiClose');
const messages = document.getElementById('aiMessages');
const input = document.getElementById('aiInput');
const voiceBtn = document.getElementById('aiVoice');

trigger?.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  if (!panel.hidden) input.focus();
});
closeBtn?.addEventListener('click', () => panel.hidden = true);

function addMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.style.margin = '8px 0';
  div.style.color = who === 'user' ? 'var(--gold-light)' : 'var(--silver)';
  div.textContent = (who === 'user' ? 'You: ' : '✦ ') + text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

const replies = {
  hi: 'Hello! I am Shadid’s portfolio assistant.',
  hello: 'Hello! How can I help you today?',
  skills: 'Literature, Freehand Writing, English Speaking, Drawing, Sketching, C++, HTML, JavaScript, Programming.',
  projects: 'You can see Task Tracker, E-commerce Website and Orpheus Engine in the Projects section.',
  contact: 'Email, GitHub, LinkedIn, Instagram, Facebook, WhatsApp, X, Pinterest, Reddit and Tumblr links are in the Contact section.',
  cv: 'You can download the CV from the Documents section.',
  default: 'I can tell you about skills, projects, contact or CV. Just ask!'
};

input?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    const q = input.value.trim().toLowerCase();
    addMsg(input.value, 'user');
    input.value = '';
    let ans = replies.default;
    for (const key in replies) {
      if (q.includes(key)) { ans = replies[key]; break; }
    }
    setTimeout(() => addMsg(ans), 400);
  }
});

// Free browser voice (Web Speech API)
voiceBtn?.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addMsg('Voice not supported in this browser.');
    return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = 'en-US';
  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  };
  rec.start();
});
