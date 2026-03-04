import Navbar from "@/components/Navbar";
import MonetisationGameplan from "@/components/MonetisationGameplan";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";

const MonetisationGameplanPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10 pt-32">
        <MonetisationGameplan />
      </div>
      <Footer />
    </div>
  );
};

export default MonetisationGameplanPage;
