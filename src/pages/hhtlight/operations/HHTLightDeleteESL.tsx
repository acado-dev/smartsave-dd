import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, ScanLine, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function HHTLightDeleteESL() {
  const navigate = useNavigate();
  const [eslId, setEslId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = () => {
    toast({ title: "ESL Deleted", description: `${eslId} removed from system` });
    navigate("/HHTLight/operations");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Delete ESL</h1><p className="text-xs text-muted-foreground">Remove from system</p></div>
      </div>
      <Card><CardContent className="p-4"><div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan ESL to delete..." className="pl-9" value={eslId} onChange={(e) => { setEslId(e.target.value); setConfirmed(false); }} /></div></div></CardContent></Card>
      {eslId && (<Card className="border-destructive/50"><CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg"><AlertTriangle className="h-5 w-5 text-destructive shrink-0" /><p className="text-sm text-muted-foreground">This will permanently remove {eslId} from the system.</p></div>
        <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setEslId("")}>Cancel</Button><Button variant="destructive" className="flex-1" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete ESL</Button></div>
      </CardContent></Card>)}
    </div>
  );
}
