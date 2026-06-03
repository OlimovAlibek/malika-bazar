const CACHE = 'tezku-v3'
const OFFLINE_URL = '/offline'

// Faqat offline sahifani precache qilamiz — SSR sahifalar keshlanmaydi
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.origin !== self.location.origin &&
      !url.hostname.includes('supabase.co') &&
      !url.hostname.includes('supabase.in')) return

  // Rasmlar: cache-first
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)
  ) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(request)
        if (cached) return cached
        try {
          const fresh = await fetch(request)
          if (fresh.ok) cache.put(request, fresh.clone())
          return fresh
        } catch {
          return cached ?? new Response('', { status: 408 })
        }
      })
    )
    return
  }

  // Static JS/CSS (_next/static): cache-first forever
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(request)
        if (cached) return cached
        const fresh = await fetch(request)
        if (fresh.ok) cache.put(request, fresh.clone())
        return fresh
      })
    )
    return
  }

  // HTML sahifalar: network-first, xatolikda offline page
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            caches.open(CACHE).then(c => c.put(request, res.clone()))
          }
          return res
        })
        .catch(async () => {
          const cached = await caches.match(request)
          if (cached) return cached
          const offline = await caches.match(OFFLINE_URL)
          return offline ?? new Response('Offline', { status: 503 })
        })
    )
    return
  }
})
