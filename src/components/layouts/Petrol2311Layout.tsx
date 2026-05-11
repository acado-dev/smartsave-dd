import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Petrol2311Sidebar } from "@/components/navigation/Petrol2311Sidebar";
import { Menu } from "lucide-react";
import petrolLogo from "@/assets/petrol-logo.svg";

interface Petrol2311LayoutProps {
  children: React.ReactNode;
}

export function Petrol2311Layout({ children }: Petrol2311LayoutProps) {
  return (
    <SidebarProvider>
      <div className="theme-petrol flex min-h-screen w-full bg-background">
        <Petrol2311Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-foreground">Fresh Convenience — Perishable Management</span>
                  <span className="text-xs text-muted-foreground">Petrol BS #2311 · Ljubljana Celovska 226</span>
                </div>
                <img src={petrolLogo} alt="Petrol" className="h-7 w-auto object-contain" />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
