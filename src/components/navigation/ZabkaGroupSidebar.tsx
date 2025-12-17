import { Building2, BarChart3, Bell, Store, Users, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import zabkaLogo from "@/assets/zabka-logo-new.png";

const menuItems = [
  { title: "Group Dashboard", icon: Building2, path: "/zabkagroup" },
  { title: "Store Performance", icon: BarChart3, path: "/zabkagroup/performance" },
  { title: "Notifications", icon: Bell, path: "/zabkagroup/notifications" },
  { title: "Store Management", icon: Store, path: "/zabkagroup/stores" },
];

export function ZabkaGroupSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="[&_[data-sidebar=sidebar]]:bg-[hsl(152,60%,12%)] [&_[data-sidebar=sidebar]]:border-[hsl(152,50%,20%)]">
      <SidebarHeader className="border-b border-[hsl(152,50%,20%)] px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={zabkaLogo} alt="Żabka" className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Żabka Group</span>
            <span className="text-xs text-[hsl(152,30%,60%)]">Multi-Store Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(152,30%,55%)]">Group Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="text-[hsl(152,20%,75%)] hover:bg-[hsl(152,50%,20%)] hover:text-white data-[active=true]:bg-[hsl(152,50%,25%)] data-[active=true]:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(152,30%,55%)]">Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/zabka")}
                  tooltip="Single Store View"
                  className="text-[hsl(152,20%,75%)] hover:bg-[hsl(152,50%,20%)] hover:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span>Store Operations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}