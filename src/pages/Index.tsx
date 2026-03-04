import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import WhatEstherBuilds from "@/components/WhatEstherBuilds";
import HowItWorks from "@/components/HowItWorks";
import WhyCreatorsFail from "@/components/WhyCreatorsFail";
import WorkflowDiagram from "@/components/WorkflowDiagram";
import EconomicMetrics from "@/components/EconomicMetrics";
import SocialProof from "@/components/SocialProof";
import LaunchTimeline from "@/components/LaunchTimeline";
import StrategySession from "@/components/StrategySession";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BackgroundGlows from "@/components/BackgroundGlows";
import OwnWebsite from "@/components/OwnWebsite";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <FeatureCards />
        <WhatEstherBuilds />
        <OwnWebsite />
        <HowItWorks />
        <WhyCreatorsFail />
        <WorkflowDiagram />
        <EconomicMetrics />
        <SocialProof />
        <LaunchTimeline />
        <StrategySession />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
