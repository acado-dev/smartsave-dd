import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const alerts = [
  { id: 1, type: "critical", title: "8 Labels need battery", time: "2m ago", read: false },
  { id: 2, type: "warning", title: "12 Price update failures", time: "15m ago", read: false },
  { id: 3, type: "warning", title: "AP offline - Aisle 7-8", time: "1h ago", read: false },
  { id: 4, type: "info", title: "Overnight sync complete", time: "6h ago", read: true },
];

export default function ITHNCommandAlerts() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-sm font-semibold">Alerts</h2>
          <p className="text-[10px] text-muted-foreground">3 unread</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {alerts.map((alert) => (
          <Card key={alert.id} className={alert.read ? "opacity-60" : ""}>
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                  alert.type === "critical" ? "bg-destructive/10 text-destructive" :
                  alert.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                  "bg-green-500/10 text-green-500"
                }`}>
                  {alert.type === "info" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium">{alert.title}</p>
                  <p className="text-[9px] text-muted-foreground">{alert.time}</p>
                </div>
                {!alert.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
