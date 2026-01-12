// Service Worker for caching and offline support
const CACHE_NAME = 'sspirial-systems-v2';
const RUNTIME_CACHE = 'sspirial-runtime-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/sspirial_logo.png'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - stale-while-revalidate for better performance
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Don't cache module scripts - let them load directly
  const isModuleScript = event.request.destination === 'script' && 
                         event.request.mode === 'cors';
  if (isModuleScript) {
    // Let module scripts bypass cache entirely
    event.respondWith(fetch(event.request));
    return;
  }

  // Use stale-while-revalidate strategy for better perceived performance
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // If network fails and no cache, return offline page for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });

        // Return cached response immediately, update in background
        return cachedResponse || fetchPromise;
      });
    })
  );
});
