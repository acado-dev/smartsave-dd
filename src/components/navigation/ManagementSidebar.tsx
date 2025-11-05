import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Heart,
  TrendingDown,
  Users,
  Settings,
  Store,
} from "lucide-react";
import smartSaveLogo from "@/assets/smartsave-logo.png";
import displayDataLogo from "@/assets/displaydata-logo.png";
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

const mainNavItems = [
  { title: "Dashboard", url: "/management", icon: LayoutDashboard },
  { title: "Inventory", url: "/management/inventory", icon: Package },
  { title: "Donations", url: "/management/donations", icon: Heart },
  { title: "Waste Analytics", url: "/management/analytics", icon: TrendingDown },
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
        <div className="flex flex-col gap-3">
          {!collapsed ? (
            <div className="flex items-center justify-center gap-2">
              <img src={smartSaveLogo} alt="SmartSave" className="h-8 w-auto object-contain" />
              <span className="text-sm font-semibold text-sidebar-foreground">SmartSave</span>
              <img src={displayDataLogo} alt="DisplayData" className="h-5 w-auto object-contain" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={smartSaveLogo} alt="SmartSave" className="h-8 w-auto object-contain" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/management"}
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

      <div className="mt-auto border-t border-sidebar-border p-4">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}
