import { useState } from "react";
import FreshnessAnalysis from "../management/details/FreshnessAnalysis";
import ithinaLogo from "@/assets/ithina-logo.png";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

const FreshnessAnalysisDemo = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logos */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={ithinaLogo} alt="Ithina" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold text-foreground">
                AI Freshness Analysis Engine
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <FreshnessAnalysis />
      </main>
    </div>
  );
};

export default FreshnessAnalysisDemo;
