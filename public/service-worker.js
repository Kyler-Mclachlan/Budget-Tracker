const APP_PREFIX = 'Budget-';     
const VERSION = 'version_01';
const CACHE_NAME = 'my-budget-cache-v2';
const DATA_CACHE_NAME = 'budget-data-cache-v2';

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './js/index.js',
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png"
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

  self.addEventListener('activate', function (e) {
    e.waitUntil(
      caches.keys().then(function (keyList) {
        // `keyList` contains all cache names under your username.github.io
        // filter out ones that has this app prefix to create white list
        let cacheKeeplist = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX);
        })
        // add current cache name to white list
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i] );
            return caches.delete(keyList[i]);
          }
        }));
      })
    );
  });

// Intercepts fetch requests
self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/transaction')) {
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
  