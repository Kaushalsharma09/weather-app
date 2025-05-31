const CACHE_NAME = "weather-app-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/forecast.html",
  "/map.html",
  "/settings.html",
  "/css/style.css",
  "/js/main.js",
  "/js/weather.js",
  "/js/forecast.js",
  "/js/map.js",
  "/js/settings.js",
  "/manifest.json"
];

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
