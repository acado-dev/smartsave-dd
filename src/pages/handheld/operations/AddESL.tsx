import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Package,
  MapPin,
  Wifi
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Step = "scan" | "location" | "product" | "confirm";

export default function AddESL() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("scan");
  const [eslId, setEslId] = useState("");
  const [aisle, setAisle] = useState("");
  const [shelf, setShelf] = useState("");
  const [productSku, setProductSku] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const productLookup: Record<string, string> = {
    "MLK-001": "Organic Milk 1L",
    "BRD-015": "Whole Wheat Bread",
    "PRD-042": "Fresh Bananas",
    "CHE-012": "Cheddar Cheese 500g",
  };

  const productName = productSku ? productLookup[productSku] || `Product ${productSku}` : "";

  const handleScanESL = () => {
    if (!eslId.trim()) return;
    setStep("location");
  };

  const handleSetLocation = () => {
    if (!aisle.trim() || !shelf.trim()) return;
    setStep("product");
  };

  const handleSetProduct = () => {
    if (!productSku.trim()) return;
    setStep("confirm");
  };

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      toast({
        title: "ESL Registered Successfully",
        description: `${eslId} is now active at Aisle ${aisle}, Shelf ${shelf}`,
      });
      navigate("/handheld/operations");
    }, 2000);
  };

  const getStepNumber = () => {
    switch (step) {
      case "scan": return 1;
      case "location": return 2;
      case "product": return 3;
      case "confirm": return 4;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => {
          if (step === "scan") navigate("/handheld/operations");
          else if (step === "location") setStep("scan");
          else if (step === "product") setStep("location");
          else if (step === "confirm") setStep("product");
        }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Add New ESL</h1>
          <p className="text-xs text-muted-foreground">Register new device to system</p>
        </div>
        <Badge variant="outline">Step {getStepNumber()}/4</Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-2">
        {["Scan", "Location", "Product", "Confirm"].map((label, index) => (
          <div key={label} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              getStepNumber() > index + 1 && "bg-green-500 text-white",
              getStepNumber() === index + 1 && "bg-primary text-primary-foreground",
              getStepNumber() < index + 1 && "bg-muted text-muted-foreground"
            )}>
              {getStepNumber() > index + 1 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
            </div>
            {index < 3 && (
              <div className={cn(
                "w-8 h-0.5 mx-1",
                getStepNumber() > index + 1 ? "bg-green-500" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Scan ESL */}
      {step === "scan" && (
        <Card className="border-primary border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Step 1: Scan New ESL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Scan ESL barcode..."
                  className="pl-9"
                  value={eslId}
                  onChange={(e) => setEslId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScanESL()}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleScanESL} disabled={!eslId.trim()}>
              Next: Set Location
            </Button>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Scan the barcode on the back of the new ESL device. Make sure the ESL is not already registered.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Set Location */}
      {step === "location" && (
        <Card className="border-primary border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Step 2: Set Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium">{eslId}</p>
              <p className="text-xs text-muted-foreground">New ESL device</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Aisle</label>
                <Input
                  placeholder="e.g., 3"
                  value={aisle}
                  onChange={(e) => setAisle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Shelf</label>
                <Input
                  placeholder="e.g., A2"
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSetLocation} disabled={!aisle.trim() || !shelf.trim()}>
              Next: Assign Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Assign Product */}
      {step === "product" && (
        <Card className="border-primary border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Step 3: Assign Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{eslId}</p>
                <p className="text-xs text-muted-foreground">Aisle {aisle}, Shelf {shelf}</p>
              </div>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan product barcode or enter SKU..."
                className="pl-9"
                value={productSku}
                onChange={(e) => setProductSku(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetProduct()}
              />
            </div>
            {productName && (
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                <p className="text-sm font-medium text-green-700">{productName}</p>
                <p className="text-xs text-muted-foreground">SKU: {productSku}</p>
              </div>
            )}
            <Button className="w-full" onClick={handleSetProduct} disabled={!productSku.trim()}>
              Next: Confirm
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirm */}
      {step === "confirm" && (
        <Card className="border-green-500 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Step 4: Confirm Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">ESL ID</span>
                <span className="text-sm font-medium">{eslId}</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium">Aisle {aisle}, Shelf {shelf}</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="text-sm font-medium">{productName}</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">SKU</span>
                <span className="text-sm font-medium">{productSku}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Please verify all information is correct. The ESL will be activated and pricing will be pushed to the display.
              </p>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleRegister} 
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Register ESL
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
