// Kill-switch service worker.
// A previous build registered a PWA service worker that cached a precache
// manifest and started intercepting deep links (e.g. /superadmin/*),
// returning 404 from cache. This replacement unregisters itself and
// clears all caches so the page reloads cleanly.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {}
      try {
        await self.registration.unregister();
      } catch (e) {}
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});

// Never intercept fetches — let the network/SPA handle everything.
self.addEventListener("fetch", () => {});
