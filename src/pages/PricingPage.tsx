import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10 pt-32">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
