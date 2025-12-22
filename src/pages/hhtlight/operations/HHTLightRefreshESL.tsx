import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw, ScanLine, CheckCircle2, XCircle, Clock, Layers } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface RefreshItem { id: string; product: string; status: "pending" | "refreshing" | "success" | "error"; }

export default function HHTLightRefreshESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  const [eslInput, setEslInput] = useState(preselectedESL || "");
  const [refreshQueue, setRefreshQueue] = useState<RefreshItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");

  const productLookup: Record<string, string> = { "ESL-001": "Organic Milk 1L", "ESL-002": "Whole Wheat Bread", "ESL-003": "Fresh Bananas" };

  const handleAddToQueue = () => {
    if (!eslInput.trim()) return;
    const product = productLookup[eslInput.trim()] || `Product for ${eslInput.trim()}`;
    if (refreshQueue.some(item => item.id === eslInput.trim())) { toast({ title: "Already in queue", variant: "destructive" }); return; }
    setRefreshQueue(prev => [...prev, { id: eslInput.trim(), product, status: "pending" }]);
    setEslInput("");
  };

  const handleRefreshSingle = () => {
    if (!eslInput.trim()) return;
    const product = productLookup[eslInput.trim()] || `Product for ${eslInput.trim()}`;
    setRefreshQueue([{ id: eslInput.trim(), product, status: "pending" }]);
    startRefresh([{ id: eslInput.trim(), product, status: "pending" }]);
  };

  const startRefresh = (items: RefreshItem[]) => {
    setIsRefreshing(true);
    items.forEach((_, index) => {
      setTimeout(() => {
        setRefreshQueue(prev => prev.map((item, i) => i === index ? { ...item, status: "refreshing" } : item));
        setTimeout(() => {
          setRefreshQueue(prev => prev.map((item, i) => i === index ? { ...item, status: "success" } : item));
          if (index === items.length - 1) { setIsRefreshing(false); toast({ title: "Refresh Complete" }); }
        }, 1000);
      }, index * 1500);
    });
  };

  const successCount = refreshQueue.filter(i => i.status === "success").length;
  const progress = refreshQueue.length > 0 ? (successCount / refreshQueue.length) * 100 : 0;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Refresh ESL</h1><p className="text-xs text-muted-foreground">Update display content</p></div>
      </div>

      <div className="flex gap-2">
        <Button variant={mode === "single" ? "default" : "outline"} className="flex-1" onClick={() => setMode("single")}><RefreshCw className="h-4 w-4 mr-2" />Single</Button>
        <Button variant={mode === "bulk" ? "default" : "outline"} className="flex-1" onClick={() => setMode("bulk")}><Layers className="h-4 w-4 mr-2" />Bulk</Button>
      </div>

      <Card><CardContent className="p-4 space-y-3">
        <div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan ESL barcode..." className="pl-9" value={eslInput} onChange={(e) => setEslInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { mode === "single" ? handleRefreshSingle() : handleAddToQueue(); }}} autoFocus /></div>
          {mode === "single" ? <Button onClick={handleRefreshSingle} disabled={!eslInput.trim() || isRefreshing}><RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /></Button> : <Button variant="outline" onClick={handleAddToQueue} disabled={!eslInput.trim()}>Add</Button>}
        </div>
      </CardContent></Card>

      {isRefreshing && (<Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Refreshing...</span><span className="text-sm text-muted-foreground">{successCount}/{refreshQueue.length}</span></div><Progress value={progress} className="h-2" /></CardContent></Card>)}

      {mode === "bulk" && refreshQueue.length > 0 && (
        <Card><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm">Refresh Queue</CardTitle>{!isRefreshing && <Button size="sm" onClick={() => startRefresh(refreshQueue)}><RefreshCw className="h-4 w-4 mr-1" />Refresh All</Button>}</div></CardHeader>
          <CardContent className="space-y-2">{refreshQueue.map((item, index) => (
            <div key={index} className={cn("flex items-center gap-3 p-2 rounded-lg border", item.status === "success" && "bg-green-500/10", item.status === "refreshing" && "bg-primary/10")}>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">{item.status === "success" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : item.status === "refreshing" ? <RefreshCw className="h-4 w-4 text-primary animate-spin" /> : <Clock className="h-4 w-4 text-muted-foreground" />}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{item.id}</p><p className="text-xs text-muted-foreground truncate">{item.product}</p></div>
              <Badge variant="outline" className="text-xs">{item.status}</Badge>
            </div>
          ))}</CardContent>
        </Card>
      )}

      {refreshQueue.length === 0 && (<div className="text-center py-8 text-muted-foreground"><RefreshCw className="h-12 w-12 mx-auto mb-3 opacity-20" /><p className="text-sm">Scan an ESL to refresh</p></div>)}
    </div>
  );
}
