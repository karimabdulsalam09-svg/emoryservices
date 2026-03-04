import { motion } from "framer-motion";
import { Heart, Shield, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-neon">Pricing</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12 reactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Big reveal — Free */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
            >
              <div className="text-6xl md:text-8xl font-black text-gradient-neon mb-4">$0</div>
              <p className="text-xl md:text-2xl font-bold text-foreground">Completely Free to Start</p>
              <p className="text-muted-foreground mt-2">No upfront cost. No hidden fees. No monthly payments.</p>
            </motion.div>

            {/* Why it's free */}
            <div className="space-y-6 mb-10">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Why is it free?</h4>
                  <p className="text-muted-foreground">Because I genuinely love helping creators monetize. Helping you win is one of my main motives.</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Handshake className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">How does Esther earn?</h4>
                  <p className="text-muted-foreground">I only take a <span className="text-foreground font-semibold">negotiable commission</span> on revenue made. This means I only win when you win — keeping both sides safe.</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Zero risk for creators</h4>
                  <p className="text-muted-foreground">If no revenue is generated, you owe nothing. It's a true partnership, not a service.</p>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/booking'}
                className="group bg-primary text-primary-foreground font-bold hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
              >
                Get Started — It's Free
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
