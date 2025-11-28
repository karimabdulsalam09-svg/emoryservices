import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const pricingPoints = [
  "$0 upfront",
  "You keep 70%",
  "Optima handles all backend work",
  "No hidden fees",
  "No monthly payments",
];

const PricingTransparency = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="elite-card rounded-2xl p-8 md:p-12 space-y-8 animate-fade-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-orange-blue flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Pricing</h3>
            </div>
            
            <div className="space-y-4">
              {pricingPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-center">
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => window.location.href = '/booking'}
                className="group"
              >
                Book Your Call
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTransparency;
