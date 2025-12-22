import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, Search, ScanLine, MapPin, StopCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const eslData: Record<string, { product: string; aisle: string; shelf: string }> = {
  "ESL-001": { product: "Organic Milk 1L", aisle: "3", shelf: "A2" },
  "ESL-002": { product: "Whole Wheat Bread", aisle: "5", shelf: "B1" },
  "ESL-003": { product: "Fresh Bananas", aisle: "1", shelf: "C3" },
};

export default function HHTLightFlashESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  const [eslInput, setEslInput] = useState(preselectedESL || "");
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashingESL, setFlashingESL] = useState<string | null>(null);
  const [flashDuration, setFlashDuration] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFlashing && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => { if (prev <= 1) { setIsFlashing(false); setFlashingESL(null); toast({ title: "Flash Complete" }); return 0; } return prev - 1; });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFlashing, timeRemaining]);

  const handleFlash = () => { if (!eslInput.trim()) return; setFlashingESL(eslInput.trim()); setIsFlashing(true); setTimeRemaining(flashDuration); toast({ title: "Flashing Started" }); };
  const handleStopFlash = () => { setIsFlashing(false); setFlashingESL(null); setTimeRemaining(0); toast({ title: "Flash Stopped" }); };
  const eslInfo = flashingESL ? eslData[flashingESL] : null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Flash ESL</h1><p className="text-xs text-muted-foreground">Locate ESL by flashing LED</p></div>
      </div>

      {isFlashing && (
        <Card className="border-amber-500 bg-gradient-to-br from-amber-500/20 to-amber-500/5"><CardContent className="p-6 text-center">
          <div className="relative inline-block"><div className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto", "bg-amber-500 animate-pulse")}><Zap className="h-12 w-12 text-white" /></div><div className="absolute inset-0 rounded-full bg-amber-500/50 animate-ping" /></div>
          <p className="font-bold text-lg mt-4">{flashingESL}</p>
          {eslInfo && (<><p className="text-sm text-muted-foreground">{eslInfo.product}</p><div className="flex items-center justify-center gap-2 mt-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Aisle {eslInfo.aisle}, Shelf {eslInfo.shelf}</span></div></>)}
          <div className="flex items-center justify-center gap-2 mt-4"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-2xl font-mono font-bold">{timeRemaining}s</span></div>
          <Button variant="destructive" className="mt-4" onClick={handleStopFlash}><StopCircle className="h-4 w-4 mr-2" />Stop Flashing</Button>
        </CardContent></Card>
      )}

      {!isFlashing && (
        <Card><CardContent className="p-4 space-y-4">
          <div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan ESL barcode..." className="pl-9" value={eslInput} onChange={(e) => setEslInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleFlash()} autoFocus /></div><Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button></div>
          <div className="space-y-2"><p className="text-sm font-medium">Flash Duration</p><div className="flex gap-2">{[15, 30, 60, 120].map((duration) => (<Button key={duration} variant={flashDuration === duration ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setFlashDuration(duration)}>{duration}s</Button>))}</div></div>
          <Button className="w-full" size="lg" onClick={handleFlash} disabled={!eslInput.trim()}><Zap className="h-5 w-5 mr-2" />Start Flashing</Button>
        </CardContent></Card>
      )}
    </div>
  );
}
