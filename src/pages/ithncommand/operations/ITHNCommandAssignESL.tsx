import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Link, ScanLine, Package, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandAssignESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [step, setStep] = useState<"esl" | "product" | "confirm">("esl");

  const handleEslScan = () => { if (eslInput.trim()) setStep("product"); };
  const handleProductScan = () => { if (productInput.trim()) setStep("confirm"); };
  const handleAssign = () => { 
    toast({ title: "ESL Assigned", description: `${eslInput} → ${productInput}` }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Assign ESL</h1>
          <p className="text-[10px] text-muted-foreground">Link ESL to product</p>
        </div>
      </div>
      
      {/* Step 1: Scan ESL */}
      <Card className={step !== "esl" ? "opacity-50" : ""}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
            <span className="text-xs font-medium">Scan ESL</span>
            {step !== "esl" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
          </div>
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan ESL barcode..." 
                className="pl-7 h-8 text-xs" 
                value={eslInput} 
                onChange={(e) => setEslInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleEslScan()}
                disabled={step !== "esl"}
              />
            </div>
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleEslScan} disabled={step !== "esl"}>Scan</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Step 2: Scan Product */}
      <Card className={step === "esl" ? "opacity-50" : step === "confirm" ? "opacity-50" : ""}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</div>
            <span className="text-xs font-medium">Scan Product</span>
            {step === "confirm" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
          </div>
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan product barcode..." 
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
      
      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <Card className="border-green-500/50">
          <CardContent className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">3</div>
              <span className="text-xs font-medium">Confirm Assignment</span>
            </div>
            <div className="bg-muted/50 rounded p-2 mb-2 text-[10px]">
              <p><span className="text-muted-foreground">ESL:</span> {eslInput}</p>
              <p><span className="text-muted-foreground">Product:</span> {productInput}</p>
            </div>
            <Button className="w-full h-8 text-xs" onClick={handleAssign}>
              <Link className="h-3 w-3 mr-1" />Assign ESL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}