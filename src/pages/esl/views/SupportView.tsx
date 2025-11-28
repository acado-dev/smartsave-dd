import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Battery, WifiOff, Monitor, Server, Activity, ExternalLink, Image, Radio, FileCheck, Wrench, PackageX } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FilterBar } from "@/components/esl/FilterBar";
import { Link, useNavigate } from "react-router-dom";

const systemHealthData = [
  { time: "22:30", failures: 12, cpu: 45, memory: 62 },
  { time: "23:00", failures: 18, cpu: 48, memory: 65 },
  { time: "23:30", failures: 23, cpu: 52, memory: 68 },
  { time: "00:00", failures: 15, cpu: 43, memory: 61 },
  { time: "00:30", failures: 9, cpu: 41, memory: 59 },
  { time: "01:00", failures: 7, cpu: 39, memory: 57 },
  { time: "01:30", failures: 11, cpu: 44, memory: 63 },
  { time: "02:00", failures: 14, cpu: 47, memory: 66 },
];

const alerts = [
  { id: 1, severity: "critical", message: "12 ESLs disconnected - Store #6467", time: "5 min ago", store: "Aberdeen Woodend" },
  { id: 2, severity: "warning", message: "Low battery warning - 359 displays below 20%", time: "15 min ago", store: "Multiple" },
  { id: 3, severity: "critical", message: "Communicator offline - Store #2025", time: "23 min ago", store: "Aldershot" },
  { id: 4, severity: "warning", message: "Azure CPU utilization above 80%", time: "35 min ago", store: "Infrastructure" },
  { id: 5, severity: "info", message: "Firmware update available for 2,456 labels", time: "1 hour ago", store: "System" },
];

const locationDiagnostics = [
  { location: "London Central", dataFilesReceived: 342, imagesGenerated: 338, imagesFailed: 4, displaysUpdated: 334, displaysFailed: 8, avgRSSI: -72, status: "warning" },
  { location: "Manchester", dataFilesReceived: 298, imagesGenerated: 298, imagesFailed: 0, displaysUpdated: 295, displaysFailed: 3, avgRSSI: -68, status: "good" },
  { location: "Birmingham", dataFilesReceived: 276, imagesGenerated: 271, imagesFailed: 5, displaysUpdated: 268, displaysFailed: 8, avgRSSI: -75, status: "warning" },
];

const imageGenerationIssues = [
  { product: "Nescafe French Roast", sku: "123688", location: "London Central", reason: "Template parsing error", time: "15 min ago", suggestion: "Check template rules configuration" },
  { product: "Premium Milk 2L", sku: "456123", location: "Birmingham", reason: "Image size exceeded", time: "32 min ago", suggestion: "Resize product image to max 800x600" },
];

const communicatorDiagnostics = [
  { location: "Aldershot", status: "offline", lastSeen: "23 min ago", issue: "No ethernet response", suggestion: "Check ethernet cable connection and router status" },
  { location: "Cardiff Bay", status: "degraded", lastSeen: "2 min ago", issue: "High latency (>500ms)", suggestion: "Check network congestion or upgrade bandwidth" },
];

export default function SupportView() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">IT Support Dashboard</h2>
        <p className="text-muted-foreground">System health monitoring and technical alerts</p>
      </div>

      <FilterBar />

      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Missing Displays"
          value="2,780"
          subtitle="Requires attention"
          icon={WifiOff}
          variant="warning"
          onClick={() => navigate("/esl/details/system-health")}
        />
        <StatCard
          title="Low Battery"
          value="359"
          subtitle="Below 20% charge"
          icon={Battery}
          variant="warning"
          onClick={() => navigate("/esl/details/system-health")}
        />
        <StatCard
          title="Total Labels"
          value="126,305"
          subtitle="Across all stores"
          icon={Monitor}
          onClick={() => navigate("/esl/details/system-health")}
        />
        <StatCard
          title="System Uptime"
          value="99.8%"
          subtitle="Last 30 days"
          icon={Activity}
          variant="success"
          onClick={() => navigate("/esl/details/system-health")}
        />
      </div>

      {/* System Health Chart */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Monitoring</CardTitle>
          <CardDescription>Image update failures and resource utilization (last 12 hours)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={systemHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Area type="monotone" dataKey="failures" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.6} name="Update Failures" />
              <Area type="monotone" dataKey="cpu" stackId="2" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.4} name="CPU %" />
              <Area type="monotone" dataKey="memory" stackId="3" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Memory %" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Active System Alerts
              </CardTitle>
              <CardDescription>Real-time notifications requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/esl/details/system-health">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {alert.severity === "critical" && (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  {alert.severity === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                  {alert.severity === "info" && (
                    <Activity className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="font-medium text-foreground">{alert.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">Location: {alert.store}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/esl/details/system-health")}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-accent" />
            Location ESL Diagnostics
          </CardTitle>
          <CardDescription>Data files, image generation, and display update tracking by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locationDiagnostics.map((location, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{location.location}</h4>
                  <Badge variant={location.status === "good" ? "default" : "secondary"}>
                    {location.status === "good" ? "Healthy" : "Needs Attention"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Data Files</span>
                    <span className="text-lg font-bold text-accent">{location.dataFilesReceived}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Images Gen.</span>
                    <span className="text-lg font-bold text-foreground">{location.imagesGenerated}</span>
                    {location.imagesFailed > 0 && (
                      <span className="text-xs text-destructive">{location.imagesFailed} failed</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Displays Updated</span>
                    <span className="text-lg font-bold text-success">{location.displaysUpdated}</span>
                    {location.displaysFailed > 0 && (
                      <span className="text-xs text-warning">{location.displaysFailed} failed</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Avg RSSI</span>
                    <span className={`text-lg font-bold ${location.avgRSSI > -70 ? 'text-success' : location.avgRSSI > -75 ? 'text-warning' : 'text-destructive'}`}>
                      {location.avgRSSI} dBm
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Generation Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-warning" />
            Image Generation Failures
          </CardTitle>
          <CardDescription>Failed image generation with diagnostic suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {imageGenerationIssues.map((issue, index) => (
              <div key={index} className="p-4 rounded-lg border bg-warning/5 border-warning/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{issue.product}</h4>
                    <p className="text-sm text-muted-foreground">SKU: {issue.sku} • {issue.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{issue.time}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-warning font-medium">Reason: {issue.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded bg-accent/10">
                    <Wrench className="h-4 w-4 text-accent" />
                    <span className="text-foreground"><strong>Suggestion:</strong> {issue.suggestion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-accent" />
              RF Signal Analysis
            </CardTitle>
            <CardDescription>RSSI monitoring and signal quality recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Excellent Signal (&gt; -70 dBm)</span>
                  <span className="text-lg font-bold text-success">45 stores</span>
                </div>
                <p className="text-xs text-muted-foreground">Optimal RF performance</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Fair Signal (-70 to -75 dBm)</span>
                  <span className="text-lg font-bold text-warning">12 stores</span>
                </div>
                <p className="text-xs text-muted-foreground">Consider adding RF repeaters in affected areas</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Weak Signal (&lt; -75 dBm)</span>
                  <span className="text-lg font-bold text-destructive">3 stores</span>
                </div>
                <p className="text-xs text-muted-foreground">Urgent: Check antenna placement and add coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageX className="h-5 w-5 text-destructive" />
              RMA Recommendations
            </CardTitle>
            <CardDescription>Displays requiring return merchandise authorization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Missing Displays (Not Found)</h4>
                  <Badge variant="destructive">47 units</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Displays not found on floor or back office after 7+ days
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Generate RMA Request
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Persistent Failures</h4>
                  <Badge variant="secondary">23 units</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Failed updates 10+ times despite troubleshooting
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Review for RMA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communicator Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-accent" />
            Communicator Diagnostics & Troubleshooting
          </CardTitle>
          <CardDescription>Gateway issues with actionable solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communicatorDiagnostics.map((comm, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{comm.location}</h4>
                    <p className="text-sm text-muted-foreground">Last seen: {comm.lastSeen}</p>
                  </div>
                  <Badge variant={comm.status === "offline" ? "destructive" : "secondary"}>
                    {comm.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-foreground"><strong>Issue:</strong> {comm.issue}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm p-3 rounded bg-accent/10">
                    <Wrench className="h-4 w-4 text-accent mt-0.5" />
                    <div>
                      <strong className="text-foreground">Troubleshooting Steps:</strong>
                      <p className="text-muted-foreground mt-1">{comm.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
