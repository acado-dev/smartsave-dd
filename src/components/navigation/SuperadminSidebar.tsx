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
} from "lucide-react";
import ithinaLogo from "@/assets/ithina-logo-white.png";
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
        {collapsed ? (
          <div className="flex justify-center">
            <img src={ithinaLogo} alt="Ithina" className="h-7 w-auto object-contain" />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1.5">
            <img src={ithinaLogo} alt="Ithina" className="h-8 w-auto object-contain" />
            <div className="text-[10px] uppercase tracking-wider text-[hsl(217,91%,75%)]">
              Superadmin Console
            </div>
          </div>
        )}
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
