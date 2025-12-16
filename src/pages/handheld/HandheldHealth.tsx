import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryFull,
  BatteryWarning,
  ChevronRight,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";

const aisleData = [
  { id: "A1", name: "Aisle 1 - Produce", total: 145, healthy: 140, warning: 4, critical: 1 },
  { id: "A2", name: "Aisle 2 - Dairy", total: 198, healthy: 185, warning: 10, critical: 3 },
  { id: "A3", name: "Aisle 3 - Bakery", total: 87, healthy: 80, warning: 5, critical: 2 },
  { id: "A4", name: "Aisle 4 - Meat", total: 156, healthy: 150, warning: 4, critical: 2 },
  { id: "A5", name: "Aisle 5 - Beverages", total: 234, healthy: 228, warning: 5, critical: 1 },
  { id: "A6", name: "Aisle 6 - Snacks", total: 312, healthy: 305, warning: 6, critical: 1 },
  { id: "A7", name: "Aisle 7 - Frozen", total: 178, healthy: 168, warning: 8, critical: 2 },
];

const criticalESLs = [
  { id: "ESL-3421", product: "Organic Milk 1L", aisle: "Aisle 2", shelf: "B3", battery: 5, daysLeft: 2 },
  { id: "ESL-1892", product: "Fresh Bread", aisle: "Aisle 3", shelf: "A1", battery: 8, daysLeft: 3 },
  { id: "ESL-7234", product: "Chicken Breast", aisle: "Aisle 4", shelf: "C2", battery: 3, daysLeft: 1 },
  { id: "ESL-5621", product: "Greek Yogurt", aisle: "Aisle 2", shelf: "B5", battery: 7, daysLeft: 3 },
  { id: "ESL-9012", product: "Orange Juice", aisle: "Aisle 5", shelf: "A4", battery: 10, daysLeft: 4 },
];

export default function HandheldHealth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);
  const initialFilter = searchParams.get("filter") || "overview";

  const totalESLs = aisleData.reduce((acc, a) => acc + a.total, 0);
  const totalHealthy = aisleData.reduce((acc, a) => acc + a.healthy, 0);
  const totalWarning = aisleData.reduce((acc, a) => acc + a.warning, 0);
  const totalCritical = aisleData.reduce((acc, a) => acc + a.critical, 0);

  const getBatteryIcon = (level: number) => {
    if (level <= 10) return BatteryWarning;
    if (level <= 30) return BatteryLow;
    if (level <= 70) return BatteryMedium;
    return BatteryFull;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Battery Intelligence</h2>
        <p className="text-sm text-muted-foreground">Monitor and plan battery replacements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-3 text-center">
            <BatteryFull className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-xl font-bold text-green-600">{totalHealthy}</p>
            <p className="text-xs text-muted-foreground">Healthy</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-3 text-center">
            <BatteryMedium className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xl font-bold text-amber-600">{totalWarning}</p>
            <p className="text-xs text-muted-foreground">Warning</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-3 text-center">
            <BatteryWarning className="h-5 w-5 mx-auto mb-1 text-destructive" />
            <p className="text-xl font-bold text-destructive">{totalCritical}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={initialFilter === "critical" ? "critical" : "overview"} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="overview">By Aisle</TabsTrigger>
          <TabsTrigger value="critical">
            Critical
            <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">{totalCritical}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-2">
          {aisleData.map((aisle) => {
            const healthPercent = Math.round((aisle.healthy / aisle.total) * 100);
            return (
              <Card 
                key={aisle.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedAisle(selectedAisle === aisle.id ? null : aisle.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{aisle.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {aisle.critical > 0 && (
                        <Badge variant="destructive" className="h-5 text-xs">{aisle.critical}</Badge>
                      )}
                      {aisle.warning > 0 && (
                        <Badge variant="outline" className="h-5 text-xs text-amber-600 border-amber-500">{aisle.warning}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{aisle.total} ESLs</span>
                      <span>{healthPercent}% healthy</span>
                    </div>
                    <Progress 
                      value={healthPercent} 
                      className={cn(
                        "h-2",
                        healthPercent < 90 && "[&>div]:bg-amber-500",
                        healthPercent < 80 && "[&>div]:bg-destructive"
                      )} 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="critical" className="mt-4 space-y-2">
          <Card className="bg-destructive/5 border-destructive/20 mb-4">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-sm">{totalCritical} ESLs need immediate attention</p>
                  <p className="text-xs text-muted-foreground">Batteries below 10% - replace within 3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {criticalESLs.map((esl) => {
            const BatteryIcon = getBatteryIcon(esl.battery);
            return (
              <Card 
                key={esl.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/handheld/operations/replace?esl=${esl.id}`)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <BatteryIcon className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{esl.product}</p>
                        <Badge variant="outline" className="text-xs shrink-0">{esl.id}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{esl.aisle}</span>
                        <span>•</span>
                        <span>Shelf {esl.shelf}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-destructive">{esl.battery}%</p>
                      <p className="text-xs text-muted-foreground">{esl.daysLeft}d left</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button className="w-full" variant="destructive">
            Plan Bulk Replacement ({totalCritical} ESLs)
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
