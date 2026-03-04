import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Ready to Add a New Income Stream?
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Book a 15-minute call to see if your audience, niche, and content
            qualify for an Esther partnership.
          </p>

          <Button
            size="xl"
            onClick={() => window.location.href = '/booking'}
            className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
          >
            Book a Call
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
