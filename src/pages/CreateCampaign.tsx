import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CampaignsSection } from "@/components/CampaignsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Footer } from "@/components/Footer";
import StellarNFTDashboard from "@/components/NFTDashboard";
import { KYCVerification } from "@/components/KYCVerification";

const CreateCampaign = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <KYCVerification/>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
