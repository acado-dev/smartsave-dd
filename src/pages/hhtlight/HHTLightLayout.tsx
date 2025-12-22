import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import ddHubLogo from "@/assets/ddhub-logo.png";

const navItems = [
  { path: "/HHTLight", icon: Home, label: "Dashboard" },
  { path: "/HHTLight/operations", icon: Cpu, label: "Operations" },
  { path: "/HHTLight/settings", icon: Settings, label: "Settings" },
];

export default function HHTLightLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={ddHubLogo} alt="DD Hub" className="h-10 w-auto" />
          <div>
            <p className="text-xs font-medium">HHT Light</p>
            <p className="text-[10px] text-primary-foreground/80">Store Operations</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation - Simplified */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/HHTLight" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors min-w-[80px]",
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
