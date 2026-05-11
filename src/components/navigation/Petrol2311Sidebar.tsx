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
import petrolLogo from "@/assets/petrol-logo.svg";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/petrol2311" },
  { title: "Analytics", icon: BarChart3, path: "/petrol2311/analytics" },
  { title: "Inventory", icon: Package, path: "/petrol2311/inventory" },
  { title: "Expiring Items", icon: AlertTriangle, path: "/petrol2311/expiring-items" },
  { title: "Pricing Optimization", icon: Zap, path: "/petrol2311/pricing-optimization" },
  { title: "Waste Tracking", icon: Trash2, path: "/petrol2311/waste-tracking" },
  { title: "Donations", icon: Heart, path: "/petrol2311/donations" },
  { title: "Discounts", icon: Percent, path: "/petrol2311/discounts" },
  { title: "Dynamic Pricing", icon: DollarSign, path: "/petrol2311/dynamic-pricing" },
  { title: "Low Salability", icon: TrendingDown, path: "/petrol2311/low-salability" },
  { title: "Marketplace", icon: Store, path: "/petrol2311/marketplace" },
];

export function Petrol2311Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="[&_[data-sidebar=sidebar]]:bg-[hsl(0,0%,12%)] [&_[data-sidebar=sidebar]]:border-[hsl(0,0%,20%)]">
      <SidebarHeader className="border-b border-[hsl(0,0%,20%)] px-4 py-5 bg-[hsl(357,96%,46%)]">
        <div className="flex flex-col items-center gap-2">
          <img src={petrolLogo} alt="Petrol" className="h-10 w-auto object-contain" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-white tracking-wide uppercase">Station #2311</span>
            <span className="text-[10px] text-white/80">Ljubljana · Celovska 226</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(0,0%,60%)]">Store Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="text-[hsl(0,0%,80%)] hover:bg-[hsl(0,0%,20%)] hover:text-white data-[active=true]:bg-[hsl(357,96%,46%)] data-[active=true]:text-white"
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
