import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Battery, 
  BatteryWarning,
  Search,
  RefreshCw,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const lowBatteryESLs = [
  { id: "ESL-045", product: "Organic Apples", aisle: "1", shelf: "A3", battery: 5, daysRemaining: 1, priority: "critical" },
  { id: "ESL-112", product: "Fresh Salmon", aisle: "7", shelf: "B1", battery: 8, daysRemaining: 2, priority: "critical" },
  { id: "ESL-067", product: "Whole Milk", aisle: "3", shelf: "C2", battery: 12, daysRemaining: 3, priority: "high" },
  { id: "ESL-189", product: "Sourdough Bread", aisle: "5", shelf: "A1", battery: 15, daysRemaining: 4, priority: "high" },
  { id: "ESL-234", product: "Free Range Eggs", aisle: "3", shelf: "D3", battery: 18, daysRemaining: 5, priority: "medium" },
  { id: "ESL-156", product: "Butter 500g", aisle: "3", shelf: "B4", battery: 20, daysRemaining: 6, priority: "medium" },
  { id: "ESL-078", product: "Orange Juice", aisle: "4", shelf: "C1", battery: 22, daysRemaining: 7, priority: "low" },
  { id: "ESL-301", product: "Greek Yogurt", aisle: "3", shelf: "A2", battery: 25, daysRemaining: 8, priority: "low" },
];

export default function LowBatteryESLs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedESLs, setSelectedESLs] = useState<string[]>([]);

  const filteredESLs = lowBatteryESLs.filter(esl => 
    esl.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.aisle.includes(searchQuery)
  );

  const getBatteryColor = (level: number) => {
    if (level <= 10) return "text-destructive";
    if (level <= 20) return "text-amber-500";
    return "text-yellow-500";
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-amber-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedESLs(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const criticalCount = lowBatteryESLs.filter(e => e.battery <= 10).length;
  const highCount = lowBatteryESLs.filter(e => e.battery > 10 && e.battery <= 20).length;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Low Battery ESLs</h1>
          <p className="text-xs text-muted-foreground">67 labels need battery replacement</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Critical Alert */}
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <BatteryWarning className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">{criticalCount} Critical - Replace Today</p>
              <p className="text-xs text-muted-foreground">Battery &lt;10% - will fail within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-3 text-center">
            <Battery className="h-5 w-5 mx-auto mb-1 text-destructive" />
            <p className="text-lg font-bold text-destructive">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">&lt;10%</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-3 text-center">
            <Battery className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold text-amber-500">{highCount}</p>
            <p className="text-xs text-muted-foreground">10-20%</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-3 text-center">
            <Battery className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="text-lg font-bold text-yellow-500">{lowBatteryESLs.length - criticalCount - highCount}</p>
            <p className="text-xs text-muted-foreground">20-30%</p>
          </CardContent>
        </Card>
      </div>

      {/* Aisle Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            By Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Aisle 3 (Dairy)</span>
            <Badge variant="outline">24 ESLs</Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Aisle 7 (Meat)</span>
            <Badge variant="outline">15 ESLs</Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Aisle 1 (Produce)</span>
            <Badge variant="outline">12 ESLs</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedESLs.length > 0 && (
        <Card className="bg-primary/10 border-primary/30 sticky top-0 z-10">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{selectedESLs.length} selected</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedESLs([])}>
                  Clear
                </Button>
                <Button size="sm">
                  <Package className="h-4 w-4 mr-1" />
                  Create Job
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ESL List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Low Battery Labels</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setSelectedESLs(selectedESLs.length === filteredESLs.length ? [] : filteredESLs.map(e => e.id))}
          >
            {selectedESLs.length === filteredESLs.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
        {filteredESLs.map((esl) => (
          <Card 
            key={esl.id} 
            className={cn(
              "cursor-pointer transition-colors",
              selectedESLs.includes(esl.id) && "ring-2 ring-primary",
              esl.priority === "critical" && "border-destructive/50"
            )}
            onClick={() => toggleSelection(esl.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedESLs.includes(esl.id) ? "bg-primary" : 
                    esl.battery <= 10 ? "bg-destructive/20" : "bg-amber-500/20"
                  )}>
                    {selectedESLs.includes(esl.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Battery className={cn("h-5 w-5", getBatteryColor(esl.battery))} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{esl.product}</p>
                    <p className="text-xs text-muted-foreground">{esl.id}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Aisle {esl.aisle}, {esl.shelf}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <Progress value={esl.battery} className="h-2" />
                    </div>
                    <span className={cn("text-sm font-medium", getBatteryColor(esl.battery))}>{esl.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    ~{esl.daysRemaining} day{esl.daysRemaining > 1 ? 's' : ''} left
                  </div>
                  <Badge className={cn("text-xs mt-1", getPriorityStyle(esl.priority))}>
                    {esl.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                <Button 
                  size="sm" 
                  variant={esl.priority === "critical" ? "destructive" : "outline"} 
                  className="flex-1 h-8 text-xs"
                  onClick={() => navigate(`/handheld/operations?esl=${esl.id}&action=replace-battery`)}
                >
                  Replace Battery
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs px-3"
                  onClick={() => navigate(`/handheld/operations?esl=${esl.id}`)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredESLs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Battery className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No low battery ESLs found matching your search</p>
        </div>
      )}
    </div>
  );
}
