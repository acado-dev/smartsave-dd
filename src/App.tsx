import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Features from "./pages/Features";
import Solutions from "./pages/Solutions";
import Benefits from "./pages/Benefits";
import About from "./pages/About";
import { ManagementLayout } from "./components/layouts/ManagementLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { SmartStoreLayout } from "./components/layouts/SmartStoreLayout";
import { ZabkaLayout } from "./components/layouts/ZabkaLayout";
import { ZabkaGroupLayout } from "./components/layouts/ZabkaGroupLayout";
import ZabkaDashboard from "./pages/zabka/Dashboard";
import ZabkaGroupDashboard from "./pages/zabkagroup/Dashboard";
import ZabkaGroupStorePerformance from "./pages/zabkagroup/StorePerformance";
import ZabkaGroupNotifications from "./pages/zabkagroup/Notifications";
import ZabkaGroupStoreManagement from "./pages/zabkagroup/StoreManagement";
import ZabkaInventory from "./pages/zabka/Inventory";
import ZabkaExpiringItems from "./pages/zabka/ExpiringItems";
import ZabkaWasteTracking from "./pages/zabka/WasteTracking";
import ZabkaDonations from "./pages/zabka/Donations";
import ZabkaDiscounts from "./pages/zabka/Discounts";
import ZabkaDynamicPricing from "./pages/zabka/DynamicPricing";
import ZabkaLowSalability from "./pages/zabka/LowSalability";
import ZabkaAnalytics from "./pages/zabka/Analytics";
import ZabkaMarketplace from "./pages/zabka/Marketplace";
import ZabkaPricingOptimization from "./pages/zabka/PricingOptimization";
import AdminHome from "./pages/admin/AdminHome";
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
import AlgorithmSettings from "./pages/management/details/AlgorithmSettings";
import RuleHistory from "./pages/management/details/RuleHistory";
import FreshnessAnalysis from "./pages/management/details/FreshnessAnalysis";
import CameraFeeds from "./pages/management/details/CameraFeeds";
import ESLSolution from "./pages/management/ESLSolution";
import RetailSentry from "./pages/management/details/RetailSentry";
import StoreSentry from "./pages/management/details/StoreSentry";
import FreshnessAnalysisDemo from "./pages/demo/FreshnessAnalysisDemo";
import MediaLibrary from "./pages/admin/advertising/MediaLibrary";
import CampaignCreator from "./pages/admin/advertising/CampaignCreator";
import CMSIntegration from "./pages/admin/advertising/CMSIntegration";
import PlanogramGapDetails from "./pages/admin/planogram/GapDetails";
import PlanogramLocationConfig from "./pages/admin/planogram/LocationConfig";
import SmartStoreDashboard from "./pages/smartstore/Dashboard";
import SmartStoreInventory from "./pages/smartstore/Inventory";
import SmartStoreExpiringItems from "./pages/smartstore/ExpiringItems";
import SmartStoreWasteTracking from "./pages/smartstore/WasteTracking";
import SmartStoreDonations from "./pages/smartstore/Donations";
import SmartStoreDiscounts from "./pages/smartstore/Discounts";
import SmartStoreDynamicPricing from "./pages/smartstore/DynamicPricing";
import SmartStoreLowSalability from "./pages/smartstore/LowSalability";
import SmartStoreAnalytics from "./pages/smartstore/Analytics";
import SmartStoreMarketplace from "./pages/smartstore/Marketplace";
import SmartStorePricingOptimization from "./pages/smartstore/PricingOptimization";
import SmartStorePricingRules from "./pages/smartstore/PricingRules";
import InfomilPresentation from "./pages/InfomilPresentation";
import InfomilStrategicPresentation from "./pages/InfomilStrategicPresentation";
import HandheldLayout from "./pages/handheld/HandheldLayout";
import HandheldHome from "./pages/handheld/HandheldHome";
import HandheldOperations from "./pages/handheld/HandheldOperations";
import HandheldHealth from "./pages/handheld/HandheldHealth";
import HandheldJobs from "./pages/handheld/HandheldJobs";
import HandheldSettings from "./pages/handheld/HandheldSettings";
import HandheldAlerts from "./pages/handheld/HandheldAlerts";
import AssignESL from "./pages/handheld/operations/AssignESL";
import UnassignESL from "./pages/handheld/operations/UnassignESL";
import MultiAssignESL from "./pages/handheld/operations/MultiAssignESL";
import ReplaceESL from "./pages/handheld/operations/ReplaceESL";
import RefreshESL from "./pages/handheld/operations/RefreshESL";
import FlashESL from "./pages/handheld/operations/FlashESL";
import PageChangeESL from "./pages/handheld/operations/PageChangeESL";
import InquireESL from "./pages/handheld/operations/InquireESL";
import AddESL from "./pages/handheld/operations/AddESL";
import DeleteESL from "./pages/handheld/operations/DeleteESL";
import OnlineESLs from "./pages/handheld/status/OnlineESLs";
import OfflineESLs from "./pages/handheld/status/OfflineESLs";
import LowBatteryESLs from "./pages/handheld/status/LowBatteryESLs";
import HHTLightLayout from "./pages/hhtlight/HHTLightLayout";
import HHTLightDashboard from "./pages/hhtlight/HHTLightDashboard";
import HHTLightOperations from "./pages/hhtlight/HHTLightOperations";
import HHTLightSettings from "./pages/hhtlight/HHTLightSettings";
import HHTLightBatteryCritical from "./pages/hhtlight/HHTLightBatteryCritical";
import HHTLightUpdateFailures from "./pages/hhtlight/HHTLightUpdateFailures";
import HHTLightAPStatus from "./pages/hhtlight/HHTLightAPStatus";
import HHTLightOvernightStatus from "./pages/hhtlight/HHTLightOvernightStatus";
import HHTLightAlerts from "./pages/hhtlight/HHTLightAlerts";
import HHTLightAssignESL from "./pages/hhtlight/operations/HHTLightAssignESL";
import HHTLightUnassignESL from "./pages/hhtlight/operations/HHTLightUnassignESL";
import HHTLightMultiAssignESL from "./pages/hhtlight/operations/HHTLightMultiAssignESL";
import HHTLightReplaceESL from "./pages/hhtlight/operations/HHTLightReplaceESL";
import HHTLightRefreshESL from "./pages/hhtlight/operations/HHTLightRefreshESL";
import HHTLightFlashESL from "./pages/hhtlight/operations/HHTLightFlashESL";
import HHTLightPageChangeESL from "./pages/hhtlight/operations/HHTLightPageChangeESL";
import HHTLightInquireESL from "./pages/hhtlight/operations/HHTLightInquireESL";
import HHTLightAddESL from "./pages/hhtlight/operations/HHTLightAddESL";
import HHTLightDeleteESL from "./pages/hhtlight/operations/HHTLightDeleteESL";
import HHTLightOnlineESLs from "./pages/hhtlight/status/HHTLightOnlineESLs";
import HHTLightOfflineESLs from "./pages/hhtlight/status/HHTLightOfflineESLs";
import ITHNCommandLayout from "./pages/ithncommand/ITHNCommandLayout";
import ITHNCommandDashboard from "./pages/ithncommand/ITHNCommandDashboard";
import ITHNCommandOperations from "./pages/ithncommand/ITHNCommandOperations";
import ITHNCommandSettings from "./pages/ithncommand/ITHNCommandSettings";
import ITHNCommandAlerts from "./pages/ithncommand/ITHNCommandAlerts";
import ITHNCommandAssignESL from "./pages/ithncommand/operations/ITHNCommandAssignESL";
import ITHNCommandUnassignESL from "./pages/ithncommand/operations/ITHNCommandUnassignESL";
import ITHNCommandMultiAssignESL from "./pages/ithncommand/operations/ITHNCommandMultiAssignESL";
import ITHNCommandReplaceESL from "./pages/ithncommand/operations/ITHNCommandReplaceESL";
import ITHNCommandRefreshESL from "./pages/ithncommand/operations/ITHNCommandRefreshESL";
import ITHNCommandFlashESL from "./pages/ithncommand/operations/ITHNCommandFlashESL";
import ITHNCommandPageChangeESL from "./pages/ithncommand/operations/ITHNCommandPageChangeESL";
import ITHNCommandInquireESL from "./pages/ithncommand/operations/ITHNCommandInquireESL";
import ITHNCommandAddESL from "./pages/ithncommand/operations/ITHNCommandAddESL";
import ITHNCommandDeleteESL from "./pages/ithncommand/operations/ITHNCommandDeleteESL";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/landing" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
          <Route path="/admin/esl-solution" element={<AdminLayout><ESLSolution /></AdminLayout>} />
          <Route path="/admin/retail-sentry" element={<AdminLayout><RetailSentry /></AdminLayout>} />
          <Route path="/admin/store-sentry" element={<AdminLayout><StoreSentry /></AdminLayout>} />
          <Route path="/admin/planogram-compliance" element={<AdminLayout><PlanogramCompliance /></AdminLayout>} />
          <Route path="/admin/planogram-gaps" element={<AdminLayout><PlanogramGapDetails /></AdminLayout>} />
          <Route path="/admin/planogram-locations" element={<AdminLayout><PlanogramLocationConfig /></AdminLayout>} />
          <Route path="/admin/camera-feeds" element={<AdminLayout><CameraFeeds /></AdminLayout>} />
          <Route path="/admin/media-management" element={<AdminLayout><MediaManagement /></AdminLayout>} />
          <Route path="/admin/display-management" element={<AdminLayout><DisplayManagement /></AdminLayout>} />
          <Route path="/admin/content-scheduler" element={<AdminLayout><ContentScheduler /></AdminLayout>} />
          <Route path="/admin/media-library" element={<AdminLayout><MediaLibrary /></AdminLayout>} />
          <Route path="/admin/campaign-creator" element={<AdminLayout><CampaignCreator /></AdminLayout>} />
          <Route path="/admin/cms-integration" element={<AdminLayout><CMSIntegration /></AdminLayout>} />
          <Route path="/admin/dynamic-pricing" element={<AdminLayout><DynamicPricing /></AdminLayout>} />
          <Route path="/admin/pricing-rules" element={<AdminLayout><PricingRules /></AdminLayout>} />
          <Route path="/admin/algorithm-settings" element={<AdminLayout><AlgorithmSettings /></AdminLayout>} />
          <Route path="/admin/freshness-analysis" element={<AdminLayout><FreshnessAnalysis /></AdminLayout>} />
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
          <Route path="/management/dynamic-pricing" element={<ManagementLayout><DynamicPricing /></ManagementLayout>} />
          <Route path="/management/details/pricing-rules" element={<ManagementLayout><PricingRules /></ManagementLayout>} />
          <Route path="/management/details/algorithm-settings" element={<ManagementLayout><AlgorithmSettings /></ManagementLayout>} />
          <Route path="/management/details/rule-history" element={<ManagementLayout><RuleHistory /></ManagementLayout>} />
          
          {/* Zabka Routes */}
          <Route path="/zabka" element={<ZabkaLayout><ZabkaDashboard /></ZabkaLayout>} />
          <Route path="/zabka/inventory" element={<ZabkaLayout><ZabkaInventory /></ZabkaLayout>} />
          <Route path="/zabka/expiring-items" element={<ZabkaLayout><ZabkaExpiringItems /></ZabkaLayout>} />
          <Route path="/zabka/waste-tracking" element={<ZabkaLayout><ZabkaWasteTracking /></ZabkaLayout>} />
          <Route path="/zabka/donations" element={<ZabkaLayout><ZabkaDonations /></ZabkaLayout>} />
          <Route path="/zabka/discounts" element={<ZabkaLayout><ZabkaDiscounts /></ZabkaLayout>} />
          <Route path="/zabka/dynamic-pricing" element={<ZabkaLayout><ZabkaDynamicPricing /></ZabkaLayout>} />
          <Route path="/zabka/low-salability" element={<ZabkaLayout><ZabkaLowSalability /></ZabkaLayout>} />
          <Route path="/zabka/analytics" element={<ZabkaLayout><ZabkaAnalytics /></ZabkaLayout>} />
          <Route path="/zabka/marketplace" element={<ZabkaLayout><ZabkaMarketplace /></ZabkaLayout>} />
          <Route path="/zabka/pricing-optimization" element={<ZabkaLayout><ZabkaPricingOptimization /></ZabkaLayout>} />
          
          {/* Zabka Group Routes */}
          <Route path="/zabkagroup" element={<ZabkaGroupLayout><ZabkaGroupDashboard /></ZabkaGroupLayout>} />
          <Route path="/zabkagroup/performance" element={<ZabkaGroupLayout><ZabkaGroupStorePerformance /></ZabkaGroupLayout>} />
          <Route path="/zabkagroup/notifications" element={<ZabkaGroupLayout><ZabkaGroupNotifications /></ZabkaGroupLayout>} />
          <Route path="/zabkagroup/stores" element={<ZabkaGroupLayout><ZabkaGroupStoreManagement /></ZabkaGroupLayout>} />
          
          {/* SmartStore Routes */}
          <Route path="/smartstore" element={<SmartStoreLayout><SmartStoreDashboard /></SmartStoreLayout>} />
          <Route path="/smartstore/inventory" element={<SmartStoreLayout><SmartStoreInventory /></SmartStoreLayout>} />
          <Route path="/smartstore/expiring-items" element={<SmartStoreLayout><SmartStoreExpiringItems /></SmartStoreLayout>} />
          <Route path="/smartstore/waste-tracking" element={<SmartStoreLayout><SmartStoreWasteTracking /></SmartStoreLayout>} />
          <Route path="/smartstore/donations" element={<SmartStoreLayout><SmartStoreDonations /></SmartStoreLayout>} />
          <Route path="/smartstore/discounts" element={<SmartStoreLayout><SmartStoreDiscounts /></SmartStoreLayout>} />
          <Route path="/smartstore/dynamic-pricing" element={<SmartStoreLayout><SmartStoreDynamicPricing /></SmartStoreLayout>} />
          <Route path="/smartstore/low-salability" element={<SmartStoreLayout><SmartStoreLowSalability /></SmartStoreLayout>} />
          <Route path="/smartstore/analytics" element={<SmartStoreLayout><SmartStoreAnalytics /></SmartStoreLayout>} />
          <Route path="/smartstore/marketplace" element={<SmartStoreLayout><SmartStoreMarketplace /></SmartStoreLayout>} />
          <Route path="/smartstore/pricing-optimization" element={<SmartStoreLayout><SmartStorePricingOptimization /></SmartStoreLayout>} />
          <Route path="/smartstore/pricing-rules" element={<SmartStoreLayout><SmartStorePricingRules /></SmartStoreLayout>} />
          
          {/* Demo Routes */}
          <Route path="/demo/freshness-analysis" element={<FreshnessAnalysisDemo />} />
          
          {/* Presentation Routes */}
          <Route path="/presentation/infomil" element={<InfomilPresentation />} />
          <Route path="/presentation/infomil-strategic" element={<InfomilStrategicPresentation />} />
          
          {/* Handheld HHT App Routes */}
          <Route path="/handheld" element={<HandheldLayout />}>
            <Route index element={<HandheldHome />} />
            <Route path="operations" element={<HandheldOperations />} />
            <Route path="operations/assign" element={<AssignESL />} />
            <Route path="operations/unassign" element={<UnassignESL />} />
            <Route path="operations/multi-assign" element={<MultiAssignESL />} />
            <Route path="operations/replace" element={<ReplaceESL />} />
            <Route path="operations/refresh" element={<RefreshESL />} />
            <Route path="operations/flash" element={<FlashESL />} />
            <Route path="operations/page-change" element={<PageChangeESL />} />
            <Route path="operations/inquire" element={<InquireESL />} />
            <Route path="operations/add" element={<AddESL />} />
            <Route path="operations/delete" element={<DeleteESL />} />
            <Route path="status/online" element={<OnlineESLs />} />
            <Route path="status/offline" element={<OfflineESLs />} />
            <Route path="status/low-battery" element={<LowBatteryESLs />} />
            <Route path="health" element={<HandheldHealth />} />
            <Route path="jobs" element={<HandheldJobs />} />
            <Route path="settings" element={<HandheldSettings />} />
            <Route path="alerts" element={<HandheldAlerts />} />
          </Route>
          
          {/* HHT Light App Routes */}
          <Route path="/HHTLight" element={<HHTLightLayout />}>
            <Route index element={<HHTLightDashboard />} />
            <Route path="operations" element={<HHTLightOperations />} />
            <Route path="operations/assign" element={<HHTLightAssignESL />} />
            <Route path="operations/unassign" element={<HHTLightUnassignESL />} />
            <Route path="operations/multi-assign" element={<HHTLightMultiAssignESL />} />
            <Route path="operations/replace" element={<HHTLightReplaceESL />} />
            <Route path="operations/refresh" element={<HHTLightRefreshESL />} />
            <Route path="operations/flash" element={<HHTLightFlashESL />} />
            <Route path="operations/page-change" element={<HHTLightPageChangeESL />} />
            <Route path="operations/inquire" element={<HHTLightInquireESL />} />
            <Route path="operations/add" element={<HHTLightAddESL />} />
            <Route path="operations/delete" element={<HHTLightDeleteESL />} />
            <Route path="alerts" element={<HHTLightAlerts />} />
            <Route path="settings" element={<HHTLightSettings />} />
            <Route path="battery-critical" element={<HHTLightBatteryCritical />} />
            <Route path="update-failures" element={<HHTLightUpdateFailures />} />
            <Route path="ap-status" element={<HHTLightAPStatus />} />
            <Route path="overnight-status" element={<HHTLightOvernightStatus />} />
            <Route path="status/online" element={<HHTLightOnlineESLs />} />
            <Route path="status/offline" element={<HHTLightOfflineESLs />} />
          </Route>
          
{/* ITHN Command App Routes - Compact HHT for 3.2"-7" screens */}
          <Route path="/ITHNCommand" element={<ITHNCommandLayout />}>
            <Route index element={<ITHNCommandDashboard />} />
            <Route path="operations" element={<ITHNCommandOperations />} />
            <Route path="operations/assign" element={<ITHNCommandAssignESL />} />
            <Route path="operations/unassign" element={<ITHNCommandUnassignESL />} />
            <Route path="operations/multi-assign" element={<ITHNCommandMultiAssignESL />} />
            <Route path="operations/replace" element={<ITHNCommandReplaceESL />} />
            <Route path="operations/refresh" element={<ITHNCommandRefreshESL />} />
            <Route path="operations/flash" element={<ITHNCommandFlashESL />} />
            <Route path="operations/page-change" element={<ITHNCommandPageChangeESL />} />
            <Route path="operations/inquire" element={<ITHNCommandInquireESL />} />
            <Route path="operations/add" element={<ITHNCommandAddESL />} />
            <Route path="operations/delete" element={<ITHNCommandDeleteESL />} />
            <Route path="alerts" element={<ITHNCommandAlerts />} />
            <Route path="settings" element={<ITHNCommandSettings />} />
            <Route path="battery-critical" element={<HHTLightBatteryCritical />} />
            <Route path="update-failures" element={<HHTLightUpdateFailures />} />
            <Route path="ap-status" element={<HHTLightAPStatus />} />
            <Route path="overnight-status" element={<HHTLightOvernightStatus />} />
            <Route path="status/online" element={<HHTLightOnlineESLs />} />
            <Route path="status/offline" element={<HHTLightOfflineESLs />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
