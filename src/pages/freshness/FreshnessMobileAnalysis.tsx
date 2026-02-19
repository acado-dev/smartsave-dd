import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
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
import { matchItemFromKeywords, getFreshnessBand, getFreshnessCondition, getFreshnessColor, type FreshnessItem } from "@/data/freshnessDatabase";
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
  const [matchedDbItem, setMatchedDbItem] = useState<FreshnessItem | null>(null);
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

  const [produce_type, setProduceType] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sku, setSku] = useState("");
  const [supplier, setSupplier] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [days_since_harvest, setDaysSinceHarvest] = useState("2");
  const [storage_condition, setStorageCondition] = useState("Ambient");
  const [observations, setObservations] = useState("");

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
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        identifyImage(file.name.toLowerCase());
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setIdentifiedProduct(null);
      setMatchedDbItem(null);
    }
  };

  const identifyImage = (filename: string) => {
    let kw: string[] = [];
    let confidence = 0;

    if (testMode === "bananas") { kw = ["banana", "yellow", "fruit"]; confidence = 94; }
    else if (testMode === "tomatoes") { kw = ["tomato", "red", "vegetable"]; confidence = 91; }
    else if (testMode === "potato") { kw = ["potato", "root", "vegetable"]; confidence = 92; }
    else if (testMode === "pome") { kw = ["pome", "seeds", "fruit"]; confidence = 88; }
    else if (testMode === "milk") { kw = ["milk", "dairy", "white"]; confidence = 89; }
    else if (testMode === "random") {
      const all = ["red", "round", "fruit", "fresh", "tomato", "vegetable", "banana", "yellow", "apple", "orange", "strawberry", "lettuce", "green", "milk", "dairy", "carton", "cheese", "eggs", "yogurt"];
      kw = all.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
      confidence = 70 + Math.floor(Math.random() * 20);
    } else {
      if (filename.includes("banana")) { kw = ["banana", "yellow", "fruit"]; confidence = 94; }
      else if (filename.includes("tomato")) { kw = ["tomato", "red", "vegetable"]; confidence = 91; }
      else if (filename.includes("milk")) { kw = ["milk", "dairy", "white"]; confidence = 89; }
      else {
        const all = ["red", "round", "fruit", "fresh", "tomato", "vegetable", "banana", "yellow", "apple", "orange", "strawberry", "lettuce", "green", "milk", "dairy", "carton", "cheese", "eggs", "yogurt"];
        kw = all.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
        confidence = 70 + Math.floor(Math.random() * 20);
      }
    }

    setDetectedKeywords(kw);
    setDetectionConfidence(confidence);

    // Match against the legacy sampleInventory (for price/supplier/location data)
    const identified = identifyProductFromKeywords(kw);
    // Also match against the large freshnessDatabase (band-aware, clearance dates)
    const dbMatch = matchItemFromKeywords(kw);
    setMatchedDbItem(dbMatch);

    if (identified) {
      setIdentifiedProduct(identified);
      setProduceType(identified.name);
      setCategory(identified.category);
      setQuantity(identified.quantity.toString());
      setLocation(identified.location);
      setOriginalPrice(identified.originalPrice.toString());
      setSku(identified.sku);
      setSupplier(identified.supplier);
      setReceivedDate(identified.receivedDate);
      setExpiryDate(identified.expiryDate);
    } else if (dbMatch) {
      // Fall back to freshnessDatabase record if not in sampleInventory
      setIdentifiedProduct(null);
      setProduceType(dbMatch.name);
      setCategory(dbMatch.category);
      setQuantity(dbMatch.quantity.toString());
      setLocation(dbMatch.location);
      setOriginalPrice(dbMatch.originalPrice.toString());
      setSku(dbMatch.sku);
      setSupplier(dbMatch.supplier);
      setReceivedDate(dbMatch.receivedDate);
      setExpiryDate(dbMatch.expiryDate);
    } else {
      setIdentifiedProduct(null);
      setProduceType("");
      setCategory("");
      setQuantity("");
      setLocation("");
      setOriginalPrice("");
      setSku("");
      setSupplier("");
      setReceivedDate("");
      setExpiryDate("");
    }
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  // Re-identify when detection mode changes
  useEffect(() => {
    if (imagePreview) {
      identifyImage(uploadedFilename || "image.jpg");
    }
  }, [testMode]);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      toast({ title: "Camera started", description: "Position the item and capture" });
    } catch (err) {
      console.error("Camera access error:", err);
      setIsCameraActive(false);
      toast({ title: "Camera error", description: "Could not access camera. Please check permissions.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Ensure we have video dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        toast({ title: "Capture failed", description: "Video stream not ready. Try again.", variant: "destructive" });
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        identifyImage("captured_image.jpg");
        stopCamera();
        setAnalysisResult(null);
        setIdentifiedProduct(null);
        setMatchedDbItem(null);
      }
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) {
      toast({ title: "No image", description: "Please upload or capture an image first", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);

    try {
      // Prepare OpenAI call
      const openai = new OpenAI({
        apiKey: "",
        dangerouslyAllowBrowser: true
      });

      const base64Image = imagePreview.split(',')[1];

      const prompt = `You are an AI produce quality inspector and pricing assistant.

Given an image or textual description of a perishable produce item, evaluate its current freshness and recommend an appropriate discount.

Follow these steps:

1. Evaluate the following parameters (0-10 scale):
   - Colour: Brightness and ripeness quality (Deep red/orange vs dull) - Weight: 0.2
   - Firmness: Resistance to touch (Firm = fresh, Soft = near spoilage) - Weight: 0.3
   - Surface Condition: Scratches, mold, bruises (Clean = 10, minor blemish = 7, mold = 0) - Weight: 0.2
   - Smell/Aroma: Fermented or off-smell reduces score (Normal = 10, sour = 5) - Weight: 0.1
   - Expected Shelf Life Remaining: Estimated days based on current condition (Fresh = 10, Overripe = 3) - Weight: 0.2

2. Compute the Freshness Score using the formula:
   Freshness Score = (Colour×0.2 + Firmness×0.3 + Surface×0.2 + Smell×0.1 + ShelfLife×0.2)

3. Determine Grade based on Freshness Score:
   - Grade A: 8.5-10 (Fresh and firm, 5-7 days shelf life)
   - Grade B: 7-8.4 (Ripe and good, 2-4 days shelf life)
   - Grade C: 5-6.9 (Softening, dull colour, 1-2 days shelf life)
   - Grade D: <5 (Overripe, damaged, <1 day shelf life)

4. Determine Discount Recommendation based on Grade:
   - Grade A: 0-10% discount
   - Grade B: 20-30% discount
   - Grade C: 35-50% discount
   - Grade D: 60%+ discount

5. Provide recommended label:
   - Grade A: "Fresh Pick"
   - Grade B: "Ripe Today"
   - Grade C: "Use Soon"
   - Grade D: "Process Immediately"

Product Information:
- Detection Mode: ${testMode}
- Produce Type: ${(testMode !== "auto" && testMode !== "random") ? testMode : (produce_type || 'Unknown')}
- Days Since Harvest: ${days_since_harvest}
- Storage Condition: ${storage_condition}
- Observations: ${observations || 'None provided'}

Output strictly in this JSON format:
{
  "produce_type": "${(testMode !== "auto" && testMode !== "random") ? testMode : (produce_type || 'Unknown')}",
  "freshness_score": <calculated score 0-10>,
  "grade": "<A/B/C/D>",
  "shelf_life_days_remaining": <integer>,
  "discount_recommendation": <percentage 0-70>,
  "recommended_label": "<short label>",
  "notes": "<brief explanation of the evaluation>"
}`;

      const messages: any[] = [
        {
          role: 'system',
          content: 'You are a food retail pricing expert. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);

      // Validate and map to state
      const freshnessScore = Math.max(0, Math.min(10, parseFloat(result.freshness_score) || 0));
      const freshnessPercent = Math.round(freshnessScore * 10); // 0-100
      const shelfLife = parseInt(result.shelf_life_days_remaining) || 0;
      const reduction = Math.max(0, Math.min(70, parseFloat(result.discount_recommendation) || 0));

      const detectedKws = detectedKeywords.length > 0 ? detectedKeywords : [produce_type.toLowerCase()];
      const bandMatch = matchItemFromKeywords(detectedKws, freshnessPercent);

      if (bandMatch) {
        setMatchedDbItem(bandMatch);
        // Specifically update UI state to match the band-specific record
        setProduceType(bandMatch.name);
        setCategory(bandMatch.category);
        setQuantity(bandMatch.quantity.toString());
        setLocation(bandMatch.location);
        setOriginalPrice(bandMatch.originalPrice.toString());
        setSku(bandMatch.sku);
        setSupplier(bandMatch.supplier);
        setReceivedDate(bandMatch.receivedDate);
        setExpiryDate(bandMatch.expiryDate);
      }

      const price = bandMatch ? bandMatch.originalPrice
        : identifiedProduct ? identifiedProduct.originalPrice
          : parseFloat(originalPrice || "0");
      const suggestedPrice = parseFloat((price * (1 - reduction / 100)).toFixed(2));

      // Populate expiry / clearance from DB match if available
      if (bandMatch) {
        setExpiryDate(bandMatch.expiryDate);
      }

      let condition = "Fair";
      if (result.grade === "A") condition = "Excellent";
      else if (result.grade === "B") condition = "Good";
      else if (result.grade === "C") condition = "Fair";
      else if (result.grade === "D") condition = "Poor";

      const factors = result.notes ? [result.notes] : ["Analysis completed"];
      const eslActions = ["Update price immediately"];
      if (reduction > 20) eslActions.push(reduction > 50 ? "Flash red indicator on ESL" : "Display amber indicator");
      if (bandMatch && bandMatch.clearanceDiscount > 0) eslActions.push(`Apply ${bandMatch.clearanceDiscount}% clearance discount`);

      let displayColor = "green";
      if (result.grade === "D" || result.grade === "C") displayColor = "red";
      else if (result.grade === "B") displayColor = "yellow";

      setAnalysisResult({
        freshness: freshnessPercent,
        shelfLife,
        suggestedPrice,
        priceReduction: reduction,
        condition,
        factors,
        eslActions,
        displayRecommendations: {
          color: displayColor,
          message: result.recommended_label || "Use Soon",
          urgency: result.grade === "D" ? "high" : result.grade === "B" || result.grade === "C" ? "medium" : "low"
        }
      });

      toast({ title: "Analysis complete", description: "AI freshness analysis finished" });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: "Analysis failed", description: error instanceof Error ? error.message : "Failed to analyze image", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
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
              <SelectItem value="potato">Potatos</SelectItem>
              <SelectItem value="pome">Pomegranate</SelectItem>
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


        {/* Analysis Parameters */}
        {/*<Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Analysis Parameters
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="produce-type" className="text-xs">Produce Type</Label>
            <Input
              id="produce-type"
              placeholder="e.g. Red Tomatoes, Cavendish Bananas"
              value={produce_type}
              onChange={(e) => setProduceType(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="days-harvest" className="text-xs">Days Since Harvest</Label>
              <Input
                id="days-harvest"
                type="number"
                value={days_since_harvest}
                onChange={(e) => setDaysSinceHarvest(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storage-cond" className="text-xs">Storage Condition</Label>
              <Select value={storage_condition} onValueChange={setStorageCondition}>
                <SelectTrigger id="storage-cond" className="h-8 text-sm">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambient">Ambient</SelectItem>
                  <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="Chilled">Chilled</SelectItem>
                  <SelectItem value="Frozen">Frozen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="observations" className="text-xs">Observations (Optional)</Label>
            <Textarea
              id="observations"
              placeholder="e.g. minor bruising, slight discoloration..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="text-sm min-h-[60px] resize-none"
            />
          </div>
        </Card>*/}

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
            {/* Product Details */}
            {(identifiedProduct || matchedDbItem) && (
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Product Details
                  </h3>
                  <Badge variant="secondary" className="text-xs">Auto-detected</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs block">Product</span>{produce_type}</div>
                  <div><span className="text-muted-foreground text-xs block">Category</span>{category}</div>
                  <div><span className="text-muted-foreground text-xs block">Quantity</span>{quantity} units</div>
                  <div><span className="text-muted-foreground text-xs block">Location</span>{location}</div>
                  <div><span className="text-muted-foreground text-xs block">Price</span>${originalPrice}</div>
                  <div><span className="text-muted-foreground text-xs block">SKU</span>{sku}</div>
                  <div><span className="text-muted-foreground text-xs block">Received</span>{receivedDate}</div>
                  <div><span className="text-muted-foreground text-xs block">Expires</span>{expiryDate}</div>
                  {matchedDbItem && (
                    <>
                      <div>
                        <span className="text-muted-foreground text-xs block">Freshness Band</span>
                        <Badge variant="outline" className="text-xs mt-0.5">{matchedDbItem.band}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs block">Clearance By</span>
                        <span className={matchedDbItem.clearanceDiscount > 40 ? "text-destructive font-semibold" : ""}>{matchedDbItem.clearanceDate}</span>
                      </div>
                      {matchedDbItem.clearanceDiscount > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground text-xs block">Recommended Clearance Discount</span>
                          <span className="font-bold text-destructive">{matchedDbItem.clearanceDiscount}% off</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            )}
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
            {/*<Card className="p-4 space-y-3">
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
            </Card>*/}

            {/* ESL Actions */}
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                ESL Display Actions
              </h3>
              <div className={`p-3 rounded-lg border-2 ${analysisResult.displayRecommendations.color === "red" ? "border-red-500 bg-red-50" :
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
