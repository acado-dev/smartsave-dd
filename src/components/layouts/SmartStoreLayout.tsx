import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartStoreSidebar } from "@/components/navigation/SmartStoreSidebar";
import { Menu } from "lucide-react";
import ithinaLogoWhite from "@/assets/ithina-logo-white.png";

interface SmartStoreLayoutProps {
  children: React.ReactNode;
}

export function SmartStoreLayout({ children }: SmartStoreLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SmartStoreSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 h-14 border-b border-secondary/20 bg-secondary">
            <div className="flex h-full items-center justify-between px-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5 text-primary-foreground" />
              </SidebarTrigger>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary-foreground">Perishable Waste Management</span>
                <div className="h-5 w-px bg-primary-foreground/30" />
                <img src={ithinaLogoWhite} alt="Ithina" className="h-7 w-auto object-contain" />
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
