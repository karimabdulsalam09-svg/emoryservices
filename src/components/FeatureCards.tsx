import { Zap, Cpu, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Zap,
    title: "Zero Backend Work",
    description:
      "We handle all product structure, launch planning, funnels, automations, delivery, and operations. You provide the audience — we do the rest.",
  },
  {
    icon: Cpu,
    title: "AI-Accelerated Production",
    description:
      "Your product, landing page, scripts, assets, and launch system are built with advanced AI workflows — fast, consistent, and high quality.",
  },
  {
    icon: Handshake,
    title: "A Partnership, Not a Service Fee",
    description:
      "No upfront cost. Esther takes a negotiable commission. Incentives aligned.",
  },
];

const FeatureCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="what-we-do" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-neon">Esther</span> Difference
          </h2>
        </motion.div>

        <div ref={containerRef} className="max-w-6xl mx-auto relative">
          {/* SVG curvy connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
          >
            {/* Line from center title area down to card 1 (left) */}
            <path
              d="M600,0 C600,60 200,60 200,120"
              className="curve-line"
              strokeDasharray="6 4"
            />
            {/* Line from center title area down to card 2 (center) */}
            <path
              d="M600,0 C600,60 600,60 600,120"
              className="curve-line"
              strokeDasharray="6 4"
            />
            {/* Line from center title area down to card 3 (right) */}
            <path
              d="M600,0 C600,60 1000,60 1000,120"
              className="curve-line"
              strokeDasharray="6 4"
            />
          </svg>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 space-y-4 reactive"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
