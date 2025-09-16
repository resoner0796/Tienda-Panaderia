const CACHE_NAME = 'panaderia-luis-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/Logo.PNG',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/maskable-icon.png'
  // No añadimos los scripts de Firebase/Tailwind porque se sirven desde una CDN
  // y es mejor que el navegador los maneje.
];

// Evento de instalación: se abre el caché y se guardan los archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: limpia cachés antiguos si los hay
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch: intercepta las peticiones y sirve desde el caché si es posible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en el caché, la devolvemos
        if (response) {
          return response;
        }
        // Si no, hacemos la petición a la red
        return fetch(event.request);
      }
    )
  );
});
