import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Camera, Upload, Scan, TrendingDown, AlertTriangle, Tag, Package, Calendar, DollarSign, Monitor, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { sampleInventory, identifyProductFromKeywords, type InventoryItem } from "@/data/sampleInventory";
import ithinaLogo from "@/assets/ithina-logo.png";

export default function FreshnessMobileAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [identifiedProduct, setIdentifiedProduct] = useState<InventoryItem | null>(null);
  const [testMode, setTestMode] = useState<string>("auto");
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [isESLDialogOpen, setIsESLDialogOpen] = useState(false);
  const [isPriceRuleDialogOpen, setIsPriceRuleDialogOpen] = useState(false);
  
  const [eslProductName, setEslProductName] = useState("");
  const [eslNewPrice, setEslNewPrice] = useState("");
  const [eslDisplayMessage, setEslDisplayMessage] = useState("");
  const [eslDisplayColor, setEslDisplayColor] = useState("");
  
  const [ruleName, setRuleName] = useState("");
  const [ruleProduct, setRuleProduct] = useState("");
  const [ruleCategory, setRuleCategory] = useState("");
  const [ruleCondition, setRuleCondition] = useState("");
  const [ruleThreshold, setRuleThreshold] = useState("");
  const [rulePriceAdjustment, setRulePriceAdjustment] = useState("");
  const [ruleAdjustmentType, setRuleAdjustmentType] = useState("percentage");
  const [ruleAutoApply, setRuleAutoApply] = useState(true);
  
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sku, setSku] = useState("");
  const [supplier, setSupplier] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  const [analysisResult, setAnalysisResult] = useState<{
    freshness: number;
    shelfLife: number;
    suggestedPrice: number;
    priceReduction: number;
    condition: string;
    factors: string[];
    eslActions: string[];
    displayRecommendations: {
      color: string;
      message: string;
      urgency: "high" | "medium" | "low";
    };
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFilename(file.name.toLowerCase());
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setIdentifiedProduct(null);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraActive(true);
      toast({ title: "Camera started", description: "Position the item and capture" });
    } catch {
      toast({ title: "Camera error", description: "Could not access camera.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.drawImage(video, 0, 0); setImagePreview(canvas.toDataURL('image/jpeg')); stopCamera(); }
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) {
      toast({ title: "No image", description: "Please upload or capture an image first", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      let kw: string[] = [];
      let confidence = 0;

      if (testMode === "bananas") { kw = ["banana", "yellow", "fruit"]; confidence = 94; }
      else if (testMode === "tomatoes") { kw = ["tomato", "red", "vegetable"]; confidence = 91; }
      else if (testMode === "milk") { kw = ["milk", "dairy", "white"]; confidence = 89; }
      else if (testMode === "random") {
        const all = ["red","round","fruit","fresh","tomato","vegetable","banana","yellow","apple","orange","strawberry","lettuce","green","milk","dairy","carton","cheese","eggs","yogurt"];
        kw = all.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
        confidence = 70 + Math.floor(Math.random() * 20);
      } else {
        const fn = uploadedFilename;
        if (fn.includes("banana")) { kw = ["banana","yellow","fruit"]; confidence = 94; }
        else if (fn.includes("tomato")) { kw = ["tomato","red","vegetable"]; confidence = 91; }
        else if (fn.includes("milk")) { kw = ["milk","dairy","white"]; confidence = 89; }
        else {
          const all = ["red","round","fruit","fresh","tomato","vegetable","banana","yellow","apple","orange","strawberry","lettuce","green","milk","dairy","carton","cheese","eggs","yogurt"];
          kw = all.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
          confidence = 70 + Math.floor(Math.random() * 20);
        }
      }

      setDetectedKeywords(kw);
      setDetectionConfidence(confidence);
      const identified = identifyProductFromKeywords(kw);
      
      if (identified) {
        setIdentifiedProduct(identified);
        setProductName(identified.name);
        setCategory(identified.category);
        setQuantity(identified.quantity.toString());
        setLocation(identified.location);
        setOriginalPrice(identified.originalPrice.toString());
        setSku(identified.sku);
        setSupplier(identified.supplier);
        setReceivedDate(identified.receivedDate);
        setExpiryDate(identified.expiryDate);
        toast({ title: "Product identified!", description: `Detected: ${identified.name} (${confidence}% confidence)` });
      } else {
        toast({ title: "Product not found", description: "Could not match to inventory", variant: "destructive" });
      }

      const daysUntilExpiry = identified 
        ? Math.max(0, Math.floor((new Date(identified.expiryDate).getTime() - Date.now()) / 86400000))
        : Math.floor(Math.random() * 10) + 2;

      let baseFreshness = 43;
      let priceMultiplier = 1.0;
      const factors: string[] = [];
      const eslActions: string[] = [];
      
      if (baseFreshness < 70) { priceMultiplier *= 0.70; factors.push("Low freshness score (-30%)"); eslActions.push("Update price immediately"); eslActions.push("Display 'Quick Sale' badge"); }
      if (daysUntilExpiry <= 2) { priceMultiplier *= 0.60; factors.push("Near expiration (-40%)"); eslActions.push("Flash red indicator on ESL"); eslActions.push("Add 'Use Today' message"); }
      else if (daysUntilExpiry <= 4) { priceMultiplier *= 0.80; factors.push("Approaching expiry (-20%)"); eslActions.push("Display amber indicator"); eslActions.push("Show days until expiry"); }
      if (identified && parseInt(quantity) > 100) { priceMultiplier *= 0.95; factors.push("High inventory (-5%)"); eslActions.push("Add 'Stock Up' promotion"); }

      const price = identified ? identified.originalPrice : parseFloat(originalPrice || "0");
      const suggestedPrice = parseFloat((price * priceMultiplier).toFixed(2));
      const reduction = Math.round((1 - priceMultiplier) * 100);

      let displayRecommendations;
      if (baseFreshness >= 85) { displayRecommendations = { color: "green", message: "Fresh & Ready", urgency: "low" as const }; }
      else if (baseFreshness >= 70) { displayRecommendations = { color: "yellow", message: "Sale Price - Great Value", urgency: "medium" as const }; }
      else { displayRecommendations = { color: "red", message: "CLEARANCE - Use Soon", urgency: "high" as const }; }

      setAnalysisResult({ freshness: Math.round(baseFreshness), shelfLife: daysUntilExpiry, suggestedPrice, priceReduction: reduction, condition: baseFreshness >= 85 ? "Excellent" : baseFreshness >= 70 ? "Good" : baseFreshness >= 60 ? "Fair" : "Poor", factors, eslActions, displayRecommendations });
      setIsAnalyzing(false);
      toast({ title: "Analysis complete", description: "AI freshness analysis finished" });
    }, 2500);
  };

  const openESLDialog = () => {
    if (analysisResult && identifiedProduct) {
      setEslProductName(identifiedProduct.name);
      setEslNewPrice(analysisResult.suggestedPrice.toString());
      setEslDisplayMessage(analysisResult.displayRecommendations.message);
      setEslDisplayColor(analysisResult.displayRecommendations.color);
    }
    setIsESLDialogOpen(true);
  };

  const openPriceRuleDialog = () => {
    if (identifiedProduct && analysisResult) {
      setRuleName(`Auto-markdown: ${identifiedProduct.name}`);
      setRuleProduct(identifiedProduct.name);
      setRuleCategory(identifiedProduct.category);
      setRuleCondition("freshness_below");
      setRuleThreshold("70");
      setRulePriceAdjustment(analysisResult.priceReduction.toString());
    }
    setIsPriceRuleDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/freshness")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={ithinaLogo} alt="Ithina" className="h-7 w-auto" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">AI Freshness Analysis</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4 pb-8">
        {/* Image Capture */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Image Input
          </h3>

          <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
            {isCameraActive ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Scan className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No image selected</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <Select value={testMode} onValueChange={setTestMode}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Detection mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              <SelectItem value="bananas">Bananas</SelectItem>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
              <SelectItem value="milk">Milk</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2">
            {isCameraActive ? (
              <>
                <Button size="sm" onClick={captureImage}><Camera className="mr-1.5 h-4 w-4" />Capture</Button>
                <Button size="sm" variant="outline" onClick={stopCamera}>Stop</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={startCamera}><Camera className="mr-1.5 h-4 w-4" />Camera</Button>
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-1.5 h-4 w-4" />Upload</Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </>
            )}
          </div>
        </Card>

        {/* Detection Results */}
        {detectedKeywords.length > 0 && (
          <Card className="p-4 space-y-2">
            <h3 className="text-sm font-semibold">Detection Results</h3>
            <div className="flex flex-wrap gap-1.5">
              {detectedKeywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <Progress value={detectionConfidence} className="flex-1 h-2" />
              <span className="text-xs font-medium">{detectionConfidence}%</span>
            </div>
          </Card>
        )}

        {/* Product Details */}
        {identifiedProduct && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Details
              </h3>
              <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700">Auto-detected</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground text-xs block">Product</span>{productName}</div>
              <div><span className="text-muted-foreground text-xs block">Category</span>{category}</div>
              <div><span className="text-muted-foreground text-xs block">Quantity</span>{quantity} units</div>
              <div><span className="text-muted-foreground text-xs block">Location</span>{location}</div>
              <div><span className="text-muted-foreground text-xs block">Price</span>${originalPrice}</div>
              <div><span className="text-muted-foreground text-xs block">SKU</span>{sku}</div>
              <div><span className="text-muted-foreground text-xs block">Received</span>{receivedDate}</div>
              <div><span className="text-muted-foreground text-xs block">Expires</span>{expiryDate}</div>
            </div>
          </Card>
        )}

        {/* Analyze Button */}
        <Button className="w-full" size="lg" onClick={analyzeImage} disabled={isAnalyzing || !imagePreview}>
          {isAnalyzing ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Analyzing...</>
          ) : (
            <><Scan className="mr-2 h-5 w-5" />Analyze Freshness</>
          )}
        </Button>

        {/* Analysis Results */}
        {analysisResult && (
          <>
            {/* Freshness Score */}
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Freshness Score
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={analysisResult.freshness >= 70 ? "hsl(142, 76%, 36%)" : analysisResult.freshness >= 50 ? "hsl(48, 96%, 53%)" : "hsl(0, 84%, 60%)"} strokeWidth="3" strokeDasharray={`${analysisResult.freshness}, 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{analysisResult.freshness}%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Condition</span>
                    <Badge variant={analysisResult.condition === "Poor" ? "destructive" : "secondary"}>{analysisResult.condition}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shelf Life</span>
                    <span className="font-medium">{analysisResult.shelfLife} days</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing Recommendation
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Original</p>
                  <p className="text-lg font-semibold line-through text-muted-foreground">${originalPrice}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Suggested</p>
                  <p className="text-lg font-bold text-primary">${analysisResult.suggestedPrice}</p>
                </div>
              </div>
              <Badge variant="destructive" className="text-xs">{analysisResult.priceReduction}% reduction</Badge>
              <div className="space-y-1">
                {analysisResult.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 shrink-0" />{f}
                  </div>
                ))}
              </div>
            </Card>

            {/* ESL Actions */}
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                ESL Display Actions
              </h3>
              <div className={`p-3 rounded-lg border-2 ${
                analysisResult.displayRecommendations.color === "red" ? "border-red-500 bg-red-50" :
                analysisResult.displayRecommendations.color === "yellow" ? "border-yellow-500 bg-yellow-50" :
                "border-green-500 bg-green-50"
              }`}>
                <p className="text-sm font-bold">{analysisResult.displayRecommendations.message}</p>
                <p className="text-xs text-muted-foreground mt-1">Display color: {analysisResult.displayRecommendations.color}</p>
              </div>
              <div className="space-y-1.5">
                {analysisResult.eslActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-primary shrink-0" />{action}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={openESLDialog} className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />Push to ESL
                </Button>
                <Button size="sm" variant="outline" onClick={openPriceRuleDialog} className="text-xs">
                  <DollarSign className="mr-1 h-3 w-3" />Create Rule
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* ESL Dialog */}
      <Dialog open={isESLDialogOpen} onOpenChange={setIsESLDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Push to ESL Display</DialogTitle>
            <DialogDescription className="text-xs">Update the electronic shelf label</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Product</Label><Input value={eslProductName} onChange={e => setEslProductName(e.target.value)} className="h-9 text-sm" /></div>
            <div className="space-y-1"><Label className="text-xs">New Price ($)</Label><Input value={eslNewPrice} onChange={e => setEslNewPrice(e.target.value)} className="h-9 text-sm" /></div>
            <div className="space-y-1"><Label className="text-xs">Display Message</Label><Textarea value={eslDisplayMessage} onChange={e => setEslDisplayMessage(e.target.value)} className="text-sm min-h-[60px]" /></div>
            <div className="space-y-1">
              <Label className="text-xs">Display Color</Label>
              <Select value={eslDisplayColor} onValueChange={setEslDisplayColor}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red - Urgent</SelectItem>
                  <SelectItem value="yellow">Yellow - Warning</SelectItem>
                  <SelectItem value="green">Green - Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setIsESLDialogOpen(false); toast({ title: "ESL Updated", description: "Price pushed to display" }); }} className="w-full">
              <Check className="mr-2 h-4 w-4" />Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Rule Dialog */}
      <Dialog open={isPriceRuleDialogOpen} onOpenChange={setIsPriceRuleDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Create Pricing Rule</DialogTitle>
            <DialogDescription className="text-xs">Auto-apply pricing based on freshness</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Rule Name</Label><Input value={ruleName} onChange={e => setRuleName(e.target.value)} className="h-9 text-sm" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Product</Label><Input value={ruleProduct} onChange={e => setRuleProduct(e.target.value)} className="h-9 text-sm" /></div>
              <div className="space-y-1"><Label className="text-xs">Category</Label><Input value={ruleCategory} onChange={e => setRuleCategory(e.target.value)} className="h-9 text-sm" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Price Adjustment (%)</Label><Input value={rulePriceAdjustment} onChange={e => setRulePriceAdjustment(e.target.value)} className="h-9 text-sm" /></div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setIsPriceRuleDialogOpen(false); toast({ title: "Rule Created", description: "Pricing rule saved" }); }} className="w-full">
              <Check className="mr-2 h-4 w-4" />Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
