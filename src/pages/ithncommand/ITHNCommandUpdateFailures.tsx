import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  FileWarning,
  RefreshCw,
  MapPin,
  ChevronRight
} from "lucide-react";

const failedUpdates = [
  { id: "ESL-1247", product: "Organic Milk", aisle: "A3", oldPrice: "€3.49", newPrice: "€2.99", reason: "Timeout" },
  { id: "ESL-0892", product: "Orange Juice", aisle: "C2", oldPrice: "€2.99", newPrice: "€2.49", reason: "No response" },
  { id: "ESL-2341", product: "Cream Cheese", aisle: "A5", oldPrice: "€1.99", newPrice: "€1.79", reason: "Weak signal" },
  { id: "ESL-1456", product: "Butter 250g", aisle: "A2", oldPrice: "€2.49", newPrice: "€2.19", reason: "Timeout" },
  { id: "ESL-0567", product: "Eggs 12pk", aisle: "A1", oldPrice: "€4.99", newPrice: "€4.49", reason: "ESL busy" },
  { id: "ESL-3421", product: "Cheddar", aisle: "A6", oldPrice: "€3.99", newPrice: "€3.49", reason: "Timeout" },
  { id: "ESL-2789", product: "Whole Milk 2L", aisle: "A3", oldPrice: "€2.29", newPrice: "€1.99", reason: "Weak signal" },
  { id: "ESL-1923", product: "Yogurt 4pk", aisle: "A4", oldPrice: "€2.79", newPrice: "€2.29", reason: "No response" },
];

export default function ITHNCommandUpdateFailures() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">Update Failures</h2>
          <p className="text-[10px] text-muted-foreground">Wrong prices</p>
        </div>
        <Button size="sm" className="gap-1 h-7 text-[10px] px-2">
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      </div>

      {/* Summary */}
      <Card className="bg-amber-500/5 border-amber-500/30">
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center">
              <FileWarning className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-sm text-amber-600">{failedUpdates.length} Failed</p>
              <p className="text-[10px] text-muted-foreground">From 02:00 update</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESL List */}
      <div className="space-y-1.5">
        {failedUpdates.map((esl) => (
          <Card 
            key={esl.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate(`/ITHNCommand/operations/refresh?esl=${esl.id}`)}
          >
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileWarning className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-[11px] truncate">{esl.product}</p>
                      <p className="text-[9px] text-muted-foreground">{esl.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] line-through text-muted-foreground">{esl.oldPrice}</p>
                      <p className="text-[10px] font-medium text-primary">{esl.newPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" />
                      {esl.aisle}
                    </span>
                    <Badge variant="secondary" className="text-[8px] h-4 px-1 bg-amber-500/10 text-amber-600">
                      {esl.reason}
                    </Badge>
                  </div>
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
