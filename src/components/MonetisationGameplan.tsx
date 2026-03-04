import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MonetisationGameplan = () => {
  return (
    <section id="monetisation-gameplan" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Monetisation <span className="text-gradient-neon">Gameplan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get your personalised step-by-step monetisation strategy — built around your content, your audience, and your goals.
          </p>
        </motion.div>

        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="glass-card p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Access Your Gameplan
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We've built a tool that maps out exactly how to turn your content into revenue.
              Click below to view your personalised monetisation gameplan.
            </p>
            <Button
              size="lg"
              onClick={() => window.open("https://shadow-workflow.lovable.app/view-gameplan", "_blank")}
              className="bg-primary text-primary-foreground font-bold hover:shadow-[0_0_20px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
            >
              View Gameplan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MonetisationGameplan;
