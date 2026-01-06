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
  totalLabels: 1847,
  updated: 1823,
  failed: 12,
  successRate: 98.7
};

const updatePhases = [
  { name: "Price", count: 1456, success: 1448, failed: 8 },
  { name: "Promo", count: 234, success: 228, failed: 3 },
  { name: "Template", count: 157, success: 147, failed: 1 },
];

export default function ITHNCommandOvernightStatus() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-sm font-semibold">Overnight Update</h2>
          <p className="text-[10px] text-muted-foreground">Last night status</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className={cn(
        overnightUpdate.status === "completed" 
          ? "bg-green-500/5 border-green-500/30" 
          : "bg-destructive/5 border-destructive/30"
      )}>
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              overnightUpdate.status === "completed" ? "bg-green-500/10" : "bg-destructive/10"
            )}>
              {overnightUpdate.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm">Complete</p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 h-4 px-1 text-[8px]">
                  {overnightUpdate.successRate}%
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {overnightUpdate.startTime} - {overnightUpdate.endTime}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        <Card>
          <CardContent className="p-2 text-center">
            <TrendingUp className="h-3.5 w-3.5 text-green-500 mx-auto mb-0.5" />
            <p className="text-base font-bold text-green-600">{overnightUpdate.updated}</p>
            <p className="text-[8px] text-muted-foreground">Updated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 text-center">
            <XCircle className="h-3.5 w-3.5 text-destructive mx-auto mb-0.5" />
            <p className="text-base font-bold text-destructive">{overnightUpdate.failed}</p>
            <p className="text-[8px] text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 text-center">
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground mx-auto mb-0.5" />
            <p className="text-base font-bold">{overnightUpdate.totalLabels}</p>
            <p className="text-[8px] text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Update Phases */}
      <Card>
        <CardHeader className="pb-1 pt-2 px-2">
          <CardTitle className="text-[11px]">Update Phases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-2 pb-2">
          {updatePhases.map((phase) => (
            <div key={phase.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium">{phase.name}</p>
                <p className="text-[9px] text-muted-foreground">{phase.success}/{phase.count}</p>
              </div>
              <Progress 
                value={(phase.success / phase.count) * 100} 
                className="h-1.5" 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Retry Button */}
      {overnightUpdate.failed > 0 && (
        <Button 
          className="w-full gap-1 h-8 text-[11px]" 
          onClick={() => navigate("/ITHNCommand/update-failures")}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry {overnightUpdate.failed} Failed
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
