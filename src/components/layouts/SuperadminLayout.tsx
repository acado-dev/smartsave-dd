import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperadminSidebar } from "@/components/navigation/SuperadminSidebar";
import { Menu, Bell, Search, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SuperadminErrorBoundary } from "@/components/superadmin/SuperadminErrorBoundary";

interface Props {
  children?: React.ReactNode;
}

export function SuperadminLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full" style={{ background: "hsl(222 47% 9%)" }}>
        <SuperadminSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header
            className="sticky top-0 z-10 h-14 border-b border-white/10"
            style={{ background: "hsl(222 47% 8%)" }}
          >
            <div className="flex h-full items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger>
                  <Menu className="h-5 w-5 text-slate-300" />
                </SidebarTrigger>
                <Badge
                  variant="outline"
                  className="border-[hsl(217,91%,60%)]/40 text-[hsl(217,91%,75%)] bg-[hsl(217,91%,60%)]/10 gap-1"
                >
                  <Crown className="h-3 w-3" />
                  PLATFORM
                </Badge>
                <span className="hidden md:inline text-xs text-slate-400">
                  Ithina · DD Brain Governance Console
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search tenants, users, roles…"
                    className="pl-9 h-9 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg hover:bg-white/5">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[hsl(4,84%,55%)]" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(262,60%,55%)] flex items-center justify-center text-xs font-bold text-white">
                    AM
                  </div>
                  <div className="hidden md:block leading-tight">
                    <div className="text-xs font-medium text-white">Anjali Mehta</div>
                    <div className="text-[10px] text-slate-400">Super Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 text-slate-200">
            <SuperadminErrorBoundary>{children ?? <Outlet />}</SuperadminErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
