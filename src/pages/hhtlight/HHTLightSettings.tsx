import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  RefreshCw, 
  Smartphone,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HHTLightSettings() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">HHT Light preferences</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="battery-alerts" className="flex-1">
              <p className="font-medium text-sm">Battery Alerts</p>
              <p className="text-xs text-muted-foreground">Notify when labels need battery</p>
            </Label>
            <Switch id="battery-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="update-alerts" className="flex-1">
              <p className="font-medium text-sm">Update Failures</p>
              <p className="text-xs text-muted-foreground">Notify on price update failures</p>
            </Label>
            <Switch id="update-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ap-alerts" className="flex-1">
              <p className="font-medium text-sm">Access Point Status</p>
              <p className="text-xs text-muted-foreground">Notify when AP goes offline</p>
            </Label>
            <Switch id="ap-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Data Refresh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh" className="flex-1">
              <p className="font-medium text-sm">Auto Refresh</p>
              <p className="text-xs text-muted-foreground">Refresh data every 5 minutes</p>
            </Label>
            <Switch id="auto-refresh" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium">HHT Light v1.0</p>
            <p className="text-xs text-muted-foreground">Store-centric operations</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate("/handheld")}
          >
            <span>Switch to Full HHT</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
