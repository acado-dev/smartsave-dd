import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Replace, ScanLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandReplaceESL() {
  const navigate = useNavigate();
  const [oldEsl, setOldEsl] = useState("");
  const [newEsl, setNewEsl] = useState("");
  const [step, setStep] = useState<"old" | "new" | "confirm">("old");

  const handleOldScan = () => { if (oldEsl.trim()) setStep("new"); };
  const handleNewScan = () => { if (newEsl.trim()) setStep("confirm"); };
  const handleReplace = () => { 
    toast({ title: "ESL Replaced", description: `${oldEsl} → ${newEsl}` }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Replace ESL</h1>
          <p className="text-[10px] text-muted-foreground">Swap old with new</p>
        </div>
      </div>
      
      {/* Step 1: Scan Old ESL */}
      <Card className={step !== "old" ? "opacity-50" : ""}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] font-bold">1</div>
            <span className="text-xs font-medium">Scan Old ESL</span>
            {step !== "old" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
          </div>
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan old ESL..." 
                className="pl-7 h-8 text-xs" 
                value={oldEsl} 
                onChange={(e) => setOldEsl(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleOldScan()}
                disabled={step !== "old"}
              />
            </div>
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleOldScan} disabled={step !== "old"}>Scan</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Step 2: Scan New ESL */}
      <Card className={step === "old" ? "opacity-50" : step === "confirm" ? "opacity-50" : ""}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">2</div>
            <span className="text-xs font-medium">Scan New ESL</span>
            {step === "confirm" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
          </div>
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan new ESL..." 
                className="pl-7 h-8 text-xs" 
                value={newEsl} 
                onChange={(e) => setNewEsl(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleNewScan()}
                disabled={step !== "new"}
              />
            </div>
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleNewScan} disabled={step !== "new"}>Scan</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <Card className="border-green-500/50">
          <CardContent className="p-2">
            <div className="bg-muted/50 rounded p-2 mb-2 text-[10px]">
              <p><span className="text-muted-foreground">Old:</span> {oldEsl}</p>
              <p><span className="text-muted-foreground">New:</span> {newEsl}</p>
            </div>
            <Button className="w-full h-8 text-xs" onClick={handleReplace}>
              <Replace className="h-3 w-3 mr-1" />Replace ESL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}