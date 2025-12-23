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
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Store Health Score & Quick Stats - Side by side on tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Store Health Score */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 lg:col-span-2">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <p className="text-sm md:text-base text-muted-foreground">Store Health Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary">{storeHealthScore}</span>
                  <span className="text-sm md:text-base text-muted-foreground">/100</span>
                </div>
              </div>
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center",
                storeHealthScore >= 90 ? "bg-green-500/20" : 
                storeHealthScore >= 70 ? "bg-amber-500/20" : "bg-destructive/20"
              )}>
                {storeHealthScore >= 90 ? (
                  <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                ) : storeHealthScore >= 70 ? (
                  <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-amber-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-destructive" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                <span>Last sync: {lastSync}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                <span>All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Vertical on tablet sidebar */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
          {healthMetrics.map((metric) => (
            <Card key={metric.label} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(metric.route)}>
              <CardContent className="p-3 md:p-4 text-center lg:flex lg:items-center lg:gap-4 lg:text-left">
                <metric.icon className={cn("h-5 w-5 md:h-6 md:w-6 mx-auto lg:mx-0 mb-1 lg:mb-0", metric.color)} />
                <div>
                  <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Priority Actions & Jobs - Two column on tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Priority Actions */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
              Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {priorityActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "p-3 md:p-4 rounded-lg border cursor-pointer transition-colors",
                  action.severity === "critical" && "bg-destructive/5 border-destructive/30 hover:bg-destructive/10",
                  action.severity === "warning" && "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10",
                  action.severity === "info" && "bg-primary/5 border-primary/30 hover:bg-primary/10"
                )}
                onClick={() => navigate(action.route)}
              >
                <div className="flex items-start justify-between gap-2 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">{action.title}</p>
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

        {/* Job Status Summary */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/handheld/jobs")}>
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5" />
                Today's Jobs
              </CardTitle>
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base text-muted-foreground">Completed</span>
                <span className="font-medium text-green-500 text-lg md:text-xl">1,247</span>
              </div>
              <Progress value={87} className="h-2 md:h-3" />
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500" />
                  23 Pending
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-destructive" />
                  5 Failed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {[
              { icon: Cpu, label: "Assign", route: "/handheld/operations/assign" },
              { icon: RefreshCw, label: "Refresh", route: "/handheld/operations/refresh" },
              { icon: Battery, label: "Battery", route: "/handheld/health" },
              { icon: AlertTriangle, label: "Issues", route: "/handheld/jobs?filter=failed" },
            ].map((item) => (
              <Button
                key={item.label}
                variant="outline"
                className="flex flex-col items-center gap-1 md:gap-2 h-auto py-3 md:py-4"
                onClick={() => navigate(item.route)}
              >
                <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
