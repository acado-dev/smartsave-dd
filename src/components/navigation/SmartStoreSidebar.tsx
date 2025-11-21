import { Home, Package, AlertTriangle, Trash2, Heart, Percent, DollarSign, BarChart3, TrendingDown, Store } from "lucide-react";
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
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/smartstore" },
  { title: "Inventory", icon: Package, path: "/smartstore/inventory" },
  { title: "Expiring Items", icon: AlertTriangle, path: "/smartstore/expiring-items" },
  { title: "Waste Tracking", icon: Trash2, path: "/smartstore/waste-tracking" },
  { title: "Donations", icon: Heart, path: "/smartstore/donations" },
  { title: "Discounts", icon: Percent, path: "/smartstore/discounts" },
  { title: "Dynamic Pricing", icon: DollarSign, path: "/smartstore/dynamic-pricing" },
  { title: "Low Salability", icon: TrendingDown, path: "/smartstore/low-salability" },
  { title: "Analytics", icon: BarChart3, path: "/smartstore/analytics" },
  { title: "Marketplace", icon: Store, path: "/smartstore/marketplace" },
];

export function SmartStoreSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SmartStore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
