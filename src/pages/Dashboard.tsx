import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CampaignsSection } from "@/components/CampaignsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Footer } from "@/components/Footer";
import StellarNFTDashboard from "@/components/NFTDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <StellarNFTDashboard/>
      <Footer />
    </div>
  );
};

export default Dashboard;
