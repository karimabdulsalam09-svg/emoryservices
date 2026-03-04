import { Lightbulb, FileText, Wrench, Rocket, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const timelineSteps = [
  { day: "Week 1", title: "Topic Selection", icon: Lightbulb },
  { day: "Week 1", title: "Blueprint", icon: FileText },
  { day: "Week 2", title: "Backend Build", icon: Wrench },
  { day: "Week 3", title: "Launch", icon: Rocket },
  { day: "Week 4", title: "Revenue Flows", icon: DollarSign },
];

const vp = { once: true, margin: "0px 0px -33% 0px" } as const;

const LaunchTimeline = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From Idea to <span className="text-gradient-neon">Revenue</span> in Days
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A clear, structured timeline from concept to cash flow
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="hidden md:flex items-start justify-between relative">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40" />
            {timelineSteps.map((step, index) => (
              <motion.div key={index} className="flex flex-col items-center relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.5, delay: index * 0.15 }}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-primary mb-2">{step.day}</div>
                  <div className="text-lg font-semibold text-foreground">{step.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden space-y-6">
            {timelineSteps.map((step, index) => (
              <motion.div key={index} className="flex items-center gap-6" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">{step.day}</div>
                  <div className="text-lg font-semibold text-foreground">{step.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchTimeline;
