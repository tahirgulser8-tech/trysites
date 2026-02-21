const CACHE_NAME = "beta v1.5";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.png"
];

// 1. Kurulum: Temel dosyaları hafızaya al
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Beklemeden hemen aktif ol
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Çalışma Mantığı: "Network First" (Önce İnternet, Yoksa Hafıza)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // İnternet varsa: Yanıtı al, kopyasını hafızaya at (güncelle), kullanıcıya göster
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // İnternet yoksa veya hata varsa: Hafızadakini göster
        return caches.match(e.request);
      })
  );
});

// 3. Temizlik: Eski ve gereksiz dosyaları sil
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Tüm sekmeleri hemen kontrol altına al
});
