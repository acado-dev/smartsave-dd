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
              <div className="flex flex-col items-center">
                <img src={ithinaLogoWhite} alt="Ithina" className="h-8 w-auto object-contain" />
                <span className="text-[10px] font-medium text-primary-foreground/70 tracking-wide">Perishable Waste Management</span>
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
