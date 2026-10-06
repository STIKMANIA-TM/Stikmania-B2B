// STIKMANIA B2B - Service Worker v1.0
const CACHE_NAME = 'stikmania-b2b-v1';

// Archivos esenciales para cachear (Carga instantánea y modo offline básico)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/favicon.png',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/var_malva.jpg'
];

// 1. INSTALACIÓN: Guardar archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ [SW] Archivos esenciales cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ [SW] Error al cachear archivos:', error);
      })
  );
  // Activar inmediatamente el nuevo service worker sin esperar a que se cierren las pestañas
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpiar cachés antiguas para liberar espacio
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ [SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediato de todas las páginas abiertas
  self.clients.claim();
});

// 3. FETCH: Estrategia "Cache First, luego Network" (La más rápida para PWAs estáticas)
self.addEventListener('fetch', event => {
  // Ignorar solicitudes que no sean GET (ej. POST de formularios)
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignorar URLs externas (WhatsApp, Instagram, Google Fonts, etc.) para evitar problemas de CORS
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si está en caché, devolverlo inmediatamente (ultra rápido)
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si no está en caché, intentar obtenerlo de la red
        return fetch(event.request)
          .then(response => {
            // Si la respuesta no es válida, devolverla tal cual
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta para guardar una copia en caché para futuras visitas
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Si no hay internet y no está en caché, aquí podrías devolver una página offline.html
            // Por ahora, dejamos que el navegador maneje el error nativo de "Sin conexión"
            console.warn('⚠️ [SW] Sin conexión y no en caché:', event.request.url);
          });
      })
  );
});