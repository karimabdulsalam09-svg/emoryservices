import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import About from "@/components/About";
import WhatWeBuild from "@/components/WhatWeBuild";
import HowItWorks from "@/components/HowItWorks";
import VisualElements from "@/components/VisualElements";
import EconomicMetrics from "@/components/EconomicMetrics";
import SocialProof from "@/components/SocialProof";
import LaunchTimeline from "@/components/LaunchTimeline";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <FeatureCards />
      <About />
      <WhatWeBuild />
      <HowItWorks />
      <VisualElements />
      <EconomicMetrics />
      <SocialProof />
      <LaunchTimeline />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
