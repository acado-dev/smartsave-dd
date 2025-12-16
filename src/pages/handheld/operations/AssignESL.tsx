import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Battery,
  Wifi,
  Link,
  Package,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Step = "scan-esl" | "pre-check" | "scan-product" | "confirm" | "complete";

const preChecks = [
  { id: "battery", label: "Battery Level", icon: Battery, status: "pass", value: "87%" },
  { id: "connectivity", label: "RF Signal", icon: Wifi, status: "pass", value: "Strong" },
  { id: "firmware", label: "Firmware", icon: CheckCircle2, status: "pass", value: "v3.2.1" },
];

export default function AssignESL() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("scan-esl");
  const [eslId, setEslId] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const eslInfo = {
    id: "ESL-7892",
    type: "2.9\" Graphic",
    battery: 87,
    signal: "Strong",
    location: "Aisle 2, Shelf B3"
  };

  const productInfo = {
    barcode: "8001234567890",
    name: "Organic Whole Milk 1L",
    price: "€2.49",
    category: "Dairy"
  };

  const handleScanESL = () => {
    setIsScanning(true);
    setTimeout(() => {
      setEslId(eslInfo.id);
      setIsScanning(false);
      setStep("pre-check");
    }, 1500);
  };

  const handleScanProduct = () => {
    setIsScanning(true);
    setTimeout(() => {
      setProductBarcode(productInfo.barcode);
      setIsScanning(false);
      setStep("confirm");
    }, 1500);
  };

  const handleConfirm = () => {
    setStep("complete");
    toast({
      title: "Assignment Successful",
      description: `${eslInfo.id} linked to ${productInfo.name}`,
    });
  };

  const getStepNumber = () => {
    switch (step) {
      case "scan-esl": return 1;
      case "pre-check": return 2;
      case "scan-product": return 3;
      case "confirm": return 4;
      case "complete": return 5;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld/operations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Assign ESL</h2>
          <p className="text-sm text-muted-foreground">Link ESL to product</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {getStepNumber()} of 5</span>
          <span>{Math.round((getStepNumber() / 5) * 100)}%</span>
        </div>
        <Progress value={(getStepNumber() / 5) * 100} className="h-2" />
      </div>

      {/* Step Content */}
      {step === "scan-esl" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Step 1: Scan ESL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Point camera at ESL barcode</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="esl-manual">Or enter ESL ID manually</Label>
              <div className="flex gap-2">
                <Input 
                  id="esl-manual" 
                  placeholder="ESL-XXXX" 
                  value={eslId}
                  onChange={(e) => setEslId(e.target.value)}
                />
                <Button onClick={handleScanESL}>
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleScanESL}>
              Scan ESL Barcode
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "pre-check" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Step 2: Pre-Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Link className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{eslInfo.id}</p>
                    <p className="text-xs text-muted-foreground">{eslInfo.type} • {eslInfo.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {preChecks.map((check) => (
                <div 
                  key={check.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <check.icon className={cn(
                      "h-4 w-4",
                      check.status === "pass" ? "text-green-500" : "text-destructive"
                    )} />
                    <span className="text-sm">{check.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{check.value}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>All pre-checks passed. ESL is ready for assignment.</span>
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep("scan-product")}>
              Continue to Product Scan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "scan-product" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5" />
              Step 3: Scan Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Point camera at product barcode</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-manual">Or enter barcode manually</Label>
              <div className="flex gap-2">
                <Input 
                  id="product-manual" 
                  placeholder="Barcode" 
                  value={productBarcode}
                  onChange={(e) => setProductBarcode(e.target.value)}
                />
                <Button onClick={handleScanProduct}>
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleScanProduct}>
              Scan Product Barcode
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link className="h-5 w-5" />
              Step 4: Confirm Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">ESL Device</p>
                  <p className="font-medium">{eslInfo.id}</p>
                  <p className="text-sm text-muted-foreground">{eslInfo.type}</p>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link className="h-4 w-4 text-primary" />
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Product</p>
                  <p className="font-medium">{productInfo.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{productInfo.price}</Badge>
                    <Badge variant="outline">{productInfo.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>This will update the ESL display immediately.</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("scan-product")}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Confirm Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "complete" && (
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Assignment Complete</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {eslInfo.id} is now linked to {productInfo.name}
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => {
                setStep("scan-esl");
                setEslId("");
                setProductBarcode("");
              }}>
                Assign Another ESL
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/handheld/operations")}>
                Back to Operations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
