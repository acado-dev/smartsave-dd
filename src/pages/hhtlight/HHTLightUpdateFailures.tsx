import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  FileWarning,
  RefreshCw,
  MapPin,
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const failedUpdates = [
  { id: "ESL-1247", product: "Organic Milk 1L", aisle: "Dairy - A3", oldPrice: "€3.49", newPrice: "€2.99", reason: "Communication timeout", lastAttempt: "02:15" },
  { id: "ESL-0892", product: "Orange Juice 1L", aisle: "Beverages - C2", oldPrice: "€2.99", newPrice: "€2.49", reason: "ESL not responding", lastAttempt: "02:18" },
  { id: "ESL-2341", product: "Cream Cheese 200g", aisle: "Dairy - A5", oldPrice: "€1.99", newPrice: "€1.79", reason: "Signal weak", lastAttempt: "02:22" },
  { id: "ESL-1456", product: "Butter 250g", aisle: "Dairy - A2", oldPrice: "€2.49", newPrice: "€2.19", reason: "Communication timeout", lastAttempt: "02:25" },
  { id: "ESL-0567", product: "Eggs 12pk", aisle: "Dairy - A1", oldPrice: "€4.99", newPrice: "€4.49", reason: "ESL busy", lastAttempt: "02:28" },
  { id: "ESL-3421", product: "Cheddar Cheese 300g", aisle: "Dairy - A6", oldPrice: "€3.99", newPrice: "€3.49", reason: "Communication timeout", lastAttempt: "02:31" },
  { id: "ESL-2789", product: "Whole Milk 2L", aisle: "Dairy - A3", oldPrice: "€2.29", newPrice: "€1.99", reason: "Signal weak", lastAttempt: "02:34" },
  { id: "ESL-1923", product: "Strawberry Yogurt 4pk", aisle: "Dairy - A4", oldPrice: "€2.79", newPrice: "€2.29", reason: "ESL not responding", lastAttempt: "02:37" },
  { id: "ESL-0456", product: "Fresh Cream 500ml", aisle: "Dairy - A2", oldPrice: "€1.49", newPrice: "€1.29", reason: "Communication timeout", lastAttempt: "02:40" },
  { id: "ESL-3156", product: "Almond Milk 1L", aisle: "Beverages - C3", oldPrice: "€2.99", newPrice: "€2.69", reason: "Signal weak", lastAttempt: "02:43" },
  { id: "ESL-2567", product: "Mozzarella 250g", aisle: "Dairy - A5", oldPrice: "€3.29", newPrice: "€2.89", reason: "ESL busy", lastAttempt: "02:46" },
  { id: "ESL-1678", product: "Greek Yogurt 500g", aisle: "Dairy - A4", oldPrice: "€2.49", newPrice: "€2.19", reason: "Communication timeout", lastAttempt: "02:49" },
];

export default function HHTLightUpdateFailures() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Update Failures</h1>
          <p className="text-sm text-muted-foreground">Labels showing incorrect prices</p>
        </div>
        <Button size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry All
        </Button>
      </div>

      {/* Summary */}
      <Card className="bg-amber-500/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileWarning className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-lg text-amber-600">{failedUpdates.length} Failed</p>
              <p className="text-sm text-muted-foreground">From last night's update (02:00)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESL List */}
      <div className="space-y-2">
        {failedUpdates.map((esl) => (
          <Card 
            key={esl.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate(`/HHTLight/operations/refresh?esl=${esl.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileWarning className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm truncate">{esl.product}</p>
                      <p className="text-xs text-muted-foreground">{esl.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs line-through text-muted-foreground">{esl.oldPrice}</p>
                      <p className="text-sm font-medium text-primary">{esl.newPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {esl.aisle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {esl.lastAttempt}
                    </span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs bg-amber-500/10 text-amber-600">
                    {esl.reason}
                  </Badge>
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
