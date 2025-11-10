import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import { ManagementLayout } from "./components/layouts/ManagementLayout";
import Home from "./pages/management/Home";
import Dashboard from "./pages/management/Dashboard";
import Analytics from "./pages/management/Analytics";
import Inventory from "./pages/management/Inventory";
import ExpiringItems from "./pages/management/ExpiringItems";
import WasteTracking from "./pages/management/WasteTracking";
import Discounts from "./pages/management/Discounts";
import Donations from "./pages/management/Donations";
import LowSalability from "./pages/management/LowSalability";
import PlanogramCompliance from "./pages/management/PlanogramCompliance";
import MediaManagement from "./pages/management/MediaManagement";
import DynamicPricing from "./pages/management/DynamicPricing";
import ESLLogin from "./pages/esl/ESLLogin";
import ESLDashboard from "./pages/esl/ESLDashboard";
import RevenueDetails from "./pages/esl/details/RevenueDetails";
import SystemHealthDetails from "./pages/esl/details/SystemHealthDetails";
import CampaignsDetails from "./pages/esl/details/CampaignsDetails";
import ComplianceDetails from "./pages/esl/details/ComplianceDetails";
import StoreOpsDetails from "./pages/esl/details/StoreOpsDetails";
import DisplayManagement from "./pages/management/details/DisplayManagement";
import ContentScheduler from "./pages/management/details/ContentScheduler";
import PricingRules from "./pages/management/details/PricingRules";
import CameraFeeds from "./pages/management/details/CameraFeeds";
import ESLSolution from "./pages/management/ESLSolution";
import RetailSentry from "./pages/management/details/RetailSentry";
import StoreSentry from "./pages/management/details/StoreSentry";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/esl/login" element={<ESLLogin />} />
          <Route path="/esl/dashboard" element={<ESLDashboard />} />
          <Route path="/esl/details/revenue" element={<RevenueDetails />} />
          <Route path="/esl/details/system-health" element={<SystemHealthDetails />} />
          <Route path="/esl/details/campaigns" element={<CampaignsDetails />} />
          <Route path="/esl/details/compliance" element={<ComplianceDetails />} />
          <Route path="/esl/details/store-operations" element={<StoreOpsDetails />} />
          <Route path="/management" element={<ManagementLayout><Home /></ManagementLayout>} />
          <Route path="/management/dashboard" element={<ManagementLayout><Dashboard /></ManagementLayout>} />
          <Route path="/management/analytics" element={<ManagementLayout><Analytics /></ManagementLayout>} />
          <Route path="/management/inventory" element={<ManagementLayout><Inventory /></ManagementLayout>} />
          <Route path="/management/expiring-items" element={<ManagementLayout><ExpiringItems /></ManagementLayout>} />
          <Route path="/management/waste-tracking" element={<ManagementLayout><WasteTracking /></ManagementLayout>} />
          <Route path="/management/discounts" element={<ManagementLayout><Discounts /></ManagementLayout>} />
          <Route path="/management/donations" element={<ManagementLayout><Donations /></ManagementLayout>} />
          <Route path="/management/low-salability" element={<ManagementLayout><LowSalability /></ManagementLayout>} />
          <Route path="/management/planogram-compliance" element={<ManagementLayout><PlanogramCompliance /></ManagementLayout>} />
          <Route path="/management/media-management" element={<ManagementLayout><MediaManagement /></ManagementLayout>} />
          <Route path="/management/dynamic-pricing" element={<ManagementLayout><DynamicPricing /></ManagementLayout>} />
          <Route path="/management/details/display-management" element={<ManagementLayout><DisplayManagement /></ManagementLayout>} />
          <Route path="/management/details/content-scheduler" element={<ManagementLayout><ContentScheduler /></ManagementLayout>} />
          <Route path="/management/details/pricing-rules" element={<ManagementLayout><PricingRules /></ManagementLayout>} />
          <Route path="/management/details/camera-feeds" element={<ManagementLayout><CameraFeeds /></ManagementLayout>} />
          <Route path="/management/esl-solution" element={<ManagementLayout><ESLSolution /></ManagementLayout>} />
          <Route path="/management/details/retail-sentry" element={<ManagementLayout><RetailSentry /></ManagementLayout>} />
          <Route path="/management/details/store-sentry" element={<ManagementLayout><StoreSentry /></ManagementLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
