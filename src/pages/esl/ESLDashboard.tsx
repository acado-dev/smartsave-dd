import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Building2, LayoutGrid, Store, Leaf } from "lucide-react";
import SeniorManagementView from "./views/SeniorManagementView";
import SupportView from "./views/SupportView";
import MarketingView from "./views/MarketingView";
import MerchandisingView from "./views/MerchandisingView";
import StoreOpsView from "./views/StoreOpsView";
import ithinaLogoWhite from "@/assets/ithina-logo-white.png";

const roleNames: Record<string, string> = {
  "senior-management": "Senior Management",
  "support": "IT Support",
  "marketing": "Marketing Team",
  "merchandising": "Merchandising Team",
  "store-ops": "Store Operations",
};

export default function ESLDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("eslRole");
    if (!savedRole) {
      navigate("/esl/login");
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("eslRole");
    navigate("/esl/login");
  };

  const handleSwitchRole = () => {
    navigate("/esl/login");
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-secondary/20 bg-secondary">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={ithinaLogoWhite} alt="ITHINA" className="h-10 w-auto object-contain" />
            <div className="h-6 w-px bg-primary-foreground/30" />
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">ITHINA Command</h1>
              <p className="text-xs text-primary-foreground/60">Powered by Displaydata</p>
            </div>
            <div className="ml-4 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              {roleNames[role]}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Navigation Buttons */}
            <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/esl/operations")}>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Operations
            </Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/esl/multi-store")}>
              <Building2 className="h-4 w-4 mr-2" />
              Multi-Store
            </Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/esl/store/001")}>
              <Store className="h-4 w-4 mr-2" />
              Store View
            </Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.location.href = "http://localhost:8080/freshness/analysis"}>
              <Leaf className="h-4 w-4 mr-2" />
              Freshness Analysis
            </Button>
            <div className="h-6 w-px bg-primary-foreground/30" />
            <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={handleSwitchRole}>
              Switch Role
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {role === "senior-management" && <SeniorManagementView />}
        {role === "support" && <SupportView />}
        {role === "marketing" && <MarketingView />}
        {role === "merchandising" && <MerchandisingView />}
        {role === "store-ops" && <StoreOpsView />}
      </main>
    </div>
  );
}
