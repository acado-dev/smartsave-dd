import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Battery, ClipboardList, Settings, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ithinaLogoWhite from "@/assets/ithina-logo-white-full.png";
import ithinaLogoColor from "@/assets/ithina-logo.png";
import { useState } from "react";

// Ithina brand colors
const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const ITHINA_NAVY_LIGHT = "hsl(205, 40%, 25%)";
const ITHINA_TEAL = "hsl(195, 100%, 42%)";

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Tablet Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col" style={{ backgroundColor: ITHINA_NAVY }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex flex-col items-center gap-2">
            <img src={ithinaLogoWhite} alt="Ithina" className="h-14 w-auto object-contain" />
            <span className="text-[11px] font-semibold text-white/80 tracking-widest uppercase">Command</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/handheld" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  isActive 
                    ? "text-white font-semibold" 
                    : "text-white/50 hover:bg-white/8 hover:text-white/80"
                )}
                style={isActive ? { backgroundColor: ITHINA_TEAL } : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/handheld/alerts")}
          >
            <Bell className="h-5 w-5" />
            <span>Alerts</span>
            <Badge className="ml-auto text-white text-[10px]" style={{ backgroundColor: ITHINA_TEAL }}>3</Badge>
          </Button>
        </div>
      </aside>

      {/* Mobile/Tablet Container */}
      <div className="flex-1 flex flex-col max-w-3xl md:max-w-none mx-auto w-full">
        {/* Header — clean white with navy text */}
        <header className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Mobile menu */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: ITHINA_NAVY }}>
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-5 border-b border-white/10 text-white" style={{ backgroundColor: ITHINA_NAVY }}>
                  <div className="flex flex-col items-center gap-2">
                    <img src={ithinaLogoWhite} alt="Ithina" className="h-12 w-auto object-contain" />
                    <span className="text-[11px] font-semibold text-white/80 tracking-widest uppercase">Command</span>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/handheld" && location.pathname.startsWith(item.path));
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                          isActive 
                            ? "text-white font-semibold" 
                            : "text-slate-600 hover:bg-slate-100"
                        )}
                        style={isActive ? { backgroundColor: ITHINA_TEAL } : undefined}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="p-3 border-t border-slate-200">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigation("/handheld/alerts")}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Alerts</span>
                    <Badge className="ml-auto text-white text-[10px]" style={{ backgroundColor: ITHINA_TEAL }}>3</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Store name - mobile */}
            <div className="flex items-center gap-2.5 md:hidden">
              <img src={ithinaLogoColor} alt="Ithina" className="h-7 w-auto object-contain" />
              <div className="h-5 w-px bg-slate-300" />
              <p className="text-sm font-semibold" style={{ color: ITHINA_NAVY }}>Store #127 — Milan Central</p>
            </div>

            {/* Tablet header title */}
            <div className="hidden md:flex items-center gap-3">
              <img src={ithinaLogoColor} alt="Ithina" className="h-8 w-auto object-contain" />
              <div className="h-6 w-px bg-slate-300" />
              <h1 className="text-lg font-semibold" style={{ color: ITHINA_NAVY }}>Store #127 — Milan Central</h1>
            </div>

            {/* Alert button */}
            <button 
              onClick={() => navigate("/handheld/alerts")}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              style={{ color: ITHINA_NAVY }}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: ITHINA_TEAL }}>
                3
              </Badge>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 max-w-3xl mx-auto bg-white border-t border-slate-200 z-50">
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
                    !isActive && "text-slate-400 hover:text-slate-600"
                  )}
                  style={isActive ? { color: ITHINA_TEAL } : undefined}
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
