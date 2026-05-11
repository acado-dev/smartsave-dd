import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Globe, 
  Bell, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  LogOut,
  ChevronRight,
  Building2,
  Shield,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const ITHINA_TEAL = "hsl(195, 100%, 42%)";

export default function HandheldSettings() {
  const { toast } = useToast();
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"online" | "offline" | "syncing">("online");

  const handleSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("online");
      toast({
        title: "Sync Complete",
        description: "All data is up to date",
      });
    }, 2000);
  };

  const userInfo = {
    name: "Marco Rossi",
    role: "Store Associate",
    store: "Store #127 - Milan Central",
    region: "Northern Italy"
  };

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold" style={{ color: ITHINA_NAVY }}>Settings</h2>
        <p className="text-sm text-muted-foreground">App preferences and sync status</p>
      </div>

      {/* User Profile */}
      <Card className="border-slate-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ITHINA_TEAL}15` }}>
              <User className="h-6 w-6" style={{ color: ITHINA_TEAL }} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{userInfo.name}</p>
              <p className="text-sm text-muted-foreground">{userInfo.role}</p>
            </div>
            <Badge variant="secondary">{userInfo.role}</Badge>
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{userInfo.store}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{userInfo.region}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            {syncStatus === "online" ? (
              <Wifi className="h-4 w-4 text-emerald-500" />
            ) : syncStatus === "syncing" ? (
              <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-500" />
            )}
            Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {syncStatus === "online" ? "Connected" : syncStatus === "syncing" ? "Syncing..." : "Offline"}
              </p>
              <p className="text-xs text-muted-foreground">Last sync: 2 minutes ago</p>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                syncStatus === "online" && "text-emerald-500 border-emerald-400",
                syncStatus === "syncing" && "text-amber-500 border-amber-400",
                syncStatus === "offline" && "text-orange-500 border-orange-400"
              )}
            >
              {syncStatus}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-slate-200" 
            onClick={handleSync}
            disabled={syncStatus === "syncing"}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", syncStatus === "syncing" && "animate-spin")} />
            {syncStatus === "syncing" ? "Syncing..." : "Sync Now"}
          </Button>
          <div className="text-xs text-muted-foreground">
            <p>• 1,247 pending changes to upload</p>
            <p>• Offline mode: 72 hours of data cached</p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="language">Language</Label>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notifications">Push Notifications</Label>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Role-based Access */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Access Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>ESL Operations</span>
              <Badge variant="secondary">Full Access</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Battery Management</span>
              <Badge variant="secondary">Full Access</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Reports</span>
              <Badge variant="outline">View Only</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Settings</span>
              <Badge variant="outline" className="text-muted-foreground">No Access</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="border-slate-200">
        <CardContent className="pt-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>App Version</span>
              <span>2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2024.12.16</span>
            </div>
            <div className="flex justify-between">
              <span>Device ID</span>
              <span>HHT-MIL-127-003</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
