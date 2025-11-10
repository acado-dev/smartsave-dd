import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Camera, Monitor, Layers, Calendar, TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock, Eye, Wifi, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">BUC-EE'S Store</h1>
            <p className="mt-2 text-muted-foreground">
              Smart retail solutions powered by AI and ESL technology
            </p>
          </div>
          <Button className="bg-gradient-primary shadow-elevated">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Report
          </Button>
        </div>

        {/* Solution Boxes (Quick Access) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground">Perishable Waste Reduction</h3>
                  <p className="text-sm text-muted-foreground">AI-powered dynamic pricing & waste management</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Dynamic pricing rules</li>
                    <li>Expiring items view</li>
                  </ul>
                  <Button onClick={() => navigate('/management/dashboard')} variant="outline" size="sm">
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground">Planogram Compliance</h3>
                  <p className="text-sm text-muted-foreground">AI-powered shelf monitoring & gap detection</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Gap detection</li>
                    <li>Compliance score</li>
                  </ul>
                  <Button onClick={() => navigate('/management/planogram-compliance')} variant="outline" size="sm">
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground">In-Store Advertising</h3>
                  <p className="text-sm text-muted-foreground">Digital displays & content management</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Active campaigns</li>
                    <li>Display status</li>
                  </ul>
                  <Button onClick={() => navigate('/management/media-management')} variant="outline" size="sm">
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground">ESL Solution</h3>
                  <p className="text-sm text-muted-foreground">Electronic shelf labels & system monitoring</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>ESL health</li>
                    <li>Battery alerts</li>
                  </ul>
                  <Button onClick={() => navigate('/management/esl-solution')} variant="outline" size="sm">
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Ecosystem Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="shadow-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">$42,890</p>
                  <p className="text-sm text-accent mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> 8.2% vs yesterday
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Waste Prevented</p>
                  <p className="text-3xl font-bold text-foreground">$12.3K</p>
                  <p className="text-sm text-primary mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> 18% increase
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-3xl font-bold text-foreground">94.2%</p>
                  <p className="text-sm text-accent mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Excellent
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active ESLs</p>
                  <p className="text-3xl font-bold text-foreground">2,847</p>
                  <p className="text-sm text-primary mt-1 flex items-center gap-1">
                    <Wifi className="h-3 w-3" /> 98.5% online
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solution Areas with Widgets */}
        <div className="space-y-6">
          {/* Perishable Waste Reduction */}
          <Card className="shadow-card border-accent/30 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Perishable Waste Reduction</CardTitle>
                    <p className="text-sm text-muted-foreground">AI-powered dynamic pricing & waste management</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/management/dashboard')} variant="outline" size="sm">
                  View Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Waste This Week</p>
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">142 kg</p>
                  <p className="text-xs text-warning mt-1 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> 23% from last week
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Near Expiry</p>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">48 items</p>
                  <p className="text-xs text-muted-foreground mt-1">Within 3 days</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Discounts Applied</p>
                    <DollarSign className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-xs text-accent mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Today
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Donations</p>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">89 units</p>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planogram Compliance */}
          <Card className="shadow-card border-primary/30 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Planogram Compliance</CardTitle>
                    <p className="text-sm text-muted-foreground">AI-powered shelf monitoring & gap detection</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/management/planogram-compliance')} variant="outline" size="sm">
                  View Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Excellent</Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">94.2%</p>
                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +2.1% this week
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Active Cameras</p>
                    <Eye className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">48/50</p>
                  <p className="text-xs text-muted-foreground mt-1">96% online</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Gaps Detected</p>
                    <AlertCircle className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Alerts Resolved</p>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">127</p>
                  <p className="text-xs text-accent mt-1">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In-Store Advertising */}
          <Card className="shadow-card border-accent/30 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">In-Store Advertising</CardTitle>
                    <p className="text-sm text-muted-foreground">Digital displays & content management</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/management/media-management')} variant="outline" size="sm">
                  View Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground mt-1">Running now</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Display Devices</p>
                    <Monitor className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">124/128</p>
                  <p className="text-xs text-accent mt-1">96.9% online</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Total Impressions</p>
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">2.4M</p>
                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Today
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">12.3%</p>
                  <p className="text-xs text-accent mt-1">Above average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ESL Solution */}
          <Card className="shadow-card border-primary/30 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">ESL Solution</CardTitle>
                    <p className="text-sm text-muted-foreground">Electronic shelf labels & system monitoring</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/management/esl-solution')} variant="outline" size="sm">
                  View Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Total ESLs</p>
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                  <p className="text-xs text-muted-foreground mt-1">Deployed</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Online Status</p>
                    <Wifi className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">98.5%</p>
                  <p className="text-xs text-accent mt-1">Excellent health</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Updates Today</p>
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-xs text-muted-foreground mt-1">Price changes</p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Battery Low</p>
                    <AlertCircle className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">23</p>
                  <p className="text-xs text-muted-foreground mt-1">Need replacement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
