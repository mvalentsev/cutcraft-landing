/**
 * Service Worker для CutCraft Landing Page
 * Modern 2025: Cache-First стратегия для статических ресурсов
 */

const CACHE_NAME = 'cutcraft-landing-v2.2.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/404.html',
  '/favicon.svg',
  '/manifest.json',
  '/qr-code.webp',
  '/og-image.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS).catch((error) => {
        console.error('Failed to cache assets during install:', error);
        // Continue anyway - offline functionality degraded but not broken
      });
    })
  );
  // Skip waiting to activate immediately (update prompt will be shown to user)
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Notify clients about the update (for skip waiting prompt)
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event: Cache-First for assets, Network-First for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-First for HTML (always fresh content)
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new HTML
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-First for assets (fast delivery)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Cache successful GET requests
        if (request.method === 'GET' && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
