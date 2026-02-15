import { Home, Package, AlertTriangle, Trash2, Heart, Percent, DollarSign, BarChart3, TrendingDown, Store, Zap } from "lucide-react";
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
import ithinaLogo from "@/assets/ithina-logo.png";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/smartstore" },
  { title: "Inventory", icon: Package, path: "/smartstore/inventory" },
  { title: "Expiring Items", icon: AlertTriangle, path: "/smartstore/expiring-items" },
  { title: "Pricing Optimization", icon: Zap, path: "/smartstore/pricing-optimization" },
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
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={ithinaLogo} alt="Ithina" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">ITHINA</span>
            <span className="text-xs text-muted-foreground">Perishable Waste Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
