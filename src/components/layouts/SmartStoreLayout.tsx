import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartStoreSidebar } from "@/components/navigation/SmartStoreSidebar";
import { Menu, Store, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-foreground">SmartStore</span>
                  <span className="text-xs text-primary-foreground/60">— Downtown Branch</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                      <Store className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
