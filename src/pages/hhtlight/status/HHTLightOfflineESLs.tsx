import { ArrowLeft, WifiOff, Clock, Package, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const offlineESLs = [
  { id: "ESL-042", product: "Cheddar Cheese", lastSeen: "2 hours ago", aisle: "B1" },
  { id: "ESL-089", product: "Apple Juice", lastSeen: "45 min ago", aisle: "B5" },
  { id: "ESL-156", product: "Rice 1kg", lastSeen: "3 hours ago", aisle: "E2" },
];

const HHTLightOfflineESLs = () => {
  const navigate = useNavigate();

  const handleFlash = (eslId: string) => {
    navigate(`/HHTLight/operations/flash?esl=${eslId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/HHTLight")} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Offline ESLs</h1>
            <p className="text-red-100 text-sm">{offlineESLs.length} labels disconnected</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Offline labels may need to be moved closer to an access point or have their batteries replaced.
        </p>
      </div>

      {/* ESL List */}
      <div className="p-4 space-y-3">
        {offlineESLs.map((esl) => (
          <div
            key={esl.id}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-sm font-medium">{esl.id}</span>
                </div>
                <p className="font-medium text-foreground">{esl.product}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last seen: {esl.lastSeen}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Aisle {esl.aisle}
                  </span>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleFlash(esl.id)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Flash to Locate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HHTLightOfflineESLs;
