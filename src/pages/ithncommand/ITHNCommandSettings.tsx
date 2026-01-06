import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Moon, 
  Globe, 
  Wifi,
  ChevronRight,
  LogOut,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useScreenSize } from "./ITHNCommandContext";

export default function ITHNCommandSettings() {
  const navigate = useNavigate();
  const { screenSize, setScreenSize } = useScreenSize();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-2 space-y-2">
      <div className="mb-1">
        <h2 className="text-sm font-semibold">Settings</h2>
        <p className="text-[10px] text-muted-foreground">App preferences</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">Store Associate</p>
              <p className="text-[10px] text-muted-foreground">Store #1247</p>
            </div>
            <Badge variant="outline" className="h-4 text-[8px]">Online</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Screen Size */}
      <Card>
        <CardContent className="p-2">
          <p className="text-[10px] font-medium text-muted-foreground mb-2">Display Size</p>
          <div className="flex gap-1">
            {(["3.2", "5", "7"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setScreenSize(size)}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                  screenSize === size 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {size}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} className="scale-75" />
          </div>
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} className="scale-75" />
          </div>
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Language</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">English</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Sync Status</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 text-green-500" />
              <span className="text-[10px] text-green-600">Synced</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="cursor-pointer hover:bg-accent/50">
        <CardContent className="p-2">
          <div className="flex items-center gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-medium">Sign Out</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
