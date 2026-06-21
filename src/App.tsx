import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { CampaignProvider } from "@/context/CampaignContext";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateCampaign = lazy(() => import("./pages/CreateCampaign"));
const Donation = lazy(() => import("./pages/Donation"));
const KYCPage = lazy(() => import("./pages/KYCPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <CampaignProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-2xl font-bold text-primary">Savia</div></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/nft-dashboard" element={<Dashboard />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/donation-flow" element={<Donation />} />
                <Route path="/donation-flow/:campaignId" element={<Donation />} />
                <Route path="/kyc-verification" element={<KYCPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CampaignProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
