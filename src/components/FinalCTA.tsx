import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Strong gradient background */}
      <div className="absolute inset-0 gradient-red-orange" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Ready to Add a New Income Stream?
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed">
            Book a 15-minute call to see if your audience, niche, and content 
            qualify for an Optima partnership.
          </p>
          
          <Button 
            variant="elite-outline" 
            size="xl"
            onClick={() => window.location.href = '/booking'}
            className="group border-white text-white hover:bg-white hover:text-background shadow-2xl"
          >
            Book a Call
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
