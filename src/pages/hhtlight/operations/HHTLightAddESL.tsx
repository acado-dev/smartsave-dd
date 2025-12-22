import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, ScanLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function HHTLightAddESL() {
  const navigate = useNavigate();
  const [eslId, setEslId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!eslId.trim()) return;
    setIsAdding(true);
    setTimeout(() => { setIsAdding(false); toast({ title: "ESL Added", description: `${eslId} registered` }); setEslId(""); }, 1500);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Add ESL</h1><p className="text-xs text-muted-foreground">Register new device</p></div>
      </div>
      <Card><CardContent className="p-4 space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed"><div className="text-center"><ScanLine className="h-12 w-12 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Scan new ESL barcode</p></div></div>
        <div className="flex gap-2"><Input placeholder="ESL-XXXX" value={eslId} onChange={(e) => setEslId(e.target.value)} /><Button onClick={handleAdd} disabled={isAdding}>{isAdding ? "Adding..." : <Plus className="h-4 w-4" />}</Button></div>
      </CardContent></Card>
    </div>
  );
}
