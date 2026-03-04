import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10 pt-32">
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
