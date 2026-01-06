import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, ScanLine } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandFlashESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [flashing, setFlashing] = useState(false);

  const handleFlash = () => {
    if (!eslInput.trim()) return;
    setFlashing(true);
    setTimeout(() => {
      toast({ title: "ESL Flashing", description: `${eslInput} LED activated` });
      setFlashing(false);
    }, 2000);
  };

  const handleStop = () => {
    setFlashing(false);
    toast({ title: "Flash Stopped", description: `${eslInput} LED deactivated` });
    navigate("/ITHNCommand/operations");
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Flash ESL</h1>
          <p className="text-[10px] text-muted-foreground">Locate by LED</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan ESL..." 
                className="pl-7 h-8 text-xs" 
                value={eslInput} 
                onChange={(e) => setEslInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleFlash()} 
                disabled={flashing}
              />
            </div>
            <Button 
              size="sm" 
              className="h-8 px-3 text-xs" 
              onClick={handleFlash}
              disabled={flashing || !eslInput.trim()}
            >
              <Zap className="h-3 w-3 mr-1" />
              Flash
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {flashing && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
              <span className="text-sm font-medium text-amber-600">Flashing...</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">ESL: {eslInput}</p>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleStop}>
              Stop Flashing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}