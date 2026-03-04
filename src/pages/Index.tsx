import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import WhatEstherBuilds from "@/components/WhatEstherBuilds";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import WhyCreatorsFail from "@/components/WhyCreatorsFail";
import WhatHappensOnCall from "@/components/WhatHappensOnCall";
import VisualElements from "@/components/VisualElements";
import EconomicMetrics from "@/components/EconomicMetrics";
import SocialProof from "@/components/SocialProof";
import PricingTransparency from "@/components/PricingTransparency";
import LaunchTimeline from "@/components/LaunchTimeline";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";
import OwnWebsite from "@/components/OwnWebsite";
import MonetizationGameplan from "@/components/MonetizationGameplan";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <div className="relative z-10">
        <Hero />
        <FeatureCards />
        <WhatEstherBuilds />
        <OwnWebsite />
        <About />
        <HowItWorks />
        <WhyCreatorsFail />
        <WhatHappensOnCall />
        <VisualElements />
        <EconomicMetrics />
        <SocialProof />
        <PricingTransparency />
        <LaunchTimeline />
        <MonetizationGameplan />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
