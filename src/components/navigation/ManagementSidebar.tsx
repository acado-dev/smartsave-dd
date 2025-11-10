import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Heart,
  Users,
  Settings,
  Store,
  Clock,
  Tag,
  Trash2,
  Archive,
  BarChart3,
  Home,
  Grid3x3,
  Monitor,
  TrendingUp,
  Radio,
  Shield,
  Eye,
} from "lucide-react";
import buceesLogo from "@/assets/bucees-logo.webp";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const homeNavItem = { title: "Home", url: "/management", icon: Home };

const perishableWasteItems = [
  { title: "Dashboard", url: "/management/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/management/analytics", icon: BarChart3 },
  { title: "Inventory", url: "/management/inventory", icon: Package },
  { title: "Expiring Items", url: "/management/expiring-items", icon: Clock },
  { title: "Discounts", url: "/management/discounts", icon: Tag },
  { title: "Donations", url: "/management/donations", icon: Heart },
  { title: "Low Salability", url: "/management/low-salability", icon: Archive },
  { title: "Waste Tracking", url: "/management/waste-tracking", icon: Trash2 },
];

const eslDisplayItems = [
  { title: "Overview", url: "/management/planogram-compliance", icon: Grid3x3 },
];

const digitalSignageItems = [
  { title: "Overview", url: "/management/media-management", icon: Monitor },
];

const dynamicPricingItems = [
  { title: "Overview", url: "/management/dynamic-pricing", icon: TrendingUp },
];

const eslSolutionItems = [
  { title: "Overview", url: "/management/esl-solution", icon: Radio },
  { title: "Retail Sentry", url: "/management/details/retail-sentry", icon: Shield },
  { title: "Store Sentry", url: "/management/details/store-sentry", icon: Eye },
];

const adminNavItems = [
  { title: "Staff", url: "/management/staff", icon: Users },
  { title: "Stores", url: "/management/stores", icon: Store },
  { title: "Settings", url: "/management/settings", icon: Settings },
];

export function ManagementSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/management") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex flex-col items-center gap-2">
          <img src={buceesLogo} alt="BUC-EE'S" className="h-12 w-auto object-contain" />
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">BUC-EE'S</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={homeNavItem.url}
                    end
                    className={getNavCls(isActive(homeNavItem.url))}
                  >
                    <homeNavItem.icon className="h-4 w-4" />
                    {!collapsed && <span>{homeNavItem.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Perishable Waste Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {perishableWasteItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Planogram Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eslDisplayItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>In-Store Advertising</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {digitalSignageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dynamic Pricing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dynamicPricingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>ESL Solution</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eslSolutionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
