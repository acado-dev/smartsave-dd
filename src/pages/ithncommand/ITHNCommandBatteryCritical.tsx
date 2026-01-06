import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Battery,
  BatteryWarning,
  ChevronRight,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const criticalBatteryESLs = [
  { id: "ESL-1247", product: "Organic Milk 1L", aisle: "Dairy - A3", battery: 5, hoursLeft: 12 },
  { id: "ESL-1892", product: "Fresh Bread", aisle: "Bakery - B1", battery: 8, hoursLeft: 18 },
  { id: "ESL-2103", product: "Greek Yogurt", aisle: "Dairy - A4", battery: 3, hoursLeft: 8 },
  { id: "ESL-0892", product: "Orange Juice 1L", aisle: "Beverages - C2", battery: 7, hoursLeft: 16 },
  { id: "ESL-1456", product: "Butter 250g", aisle: "Dairy - A2", battery: 6, hoursLeft: 14 },
  { id: "ESL-2341", product: "Cream Cheese", aisle: "Dairy - A5", battery: 9, hoursLeft: 20 },
  { id: "ESL-0567", product: "Eggs 12pk", aisle: "Dairy - A1", battery: 4, hoursLeft: 10 },
  { id: "ESL-1789", product: "Sliced Ham", aisle: "Deli - D1", battery: 6, hoursLeft: 15 },
];

export default function ITHNCommandBatteryCritical() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-sm font-semibold">Battery Replace</h2>
          <p className="text-[10px] text-muted-foreground">{criticalBatteryESLs.length} critical</p>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center">
              <BatteryWarning className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="font-bold text-sm text-destructive">{criticalBatteryESLs.length} Critical</p>
              <p className="text-[10px] text-muted-foreground">Replace within 24h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESL List */}
      <div className="space-y-1.5">
        {criticalBatteryESLs.map((esl) => (
          <Card 
            key={esl.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate(`/ITHNCommand/operations/replace?esl=${esl.id}`)}
          >
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <div className={cn(
                  "w-7 h-7 rounded flex items-center justify-center shrink-0",
                  esl.battery <= 5 ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
                )}>
                  <Battery className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-[11px] truncate">{esl.product}</p>
                      <p className="text-[9px] text-muted-foreground">{esl.id}</p>
                    </div>
                    <Badge variant={esl.hoursLeft <= 12 ? "destructive" : "secondary"} className="shrink-0 h-4 px-1 text-[8px]">
                      {esl.hoursLeft}h
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">{esl.aisle}</span>
                  </div>
                  <Progress value={esl.battery} className="h-1 mt-1" />
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
