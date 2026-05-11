import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Battery, ClipboardList, Settings, Bell, Menu, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import petrolLogo from "@/assets/petrol-logo.svg";
import { useState } from "react";
import IthinaAssistant from "@/components/handheld/IthinaAssistant";

// Petrol brand colors
const PETROL_DARK = "hsl(0, 0%, 10%)";
const PETROL_RED = "hsl(357, 92%, 46%)";

const navItems = [
  { path: "/petrol_hht/home", icon: Home, label: "Home", external: false },
  { path: "/petrol_hht/home/operations", icon: Cpu, label: "Operations", external: false },
  { path: "/petrol_hht/home/health", icon: Battery, label: "Health", external: false },
  { path: "/petrol_hht/home/jobs", icon: ClipboardList, label: "Jobs", external: false },
  { path: "/petrol_hht/home/freshness", icon: Leaf, label: "Freshness", external: false },
];

export default function PetrolHandheldLayout() {
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
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col" style={{ backgroundColor: PETROL_DARK }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white rounded-xl px-4 py-3 w-full flex justify-center">
              <img src={petrolLogo} alt="Petrol" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-[11px] font-semibold text-white/80 tracking-widest uppercase mt-1">Station Command</span>
            <span className="text-[10px] text-white/50">BS #2311 · Celovska 226</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/petrol_hht/home" && location.pathname.startsWith(item.path));
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
                style={isActive ? { backgroundColor: PETROL_RED } : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/petrol_hht/home/alerts")}
          >
            <Bell className="h-5 w-5" />
            <span>Alerts</span>
            <Badge className="ml-auto text-white text-[10px]" style={{ backgroundColor: PETROL_RED }}>3</Badge>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-white/10 font-semibold text-emerald-400"
            onClick={() => navigate("/petrol_hht/home/freshness")}
          >
            <Leaf className="h-5 w-5" />
            <span>Freshness AI</span>
            <Badge className="ml-auto text-[10px] text-white bg-emerald-500 border-0">Live</Badge>
          </Button>
        </div>
      </aside>

      {/* Mobile/Tablet Container */}
      <div className="flex-1 flex flex-col max-w-3xl md:max-w-none mx-auto w-full">
        <header className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-800">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-5 border-b border-white/10 text-white" style={{ backgroundColor: PETROL_DARK }}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white rounded-xl px-4 py-2.5">
                      <img src={petrolLogo} alt="Petrol" className="h-9 w-auto object-contain" />
                    </div>
                    <span className="text-[11px] font-semibold text-white/80 tracking-widest uppercase mt-1">Station Command</span>
                    <span className="text-[10px] text-white/50">BS #2311 · Celovska 226</span>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                      (item.path !== "/petrol_hht/home" && location.pathname.startsWith(item.path));
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
                        style={isActive ? { backgroundColor: PETROL_RED } : undefined}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="p-3 border-t border-slate-200 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigation("/petrol_hht/home/alerts")}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Alerts</span>
                    <Badge className="ml-auto text-white text-[10px]" style={{ backgroundColor: PETROL_RED }}>3</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 font-semibold border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                    onClick={() => handleNavigation("/petrol_hht/home/freshness")}
                  >
                    <Leaf className="h-5 w-5" />
                    <span>Freshness AI</span>
                    <Badge className="ml-auto text-[10px] text-white bg-emerald-500 border-0">Live</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Store name - mobile */}
            <div className="flex items-center gap-2.5 md:hidden">
              <img src={petrolLogo} alt="Petrol" className="h-7 w-auto object-contain" />
              <div className="h-5 w-px bg-slate-300" />
              <p className="text-sm font-semibold text-slate-900">BS #2311 · Celovska 226</p>
            </div>

            {/* Tablet header title */}
            <div className="hidden md:flex items-center gap-3">
              <img src={petrolLogo} alt="Petrol" className="h-8 w-auto object-contain" />
              <div className="h-6 w-px bg-slate-300" />
              <h1 className="text-lg font-semibold text-slate-900">Petrol BS #2311 — Ljubljana Celovska 226</h1>
            </div>

            <button
              onClick={() => navigate("/petrol_hht/home/alerts")}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-800"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: PETROL_RED }}>
                3
              </Badge>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 max-w-3xl mx-auto bg-white border-t border-slate-200 z-50">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = !item.external && (location.pathname === item.path ||
                (item.path !== "/petrol_hht/home" && location.pathname.startsWith(item.path)));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[56px]",
                    !isActive ? "text-slate-400 hover:text-slate-600" : ""
                  )}
                  style={isActive ? { color: PETROL_RED } : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Ithina AI Assistant */}
      <IthinaAssistant />
    </div>
  );
}
