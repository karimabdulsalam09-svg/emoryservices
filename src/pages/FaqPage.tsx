import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10 pt-32">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default FaqPage;
