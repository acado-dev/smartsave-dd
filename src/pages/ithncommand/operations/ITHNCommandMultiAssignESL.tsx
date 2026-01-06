import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Layers, ScanLine, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ITHNCommandMultiAssignESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [scannedEsls, setScannedEsls] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");
  const [step, setStep] = useState<"scan" | "product" | "confirm">("scan");

  const handleAddEsl = () => {
    if (eslInput.trim() && !scannedEsls.includes(eslInput.trim())) {
      setScannedEsls([...scannedEsls, eslInput.trim()]);
      setEslInput("");
    }
  };
  const handleRemoveEsl = (esl: string) => setScannedEsls(scannedEsls.filter(e => e !== esl));
  const handleProductScan = () => { if (productInput.trim()) setStep("confirm"); };
  const handleAssign = () => { 
    toast({ title: "Multi-Assign Complete", description: `${scannedEsls.length} ESLs assigned` }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Multi-Assign</h1>
          <p className="text-[10px] text-muted-foreground">Assign multiple ESLs</p>
        </div>
      </div>
      
      {/* Step 1: Scan ESLs */}
      <Card className={step !== "scan" ? "opacity-50" : ""}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
            <span className="text-xs font-medium">Scan ESLs</span>
            <Badge variant="secondary" className="ml-auto text-[10px] h-4">{scannedEsls.length}</Badge>
          </div>
          <div className="flex gap-1.5 mb-2">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan ESL..." 
                className="pl-7 h-8 text-xs" 
                value={eslInput} 
                onChange={(e) => setEslInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAddEsl()}
                disabled={step !== "scan"}
              />
            </div>
            <Button size="sm" className="h-8 px-2 text-xs" onClick={handleAddEsl} disabled={step !== "scan"}>Add</Button>
          </div>
          {scannedEsls.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {scannedEsls.map(esl => (
                <Badge key={esl} variant="outline" className="text-[10px] h-5 gap-1">
                  {esl}
                  <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => handleRemoveEsl(esl)} />
                </Badge>
              ))}
            </div>
          )}
          {scannedEsls.length > 0 && step === "scan" && (
            <Button size="sm" className="w-full mt-2 h-7 text-xs" onClick={() => setStep("product")}>
              Continue ({scannedEsls.length} ESLs)
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Step 2: Scan Product */}
      {step !== "scan" && (
        <Card className={step === "confirm" ? "opacity-50" : ""}>
          <CardContent className="p-2">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</div>
              <span className="text-xs font-medium">Scan Product</span>
              {step === "confirm" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
            </div>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Scan product..." 
                  className="pl-7 h-8 text-xs" 
                  value={productInput} 
                  onChange={(e) => setProductInput(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleProductScan()}
                  disabled={step !== "product"}
                />
              </div>
              <Button size="sm" className="h-8 px-3 text-xs" onClick={handleProductScan} disabled={step !== "product"}>Scan</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <Card className="border-green-500/50">
          <CardContent className="p-2">
            <div className="bg-muted/50 rounded p-2 mb-2 text-[10px]">
              <p><span className="text-muted-foreground">ESLs:</span> {scannedEsls.length} labels</p>
              <p><span className="text-muted-foreground">Product:</span> {productInput}</p>
            </div>
            <Button className="w-full h-8 text-xs" onClick={handleAssign}>
              <Layers className="h-3 w-3 mr-1" />Assign All
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}