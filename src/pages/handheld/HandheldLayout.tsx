import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Battery, ClipboardList, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ddHubLogo from "@/assets/ddhub-logo.png";

const navItems = [
  { path: "/handheld", icon: Home, label: "Home" },
  { path: "/handheld/operations", icon: Cpu, label: "Operations" },
  { path: "/handheld/health", icon: Battery, label: "Health" },
  { path: "/handheld/jobs", icon: ClipboardList, label: "Jobs" },
  { path: "/handheld/settings", icon: Settings, label: "Settings" },
];

export default function HandheldLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border">
      {/* Status Bar */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={ddHubLogo} alt="DD Hub" className="h-10 w-auto brightness-0 invert" />
          <p className="text-[10px] text-primary-foreground/80 tracking-wide">One App. Total Store Control.</p>
        </div>
        <button 
          onClick={() => navigate("/handheld/alerts")}
          className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
            3
          </Badge>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/handheld" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
