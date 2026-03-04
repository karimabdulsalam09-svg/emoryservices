import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-8 animate-fade-up">
          <h1 className="text-2xl sm:text-3xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-gradient-neon block mb-1 md:mb-4">
              Turn Your Content Into Revenue
            </span>
            <span className="text-foreground text-xl sm:text-2xl md:text-5xl lg:text-6xl">
              Without Learning Tools, Funnels, or Operations
            </span>
          </h1>

          <p className="text-sm md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 md:px-0">
            Esther builds your entire digital-product system using AI-accelerated workflows.
            You stay focused on content — we handle everything else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="xl"
              onClick={() => window.location.href = '/booking'}
              className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
            >
              Book a Call
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-primary/30 text-foreground hover:bg-primary/5 font-semibold"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
