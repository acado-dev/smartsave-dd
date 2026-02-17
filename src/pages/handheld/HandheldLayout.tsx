import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Battery, ClipboardList, Settings, Bell, Menu, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ithinaLogoWhite from "@/assets/ithina-logo-white-full.png";
import { useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Tablet Sidebar - Hidden on mobile, visible on md+ */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border" style={{ backgroundColor: 'hsl(222, 47%, 14%)' }}>
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col items-center gap-2">
            <img src={ithinaLogoWhite} alt="Ithina" className="h-12 w-auto object-contain" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">Store Operations</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/handheld" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  isActive 
                    ? "bg-white/15 text-white" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={() => navigate("/handheld/alerts")}
          >
            <Bell className="h-5 w-5" />
            <span>Alerts</span>
            <Badge className="ml-auto bg-destructive text-destructive-foreground">3</Badge>
          </Button>
        </div>
      </aside>

      {/* Mobile/Tablet Container */}
      <div className="flex-1 flex flex-col max-w-3xl md:max-w-none mx-auto w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 px-4 py-3 text-white" style={{ backgroundColor: 'hsl(222, 47%, 14%)' }}>
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b border-white/10 text-white" style={{ backgroundColor: 'hsl(222, 47%, 14%)' }}>
                  <div className="flex flex-col items-center gap-2">
                    <img src={ithinaLogoWhite} alt="Ithina" className="h-12 w-auto object-contain" />
                    <span className="text-xs font-semibold text-white/90 tracking-wide">Store Operations</span>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/handheld" && location.pathname.startsWith(item.path));
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
                    onClick={() => handleNavigation("/handheld/alerts")}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Alerts</span>
                    <Badge className="ml-auto bg-destructive text-destructive-foreground">3</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Store name - mobile */}
            <div className="flex items-center gap-3 md:hidden">
              <img src={ithinaLogoWhite} alt="Ithina" className="h-8 w-auto object-contain" />
              <p className="text-sm font-semibold text-white">Store #127 — Milan Central</p>
            </div>

            {/* Tablet header title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold">Store #127 — Milan Central</h1>
            </div>

            {/* Alert button - mobile */}
            <button 
              onClick={() => navigate("/handheld/alerts")}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </button>

            {/* Tablet header actions */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => navigate("/handheld/alerts")}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
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
    </div>
  );
}
