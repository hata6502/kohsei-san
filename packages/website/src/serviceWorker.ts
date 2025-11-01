const requests = [
  "/",
  "/dict/base.dat",
  "/dict/cc.dat",
  "/dict/check.dat",
  "/dict/tid_map.dat",
  "/dict/tid_pos.dat",
  "/dict/tid.dat",
  "/dict/unk_char.dat",
  "/dict/unk_compat.dat",
  "/dict/unk_invoke.dat",
  "/dict/unk_map.dat",
  "/dict/unk_pos.dat",
  "/dict/unk.dat",
  "/favicon.png",
  "/j260_12_0.svg",
  "/lintWorker.js",
  "/main.js",
];

const cacheName = `service-worker-${process.env.TIMESTAMP}`;
const serviceWorker = globalThis as unknown as ServiceWorkerGlobalScope;

serviceWorker.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(async (key) => {
          if ([cacheName].includes(key)) {
            return;
          }
          await caches.delete(key);
        }),
      );
    })(),
  );
});

serviceWorker.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) {
        return cacheResponse;
      }

      return fetch(event.request);
    })(),
  );
});

serviceWorker.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(requests);
      await serviceWorker.skipWaiting();
    })(),
  );
});
