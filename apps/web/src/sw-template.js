// Service worker template with automatic update checking and version management
// Version will be injected during build time

const CACHE_VERSION = '__SW_VERSION__';
const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';
const CACHE_NAME = `motivate-${CACHE_VERSION}`;
const urlsToCache = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${CACHE_VERSION}...`);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      }),
  );
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
    ]).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION,
            buildTimestamp: BUILD_TIMESTAMP,
          });
        });
      });
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
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
