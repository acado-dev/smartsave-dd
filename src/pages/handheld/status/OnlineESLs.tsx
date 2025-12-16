import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Wifi, 
  Search,
  RefreshCw,
  Signal,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const onlineESLs = [
  { id: "ESL-001", product: "Organic Milk 1L", aisle: "3", shelf: "A2", signal: 95, lastSync: "1 min ago", battery: 87 },
  { id: "ESL-002", product: "Whole Wheat Bread", aisle: "5", shelf: "B1", signal: 88, lastSync: "2 min ago", battery: 92 },
  { id: "ESL-003", product: "Fresh Bananas", aisle: "1", shelf: "C3", signal: 92, lastSync: "30 sec ago", battery: 78 },
  { id: "ESL-004", product: "Greek Yogurt", aisle: "3", shelf: "A4", signal: 78, lastSync: "3 min ago", battery: 95 },
  { id: "ESL-005", product: "Orange Juice 2L", aisle: "4", shelf: "D2", signal: 85, lastSync: "1 min ago", battery: 81 },
  { id: "ESL-006", product: "Eggs Large 12pk", aisle: "3", shelf: "B2", signal: 90, lastSync: "45 sec ago", battery: 89 },
  { id: "ESL-007", product: "Cheddar Cheese", aisle: "3", shelf: "C1", signal: 82, lastSync: "2 min ago", battery: 76 },
  { id: "ESL-008", product: "Chicken Breast", aisle: "7", shelf: "A1", signal: 94, lastSync: "1 min ago", battery: 93 },
];

export default function OnlineESLs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredESLs = onlineESLs.filter(esl => 
    esl.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.aisle.includes(searchQuery)
  );

  const getSignalStrength = (signal: number) => {
    if (signal >= 90) return { label: "Excellent", color: "text-green-500" };
    if (signal >= 75) return { label: "Good", color: "text-emerald-500" };
    if (signal >= 50) return { label: "Fair", color: "text-amber-500" };
    return { label: "Weak", color: "text-destructive" };
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Online ESLs</h1>
          <p className="text-xs text-muted-foreground">2,847 labels connected</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by product, ESL ID, or aisle..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-green-500">2,412</p>
            <p className="text-xs text-muted-foreground">Excellent Signal</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-emerald-500">398</p>
            <p className="text-xs text-muted-foreground">Good Signal</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-amber-500">37</p>
            <p className="text-xs text-muted-foreground">Fair Signal</p>
          </CardContent>
        </Card>
      </div>

      {/* ESL List */}
      <div className="space-y-2">
        {filteredESLs.map((esl) => {
          const signalInfo = getSignalStrength(esl.signal);
          return (
            <Card 
              key={esl.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/handheld/operations?esl=${esl.id}`)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{esl.product}</p>
                      <p className="text-xs text-muted-foreground">{esl.id}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Aisle {esl.aisle}, {esl.shelf}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {esl.lastSync}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Signal className={cn("h-4 w-4", signalInfo.color)} />
                      <span className={cn("text-sm font-medium", signalInfo.color)}>{esl.signal}%</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {signalInfo.label}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredESLs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Wifi className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No ESLs found matching your search</p>
        </div>
      )}
    </div>
  );
}
