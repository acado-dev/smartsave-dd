import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Search,
  ScanLine,
  CheckCircle2,
  Tag,
  Percent,
  Star,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const templates = [
  { id: "standard", name: "Standard Price", icon: Tag, description: "Default price display", color: "bg-primary/10 text-primary" },
  { id: "promo", name: "Promotion", icon: Percent, description: "Discount & sale prices", color: "bg-amber-500/10 text-amber-500" },
  { id: "loyalty", name: "Loyalty Price", icon: Star, description: "Member pricing shown", color: "bg-purple-500/10 text-purple-500" },
  { id: "clearance", name: "Clearance", icon: AlertTriangle, description: "Final sale items", color: "bg-destructive/10 text-destructive" },
];

const eslData: Record<string, { product: string; currentTemplate: string }> = {
  "ESL-001": { product: "Organic Milk 1L", currentTemplate: "standard" },
  "ESL-002": { product: "Whole Wheat Bread", currentTemplate: "promo" },
  "ESL-003": { product: "Fresh Bananas", currentTemplate: "standard" },
  "ESL-004": { product: "Greek Yogurt", currentTemplate: "loyalty" },
};

export default function PageChangeESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  
  const [eslInput, setEslInput] = useState(preselectedESL || "");
  const [selectedESL, setSelectedESL] = useState<string | null>(preselectedESL);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const eslInfo = selectedESL ? eslData[selectedESL] : null;

  const handleScanESL = () => {
    if (!eslInput.trim()) return;
    setSelectedESL(eslInput.trim());
    setSelectedTemplate(null);
  };

  const handleApplyTemplate = () => {
    if (!selectedESL || !selectedTemplate) return;
    setIsApplying(true);
    
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Template Applied",
        description: `${selectedESL} now showing ${templates.find(t => t.id === selectedTemplate)?.name}`,
      });
      setSelectedESL(null);
      setSelectedTemplate(null);
      setEslInput("");
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld/operations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Page Change</h1>
          <p className="text-xs text-muted-foreground">Switch display template</p>
        </div>
      </div>

      {/* Scan Input */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan ESL barcode..."
                className="pl-9"
                value={eslInput}
                onChange={(e) => setEslInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScanESL()}
                autoFocus
              />
            </div>
            <Button onClick={handleScanESL} disabled={!eslInput.trim()}>
              Find
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected ESL Info */}
      {selectedESL && eslInfo && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{selectedESL}</p>
                <p className="text-sm text-muted-foreground">{eslInfo.product}</p>
              </div>
              <Badge variant="outline">
                Current: {templates.find(t => t.id === eslInfo.currentTemplate)?.name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Selection */}
      {selectedESL && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Select Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              const isCurrent = eslInfo?.currentTemplate === template.id;
              
              return (
                <div
                  key={template.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected && "ring-2 ring-primary border-primary",
                    isCurrent && "bg-muted/50"
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", template.color)}>
                    <template.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{template.name}</p>
                      {isCurrent && <Badge variant="secondary" className="text-xs">Current</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Apply Button */}
      {selectedESL && selectedTemplate && (
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleApplyTemplate}
          disabled={isApplying || eslInfo?.currentTemplate === selectedTemplate}
        >
          {isApplying ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Applying...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 mr-2" />
              Apply Template
            </>
          )}
        </Button>
      )}

      {/* Empty State */}
      {!selectedESL && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Scan an ESL to change its display template</p>
          <p className="text-xs mt-1">Templates control how pricing information is shown</p>
        </div>
      )}
    </div>
  );
}
