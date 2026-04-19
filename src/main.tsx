import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Detect preview/iframe contexts where service workers cause stale-content
// and routing issues (navigateFallback intercepts deep links like /superadmin/*)
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("id-preview--") ||
    window.location.hostname.includes("lovableproject.com") ||
    window.location.hostname.includes("lovable.app"));

if (isPreviewHost || isInIframe) {
  // Aggressively unregister any existing service workers and clear caches
  // so previously-cached precache manifests don't 404 new routes.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister());
    });
  }
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
} else {
  // Only register the SW in production / non-preview contexts
  registerSW({ immediate: true });
}

createRoot(document.getElementById("root")!).render(<App />);
