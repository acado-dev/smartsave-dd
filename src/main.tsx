import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aggressively unregister any previously-installed service workers and clear
// caches BEFORE rendering. A previous PWA build registered a service worker
// that intercepted deep links and (in one revision) called
// `client.navigate(client.url)` during activation, which wiped the DOM and
// left the page blank. We unregister synchronously-as-possible and then mount.
async function cleanupServiceWorkers() {
  if (typeof window === "undefined") return;
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister().catch(() => {})));
    }
  } catch {}
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
    }
  } catch {}
}

function mount() {
  createRoot(document.getElementById("root")!).render(<App />);
}

// Fire cleanup but don't block initial render — render immediately so users
// always see UI. Cleanup happens in the background for next page load.
cleanupServiceWorkers();
mount();
