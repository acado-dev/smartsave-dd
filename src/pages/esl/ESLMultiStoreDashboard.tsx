import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Building2, Tag, Wifi, Battery, Activity, AlertTriangle, 
  TrendingUp, TrendingDown, Users, Clock, BarChart3
} from "lucide-react";
import ithinaLogo from "@/assets/ithina-logo.png";

// Regional Overview Data
const regionMetrics = {
  stores: { value: 24, change: "+2" },
  esls: { value: "18.4K", change: "+458" },
  online: { value: "97.2%", change: "+0.8%" },
  battery: { value: "94.8%", change: "-1.2%" },
  uptime: { value: "99.3%", change: "+0.1%" },
};

// Store Performance Rankings
const storeRankings = [
  { id: "001", name: "Downtown", score: 98.2, labels: 1847 },
  { id: "015", name: "Mall Plaza", score: 97.8, labels: 1432 },
  { id: "008", name: "Westside", score: 96.5, labels: 953 },
  { id: "022", name: "North", score: 94.1, labels: 742 },
];

// Action Required Items
const actionsRequired = [
  { storeId: "009", issue: "Low Battery", count: 47, severity: "warning" },
  { storeId: "003", issue: "Offline", count: 12, severity: "error" },
  { storeId: "021", issue: "Price Errors", count: 8, severity: "warning" },
  { storeId: "012", issue: "Replace Due", count: 23, severity: "info" },
];

// Bottom Stats
const systemStats = [
  { label: "Daily Ops", value: "2,847" },
  { label: "Users", value: "156" },
  { label: "Response", value: "384ms" },
  { label: "Error Rate", value: "0.02%" },
];

export default function ESLMultiStoreDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/esl/dashboard")}>
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium mb-4">
            MANAGEMENT DASHBOARD
          </span>
          <h1 className="text-4xl font-bold mb-2">Enterprise Multi-Store Analytics</h1>
          <p className="text-muted-foreground text-lg">Centralized visibility across all retail locations</p>
        </div>

        {/* Regional Overview Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Regional Overview</CardTitle>
                <CardDescription>North America Region - 24 Stores</CardDescription>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                All Systems Operational
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {regionMetrics.stores.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{regionMetrics.stores.value}</p>
                <p className="text-sm text-muted-foreground">Stores</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {regionMetrics.esls.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{regionMetrics.esls.value}</p>
                <p className="text-sm text-muted-foreground">ESLs</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {regionMetrics.online.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{regionMetrics.online.value}</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Battery className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-red-500 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {regionMetrics.battery.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{regionMetrics.battery.value}</p>
                <p className="text-sm text-muted-foreground">Battery</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {regionMetrics.uptime.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{regionMetrics.uptime.value}</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>

            {/* Store Rankings and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Performance Rankings */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-none bg-slate-50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Store Performance Rankings
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">Last 7 days</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {storeRankings.map((store) => (
                      <div
                        key={store.id}
                        className="p-3 rounded-lg bg-white border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => navigate(`/esl/store/${store.id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Store #{store.id} - {store.name}</span>
                          <span className={`font-bold ${store.score >= 97 ? 'text-green-500' : store.score >= 95 ? 'text-yellow-500' : 'text-orange-500'}`}>
                            {store.score}%
                          </span>
                        </div>
                        <Progress 
                          value={store.score} 
                          className="h-2 mb-1"
                        />
                        <p className="text-xs text-muted-foreground">Labels: {store.labels.toLocaleString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Action Required */}
              <div>
                <Card className="border-0 shadow-none bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      Action Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {actionsRequired.map((action, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-white border cursor-pointer hover:border-amber-400 transition-colors"
                        onClick={() => navigate(`/esl/store/${action.storeId}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`h-4 w-4 ${
                            action.severity === 'error' ? 'text-red-500' : 
                            action.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                          }`} />
                          <span className="font-medium text-amber-700">Store #{action.storeId}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {action.issue}: <span className="font-semibold">{action.count}</span>
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
