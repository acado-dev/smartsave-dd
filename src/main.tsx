import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister any previously-installed service workers and clear caches.
// Stale PWA precache manifests were intercepting deep links (e.g. /superadmin/*)
// and serving 404s in new tabs.
if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister());
    });
  }
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
}

createRoot(document.getElementById("root")!).render(<App />);
