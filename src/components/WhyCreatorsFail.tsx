import { X } from "lucide-react";
import { motion } from "framer-motion";

const obstacles = [
  "No backend system",
  "No structured launch plan",
  "No product blueprint",
  "No follow-up automation",
  "No timeline",
];

const WhyCreatorsFail = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Most Creators <span className="text-gradient-neon">Never Launch</span>
          </motion.h2>

          <motion.div
            className="glass-card p-8 md:p-12 space-y-6 reactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {obstacles.map((obstacle, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 text-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <span className="text-muted-foreground">{obstacle}</span>
              </motion.div>
            ))}

            <div className="border-t border-border/40 pt-8 mt-8">
              <p className="text-xl font-bold text-center text-gradient-neon">
                Esther removes all five obstacles instantly.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyCreatorsFail;
