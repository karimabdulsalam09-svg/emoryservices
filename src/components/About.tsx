import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            About <span className="text-gradient-blue-olive">Us</span>
          </motion.h2>

          <motion.div
            className="glass-card p-8 md:p-12 space-y-6 text-lg text-muted-foreground leading-relaxed reactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              I'm the founder of Esther — a creator-operations partner built for serious creators
              who want to turn attention into revenue without drowning in backend work.
            </p>
            <p>Most creators know exactly what their audience wants, but don't have the time, structure, or systems to turn that demand into a scalable digital product. Esther exists to remove that friction entirely.</p>
            <p>
              My work sits at the intersection of AI-accelerated execution, lean digital product systems,
              and conversion strategy. I operate behind the scenes to build the entire monetization engine
              a creator needs — from the product structure to the launch system — while the creator stays
              fully focused on content.
            </p>
            <p className="text-foreground font-semibold">
              If you're a creator who wants to open a new income stream without adding more work to your day,
              Esther builds the system that makes it happen — efficiently, intelligently, and with zero
              operational drag.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
