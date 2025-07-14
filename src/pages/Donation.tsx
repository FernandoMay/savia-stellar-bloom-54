import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CampaignsSection } from "@/components/CampaignsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Footer } from "@/components/Footer";
import StellarNFTDashboard from "@/components/NFTDashboard";
import { DonationFlow } from "@/components/DonationFlow";

const Donation = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <DonationFlow/>
      <Footer />
    </div>
  );
};

export default Donation;
