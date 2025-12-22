import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Radio,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const accessPoints = [
  { 
    id: "AP-001", 
    name: "Access Point 1", 
    location: "Entrance - Aisles 1-3",
    status: "online",
    labelsConnected: 512,
    signalStrength: 95,
    lastSeen: "Now",
    uptime: "14 days"
  },
  { 
    id: "AP-002", 
    name: "Access Point 2", 
    location: "Center - Aisles 4-6",
    status: "online",
    labelsConnected: 487,
    signalStrength: 92,
    lastSeen: "Now",
    uptime: "14 days"
  },
  { 
    id: "AP-003", 
    name: "Access Point 3", 
    location: "Back - Aisles 7-8",
    status: "offline",
    labelsConnected: 0,
    signalStrength: 0,
    lastSeen: "45 min ago",
    uptime: "0"
  },
  { 
    id: "AP-004", 
    name: "Access Point 4", 
    location: "Checkout Area",
    status: "online",
    labelsConnected: 356,
    signalStrength: 88,
    lastSeen: "Now",
    uptime: "14 days"
  },
];

export default function HHTLightAPStatus() {
  const navigate = useNavigate();
  const onlineCount = accessPoints.filter(ap => ap.status === "online").length;
  const offlineCount = accessPoints.filter(ap => ap.status === "offline").length;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Access Points</h1>
          <p className="text-sm text-muted-foreground">Store network status</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Wifi className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </CardContent>
        </Card>
        <Card className={cn(
          offlineCount > 0 ? "bg-destructive/5 border-destructive/30" : "bg-muted"
        )}>
          <CardContent className="p-4 text-center">
            <WifiOff className={cn("h-6 w-6 mx-auto mb-2", offlineCount > 0 ? "text-destructive" : "text-muted-foreground")} />
            <p className={cn("text-2xl font-bold", offlineCount > 0 ? "text-destructive" : "text-muted-foreground")}>{offlineCount}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </CardContent>
        </Card>
      </div>

      {/* Access Point List */}
      <div className="space-y-3">
        {accessPoints.map((ap) => (
          <Card 
            key={ap.id}
            className={cn(
              ap.status === "offline" && "border-destructive/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                  ap.status === "online" ? "bg-green-500/10" : "bg-destructive/10"
                )}>
                  {ap.status === "online" ? (
                    <Radio className="h-6 w-6 text-green-500" />
                  ) : (
                    <WifiOff className="h-6 w-6 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{ap.name}</p>
                      <p className="text-xs text-muted-foreground">{ap.id}</p>
                    </div>
                    <Badge variant={ap.status === "online" ? "secondary" : "destructive"} className="gap-1">
                      {ap.status === "online" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {ap.status === "online" ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{ap.location}</span>
                  </div>

                  {ap.status === "online" ? (
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div className="p-2 bg-muted/50 rounded">
                        <p className="text-sm font-medium">{ap.labelsConnected}</p>
                        <p className="text-[10px] text-muted-foreground">Labels</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <p className="text-sm font-medium">{ap.signalStrength}%</p>
                        <p className="text-[10px] text-muted-foreground">Signal</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <p className="text-sm font-medium">{ap.uptime}</p>
                        <p className="text-[10px] text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-destructive/5 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Connectivity Issue</span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last seen: {ap.lastSeen}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Labels in Aisles 7-8 may not update until resolved.
                      </p>
                      <Button size="sm" variant="destructive" className="w-full mt-2">
                        Report Issue
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
