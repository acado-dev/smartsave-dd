import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, ScanLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const templates = ["Standard", "Promo", "Clear", "New", "Organic"];

export default function ITHNCommandPageChangeESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [eslScanned, setEslScanned] = useState(false);

  const handleScan = () => { if (eslInput.trim()) setEslScanned(true); };
  const handleApply = () => { 
    toast({ title: "Template Changed", description: `${eslInput} → ${selectedTemplate}` }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Page Change</h1>
          <p className="text-[10px] text-muted-foreground">Switch template</p>
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
        <Card>
          <CardContent className="p-2 space-y-2">
            <p className="text-xs font-medium">Select Template</p>
            <div className="grid grid-cols-2 gap-1.5">
              {templates.map(t => (
                <Button 
                  key={t} 
                  variant={selectedTemplate === t ? "default" : "outline"} 
                  className="h-8 text-xs justify-start" 
                  onClick={() => setSelectedTemplate(t)}
                >
                  {selectedTemplate === t && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {t}
                </Button>
              ))}
            </div>
            {selectedTemplate && (
              <Button className="w-full h-8 text-xs" onClick={handleApply}>
                <FileText className="h-3 w-3 mr-1" />Apply
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}