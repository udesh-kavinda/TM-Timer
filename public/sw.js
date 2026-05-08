const CACHE_NAME = 'toastmaster-timer-v1'
const RUNTIME_CACHE = 'toastmaster-timer-runtime'
const ASSET_CACHE = 'toastmaster-assets'

const STATIC_ASSETS = [
  '/',
  '/speech-timer',
  '/ah-counter',
  '/meeting-records',
  '/getting-started',
  '/manifest.json',
]

const ASSET_PATHS = [
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(() => {
          console.log('Some assets failed to cache during install')
        })
      }),
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.addAll(ASSET_PATHS).catch(() => {
          console.log('Some assets failed to cache')
        })
      })
    ]).then(() => {
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
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== ASSET_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - Cache first for instant loading (native app feel)
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

  const url = new URL(request.url)
  const isPage = request.headers.get('accept')?.includes('text/html')
  const isAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/i)

  if (isAsset) {
    // Cache first for assets - instant loading
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const cache = caches.open(ASSET_CACHE)
            cache.then((c) => {
              c.put(request, networkResponse.clone())
            })
          }
          return networkResponse
        }).catch(() => {
          return new Response('Asset not available', { status: 404 })
        })
      })
    )
  } else if (isPage) {
    // Cache first for pages - instant navigation like native app
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached page immediately for instant load
        if (cachedResponse) {
          // Update cache in background (stale-while-revalidate pattern)
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response.clone())
              })
            }
          }).catch(() => {})
          
          return cachedResponse
        }
        
        // No cache - fetch from network
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response.clone())
              })
            }
            return response
          })
          .catch(() => {
            // Return offline fallback
            return caches.match('/').catch(() => {
              return new Response('Offline - Page not available', { status: 503 })
            })
          })
      })
    )
  } else {
    // For other requests (API calls, etc)
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request)
        })
    )
  }
})
