import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperadminSidebar } from "@/components/navigation/SuperadminSidebar";
import { Menu, Bell, Search, Crown, Building2, Users, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SuperadminErrorBoundary } from "@/components/superadmin/SuperadminErrorBoundary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";

interface Props {
  children?: React.ReactNode;
}

const personaMeta: Record<string, { label: string; icon: any; color: string }> = {
  platform: { label: "PLATFORM", icon: Crown, color: "hsl(217,91%,60%)" },
  organization: { label: "ORGANIZATION", icon: Building2, color: "hsl(187,70%,42%)" },
  tenant: { label: "TENANT", icon: Users, color: "hsl(262,60%,55%)" },
};

export function SuperadminLayout({ children }: Props) {
  const navigate = useNavigate();
  const { session, signOut } = useSuperadminAuth();
  const meta = personaMeta[session?.persona ?? "platform"];
  const PersonaIcon = meta.icon;

  const initials = session
    ? session.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const scopeLabel = !session
    ? "Ithina · Superadmin Console"
    : session.persona === "platform"
      ? "Ithina · Superadmin Governance Console"
      : `Ithina · ${session.tenantName}${session.persona === "tenant" ? " · " + session.primaryRoleName : " Admin"}`;

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
                  className="gap-1"
                  style={{
                    borderColor: `${meta.color}66`,
                    color: meta.color,
                    background: `${meta.color}1a`,
                  }}
                >
                  <PersonaIcon className="h-3 w-3" />
                  {meta.label}
                </Badge>
                <span className="hidden md:inline text-xs text-slate-400">{scopeLabel}</span>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-white/5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(262,60%,55%)] flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="hidden md:block leading-tight text-left">
                        <div className="text-xs font-medium text-white">{session?.name ?? "—"}</div>
                        <div className="text-[10px] text-slate-400">{session?.primaryRoleName ?? "—"}</div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 min-w-[220px]"
                  >
                    <DropdownMenuLabel className="text-slate-400 text-xs">
                      <div className="text-white">{session?.name}</div>
                      <div className="text-[10px] text-slate-500">{session?.email}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{session?.tenantName}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => {
                        signOut();
                        navigate("/superadmin/login", { replace: true });
                      }}
                      className="cursor-pointer text-[hsl(4,84%,75%)] focus:text-[hsl(4,84%,75%)]"
                    >
                      <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
