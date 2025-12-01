import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import WhatOptimaBuilds from "@/components/WhatOptimaBuilds";
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
import CountdownBonus from "@/components/CountdownBonus";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <div className="relative z-10">
        <Hero />
        <FeatureCards />
        <WhatOptimaBuilds />
        <About />
        <HowItWorks />
        <WhyCreatorsFail />
        <WhatHappensOnCall />
        <VisualElements />
        <EconomicMetrics />
        <SocialProof />
        <PricingTransparency />
        <LaunchTimeline />
        
        {/* Countdown Bonus Reminder Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="elite-card rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient-red-orange mb-4">
                  Don't Miss Your Exclusive Bonus
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Book within the countdown to unlock exclusive bonuses
                </p>
              </div>
              <CountdownBonus />
            </div>
          </div>
        </section>
        
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
