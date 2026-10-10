/* Service worker — Dental Medicine Firenze
   Strategia "network-first": se c'è connessione si scarica sempre la versione più recente,
   la copia in cache serve solo quando si è offline.
   Per pubblicare un aggiornamento basta caricare i file nuovi (incrementare VERSION è consigliato). */
const VERSION = 'dmf-v1.4.1';
const CORE = [
  './', 'index.html', 'css/app.css', 'js/app.js', 'manifest.webmanifest',
  'content/it.json', 'content/en.json',
  'img/logo.png', 'img/studio-1.webp', 'img/studio-2.webp', 'img/studio-3.webp', 'img/studio-4.webp', 'img/mappa-studio.webp',
  'icons/icon-192.png',
  'img/staff/andrea-barbucci.webp', 'img/staff/giovanna-cuccaro.webp', 'img/staff/paola-coscarella.webp', 'img/staff/cintia-d-andrea.webp', 'img/staff/giacomo-faleri.webp', 'img/staff/massimo-frosecchi.webp', 'img/staff/barbara-petrucci.webp',
  'img/staff/dunia.webp', 'img/staff/lucia.webp', 'img/staff/claudia-bassetti.webp', 'img/staff/lisia-d-andrea-plentz.webp', 'img/staff/elisa-incardona.webp', 'img/staff/klara-pochobradska.webp', 'img/staff/donatella-signorini.webp', 'img/staff/alessandro-certini.webp', 'img/staff/isabelle-fini-storchi.webp', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'dmf-tiles').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // tile della mappa e libreria Leaflet: cache "best effort"
  if (/tile\.openstreetmap\.org|cdnjs\.cloudflare\.com/.test(url.host)) {
    e.respondWith(caches.open('dmf-tiles').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }
      catch (err) { return Response.error(); }
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // network-first per tutti i file dell'app
  const key = req.mode === 'navigate' ? 'index.html' : req;
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.match(key, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
