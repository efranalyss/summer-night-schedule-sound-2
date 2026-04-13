const CACHE = 'schedule-v1';
const FILES = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  self.registration.showNotification(data.title || '✦ Schedule', {
    body: data.body || '',
    icon: 'https://em-content.zobj.net/source/apple/354/crystal-ball_1f52e.png',
    badge: 'https://em-content.zobj.net/source/apple/354/crystal-ball_1f52e.png',
    vibrate: [200, 100, 200]
  });
});