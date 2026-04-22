import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clean up any stale service workers from older PWA experiments before the
// app renders. If the current page is still controlled by a legacy worker,
// we must reload once after unregistering so the browser fetches fresh assets
// directly from the network instead of the stale worker cache.
async function cleanupServiceWorkers() {
  if (typeof window === "undefined") return false;

  let hadLegacyServiceWorker = false;

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      hadLegacyServiceWorker = registrations.length > 0 || !!navigator.serviceWorker.controller;
      await Promise.all(registrations.map((r) => r.unregister().catch(() => {})));
    }
  } catch {}

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      if (keys.length > 0) {
        hadLegacyServiceWorker = true;
      }
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
    }
  } catch {}

  return hadLegacyServiceWorker;
}

function mount() {
  createRoot(document.getElementById("root")!).render(<App />);
}

async function bootstrap() {
  const reloadGuardKey = "__ithina_sw_cleanup_reload__";
  const alreadyReloaded = typeof window !== "undefined" && sessionStorage.getItem(reloadGuardKey) === "1";
  const hadLegacyServiceWorker = await cleanupServiceWorkers();

  if (typeof window !== "undefined" && hadLegacyServiceWorker && !alreadyReloaded) {
    sessionStorage.setItem(reloadGuardKey, "1");
    const url = new URL(window.location.href);
    url.searchParams.set("sw_cleanup", Date.now().toString());
    window.location.replace(url.toString());
    return;
  }

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(reloadGuardKey);
  }

  mount();
}

bootstrap();
