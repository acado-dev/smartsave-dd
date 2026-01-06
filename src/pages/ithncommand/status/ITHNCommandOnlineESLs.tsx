import { ArrowLeft, Wifi, Clock, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const onlineESLs = [
  { id: "ESL-001", product: "Organic Bananas", lastSync: "2m ago", aisle: "A1" },
  { id: "ESL-002", product: "Whole Milk 1L", lastSync: "1m ago", aisle: "B3" },
  { id: "ESL-003", product: "Fresh Bread", lastSync: "3m ago", aisle: "C2" },
  { id: "ESL-004", product: "Orange Juice", lastSync: "1m ago", aisle: "B4" },
  { id: "ESL-005", product: "Greek Yogurt", lastSync: "2m ago", aisle: "B2" },
  { id: "ESL-006", product: "Chicken Breast", lastSync: "4m ago", aisle: "D1" },
  { id: "ESL-007", product: "Pasta 500g", lastSync: "1m ago", aisle: "E3" },
  { id: "ESL-008", product: "Tomato Sauce", lastSync: "2m ago", aisle: "E4" },
];

export default function ITHNCommandOnlineESLs() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/ITHNCommand")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-green-500" />
          <div>
            <h2 className="text-sm font-semibold">Online ESLs</h2>
            <p className="text-[10px] text-muted-foreground">{onlineESLs.length} connected</p>
          </div>
        </div>
      </div>

      {/* ESL List */}
      <div className="space-y-1.5">
        {onlineESLs.map((esl) => (
          <Card key={esl.id}>
            <CardContent className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="font-mono text-[10px] font-medium">{esl.id}</span>
                  </div>
                  <p className="font-medium text-[11px] truncate">{esl.product}</p>
                  <div className="flex items-center gap-3 mt-1 text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {esl.lastSync}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Package className="w-2.5 h-2.5" />
                      {esl.aisle}
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
