import { Search, Wrench, Video, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Identify the Creator's Monetizable Topic",
    description: "Based on audience engagement and content pillars.",
  },
  {
    icon: Wrench,
    number: "02",
    title: "Build the Product Back End",
    description: "Scripts, assets, landing page, email sequence, and system setup.",
  },
  {
    icon: Video,
    number: "03",
    title: "Creator Records Minimal Content",
    description: "1–3 short videos or posts. Esther builds the full product from it.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Launch to Their Audience",
    description: "Esther manages the full launch system and operations.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient-blue-olive">Works</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <motion.div
                className="flex gap-6 items-start mb-4"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="glass-card p-6 flex-1 reactive">
                  <div className="text-primary text-sm font-bold mb-2">
                    STEP {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Curvy connecting line to next step */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex justify-start pl-[30px] mb-4"
                  initial={{ opacity: 0, scaleY: 0 }}
                  whileInView={{ opacity: 1, scaleY: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{ transformOrigin: "top" }}
                >
                  <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
                    <path
                      d="M20,0 C20,20 5,30 20,60"
                      stroke="hsl(187 100% 50% / 0.3)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
