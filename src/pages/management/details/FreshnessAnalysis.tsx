import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Camera, Upload, Scan, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function FreshnessAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Form parameters
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  
  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<{
    freshness: number;
    shelfLife: number;
    suggestedPrice: number;
    priceReduction: number;
    condition: string;
    factors: string[];
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      toast({
        title: "Camera started",
        description: "Position the item in the frame and capture",
      });
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        stopCamera();
      }
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) {
      toast({
        title: "No image",
        description: "Please upload or capture an image first",
        variant: "destructive",
      });
      return;
    }

    if (!productName || !category || !originalPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in product details",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis (replace with actual AI vision API call when backend is ready)
    setTimeout(() => {
      const baseFreshness = Math.floor(Math.random() * 30) + 60; // 60-90%
      const baseShelfLife = Math.floor(Math.random() * 5) + 1; // 1-5 days
      
      // Calculate price adjustments based on parameters
      let priceMultiplier = 1.0;
      const factors = [];
      
      if (season === "out-of-season") {
        priceMultiplier *= 0.85;
        factors.push("Out of season (-15%)");
      }
      
      if (parseInt(quantity) > 100) {
        priceMultiplier *= 0.90;
        factors.push("High quantity (-10%)");
      }
      
      if (baseFreshness < 70) {
        priceMultiplier *= 0.80;
        factors.push("Reduced freshness (-20%)");
      } else if (baseFreshness < 80) {
        priceMultiplier *= 0.90;
        factors.push("Good condition (-10%)");
      }

      const price = parseFloat(originalPrice);
      const suggestedPrice = parseFloat((price * priceMultiplier).toFixed(2));
      const reduction = Math.round((1 - priceMultiplier) * 100);

      setAnalysisResult({
        freshness: baseFreshness,
        shelfLife: baseShelfLife,
        suggestedPrice,
        priceReduction: reduction,
        condition: baseFreshness >= 80 ? "Excellent" : baseFreshness >= 70 ? "Good" : "Fair",
        factors,
      });

      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "AI freshness analysis finished successfully",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dynamic-pricing')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">AI Freshness Analysis</h1>
              <p className="text-muted-foreground">Vision-based perishable item analysis & dynamic pricing</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image Capture */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Image Input
              </h3>
              <p className="text-sm text-muted-foreground">Upload an image or use live camera feed</p>
            </div>

            {/* Image Preview Area */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Scan className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">No image selected</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Capture Controls */}
            <div className="flex gap-2">
              {isCameraActive ? (
                <>
                  <Button onClick={captureImage} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    Stop Camera
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={startCamera} variant="outline" className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Live Camera
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Product Details Form */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Product Details</h4>
              
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input 
                  id="productName" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (units)</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-season">In Season</SelectItem>
                      <SelectItem value="out-of-season">Out of Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($) *</Label>
                <Input 
                  id="originalPrice" 
                  type="number" 
                  step="0.01"
                  value={originalPrice} 
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="5.99"
                />
              </div>
            </div>

            <Button 
              onClick={analyzeImage} 
              disabled={isAnalyzing || !imagePreview}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Freshness"}
            </Button>
          </Card>

          {/* Right Column - Analysis Results */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <p className="text-sm text-muted-foreground">AI-powered freshness assessment & pricing recommendation</p>
            </div>

            {analysisResult ? (
              <div className="space-y-6">
                {/* Freshness Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Freshness Score</Label>
                    <span className="text-2xl font-bold">{analysisResult.freshness}%</span>
                  </div>
                  <Progress value={analysisResult.freshness} className="h-3" />
                  <p className="text-sm text-muted-foreground">Condition: {analysisResult.condition}</p>
                </div>

                {/* Shelf Life */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <Label className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Estimated Shelf Life
                  </Label>
                  <p className="text-3xl font-bold">{analysisResult.shelfLife} days</p>
                  <p className="text-sm text-muted-foreground">Under optimal storage conditions</p>
                </div>

                {/* Pricing Recommendation */}
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
                  <Label className="text-base font-semibold">Pricing Recommendation</Label>
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm text-muted-foreground line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      ${analysisResult.suggestedPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      {analysisResult.priceReduction}% reduction
                    </span>
                  </div>

                  {/* Factors */}
                  <div className="pt-3 border-t space-y-2">
                    <Label className="text-sm">Price Adjustment Factors:</Label>
                    <ul className="text-sm space-y-1">
                      {analysisResult.factors.map((factor, idx) => (
                        <li key={idx} className="text-muted-foreground">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">Apply to ESL</Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/pricing-rules')}>
                    Create Rule
                  </Button>
                </div>

                {/* Note */}
                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <p className="font-semibold mb-1">Note:</p>
                  <p>This is a demonstration using simulated analysis. For production use, connect to an AI vision API for real-time freshness detection based on visual characteristics like color, texture, and condition.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Scan className="h-16 w-16 text-muted-foreground mb-4" />
                <h4 className="font-semibold mb-2">No Analysis Yet</h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload or capture an image of a perishable item and provide product details to get AI-powered freshness analysis and pricing recommendations.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
