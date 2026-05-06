const CACHE_NAME = 'toastmaster-timer-v1'
const RUNTIME_CACHE = 'toastmaster-timer-runtime'

const STATIC_ASSETS = [
  '/',
  '/speech-timer',
  '/ah-counter',
  '/manifest.json',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some assets might fail to cache, that's ok
      })
    }).then(() => {
      self.skipWaiting()
    })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const cache = caches.open(RUNTIME_CACHE)
          cache.then((c) => {
            c.put(request, response.clone())
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache on network failure
        return caches.match(request).then((response) => {
          return response || new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        })
      })
  )
})
