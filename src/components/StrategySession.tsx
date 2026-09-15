import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const callPoints = [
  "Your niche + product angle analysis",
  "Fastest product we can build for you",
  "Your audience's buying triggers",
  "Your revenue potential breakdown",
  "Partnership fit assessment",
];

const StrategySession = () => {
  const navigate = useNavigate();
  return (
    <section id="book-a-call" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Your <span className="text-gradient-neon">15-Min Strategy Session</span> Includes
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12 reactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-5 mb-8">
              {callPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -33% 0px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border/40 pt-6">
              <p className="text-lg text-center text-muted-foreground mb-6">
                Book your session — <span className="text-foreground font-semibold">no pressure, no obligation.</span>
              </p>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/booking')}
                  className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
                >
                  Book Your Free Call
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StrategySession;
