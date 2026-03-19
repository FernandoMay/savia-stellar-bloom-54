import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";

const CreateCampaign = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CreateCampaignForm />
      <Footer />
    </div>
  );
};

export default CreateCampaign;
