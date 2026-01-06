import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ScanLine, Battery, Wifi, Clock, Package } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ITHNCommandInquireESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [eslInfo, setEslInfo] = useState<null | {
    id: string;
    status: "online" | "offline";
    battery: number;
    lastUpdate: string;
    product: string;
    template: string;
  }>(null);

  const handleInquire = () => {
    if (!eslInput.trim()) return;
    setEslInfo({
      id: eslInput,
      status: "online",
      battery: 78,
      lastUpdate: "2 min ago",
      product: "Organic Milk 1L",
      template: "Standard Price"
    });
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Inquire ESL</h1>
          <p className="text-[10px] text-muted-foreground">View ESL details</p>
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
                onKeyDown={(e) => e.key === "Enter" && handleInquire()} 
              />
            </div>
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleInquire}>
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {eslInfo && (
        <Card>
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{eslInfo.id}</span>
              <Badge variant={eslInfo.status === "online" ? "default" : "destructive"} className="text-[10px] h-4">
                {eslInfo.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 p-1.5 bg-muted/50 rounded text-[10px]">
                <Battery className="h-3 w-3 text-green-500" />
                <span>{eslInfo.battery}%</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-muted/50 rounded text-[10px]">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{eslInfo.lastUpdate}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{eslInfo.product}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium">{eslInfo.template}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}