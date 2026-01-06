import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Battery, 
  BatteryWarning,
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  RefreshCw,
  Wifi,
  WifiOff,
  Radio,
  FileWarning
} from "lucide-react";
import { cn } from "@/lib/utils";

const storeMetrics = {
  batteryReplacement: { critical: 8, warning: 23 },
  priceUpdateFailures: { count: 12 },
  accessPoints: { online: 3, offline: 1 },
  overnightUpdate: { success: true, updated: 1823, failed: 12 }
};

const labelStatus = { online: 1789, offline: 44, lowBatt: 67, updating: 12 };

export default function ITHNCommandDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      {/* Label Stats Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-background">
        <CardContent className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xl font-bold text-primary">1,847</p>
              <p className="text-[10px] text-muted-foreground">Total Labels</p>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <RefreshCw className="h-2.5 w-2.5" />
              <span>3m ago</span>
            </div>
          </div>
          
          {/* Label Status Grid - Compact */}
          <div className="grid grid-cols-4 gap-1">
            <div 
              className="p-1.5 bg-green-500/10 rounded text-center cursor-pointer"
              onClick={() => navigate("/ITHNCommand/status/online")}
            >
              <Wifi className="h-3.5 w-3.5 text-green-500 mx-auto" />
              <p className="text-xs font-bold text-green-600">{labelStatus.online}</p>
              <p className="text-[8px] text-muted-foreground">On</p>
            </div>
            <div 
              className="p-1.5 bg-destructive/10 rounded text-center cursor-pointer"
              onClick={() => navigate("/ITHNCommand/status/offline")}
            >
              <WifiOff className="h-3.5 w-3.5 text-destructive mx-auto" />
              <p className="text-xs font-bold text-destructive">{labelStatus.offline}</p>
              <p className="text-[8px] text-muted-foreground">Off</p>
            </div>
            <div 
              className="p-1.5 bg-amber-500/10 rounded text-center cursor-pointer"
              onClick={() => navigate("/ITHNCommand/battery-critical")}
            >
              <Battery className="h-3.5 w-3.5 text-amber-500 mx-auto" />
              <p className="text-xs font-bold text-amber-600">{labelStatus.lowBatt}</p>
              <p className="text-[8px] text-muted-foreground">Batt</p>
            </div>
            <div className="p-1.5 bg-primary/10 rounded text-center">
              <RefreshCw className="h-3.5 w-3.5 text-primary mx-auto" />
              <p className="text-xs font-bold text-primary">{labelStatus.updating}</p>
              <p className="text-[8px] text-muted-foreground">Sync</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics - 2x2 Compact Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Battery */}
        <Card 
          className={cn("cursor-pointer", storeMetrics.batteryReplacement.critical > 0 && "border-destructive/50")}
          onClick={() => navigate("/ITHNCommand/battery-critical")}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                storeMetrics.batteryReplacement.critical > 0 ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
              )}>
                <BatteryWarning className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate">Battery</p>
                <div className="flex items-center gap-1">
                  <Badge variant="destructive" className="h-4 px-1 text-[8px]">{storeMetrics.batteryReplacement.critical}</Badge>
                  <Badge variant="secondary" className="h-4 px-1 text-[8px]">{storeMetrics.batteryReplacement.warning}</Badge>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Price Failures */}
        <Card 
          className={cn("cursor-pointer", storeMetrics.priceUpdateFailures.count > 0 && "border-amber-500/50")}
          onClick={() => navigate("/ITHNCommand/update-failures")}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                storeMetrics.priceUpdateFailures.count > 0 ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
              )}>
                <FileWarning className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate">Price Err</p>
                <Badge variant="secondary" className="h-4 px-1 text-[8px] bg-amber-500/10 text-amber-600">
                  {storeMetrics.priceUpdateFailures.count} fail
                </Badge>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Access Points */}
        <Card 
          className={cn("cursor-pointer", storeMetrics.accessPoints.offline > 0 && "border-amber-500/50")}
          onClick={() => navigate("/ITHNCommand/ap-status")}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                storeMetrics.accessPoints.offline > 0 ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
              )}>
                <Radio className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate">APs</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-4 px-1 text-[8px] bg-green-500/10 text-green-600">{storeMetrics.accessPoints.online}✓</Badge>
                  {storeMetrics.accessPoints.offline > 0 && (
                    <Badge variant="secondary" className="h-4 px-1 text-[8px] bg-destructive/10 text-destructive">{storeMetrics.accessPoints.offline}✗</Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Overnight Update */}
        <Card 
          className={cn("cursor-pointer", !storeMetrics.overnightUpdate.success && "border-destructive/50")}
          onClick={() => navigate("/ITHNCommand/overnight-status")}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                storeMetrics.overnightUpdate.success ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
              )}>
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate">Night Sync</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-4 px-1 text-[8px] bg-green-500/10 text-green-600">
                    <CheckCircle2 className="h-2 w-2 mr-0.5" />OK
                  </Badge>
                  {storeMetrics.overnightUpdate.failed > 0 && (
                    <span className="text-[8px] text-amber-600">{storeMetrics.overnightUpdate.failed}!</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions - Compact List */}
      <Card>
        <CardContent className="p-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            Actions Required
          </p>
          <div className="space-y-1">
            <div 
              className="p-1.5 rounded bg-destructive/5 border border-destructive/30 cursor-pointer"
              onClick={() => navigate("/ITHNCommand/battery-critical")}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium">8 Labels need battery NOW</p>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div 
              className="p-1.5 rounded bg-amber-500/5 border border-amber-500/30 cursor-pointer"
              onClick={() => navigate("/ITHNCommand/update-failures")}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium">12 Price update failures</p>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div 
              className="p-1.5 rounded bg-amber-500/5 border border-amber-500/30 cursor-pointer"
              onClick={() => navigate("/ITHNCommand/ap-status")}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium">1 Access Point offline</p>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
