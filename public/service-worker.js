const CACHE_NAME = 'my-budget-cache-v2';
const DATA_CACHE_NAME = 'budget-data-cache-v2';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    'public/css/styles.css',
    'public/js/index.js',
    'routes/api.js',
    'public/icons/icons/icon-72x72.png',
    'public/icons/icons/icon-96x96.png',
    'public/icons/icons/icon-128x128.png',
    'public/icons/icons/icon-144x144.png',
    'public/icons/icon-152x152.png',
    'public/icons/icon-192x192.png',
    'public/icons/icon-384x384.png',
    'public/icons/icon-512x512.png'

  ];

  self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log('Your files were pre-cached successfully!');
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

  self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log('Removing old cache data', key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });

// Intercepts fetch requests
self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/')) {
      evt.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then(cache => {
            return fetch(evt.request)
              .then(response => {
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              })
              .catch(err => {
                return cache.match(evt.request);
              });
          })
          .catch(err => console.log(err))
      );
  
      return;
    }
  
    evt.respondWith(
      fetch(evt.request).catch(function() {
        return caches.match(evt.request).then(function(response) {
          if (response) {
            return response;
          } else if (evt.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
      })
    );
  });
  