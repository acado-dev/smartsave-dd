import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, ScanLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const templates = ["Standard Price", "Promotion", "Clearance", "New Item", "Organic"];

export default function HHTLightPageChangeESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [eslScanned, setEslScanned] = useState(false);

  const handleScan = () => { if (eslInput.trim()) setEslScanned(true); };
  const handleApply = () => { toast({ title: "Template Changed", description: `${eslInput} → ${selectedTemplate}` }); navigate("/HHTLight/operations"); };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Page Change</h1><p className="text-xs text-muted-foreground">Switch display template</p></div>
      </div>
      <Card><CardContent className="p-4"><div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan ESL..." className="pl-9" value={eslInput} onChange={(e) => setEslInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScan()} /></div><Button onClick={handleScan}>Scan</Button></div></CardContent></Card>
      {eslScanned && (<Card><CardContent className="p-4 space-y-3"><p className="text-sm font-medium">Select Template</p><div className="space-y-2">{templates.map(t => (<Button key={t} variant={selectedTemplate === t ? "default" : "outline"} className="w-full justify-start" onClick={() => setSelectedTemplate(t)}>{selectedTemplate === t && <CheckCircle2 className="h-4 w-4 mr-2" />}{t}</Button>))}</div>{selectedTemplate && <Button className="w-full" onClick={handleApply}><FileText className="h-4 w-4 mr-2" />Apply Template</Button>}</CardContent></Card>)}
    </div>
  );
}
