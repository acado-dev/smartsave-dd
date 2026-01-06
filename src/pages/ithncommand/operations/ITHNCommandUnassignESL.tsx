import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Unlink, ScanLine, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandUnassignESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [eslScanned, setEslScanned] = useState(false);

  const handleScan = () => { if (eslInput.trim()) setEslScanned(true); };
  const handleUnassign = () => { 
    toast({ title: "ESL Unassigned", description: `${eslInput} has been unassigned` }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Unassign ESL</h1>
          <p className="text-[10px] text-muted-foreground">Remove product link</p>
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
                onKeyDown={(e) => e.key === "Enter" && handleScan()} 
              />
            </div>
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleScan}>Scan</Button>
          </div>
        </CardContent>
      </Card>
      
      {eslScanned && (
        <Card className="border-amber-500/50">
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Confirm Unassign</span>
            </div>
            <div className="bg-muted/50 rounded p-2 text-[10px]">
              <p><span className="text-muted-foreground">ESL:</span> {eslInput}</p>
              <p><span className="text-muted-foreground">Product:</span> Sample Product</p>
            </div>
            <Button variant="destructive" className="w-full h-8 text-xs" onClick={handleUnassign}>
              <Unlink className="h-3 w-3 mr-1" />Unassign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}