import { DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPoints = [
  "$0 upfront",
  "You keep 70%",
  "Esther handles all backend work",
  "No hidden fees",
  "No monthly payments",
];

const PricingTransparency = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 md:p-12 space-y-8 animate-fade-up reactive">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Pricing</h3>
            </div>

            <div className="space-y-4">
              {pricingPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-lg">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/booking'}
                className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
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
