import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  WifiOff, 
  Search,
  RefreshCw,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  Wrench,
  Radio,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const offlineESLs = [
  { id: "ESL-089", product: "Almond Milk 1L", aisle: "3", shelf: "A5", lastSeen: "2 hours ago", reason: "Signal lost", priority: "high" },
  { id: "ESL-142", product: "Pasta Sauce", aisle: "6", shelf: "C2", lastSeen: "4 hours ago", reason: "Communication timeout", priority: "high" },
  { id: "ESL-203", product: "Frozen Pizza", aisle: "9", shelf: "B3", lastSeen: "1 day ago", reason: "Battery depleted", priority: "critical" },
  { id: "ESL-156", product: "Cereal Box", aisle: "5", shelf: "D1", lastSeen: "6 hours ago", reason: "Out of range", priority: "medium" },
  { id: "ESL-078", product: "Yogurt Cup", aisle: "3", shelf: "A1", lastSeen: "30 min ago", reason: "Signal interference", priority: "low" },
  { id: "ESL-234", product: "Ice Cream", aisle: "9", shelf: "A2", lastSeen: "12 hours ago", reason: "Hardware fault", priority: "high" },
];

const troubleshootingTips = [
  { icon: Radio, title: "Check Communicator", description: "Verify communicator in range is operational" },
  { icon: Zap, title: "Power Cycle", description: "Remove and reinstall battery" },
  { icon: Wrench, title: "Physical Check", description: "Ensure ESL is properly mounted" },
];

export default function OfflineESLs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredESLs = offlineESLs.filter(esl => 
    esl.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    esl.aisle.includes(searchQuery)
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-amber-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const criticalCount = offlineESLs.filter(e => e.priority === "critical").length;
  const highCount = offlineESLs.filter(e => e.priority === "high").length;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Offline ESLs</h1>
          <p className="text-xs text-muted-foreground">44 labels need attention</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert Banner */}
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">{criticalCount + highCount} High Priority Issues</p>
              <p className="text-xs text-muted-foreground">Immediate attention required</p>
            </div>
            <Button size="sm" variant="destructive">Fix All</Button>
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

      {/* Summary by Reason */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold">18</p>
            <p className="text-xs text-muted-foreground">Signal Lost</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold">12</p>
            <p className="text-xs text-muted-foreground">Timeout</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold">8</p>
            <p className="text-xs text-muted-foreground">Battery Depleted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold">6</p>
            <p className="text-xs text-muted-foreground">Hardware Fault</p>
          </CardContent>
        </Card>
      </div>

      {/* Troubleshooting Tips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Quick Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {troubleshootingTips.map((tip, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <tip.icon className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-medium">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ESL List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Offline Labels</p>
        {filteredESLs.map((esl) => (
          <Card 
            key={esl.id} 
            className={cn(
              "cursor-pointer hover:bg-accent/50 transition-colors",
              esl.priority === "critical" && "border-destructive/50"
            )}
            onClick={() => navigate(`/handheld/operations?esl=${esl.id}&action=diagnose`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <WifiOff className="h-5 w-5 text-destructive" />
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
                        {esl.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={cn("text-xs", getPriorityStyle(esl.priority))}>
                    {esl.priority}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{esl.reason}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                  <Wrench className="h-3 w-3 mr-1" />
                  Diagnose
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredESLs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <WifiOff className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No offline ESLs found matching your search</p>
        </div>
      )}
    </div>
  );
}
