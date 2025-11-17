// Service worker template with automatic update checking and version management
// Version will be injected during build time

const CACHE_VERSION = '__SW_VERSION__';
const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';
const CACHE_NAME = `motivate-${CACHE_VERSION}`;
const urlsToCache = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${CACHE_VERSION}...`);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  // Don't skip waiting automatically - wait for user confirmation
});

self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version ${CACHE_VERSION}...`);

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }),
        );
      }),
      // Take control of all clients immediately
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For navigation requests (HTML pages), use network-first strategy
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new response
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(request).then((response) => {
            return (
              response ||
              new Response('Offline - Content not available', {
                status: 503,
                statusText: 'Service Unavailable',
              })
            );
          });
        }),
    );
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((response) => {
        // Cache valid responses
        if (response.ok && url.origin === self.location.origin) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    }),
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received SKIP_WAITING message');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CHECK_UPDATE') {
    console.log('[Service Worker] Manual update check requested');
    checkForUpdates();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      buildTimestamp: BUILD_TIMESTAMP,
    });
  }
});

// Periodic update check
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

// Check for updates function
async function checkForUpdates() {
  try {
    console.log('[Service Worker] Checking for updates...');
    const registration = await self.registration.update();
    console.log('[Service Worker] Update check completed');
    return registration;
  } catch (error) {
    console.error('[Service Worker] Update check failed:', error);
  }
}
