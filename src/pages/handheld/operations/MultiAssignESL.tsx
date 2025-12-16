import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Layers, 
  Search,
  ScanLine,
  CheckCircle2,
  MapPin,
  Package,
  Play,
  Pause,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AssignmentPair {
  eslId: string;
  product: string;
  sku: string;
  status: "pending" | "processing" | "success" | "error";
}

export default function MultiAssignESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [skuInput, setSkuInput] = useState("");
  const [assignments, setAssignments] = useState<AssignmentPair[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<"esl" | "sku">("esl");
  const [currentESL, setCurrentESL] = useState("");

  const productLookup: Record<string, string> = {
    "MLK-001": "Organic Milk 1L",
    "BRD-015": "Whole Wheat Bread",
    "PRD-042": "Fresh Bananas",
    "DRY-089": "Greek Yogurt",
    "BEV-023": "Orange Juice 2L",
    "CHE-012": "Cheddar Cheese 500g",
  };

  const handleESLScan = () => {
    if (!eslInput.trim()) return;
    setCurrentESL(eslInput.trim());
    setCurrentStep("sku");
    setEslInput("");
  };

  const handleSKUScan = () => {
    if (!skuInput.trim() || !currentESL) return;
    const product = productLookup[skuInput.trim()] || `Product ${skuInput.trim()}`;
    setAssignments(prev => [...prev, {
      eslId: currentESL,
      product,
      sku: skuInput.trim(),
      status: "pending"
    }]);
    setSkuInput("");
    setCurrentESL("");
    setCurrentStep("esl");
    toast({
      title: "Pair Added",
      description: `${currentESL} → ${product}`,
    });
  };

  const handleStartBatch = () => {
    if (assignments.length === 0) return;
    setIsRunning(true);
    
    assignments.forEach((_, index) => {
      setTimeout(() => {
        setAssignments(prev => prev.map((a, i) => 
          i === index ? { ...a, status: "processing" } : a
        ));
        
        setTimeout(() => {
          setAssignments(prev => prev.map((a, i) => 
            i === index ? { ...a, status: Math.random() > 0.1 ? "success" : "error" } : a
          ));
          
          if (index === assignments.length - 1) {
            setIsRunning(false);
            toast({
              title: "Batch Complete",
              description: `${assignments.length} assignments processed`,
            });
          }
        }, 800);
      }, index * 1200);
    });
  };

  const removeAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const successCount = assignments.filter(a => a.status === "success").length;
  const progress = assignments.length > 0 ? (successCount / assignments.length) * 100 : 0;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld/operations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Multi-Assign</h1>
          <p className="text-xs text-muted-foreground">Bulk ESL assignment mode</p>
        </div>
        {assignments.length > 0 && (
          <Badge variant="secondary">{assignments.length} pairs</Badge>
        )}
      </div>

      {/* Scan Input */}
      <Card className={cn(
        "border-2 transition-colors",
        currentStep === "esl" ? "border-primary" : "border-amber-500"
      )}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              currentStep === "esl" ? "bg-primary text-primary-foreground" : "bg-amber-500 text-white"
            )}>
              {currentStep === "esl" ? "1" : "2"}
            </div>
            <div>
              <p className="font-medium text-sm">
                {currentStep === "esl" ? "Scan ESL Barcode" : "Scan Product SKU"}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentStep === "esl" 
                  ? "Scan the barcode on the ESL device" 
                  : `Assigning to: ${currentESL}`}
              </p>
            </div>
          </div>
          
          {currentStep === "esl" ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ESL-XXX or scan..."
                  className="pl-9"
                  value={eslInput}
                  onChange={(e) => setEslInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleESLScan()}
                  autoFocus
                />
              </div>
              <Button onClick={handleESLScan}>Next</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SKU or scan product..."
                  className="pl-9"
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSKUScan()}
                  autoFocus
                />
              </div>
              <Button variant="outline" onClick={() => { setCurrentStep("esl"); setCurrentESL(""); }}>
                Back
              </Button>
              <Button onClick={handleSKUScan}>Add</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Processing...</span>
              <span className="text-sm text-muted-foreground">{successCount}/{assignments.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Assignment Queue */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Assignment Queue</CardTitle>
              {!isRunning && (
                <Button size="sm" onClick={handleStartBatch}>
                  <Play className="h-4 w-4 mr-1" />
                  Start Batch
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignments.map((assignment, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border",
                  assignment.status === "success" && "bg-green-500/10 border-green-500/30",
                  assignment.status === "error" && "bg-destructive/10 border-destructive/30",
                  assignment.status === "processing" && "bg-primary/10 border-primary/30"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {assignment.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : assignment.status === "processing" ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{assignment.eslId}</p>
                  <p className="text-xs text-muted-foreground truncate">{assignment.product}</p>
                </div>
                {assignment.status === "pending" && !isRunning && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => removeAssignment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {assignments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Layers className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Scan ESL and product pairs to build your batch</p>
          <p className="text-xs mt-1">Then press "Start Batch" to assign all at once</p>
        </div>
      )}
    </div>
  );
}
