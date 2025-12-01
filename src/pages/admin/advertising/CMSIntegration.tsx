import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, Link as LinkIcon, Check, X, RefreshCw, Settings, 
  Cloud, Database, Zap, ExternalLink, Trash2, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const integrations = [
  { 
    id: "contentful", 
    name: "Contentful", 
    description: "Headless CMS for structured content",
    status: "connected",
    lastSync: "5 mins ago",
    assets: 124,
    logo: "📦"
  },
  { 
    id: "wordpress", 
    name: "WordPress", 
    description: "Popular CMS with REST API",
    status: "available",
    lastSync: null,
    assets: 0,
    logo: "🌐"
  },
  { 
    id: "sanity", 
    name: "Sanity.io", 
    description: "Real-time structured content",
    status: "available",
    lastSync: null,
    assets: 0,
    logo: "🔴"
  },
  { 
    id: "strapi", 
    name: "Strapi", 
    description: "Open-source headless CMS",
    status: "available",
    lastSync: null,
    assets: 0,
    logo: "🚀"
  },
];

const syncHistory = [
  { id: 1, type: "Full Sync", status: "success", items: 124, time: "Today, 10:30 AM", duration: "2m 15s" },
  { id: 2, type: "Incremental", status: "success", items: 8, time: "Today, 9:00 AM", duration: "12s" },
  { id: 3, type: "Incremental", status: "success", items: 3, time: "Yesterday, 6:00 PM", duration: "8s" },
  { id: 4, type: "Full Sync", status: "failed", items: 0, time: "Yesterday, 12:00 PM", duration: "45s" },
];

export default function CMSIntegration() {
  const navigate = useNavigate();
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("15");

  const handleConnect = (integrationId: string) => {
    toast.success(`Connecting to ${integrationId}...`);
  };

  const handleDisconnect = (integrationId: string) => {
    toast.success(`Disconnected from ${integrationId}`);
  };

  const handleSync = () => {
    toast.success("Sync started! This may take a few minutes.");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/media-management')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CMS Integration</h1>
              <p className="text-muted-foreground">Connect external content management systems</p>
            </div>
          </div>
          <Button className="bg-gradient-primary" onClick={handleSync}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Now
          </Button>
        </div>

        {/* Connection Status */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                  <p className="text-2xl font-bold text-accent">1</p>
                </div>
                <Check className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Synced Assets</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="text-2xl font-bold">5m</p>
                </div>
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Health</p>
                  <p className="text-2xl font-bold text-accent">100%</p>
                </div>
                <Zap className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Integrations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Available Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <div 
                  key={integration.id}
                  className={`rounded-lg border p-4 ${
                    integration.status === "connected" ? "border-accent bg-accent/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {integration.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{integration.name}</h3>
                          {integration.status === "connected" && (
                            <Badge className="bg-accent text-accent-foreground">Connected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-xs text-accent mt-1">
                            Last sync: {integration.lastSync} • {integration.assets} assets
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {integration.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(integration.id)}>
                          <Plus className="mr-1 h-4 w-4" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Sync Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <p className="font-medium">Automatic Sync</p>
                <p className="text-sm text-muted-foreground">
                  Automatically sync content from connected CMS
                </p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            {autoSync && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sync Interval (minutes)</Label>
                  <Input 
                    type="number" 
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    min="5"
                    max="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value="https://api.displaydata.com/webhook/cms/abc123"
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Sync History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {syncHistory.map((sync) => (
                <div 
                  key={sync.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      sync.status === "success" ? "bg-accent/10" : "bg-destructive/10"
                    }`}>
                      {sync.status === "success" ? (
                        <Check className="h-5 w-5 text-accent" />
                      ) : (
                        <X className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{sync.type}</p>
                      <p className="text-sm text-muted-foreground">{sync.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{sync.items} items</p>
                    <p className="text-sm text-muted-foreground">{sync.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
