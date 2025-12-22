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
  { id: "ESL-1892", product: "Fresh Bread Loaf", aisle: "Bakery - B1", battery: 8, hoursLeft: 18 },
  { id: "ESL-2103", product: "Greek Yogurt 500g", aisle: "Dairy - A4", battery: 3, hoursLeft: 8 },
  { id: "ESL-0892", product: "Orange Juice 1L", aisle: "Beverages - C2", battery: 7, hoursLeft: 16 },
  { id: "ESL-1456", product: "Butter 250g", aisle: "Dairy - A2", battery: 6, hoursLeft: 14 },
  { id: "ESL-2341", product: "Cream Cheese 200g", aisle: "Dairy - A5", battery: 9, hoursLeft: 20 },
  { id: "ESL-0567", product: "Eggs 12pk", aisle: "Dairy - A1", battery: 4, hoursLeft: 10 },
  { id: "ESL-1789", product: "Sliced Ham 150g", aisle: "Deli - D1", battery: 6, hoursLeft: 15 },
];

export default function HHTLightBatteryCritical() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Battery Replacement</h1>
          <p className="text-sm text-muted-foreground">Labels needing immediate attention</p>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <BatteryWarning className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="font-bold text-lg text-destructive">{criticalBatteryESLs.length} Critical</p>
              <p className="text-sm text-muted-foreground">Replace within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESL List */}
      <div className="space-y-2">
        {criticalBatteryESLs.map((esl) => (
          <Card 
            key={esl.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate(`/HHTLight/operations/replace?esl=${esl.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  esl.battery <= 5 ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
                )}>
                  <Battery className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm truncate">{esl.product}</p>
                      <p className="text-xs text-muted-foreground">{esl.id}</p>
                    </div>
                    <Badge variant={esl.hoursLeft <= 12 ? "destructive" : "secondary"} className="shrink-0">
                      {esl.hoursLeft}h left
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{esl.aisle}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={esl.battery} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{esl.battery}% battery</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
