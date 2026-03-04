import { motion } from "framer-motion";

const workflowSteps = ["Idea", "Product Blueprint", "Backend Build", "Launch", "Revenue"];

const WorkflowDiagram = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Esther <span className="text-gradient-neon">Workflow</span>
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-12 reactive">
            {/* Desktop: horizontal with curvy lines */}
            <div className="hidden md:flex items-center justify-center gap-2">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <motion.div
                    className="bg-primary/10 border border-primary/30 text-foreground px-6 py-4 rounded-2xl font-bold text-lg text-center min-w-[140px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    {step}
                  </motion.div>
                  {index < workflowSteps.length - 1 && (
                    <motion.svg
                      width="60"
                      height="40"
                      viewBox="0 0 60 40"
                      className="flex-shrink-0"
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <path
                        d="M0,20 C15,5 45,35 60,20"
                        stroke="hsl(187 100% 50% / 0.35)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 3"
                      />
                    </motion.svg>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical with curvy lines */}
            <div className="md:hidden space-y-2">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    className="bg-primary/10 border border-primary/30 text-foreground px-6 py-3 rounded-2xl font-bold text-base text-center w-full max-w-[200px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {step}
                  </motion.div>
                  {index < workflowSteps.length - 1 && (
                    <motion.svg
                      width="40"
                      height="30"
                      viewBox="0 0 40 30"
                      initial={{ opacity: 0, scaleY: 0 }}
                      whileInView={{ opacity: 1, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
                      style={{ transformOrigin: "top" }}
                    >
                      <path
                        d="M20,0 C5,10 35,20 20,30"
                        stroke="hsl(187 100% 50% / 0.35)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 3"
                      />
                    </motion.svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;
