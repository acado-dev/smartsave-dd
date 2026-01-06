import { createContext, useContext, useState, ReactNode } from "react";

type ScreenSize = "3.2" | "5" | "7" | "browser";

interface ScreenDimensions {
  width: string;
  height: string;
  label: string;
}

export const screenDimensions: Record<ScreenSize, ScreenDimensions> = {
  "3.2": { width: "320px", height: "480px", label: '3.2"' },
  "5": { width: "360px", height: "640px", label: '5"' },
  "7": { width: "480px", height: "800px", label: '7"' },
  "browser": { width: "100%", height: "100%", label: "Browser/Tablet" },
};

interface ITHNCommandContextType {
  screenSize: ScreenSize;
  setScreenSize: (size: ScreenSize) => void;
}

const ITHNCommandContext = createContext<ITHNCommandContextType | undefined>(undefined);

export function ITHNCommandProvider({ children }: { children: ReactNode }) {
  const [screenSize, setScreenSize] = useState<ScreenSize>("5");

  return (
    <ITHNCommandContext.Provider value={{ screenSize, setScreenSize }}>
      {children}
    </ITHNCommandContext.Provider>
  );
}

export function useScreenSize() {
  const context = useContext(ITHNCommandContext);
  if (!context) {
    throw new Error("useScreenSize must be used within ITHNCommandProvider");
  }
  return context;
}
