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
import zabkaLogo from "@/assets/zabka-logo-new.png";

const menuItems = [
  { title: "Group Dashboard", icon: Home, path: "/zabka", group: "group" },
  { title: "Store Analytics", icon: BarChart3, path: "/zabka/analytics", group: "store" },
  { title: "Inventory", icon: Package, path: "/zabka/inventory", group: "store" },
  { title: "Expiring Items", icon: AlertTriangle, path: "/zabka/expiring-items", group: "store" },
  { title: "Pricing Optimization", icon: Zap, path: "/zabka/pricing-optimization", group: "store" },
  { title: "Waste Tracking", icon: Trash2, path: "/zabka/waste-tracking", group: "store" },
  { title: "Donations", icon: Heart, path: "/zabka/donations", group: "store" },
  { title: "Discounts", icon: Percent, path: "/zabka/discounts", group: "store" },
  { title: "Dynamic Pricing", icon: DollarSign, path: "/zabka/dynamic-pricing", group: "store" },
  { title: "Low Salability", icon: TrendingDown, path: "/zabka/low-salability", group: "store" },
  { title: "Marketplace", icon: Store, path: "/zabka/marketplace", group: "store" },
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
            <span className="text-xs text-[hsl(152,30%,70%)]">Perishable Waste Management</span>
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
