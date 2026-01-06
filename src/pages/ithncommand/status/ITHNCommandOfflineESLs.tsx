import { ArrowLeft, WifiOff, Clock, Package, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const offlineESLs = [
  { id: "ESL-042", product: "Cheddar Cheese", lastSeen: "2h ago", aisle: "B1" },
  { id: "ESL-089", product: "Apple Juice", lastSeen: "45m ago", aisle: "B5" },
  { id: "ESL-156", product: "Rice 1kg", lastSeen: "3h ago", aisle: "E2" },
];

export default function ITHNCommandOfflineESLs() {
  const navigate = useNavigate();

  const handleFlash = (eslId: string) => {
    navigate(`/ITHNCommand/operations/flash?esl=${eslId}`);
  };

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-destructive" />
          <div>
            <h2 className="text-sm font-semibold">Offline ESLs</h2>
            <p className="text-[10px] text-muted-foreground">{offlineESLs.length} disconnected</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-[10px] text-amber-800 dark:text-amber-200">
          Move closer to AP or replace battery.
        </p>
      </div>

      {/* ESL List */}
      <div className="space-y-1.5">
        {offlineESLs.map((esl) => (
          <Card key={esl.id}>
            <CardContent className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <WifiOff className="w-3 h-3 text-destructive" />
                    <span className="font-mono text-[10px] font-medium">{esl.id}</span>
                  </div>
                  <p className="font-medium text-[11px] truncate">{esl.product}</p>
                  <div className="flex items-center gap-3 mt-1 text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {esl.lastSeen}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Package className="w-2.5 h-2.5" />
                      {esl.aisle}
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-destructive mt-1"></div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 h-6 text-[10px]"
                onClick={() => handleFlash(esl.id)}
              >
                <Zap className="w-3 h-3 mr-1" />
                Flash
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
