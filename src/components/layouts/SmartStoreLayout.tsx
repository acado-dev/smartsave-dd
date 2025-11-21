import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartStoreSidebar } from "@/components/navigation/SmartStoreSidebar";
import { Menu } from "lucide-react";
import smartStoreLogo from "@/assets/ddsmartstore-logo.png";
import displayDataLogo from "@/assets/displaydata-logo.png";

interface SmartStoreLayoutProps {
  children: React.ReactNode;
}

export function SmartStoreLayout({ children }: SmartStoreLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SmartStoreSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-3">
                <img src={smartStoreLogo} alt="DD-SmartStore" className="h-6 w-auto object-contain" />
                <img src={displayDataLogo} alt="DisplayData" className="h-5 w-auto object-contain" />
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
