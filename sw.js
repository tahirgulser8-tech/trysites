const CACHE_NAME = "pro-antrenman-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./icon.png",
  "./manifest.json"
];

// Kurulum
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Çalıştırma (Fetch)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
