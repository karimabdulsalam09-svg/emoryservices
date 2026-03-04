import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

const MonetizationGameplan = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 reactive">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Monetization <span className="text-gradient-blue-olive">Gameplan Access</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Stop leaving money on the table. Get a custom roadmap to turn your content into a scalable digital product business.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/booking'}
            className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
          >
            Apply for Access
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MonetizationGameplan;
