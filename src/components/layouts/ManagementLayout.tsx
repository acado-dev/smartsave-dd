import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ManagementSidebar } from "@/components/navigation/ManagementSidebar";
import { Menu } from "lucide-react";

interface ManagementLayoutProps {
  children: React.ReactNode;
}

export function ManagementLayout({ children }: ManagementLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ManagementSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center px-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
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
