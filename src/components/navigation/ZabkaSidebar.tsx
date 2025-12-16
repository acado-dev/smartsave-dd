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
import zabkaLogo from "@/assets/zabka-logo.png";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/zabka" },
  { title: "Inventory", icon: Package, path: "/zabka/inventory" },
  { title: "Expiring Items", icon: AlertTriangle, path: "/zabka/expiring-items" },
  { title: "Pricing Optimization", icon: Zap, path: "/zabka/pricing-optimization" },
  { title: "Waste Tracking", icon: Trash2, path: "/zabka/waste-tracking" },
  { title: "Donations", icon: Heart, path: "/zabka/donations" },
  { title: "Discounts", icon: Percent, path: "/zabka/discounts" },
  { title: "Dynamic Pricing", icon: DollarSign, path: "/zabka/dynamic-pricing" },
  { title: "Low Salability", icon: TrendingDown, path: "/zabka/low-salability" },
  { title: "Analytics", icon: BarChart3, path: "/zabka/analytics" },
  { title: "Marketplace", icon: Store, path: "/zabka/marketplace" },
];

export function ZabkaSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="[&_[data-sidebar=sidebar]]:bg-[hsl(152,60%,18%)] [&_[data-sidebar=sidebar]]:border-[hsl(152,50%,25%)]">
      <SidebarHeader className="border-b border-[hsl(152,50%,25%)] px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={zabkaLogo} alt="Żabka" className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Żabka</span>
            <span className="text-xs text-[hsl(152,30%,70%)]">Convenience Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(152,30%,60%)]">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="text-[hsl(152,20%,80%)] hover:bg-[hsl(152,50%,25%)] hover:text-white data-[active=true]:bg-[hsl(152,50%,30%)] data-[active=true]:text-white"
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
