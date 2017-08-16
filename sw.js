// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

const CACHE_NAME = 'play-with-notes-cache-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/components/index.html',
  '/components/header/index.html',
  '/components/row/index.html',
  '/components/column/index.html',
  '/components/card/index.html',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then((fetchResponse) => {
        // Check if we received a valid response
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    }),
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['tcl-v1'];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        }),
      )),
  );
});
