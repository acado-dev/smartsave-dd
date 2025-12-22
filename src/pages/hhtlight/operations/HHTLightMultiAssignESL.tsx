import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers, ScanLine, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function HHTLightMultiAssignESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [queue, setQueue] = useState<{id: string; product: string}[]>([]);

  const handleAdd = () => {
    if (!eslInput.trim() || queue.some(q => q.id === eslInput)) return;
    setQueue(prev => [...prev, { id: eslInput, product: `Product ${queue.length + 1}` }]);
    setEslInput("");
  };

  const handleAssignAll = () => {
    toast({ title: "Multi-Assign Complete", description: `${queue.length} ESLs assigned` });
    navigate("/HHTLight/operations");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Multi-Assign</h1><p className="text-xs text-muted-foreground">Bulk assignment mode</p></div>
      </div>
      <Card><CardContent className="p-4"><div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan ESL..." className="pl-9" value={eslInput} onChange={(e) => setEslInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} /></div><Button onClick={handleAdd}>Add</Button></div></CardContent></Card>
      {queue.length > 0 && (<Card><CardContent className="p-4 space-y-2">{queue.map((item, i) => (<div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-sm">{item.id}</span></div><Button variant="ghost" size="icon" onClick={() => setQueue(prev => prev.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button></div>))}<Button className="w-full mt-2" onClick={handleAssignAll}><Layers className="h-4 w-4 mr-2" />Assign All ({queue.length})</Button></CardContent></Card>)}
    </div>
  );
}
