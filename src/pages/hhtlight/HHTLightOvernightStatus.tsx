import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const overnightUpdate = {
  status: "completed",
  startTime: "02:00",
  endTime: "02:45",
  duration: "45 min",
  totalLabels: 1847,
  updated: 1823,
  failed: 12,
  skipped: 12,
  successRate: 98.7
};

const updatePhases = [
  { name: "Price Updates", count: 1456, success: 1448, failed: 8, time: "02:00 - 02:25" },
  { name: "Promotion Updates", count: 234, success: 228, failed: 3, time: "02:25 - 02:35" },
  { name: "Template Refreshes", count: 157, success: 147, failed: 1, time: "02:35 - 02:45" },
];

const failedItems = [
  { id: "ESL-1247", product: "Organic Milk 1L", reason: "Communication timeout" },
  { id: "ESL-0892", product: "Orange Juice 1L", reason: "ESL not responding" },
  { id: "ESL-2341", product: "Cream Cheese 200g", reason: "Signal weak" },
];

export default function HHTLightOvernightStatus() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Overnight Update</h1>
          <p className="text-sm text-muted-foreground">Last night's price update status</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className={cn(
        overnightUpdate.status === "completed" 
          ? "bg-green-500/5 border-green-500/30" 
          : "bg-destructive/5 border-destructive/30"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              overnightUpdate.status === "completed" ? "bg-green-500/10" : "bg-destructive/10"
            )}>
              {overnightUpdate.status === "completed" ? (
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              ) : (
                <XCircle className="h-7 w-7 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">
                  {overnightUpdate.status === "completed" ? "Update Completed" : "Update Failed"}
                </p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  {overnightUpdate.successRate}% success
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {overnightUpdate.startTime} - {overnightUpdate.endTime}
                </span>
                <span>•</span>
                <span>{overnightUpdate.duration}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-600">{overnightUpdate.updated}</p>
            <p className="text-xs text-muted-foreground">Updated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <XCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-xl font-bold text-destructive">{overnightUpdate.failed}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <RefreshCw className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xl font-bold">{overnightUpdate.skipped}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </CardContent>
        </Card>
      </div>

      {/* Update Phases */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Update Phases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {updatePhases.map((phase) => (
            <div key={phase.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{phase.name}</p>
                <p className="text-xs text-muted-foreground">{phase.time}</p>
              </div>
              <Progress 
                value={(phase.success / phase.count) * 100} 
                className="h-2" 
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-green-600">{phase.success} success</span>
                {phase.failed > 0 && (
                  <span className="text-destructive">{phase.failed} failed</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Failed Items Preview */}
      {overnightUpdate.failed > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Failed Updates
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => navigate("/HHTLight/update-failures")}
              >
                View All
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {failedItems.map((item) => (
              <div 
                key={item.id}
                className="p-2 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.product}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">
                    {item.reason}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Retry Button */}
      {overnightUpdate.failed > 0 && (
        <Button className="w-full gap-2" onClick={() => navigate("/HHTLight/update-failures")}>
          <RefreshCw className="h-4 w-4" />
          Retry {overnightUpdate.failed} Failed Updates
        </Button>
      )}
    </div>
  );
}
