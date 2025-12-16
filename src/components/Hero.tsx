import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import CountdownBonus from "./CountdownBonus";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Gradient overlays */}
      <div className="absolute inset-0 gradient-radial-red" />
      <div className="absolute inset-0 gradient-radial-blue opacity-50" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-8 animate-fade-up">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-gradient-red-orange block mb-2 md:mb-4">
              How to Turn Your Content Into Revenue
            </span>
            <span className="text-foreground">
              Without Learning Tools, Funnels, or Operations
            </span>
            <span className="text-gradient-orange-blue block mt-2 md:mt-4">
              in the Fastest Way Possible.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 md:px-0">
            Optima builds your entire digital-product system using AI-accelerated workflows. 
            You stay focused on content — we handle all backend work, launch systems, and operations.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="elite" 
              size="xl"
              onClick={() => window.location.href = '/booking'}
              className="group"
            >
              Book a Call
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="elite-outline" 
              size="xl"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>
          
          {/* Countdown Bonus System */}
          <CountdownBonus />
        </div>
      </div>
    </section>
  );
};

export default Hero;
