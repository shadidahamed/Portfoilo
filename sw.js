const CACHE_NAME = 'shadid-portfolio-v1';
const ASSETS = [
  './',
  './index.html',
  './sa-favicon-32.png',
  './sa-favicon-hires.png',
  './sa-favicon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
