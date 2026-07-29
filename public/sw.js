const CACHE_NAME = 'dompetku-static-v2';
const RUNTIME_CACHE = 'dompetku-runtime-v2';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/img/logo1.png',
  '/img/logo2.png',
  '/img/logo3.png',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.log('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Let navigations use the network first so authentication redirects and
// Next.js server-rendered pages always reflect the current session.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
        .then((response) => response || Response.error())
    );
    return;
  }

  // Do not intercept API calls, Server Actions, or App Router/RSC payloads.
  const isNextStaticAsset = url.pathname.startsWith('/_next/static/');
  const isPublicStaticAsset =
    url.pathname === '/manifest.json' ||
    url.pathname.startsWith('/img/') ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$/i.test(url.pathname);

  if (!isNextStaticAsset && !isPublicStaticAsset) {
    return;
  }

  // Hashed/static assets are safe to serve cache-first.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const clonedResponse = response.clone();

          // Cache successful responses
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });

          return response;
        })
        .catch(() => caches.match(request).then((response) => response || Response.error()));
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
