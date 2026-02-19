/**
 * Service Worker for npmview
 * Provides offline support and caching for better performance
 */

const CACHE_NAME = 'npmview-v1';
const API_CACHE_NAME = 'npmview-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/about',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
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
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - implement cache-first strategy for API calls
self.addEventListener('fetch', (event) => {
    const {request} = event;
    const url = new URL(request.url);

    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }

    // API routes - cache-first strategy
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/package/')) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    // Clone the response before caching
                    const responseToCache = response.clone();

                    caches.open(API_CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                    // Return offline fallback if fetch fails
                    if (request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('/');
                    }
                });
            })
        );
        return;
    }

    // Static assets - cache-first strategy
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/)) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                });
            })
        );
    }
});
