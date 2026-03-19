import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { KYCVerification } from "@/components/KYCVerification";

const KYCPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <KYCVerification />
      <Footer />
    </div>
  );
};

export default KYCPage;
