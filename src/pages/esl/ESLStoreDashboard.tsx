import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Tag, Wifi, Battery, RefreshCw, AlertTriangle, Activity,
  Clock, Building, Zap, BarChart3, Settings, Search, DollarSign, Plus
} from "lucide-react";
import ithinaLogo from "@/assets/ithina-logo.png";

// Store-specific data
const storeData = {
  id: "001",
  name: "Downtown Plaza",
  manager: "Sarah Johnson",
  lastUpdate: "2 min ago",
  status: "Operational",
  hours: "8am-10pm"
};

// KPI Metrics
const storeKPIs = [
  { label: "Total ESLs", value: "1,847", icon: Tag, color: "bg-blue-500" },
  { label: "Online", value: "98.2%", icon: Wifi, color: "bg-emerald-500" },
  { label: "Avg Battery", value: "89%", icon: Battery, color: "bg-amber-500" },
  { label: "Today Ops", value: "347", icon: RefreshCw, color: "bg-purple-500" },
  { label: "Alerts", value: "3", icon: AlertTriangle, color: "bg-red-500" },
  { label: "Response", value: "142ms", icon: Activity, color: "bg-cyan-500" },
];

// ESL Status Distribution
const statusDistribution = [
  { label: "Online & Active", count: 1813, color: "bg-green-500" },
  { label: "Low Battery", count: 23, color: "bg-amber-500" },
  { label: "Offline", count: 8, color: "bg-red-500" },
  { label: "Pending Update", count: 3, color: "bg-blue-500" },
];

// Recent Operations
const recentOperations = [
  { type: "Refresh", labels: 247, time: "15 min ago", icon: RefreshCw, color: "text-emerald-500" },
  { type: "Price Update", labels: 89, time: "1 hour ago", icon: DollarSign, color: "text-blue-500" },
  { type: "Flash", labels: 12, time: "2 hours ago", icon: Zap, color: "text-amber-500" },
  { type: "New Assignment", labels: 5, time: "3 hours ago", icon: Plus, color: "text-purple-500" },
];

// Department Stats
const departments = [
  { name: "Fresh Produce", labels: 423, health: 98 },
  { name: "Dairy", labels: 312, health: 99 },
  { name: "Bakery", labels: 198, health: 97 },
  { name: "Frozen Foods", labels: 267, health: 96 },
];

// Quick Actions
const quickActions = [
  { label: "Refresh All", icon: RefreshCw, color: "bg-slate-500" },
  { label: "Flash Labels", icon: Zap, color: "bg-amber-500" },
  { label: "Full Report", icon: BarChart3, color: "bg-blue-500" },
  { label: "Search ESL", icon: Search, color: "bg-slate-700" },
  { label: "Settings", icon: Settings, color: "bg-slate-800" },
];

export default function ESLStoreDashboard() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const displayStoreId = storeId || storeData.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/esl/multi-store")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <img src={ithinaLogo} alt="ITHINA" className="h-8 w-auto object-contain" />
            <p className="text-xs text-muted-foreground">Powered by Displaydata</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-medium mb-4">
            STORE-LEVEL INSIGHTS
          </span>
          <h1 className="text-4xl font-bold mb-2">Drill Down to Individual Store Performance</h1>
          <p className="text-muted-foreground text-lg">Real-time operational visibility where it matters most</p>
        </div>

        {/* Store Info Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Building className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-bold">Store #{displayStoreId} - {storeData.name}</h2>
                  <p className="text-muted-foreground">
                    Manager: {storeData.manager} • Last Update: {storeData.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white">
                  <span className="w-2 h-2 rounded-full bg-white mr-2" />
                  {storeData.status}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Open: {storeData.hours}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {storeKPIs.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className={`${kpi.color} text-white border-0`}>
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm opacity-90">{kpi.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ESL Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                ESL Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span className="text-sm">{status.label}</span>
                  </div>
                  <span className="font-semibold">{status.count.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t">
                <Progress value={98.2} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1 text-center">98.2% Online</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOperations.map((op, index) => {
                const Icon = op.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${op.color}`} />
                      <div>
                        <p className="font-medium text-sm">{op.type}</p>
                        <p className="text-xs text-muted-foreground">{op.labels} labels</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{op.time}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* By Department */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                By Department
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <Tag className="h-3 w-3 inline mr-1" />
                      {dept.labels} labels
                    </p>
                  </div>
                  <span className={`font-bold ${dept.health >= 98 ? 'text-green-500' : 'text-amber-500'}`}>
                    {dept.health}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`${action.color} text-white border-0 h-16 hover:opacity-90`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{action.label}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            <span className="text-primary font-medium">Actionable Intelligence:</span> From regional overview to individual store control — empower every manager with real-time insights
          </p>
        </div>
      </main>
    </div>
  );
}
