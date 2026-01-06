import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, RefreshCw, ScanLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ITHNCommandRefreshESL() {
  const navigate = useNavigate();
  const [eslInput, setEslInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    if (!eslInput.trim()) return;
    setRefreshing(true);
    setTimeout(() => {
      toast({ title: "ESL Refreshed", description: `${eslInput} updated successfully` });
      setRefreshing(false);
      navigate("/ITHNCommand/operations");
    }, 1500);
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/ITHNCommand/operations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">Refresh ESL</h1>
          <p className="text-[10px] text-muted-foreground">Force update display</p>
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
                onKeyDown={(e) => e.key === "Enter" && handleRefresh()} 
              />
            </div>
            <Button 
              size="sm" 
              className="h-8 px-3 text-xs" 
              onClick={handleRefresh}
              disabled={refreshing || !eslInput.trim()}
            >
              {refreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {eslInput.trim() && !refreshing && (
        <Card className="border-primary/50">
          <CardContent className="p-2">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Ready to refresh: {eslInput}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}