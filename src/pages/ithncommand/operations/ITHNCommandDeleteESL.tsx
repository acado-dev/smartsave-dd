import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, ScanLine, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandDeleteESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [eslScanned, setEslScanned] = useState(false);

  const handleScan = () => { if (eslInput.trim()) setEslScanned(true); };
  const handleDelete = () => { 
    toast({ title: "ESL Deleted", description: `${eslInput} removed from store`, variant: "destructive" }); 
    navigate("/ITHNCommand/operations"); 
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Delete ESL</h1>
          <p className="text-[10px] text-muted-foreground">Remove from store</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Scan ESL to delete..." 
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
        <Card className="border-destructive/50">
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Confirm Deletion</span>
            </div>
            <div className="bg-destructive/5 rounded p-2 text-[10px]">
              <p><span className="text-muted-foreground">ESL ID:</span> {eslInput}</p>
              <p className="text-destructive">This action cannot be undone!</p>
            </div>
            <Button variant="destructive" className="w-full h-8 text-xs" onClick={handleDelete}>
              <Trash2 className="h-3 w-3 mr-1" />Delete ESL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}