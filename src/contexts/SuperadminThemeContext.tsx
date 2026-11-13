import { createContext, useContext, useEffect, useState } from "react";

export type SuperadminTheme = "dark" | "light";

const STORAGE_KEY = "ithina.superadmin.theme";

interface SuperadminThemeCtx {
  theme: SuperadminTheme;
  setTheme: (t: SuperadminTheme) => void;
  toggleTheme: () => void;
}

const SuperadminThemeContext = createContext<SuperadminThemeCtx>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

function readInitialTheme(): SuperadminTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function SuperadminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SuperadminTheme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.toggle("superadmin-light", theme === "light");
    // Keep token-based components (cards, badges, muted text) in sync:
    // superadmin dark mode needs the dark design tokens, light mode the light ones.
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
    return () => {
      root.classList.remove("superadmin-light");
      root.classList.toggle("dark", hadDark);
    };
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  return (
    <SuperadminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </SuperadminThemeContext.Provider>
  );
}

export function useSuperadminTheme() {
  return useContext(SuperadminThemeContext);
}
