import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Settings, Bell, MapPin, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ddHubLogo from "@/assets/ddhub-logo.png";
import { useState } from "react";

const navItems = [
  { path: "/HHTLight", icon: Home, label: "Dashboard" },
  { path: "/HHTLight/operations", icon: Cpu, label: "Operations" },
  { path: "/HHTLight/settings", icon: Settings, label: "Settings" },
];

export default function HHTLightLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Tablet Sidebar - Hidden on mobile, visible on md+ */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={ddHubLogo} alt="DD Hub" className="h-10 w-auto" />
            <div>
              <p className="text-sm font-semibold">Store #1247</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Warsaw Central
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/HHTLight" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => navigate("/HHTLight/alerts")}
          >
            <Bell className="h-5 w-5" />
            <span>Alerts</span>
            <Badge className="ml-auto bg-destructive text-destructive-foreground">3</Badge>
          </Button>
        </div>
      </aside>

      {/* Mobile/Tablet Container */}
      <div className="flex-1 flex flex-col max-w-3xl md:max-w-none mx-auto w-full">
        {/* Header - Mobile shows full header, Tablet shows simplified */}
        <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b border-border bg-primary text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <img src={ddHubLogo} alt="DD Hub" className="h-10 w-auto" />
                    <div>
                      <p className="text-sm font-semibold">Store #1247</p>
                      <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Warsaw Central
                      </p>
                    </div>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/HHTLight" && location.pathname.startsWith(item.path));
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigation("/HHTLight/alerts")}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Alerts</span>
                    <Badge className="ml-auto bg-destructive text-destructive-foreground">3</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo and store info - centered on mobile */}
            <div className="flex items-center gap-3 md:hidden">
              <img src={ddHubLogo} alt="DD Hub" className="h-10 w-auto" />
              <div>
                <p className="text-sm font-semibold">Store #1247</p>
                <p className="text-[10px] text-primary-foreground/80 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Warsaw Central
                </p>
              </div>
            </div>

            {/* Tablet header title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold">HHT Light</h1>
            </div>

            {/* Alert button */}
            <button 
              onClick={() => navigate("/HHTLight/alerts")}
              className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-colors md:hidden"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </button>

            {/* Tablet header actions */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => navigate("/HHTLight/alerts")}
                className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 max-w-3xl mx-auto bg-card border-t border-border z-50">
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
    </div>
  );
}
