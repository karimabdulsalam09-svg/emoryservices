import { motion } from "framer-motion";

const metrics = [
  { stat: "$250B Creator Economy by 2027", source: "Goldman Sachs" },
  { stat: "70% of creators struggle to monetize", source: "Thinkific (2024)" },
  { stat: "AI speeds up product creation by 5–20x", source: "McKinsey (2024)" },
];

const EconomicMetrics = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="text-gradient-blue-olive">Market</span> Opportunity
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="glass-card p-4 md:p-8 text-center reactive"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="text-lg md:text-3xl lg:text-4xl font-bold text-gradient-neon mb-2 md:mb-4 leading-tight">
                {metric.stat}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                {metric.source}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EconomicMetrics;
