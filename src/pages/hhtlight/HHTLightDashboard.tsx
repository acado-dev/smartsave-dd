import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  XCircle,
  Radio,
  FileWarning
} from "lucide-react";
import { cn } from "@/lib/utils";

// Store-centric data
const storeInfo = {
  name: "Store #1247",
  location: "Warsaw Central",
  totalLabels: 1847,
  lastSync: "3 min ago"
};

const storeMetrics = {
  batteryReplacement: {
    critical: 8,
    warning: 23,
    total: 31
  },
  priceUpdateFailures: {
    count: 12,
    lastAttempt: "Last night 02:00"
  },
  accessPoints: {
    total: 4,
    online: 3,
    offline: 1
  },
  overnightUpdate: {
    success: true,
    labelsUpdated: 1823,
    failed: 12,
    time: "02:00 - 02:45"
  }
};

const priorityActions = [
  {
    id: 1,
    title: "8 Labels need battery NOW",
    description: "Critical - Less than 24 hours remaining",
    severity: "critical",
    action: "View",
    route: "/HHTLight/battery-critical"
  },
  {
    id: 2,
    title: "12 Price update failures",
    description: "Products showing incorrect prices",
    severity: "warning",
    action: "Fix",
    route: "/HHTLight/update-failures"
  },
  {
    id: 3,
    title: "1 Access Point offline",
    description: "Aisle 7-8 affected - Check connectivity",
    severity: "warning",
    action: "Check",
    route: "/HHTLight/ap-status"
  }
];

// Label status data
const labelStatus = {
  online: 1789,
  offline: 44,
  lowBattery: 67,
  updating: 12
};

export default function HHTLightDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Store Header with Label Stats */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">{storeInfo.totalLabels}</p>
              <p className="text-xs md:text-sm text-muted-foreground">Total Labels</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
              <span>Sync: {storeInfo.lastSync}</span>
            </div>
          </div>
          
          {/* Label Status Grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            <div 
              className="p-2 md:p-4 bg-green-500/10 rounded-lg text-center cursor-pointer hover:bg-green-500/20 transition-colors"
              onClick={() => navigate("/HHTLight/status/online")}
            >
              <Wifi className="h-4 w-4 md:h-6 md:w-6 text-green-500 mx-auto mb-1" />
              <p className="text-sm md:text-lg font-bold text-green-600">{labelStatus.online}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Online</p>
            </div>
            <div 
              className="p-2 md:p-4 bg-destructive/10 rounded-lg text-center cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => navigate("/HHTLight/status/offline")}
            >
              <WifiOff className="h-4 w-4 md:h-6 md:w-6 text-destructive mx-auto mb-1" />
              <p className="text-sm md:text-lg font-bold text-destructive">{labelStatus.offline}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Offline</p>
            </div>
            <div 
              className="p-2 md:p-4 bg-amber-500/10 rounded-lg text-center cursor-pointer hover:bg-amber-500/20 transition-colors"
              onClick={() => navigate("/HHTLight/battery-critical")}
            >
              <Battery className="h-4 w-4 md:h-6 md:w-6 text-amber-500 mx-auto mb-1" />
              <p className="text-sm md:text-lg font-bold text-amber-600">{labelStatus.lowBattery}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Low Batt</p>
            </div>
            <div className="p-2 md:p-4 bg-primary/10 rounded-lg text-center">
              <RefreshCw className="h-4 w-4 md:h-6 md:w-6 text-primary mx-auto mb-1" />
              <p className="text-sm md:text-lg font-bold text-primary">{labelStatus.updating}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Updating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Store Metrics - Responsive Grid for Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Battery Replacement Needed */}
        <Card 
          className={cn(
            "cursor-pointer hover:bg-accent/50 transition-colors",
            storeMetrics.batteryReplacement.critical > 0 && "border-destructive/50"
          )}
          onClick={() => navigate("/HHTLight/battery-critical")}
        >
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shrink-0",
                storeMetrics.batteryReplacement.critical > 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-amber-500/10 text-amber-500"
              )}>
                <BatteryWarning className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium md:text-lg">Battery Replacement</p>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  How many displays need battery replacing?
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {storeMetrics.batteryReplacement.critical} Critical
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    {storeMetrics.batteryReplacement.warning} Warning
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Update Failures */}
        <Card 
          className={cn(
            "cursor-pointer hover:bg-accent/50 transition-colors",
            storeMetrics.priceUpdateFailures.count > 0 && "border-amber-500/50"
          )}
          onClick={() => navigate("/HHTLight/update-failures")}
        >
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shrink-0",
                storeMetrics.priceUpdateFailures.count > 0 
                  ? "bg-amber-500/10 text-amber-500" 
                  : "bg-green-500/10 text-green-500"
              )}>
                <FileWarning className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium md:text-lg">Incorrect Prices</p>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Displays not showing correct price due to update failure
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {storeMetrics.priceUpdateFailures.count > 0 ? (
                    <>
                      <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
                        <XCircle className="h-3 w-3" />
                        {storeMetrics.priceUpdateFailures.count} Failed
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {storeMetrics.priceUpdateFailures.lastAttempt}
                      </span>
                    </>
                  ) : (
                    <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      All prices correct
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Point Status */}
        <Card 
          className={cn(
            "cursor-pointer hover:bg-accent/50 transition-colors",
            storeMetrics.accessPoints.offline > 0 && "border-amber-500/50"
          )}
          onClick={() => navigate("/HHTLight/ap-status")}
        >
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shrink-0",
                storeMetrics.accessPoints.offline > 0 
                  ? "bg-amber-500/10 text-amber-500" 
                  : "bg-green-500/10 text-green-500"
              )}>
                <Radio className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium md:text-lg">Access Points</p>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Are the access points in my store working?
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-500/30">
                    <Wifi className="h-3 w-3" />
                    {storeMetrics.accessPoints.online} Online
                  </Badge>
                  {storeMetrics.accessPoints.offline > 0 && (
                    <Badge variant="secondary" className="gap-1 bg-destructive/10 text-destructive border-destructive/30">
                      <WifiOff className="h-3 w-3" />
                      {storeMetrics.accessPoints.offline} Offline
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overnight Update Status */}
        <Card 
          className={cn(
            "cursor-pointer hover:bg-accent/50 transition-colors",
            !storeMetrics.overnightUpdate.success && "border-destructive/50"
          )}
          onClick={() => navigate("/HHTLight/overnight-status")}
        >
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shrink-0",
                storeMetrics.overnightUpdate.success 
                  ? "bg-green-500/10 text-green-500" 
                  : "bg-destructive/10 text-destructive"
              )}>
                <Clock className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium md:text-lg">Last Night's Update</p>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Did the price update sent last night work?
                </p>
                <div className="mt-2">
                  {storeMetrics.overnightUpdate.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {storeMetrics.overnightUpdate.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-600">{storeMetrics.overnightUpdate.labelsUpdated} updated</span>
                        {storeMetrics.overnightUpdate.failed > 0 && (
                          <span className="text-amber-600">• {storeMetrics.overnightUpdate.failed} failed</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Update Failed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions & Quick Operations - Side by Side on Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Priority Actions */}
        {priorityActions.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              {priorityActions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    "p-3 md:p-4 rounded-lg border cursor-pointer transition-colors",
                    action.severity === "critical" && "bg-destructive/5 border-destructive/30 hover:bg-destructive/10",
                    action.severity === "warning" && "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10"
                  )}
                  onClick={() => navigate(action.route)}
                >
                  <div className="flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base">{action.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={action.severity === "critical" ? "destructive" : "outline"}
                      className="shrink-0 h-7 md:h-9 text-xs md:text-sm"
                    >
                      {action.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Operations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Quick Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 md:py-5"
                onClick={() => navigate("/HHTLight/operations")}
              >
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">Refresh Labels</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 md:py-5"
                onClick={() => navigate("/HHTLight/operations")}
              >
                <Battery className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">Replace Battery</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
