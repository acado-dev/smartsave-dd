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
  PackageSearch,
  CreditCard,
} from "lucide-react";
import ithinaLogoWhite from "@/assets/ithina-logo-white.png";
import ithinaLogoDark from "@/assets/ithina-logo.png";
import { useSuperadminTheme } from "@/contexts/SuperadminThemeContext";
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
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { canAccess } from "@/lib/superadminScope";

type Item = { title: string; url: string; icon: any; end?: boolean; section: Parameters<typeof canAccess>[0] };

const overview: Item[] = [
  { title: "Workspace Dashboard", url: "/superadmin", icon: LayoutDashboard, end: true, section: "dashboard" },
];

const governance: Item[] = [
  { title: "Tenants", url: "/superadmin/tenants", icon: Building2, section: "tenants" },
  { title: "Organization Tree", url: "/superadmin/organization", icon: Network, section: "organization" },
  { title: "Users", url: "/superadmin/users", icon: Users, section: "users" },
];

const commercial: Item[] = [
  { title: "Partner Master", url: "/superadmin/partners", icon: Building2, section: "partners" },
  { title: "Product Configuration", url: "/superadmin/products", icon: PackageSearch, section: "products" },
  { title: "Subscriptions", url: "/superadmin/subscriptions", icon: CreditCard, section: "subscriptions" },
];

const access: Item[] = [
  { title: "Roles & Permissions", url: "/superadmin/roles", icon: ShieldCheck, section: "roles" },
  { title: "Module Access", url: "/superadmin/modules", icon: Boxes, section: "modules" },
  { title: "Guardrails", url: "/superadmin/guardrails", icon: GitBranch, section: "guardrails" },
];

const compliance: Item[] = [
  { title: "Audit Log", url: "/superadmin/audit", icon: ScrollText, section: "audit" },
];

export function SuperadminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const { session } = useSuperadminAuth();
  const { theme } = useSuperadminTheme();
  const ithinaLogo = theme === "light" ? ithinaLogoDark : ithinaLogoWhite;
  const persona = session?.persona;

  const isActive = (path: string, end = false) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const cls = (active: boolean) =>
    active
      ? "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,75%)] font-medium border-l-2 border-[hsl(217,91%,60%)]"
      : "text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent";

  const renderGroup = (label: string, items: Item[]) => {
    const allowed = items.filter((i) => canAccess(i.section, persona));
    if (allowed.length === 0) return null;
    return (
      <SidebarGroup>
        {!collapsed && (
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 px-3 mt-2">
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {allowed.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.end}
                    className={cls(isActive(item.url, item.end))}
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
  };

  const personaLabel =
    persona === "platform" ? "Superadmin Console"
    : persona === "organization" ? "Organization Console"
    : persona === "tenant" ? "Tenant Console"
    : "Superadmin Console";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-white/10`}
      style={{ background: "var(--sa-bg-deep)" }}
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
              {personaLabel}
            </div>
            {session && session.persona !== "platform" && (
              <div className="text-[10px] text-slate-400 truncate max-w-full">{session.tenantName}</div>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent style={{ background: "var(--sa-bg-deep)" }}>
        {renderGroup("Overview", overview)}
        {renderGroup("Governance", governance)}
        {renderGroup("Commercial", commercial)}
        {renderGroup("Access Control", access)}
        {renderGroup("Compliance", compliance)}
      </SidebarContent>
    </Sidebar>
  );
}

