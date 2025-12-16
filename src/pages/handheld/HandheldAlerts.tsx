import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  AlertTriangle,
  Battery,
  Wifi,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BellOff
} from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "12 ESLs with Critical Battery",
    description: "Aisle 3, 7 - Replace batteries within 24 hours",
    time: "5 min ago",
    icon: Battery,
    route: "/handheld/health?filter=critical",
    read: false
  },
  {
    id: 2,
    type: "warning",
    title: "5 Failed Price Updates",
    description: "Job #4521 - Communication timeout on 3 ESLs",
    time: "15 min ago",
    icon: XCircle,
    route: "/handheld/jobs?filter=failed",
    read: false
  },
  {
    id: 3,
    type: "info",
    title: "3 New ESLs Detected",
    description: "Unassigned labels found in Aisle 2",
    time: "32 min ago",
    icon: Wifi,
    route: "/handheld/operations/assign",
    read: false
  },
  {
    id: 4,
    type: "warning",
    title: "SLA Breach Warning",
    description: "2 jobs approaching 4-hour SLA limit",
    time: "1 hour ago",
    icon: Clock,
    route: "/handheld/jobs",
    read: true
  },
  {
    id: 5,
    type: "info",
    title: "Daily Sync Complete",
    description: "1,247 price updates successfully applied",
    time: "2 hours ago",
    icon: CheckCircle2,
    route: null,
    read: true
  },
];

export default function HandheldAlerts() {
  const navigate = useNavigate();
  const [alertList, setAlertList] = useState(alerts);

  const unreadCount = alertList.filter(a => !a.read).length;
  const criticalCount = alertList.filter(a => a.type === "critical" && !a.read).length;

  const markAsRead = (id: number) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })));
  };

  const getAlertStyle = (type: string, read: boolean) => {
    if (read) return "bg-muted/30 border-border";
    switch (type) {
      case "critical": return "bg-destructive/5 border-destructive/30";
      case "warning": return "bg-amber-500/5 border-amber-500/30";
      default: return "bg-primary/5 border-primary/30";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "critical": return "text-destructive";
      case "warning": return "text-amber-500";
      default: return "text-primary";
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/handheld")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Alerts</h2>
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Critical Banner */}
      {criticalCount > 0 && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-sm text-destructive">{criticalCount} Critical Alerts</p>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{alertList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        {["all", "unread", "critical"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-2">
            {alertList
              .filter(alert => {
                if (tab === "unread") return !alert.read;
                if (tab === "critical") return alert.type === "critical";
                return true;
              })
              .map((alert) => (
                <Card 
                  key={alert.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    getAlertStyle(alert.type, alert.read)
                  )}
                  onClick={() => {
                    markAsRead(alert.id);
                    if (alert.route) navigate(alert.route);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        alert.type === "critical" && "bg-destructive/10",
                        alert.type === "warning" && "bg-amber-500/10",
                        alert.type === "info" && "bg-primary/10"
                      )}>
                        <alert.icon className={cn("h-5 w-5", getIconColor(alert.type))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "font-medium text-sm",
                            alert.read && "text-muted-foreground"
                          )}>
                            {alert.title}
                          </p>
                          {!alert.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                      {alert.route && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-3" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            {alertList.filter(alert => {
              if (tab === "unread") return !alert.read;
              if (tab === "critical") return alert.type === "critical";
              return true;
            }).length === 0 && (
              <div className="text-center py-8">
                <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No alerts to show</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
