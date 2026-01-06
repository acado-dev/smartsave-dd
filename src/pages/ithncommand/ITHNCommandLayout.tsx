import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Cpu, Settings, Bell, MapPin, Menu, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ddHubLogo from "@/assets/ddhub-logo.png";
import { useState } from "react";
import { ITHNCommandProvider, useScreenSize } from "./ITHNCommandContext";

const navItems = [
  { path: "/ITHNCommand", icon: Home, label: "Home" },
  { path: "/ITHNCommand/operations", icon: Cpu, label: "Ops" },
  { path: "/ITHNCommand/settings", icon: Settings, label: "Settings" },
];

function ScreenSizeSelector() {
  const { screenSize, setScreenSize } = useScreenSize();
  
  const sizes = [
    { value: "3.2" as const, label: '3.2"', width: "320px" },
    { value: "5" as const, label: '5"', width: "360px" },
    { value: "7" as const, label: '7"', width: "480px" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-primary-foreground hover:bg-primary-foreground/10 h-7 px-2">
          <Monitor className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{screenSize}"</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {sizes.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => setScreenSize(size.value)}
            className={cn(
              "flex items-center justify-between",
              screenSize === size.value && "bg-accent"
            )}
          >
            <span>{size.label}</span>
            <span className="text-xs text-muted-foreground">{size.width}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ITHNCommandLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { screenSize } = useScreenSize();

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // Screen width based on selected size
  const screenWidths = {
    "3.2": "max-w-[320px]",
    "5": "max-w-[360px]",
    "7": "max-w-[480px]",
  };

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className={cn(
        "w-full bg-background min-h-screen flex flex-col shadow-xl transition-all duration-300",
        screenWidths[screenSize]
      )}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-3 border-b border-border bg-primary text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <img src={ddHubLogo} alt="DD Hub" className="h-8 w-auto" />
                    <div>
                      <p className="text-xs font-semibold">Store #1247</p>
                      <p className="text-[10px] text-primary-foreground/80 flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        Warsaw Central
                      </p>
                    </div>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/ITHNCommand" && location.pathname.startsWith(item.path));
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left text-sm",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="p-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 h-8"
                    onClick={() => handleNavigation("/ITHNCommand/alerts")}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Alerts</span>
                    <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] h-4 px-1">3</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo and store info */}
            <div className="flex items-center gap-2">
              <img src={ddHubLogo} alt="DD Hub" className="h-7 w-auto" />
              <div>
                <p className="text-[10px] font-semibold leading-tight">Store #1247</p>
                <p className="text-[8px] text-primary-foreground/80 flex items-center gap-0.5">
                  <MapPin className="h-2 w-2" />
                  Warsaw
                </p>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-1">
              <ScreenSizeSelector />
              <button 
                onClick={() => navigate("/ITHNCommand/alerts")}
                className="relative p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 p-0 flex items-center justify-center text-[8px] bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-14">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-card border-t border-border z-50" 
          style={{ width: screenSize === "3.2" ? "320px" : screenSize === "5" ? "360px" : "480px" }}>
          <div className="flex items-center justify-around py-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/ITHNCommand" && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function ITHNCommandLayout() {
  return (
    <ITHNCommandProvider>
      <ITHNCommandLayoutInner />
    </ITHNCommandProvider>
  );
}
