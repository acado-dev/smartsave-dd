import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Radio,
  Wifi,
  WifiOff,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const accessPoints = [
  { id: "AP-001", name: "AP 1", location: "Aisles 1-3", status: "online", labels: 512, signal: 95 },
  { id: "AP-002", name: "AP 2", location: "Aisles 4-6", status: "online", labels: 487, signal: 92 },
  { id: "AP-003", name: "AP 3", location: "Aisles 7-8", status: "offline", labels: 0, signal: 0, lastSeen: "45m ago" },
  { id: "AP-004", name: "AP 4", location: "Checkout", status: "online", labels: 356, signal: 88 },
];

export default function ITHNCommandAPStatus() {
  const navigate = useNavigate();
  const onlineCount = accessPoints.filter(ap => ap.status === "online").length;
  const offlineCount = accessPoints.filter(ap => ap.status === "offline").length;

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-sm font-semibold">Access Points</h2>
          <p className="text-[10px] text-muted-foreground">Network status</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-1.5">
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="p-2 text-center">
            <Wifi className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">{onlineCount}</p>
            <p className="text-[9px] text-muted-foreground">Online</p>
          </CardContent>
        </Card>
        <Card className={cn(
          offlineCount > 0 ? "bg-destructive/5 border-destructive/30" : "bg-muted"
        )}>
          <CardContent className="p-2 text-center">
            <WifiOff className={cn("h-4 w-4 mx-auto mb-1", offlineCount > 0 ? "text-destructive" : "text-muted-foreground")} />
            <p className={cn("text-lg font-bold", offlineCount > 0 ? "text-destructive" : "text-muted-foreground")}>{offlineCount}</p>
            <p className="text-[9px] text-muted-foreground">Offline</p>
          </CardContent>
        </Card>
      </div>

      {/* AP List */}
      <div className="space-y-1.5">
        {accessPoints.map((ap) => (
          <Card 
            key={ap.id}
            className={cn(ap.status === "offline" && "border-destructive/50")}
          >
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <div className={cn(
                  "w-8 h-8 rounded flex items-center justify-center shrink-0",
                  ap.status === "online" ? "bg-green-500/10" : "bg-destructive/10"
                )}>
                  {ap.status === "online" ? (
                    <Radio className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-[11px]">{ap.name}</p>
                      <p className="text-[9px] text-muted-foreground">{ap.id}</p>
                    </div>
                    <Badge variant={ap.status === "online" ? "secondary" : "destructive"} className="gap-0.5 h-4 px-1 text-[8px]">
                      {ap.status === "online" ? (
                        <CheckCircle2 className="h-2 w-2" />
                      ) : (
                        <AlertTriangle className="h-2 w-2" />
                      )}
                      {ap.status === "online" ? "OK" : "OFF"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" />
                    <span>{ap.location}</span>
                  </div>

                  {ap.status === "online" ? (
                    <div className="grid grid-cols-2 gap-1 mt-1.5 text-center">
                      <div className="p-1 bg-muted/50 rounded">
                        <p className="text-[10px] font-medium">{ap.labels}</p>
                        <p className="text-[8px] text-muted-foreground">Labels</p>
                      </div>
                      <div className="p-1 bg-muted/50 rounded">
                        <p className="text-[10px] font-medium">{ap.signal}%</p>
                        <p className="text-[8px] text-muted-foreground">Signal</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1.5 p-1.5 bg-destructive/5 rounded">
                      <p className="text-[9px] text-destructive">Last: {ap.lastSeen}</p>
                      <Button size="sm" variant="destructive" className="w-full mt-1 h-6 text-[10px]">
                        Report
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
