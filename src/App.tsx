import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ManagementLayout } from "./components/layouts/ManagementLayout";
import Dashboard from "./pages/management/Dashboard";
import Inventory from "./pages/management/Inventory";
import ExpiringItems from "./pages/management/ExpiringItems";
import WasteTracking from "./pages/management/WasteTracking";
import Discounts from "./pages/management/Discounts";
import Donations from "./pages/management/Donations";
import LowSalability from "./pages/management/LowSalability";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/management" element={<ManagementLayout><Dashboard /></ManagementLayout>} />
          <Route path="/management/inventory" element={<ManagementLayout><Inventory /></ManagementLayout>} />
          <Route path="/management/expiring-items" element={<ManagementLayout><ExpiringItems /></ManagementLayout>} />
          <Route path="/management/waste-tracking" element={<ManagementLayout><WasteTracking /></ManagementLayout>} />
          <Route path="/management/discounts" element={<ManagementLayout><Discounts /></ManagementLayout>} />
          <Route path="/management/donations" element={<ManagementLayout><Donations /></ManagementLayout>} />
          <Route path="/management/low-salability" element={<ManagementLayout><LowSalability /></ManagementLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
