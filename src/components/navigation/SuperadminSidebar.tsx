import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Network,
  Users,
  ShieldCheck,
  Boxes,
  GitBranch,
  ScrollText,
  Crown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const overview = [
  { title: "Platform Dashboard", url: "/superadmin", icon: LayoutDashboard, end: true },
];

const governance = [
  { title: "Tenants", url: "/superadmin/tenants", icon: Building2 },
  { title: "Organization Tree", url: "/superadmin/organization", icon: Network },
  { title: "Users", url: "/superadmin/users", icon: Users },
];

const access = [
  { title: "Roles & Permissions", url: "/superadmin/roles", icon: ShieldCheck },
  { title: "Module Access", url: "/superadmin/modules", icon: Boxes },
  { title: "Guardrails", url: "/superadmin/guardrails", icon: GitBranch },
];

const compliance = [
  { title: "Audit Log", url: "/superadmin/audit", icon: ScrollText },
];

export function SuperadminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string, end = false) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const cls = (active: boolean) =>
    active
      ? "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,75%)] font-medium border-l-2 border-[hsl(217,91%,60%)]"
      : "text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent";

  const renderGroup = (
    label: string,
    items: Array<{ title: string; url: string; icon: any; end?: boolean }>,
  ) => (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 px-3 mt-2">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={(item as any).end}
                  className={cls(isActive(item.url, (item as any).end))}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-white/10`}
      style={{ background: "hsl(222 47% 6%)" }}
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(262,60%,55%)] flex items-center justify-center shrink-0">
            <Crown className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-bold text-white">DD Brain</div>
              <div className="text-[10px] uppercase tracking-wider text-[hsl(217,91%,75%)]">
                Superadmin Console
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent style={{ background: "hsl(222 47% 6%)" }}>
        {renderGroup("Overview", overview)}
        {renderGroup("Governance", governance)}
        {renderGroup("Access Control", access)}
        {renderGroup("Compliance", compliance)}
      </SidebarContent>
    </Sidebar>
  );
}
