const CACHE_NAME = "sportal-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo-final.jpg",
  "/founder.jpg",
  "/og-image.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : null)))
    )
  );
  self.clients.claim();
});

// Network-first for HTML so updates deploy properly
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const accept = req.headers.get("accept") || "";

  if (accept.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});
