import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CampaignProvider } from "@/context/CampaignContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreateCampaign from "./pages/CreateCampaign";
import Donation from "./pages/Donation";
import KYCPage from "./pages/KYCPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CampaignProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nft-dashboard" element={<Dashboard />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/donation-flow" element={<Donation />} />
            <Route path="/donation-flow/:campaignId" element={<Donation />} />
            <Route path="/kyc-verification" element={<KYCPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CampaignProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
