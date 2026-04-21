// No-op service worker.
// Any previously-installed PWA service worker is unregistered by the cleanup
// logic in src/main.tsx. This file exists only so that browsers requesting
// /sw.js receive a valid (but inert) script — it never intercepts fetches
// and never reloads the page.
self.addEventListener("install", () => {
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
    })()
  );
});

// Never intercept fetches — let the network/SPA handle everything.
self.addEventListener("fetch", () => {});
