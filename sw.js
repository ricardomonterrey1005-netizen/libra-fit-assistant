const CACHE = 'fitricardo-v5';
const ASSETS = ['./index.html', './styles.css', './data.js', './engine.js', './libra.js', './app.js', './api.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Never cache API requests - always go to server
  if (e.request.url.includes('/api/')) return;
  // Network first, fallback to cache
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

self.addEventListener('periodicsync', e => {
  if (e.tag === 'water-reminder') {
    e.waitUntil(self.registration.showNotification('FitRicardo', {
      body: 'Ya tomaste agua? Tu meta son 4 litros hoy.',
      tag: 'water', renotify: true
    }));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cs => {
    if (cs.length > 0) return cs[0].focus();
    return clients.openWindow('./index.html');
  }));
});
