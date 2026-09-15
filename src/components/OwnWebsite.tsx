import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";

const OwnWebsite = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 reactive">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Launch Your Own <span className="text-gradient-neon">Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Move beyond social algorithms. I help you build a custom, high-converting website that you truly own.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/booking')}
            className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
          >
            Book a Strategy Call
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OwnWebsite;
