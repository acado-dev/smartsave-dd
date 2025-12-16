import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Battery, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Cpu,
  RefreshCw,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityActions = [
  {
    id: 1,
    title: "12 ESLs with Critical Battery",
    description: "Aisle 3, 7 - Replace batteries today",
    severity: "critical",
    action: "Fix Now",
    route: "/handheld/health?filter=critical"
  },
  {
    id: 2,
    title: "5 Failed Price Updates",
    description: "Job #4521 - Communication timeout",
    severity: "warning",
    action: "Retry",
    route: "/handheld/jobs?filter=failed"
  },
  {
    id: 3,
    title: "3 Unassigned ESLs",
    description: "New labels detected in Aisle 2",
    severity: "info",
    action: "Assign",
    route: "/handheld/operations/assign"
  }
];

const healthMetrics = [
  { label: "Online", value: 2847, total: 2891, icon: Wifi, color: "text-green-500", route: "/handheld/status/online" },
  { label: "Offline", value: 44, total: 2891, icon: WifiOff, color: "text-destructive", route: "/handheld/status/offline" },
  { label: "Low Battery", value: 67, total: 2891, icon: Battery, color: "text-amber-500", route: "/handheld/status/low-battery" },
];

export default function HandheldHome() {
  const navigate = useNavigate();
  const storeHealthScore = 94;
  const lastSync = "2 min ago";

  return (
    <div className="p-4 space-y-4">
      {/* Store Health Score */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Store Health Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">{storeHealthScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              storeHealthScore >= 90 ? "bg-green-500/20" : 
              storeHealthScore >= 70 ? "bg-amber-500/20" : "bg-destructive/20"
            )}>
              {storeHealthScore >= 90 ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : storeHealthScore >= 70 ? (
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-destructive" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>Last sync: {lastSync}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {healthMetrics.map((metric) => (
          <Card key={metric.label} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(metric.route)}>
            <CardContent className="p-3 text-center">
              <metric.icon className={cn("h-5 w-5 mx-auto mb-1", metric.color)} />
              <p className="text-xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Priority Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priorityActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                action.severity === "critical" && "bg-destructive/5 border-destructive/30 hover:bg-destructive/10",
                action.severity === "warning" && "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10",
                action.severity === "info" && "bg-primary/5 border-primary/30 hover:bg-primary/10"
              )}
              onClick={() => navigate(action.route)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant={action.severity === "critical" ? "destructive" : "outline"}
                  className="shrink-0 h-7 text-xs"
                >
                  {action.action}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Job Status Summary */}
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/handheld/jobs")}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Jobs
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-medium text-green-500">1,247</span>
            </div>
            <Progress value={87} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                23 Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                5 Failed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Cpu, label: "Assign", route: "/handheld/operations/assign" },
          { icon: RefreshCw, label: "Refresh", route: "/handheld/operations/refresh" },
          { icon: Battery, label: "Battery", route: "/handheld/health" },
          { icon: AlertTriangle, label: "Issues", route: "/handheld/jobs?filter=failed" },
        ].map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => navigate(item.route)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
