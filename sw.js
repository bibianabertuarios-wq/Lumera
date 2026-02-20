// Lumera Service Worker
const CACHE_NAME = 'lumera-v1';

// Archivos a cachear para uso offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar SW y cachear assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets estáticos');
      // No fallamos si algún asset no existe aún
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(err => console.log('[SW] No se pudo cachear:', url)))
      );
    })
  );
  self.skipWaiting();
});

// Activar SW y limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Eliminando cache viejo:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requests - estrategia Network First para la app, Cache First para assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // No interceptar requests a APIs externas (Supabase, Anthropic, etc.)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('lemon-squeezy.com') ||
    url.hostname.includes('workers.dev') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Para la app principal: Network First (siempre intenta la red, cae al cache si falla)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la respuesta es válida, la guardamos en cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, servimos desde cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Sirviendo desde cache:', request.url);
            return cachedResponse;
          }
          // Si no hay cache, devolver la página principal (SPA fallback)
          return caches.match('/') || caches.match('/index.html');
        });
      })
  );
});

// Manejar push notifications (para futuras notificaciones de LUMI)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '💜 Lumera tiene algo para ti',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Lumera', options)
  );
});

// Clic en notificación → abrir la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});
