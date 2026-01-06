import { createContext, useContext, useState, ReactNode } from "react";

type ScreenSize = "3.2" | "5" | "7";

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
