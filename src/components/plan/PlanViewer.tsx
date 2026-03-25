import { useRef } from "react";
import { motion } from "framer-motion";
import { ClientPlan, PlanDay, PlanTask } from "@/pages/ViewMyPlan";
import { CheckCircle2, Flag, Package, Lightbulb } from "lucide-react";

const taskTypeConfig = {
  task: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  milestone: { icon: Flag, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30" },
  deliverable: { icon: Package, color: "text-accent-foreground", bg: "bg-accent/30", border: "border-accent" },
};

const DayCard = ({ day, index }: { day: PlanDay; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      {/* Connecting line */}
      {index > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-0.5 h-16 bg-gradient-to-b from-transparent via-primary/30 to-primary/50" />
      )}

      <motion.div
        initial={{ opacity: 0, x: isEven ? -60 : 60, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -33% 0px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative"
      >
        {/* Day badge */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
            className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center z-10"
          >
            <span className="text-lg font-bold text-primary">{day.day}</span>
          </motion.div>
        </div>

        <div className={`glass-card p-6 md:p-8 max-w-2xl mx-auto ${isEven ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'} md:max-w-xl`}>
          <h3 className="text-xl md:text-2xl font-bold mb-2">{day.title}</h3>
          <p className="text-muted-foreground mb-5">{day.summary}</p>

          <div className="space-y-3">
            {day.tasks.map((task: PlanTask, tIdx: number) => {
              const config = taskTypeConfig[task.type] || taskTypeConfig.task;
              const Icon = config.icon;
              return (
                <motion.div
                  key={tIdx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                  transition={{ duration: 0.4, delay: 0.1 * tIdx }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
                >
                  <span className="text-xl mt-0.5">{task.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
                      <span className="font-semibold text-sm">{task.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${config.color} px-2 py-0.5 rounded-full border ${config.border} shrink-0`}>
                    {task.type}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {day.tip && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-secondary/10 border border-secondary/20"
            >
              <Lightbulb className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic">{day.tip}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const PlanViewer = ({ plan }: { plan: ClientPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4 md:px-6">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Welcome, <span className="text-gradient-neon">{plan.client_name}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your personalised 14-day launch plan is ready. Scroll through each day to discover your path to a successful digital product launch.
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Tasks</span>
          <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5 text-secondary" /> Milestones</span>
          <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5 text-accent-foreground" /> Deliverables</span>
        </div>
      </motion.div>

      {/* Days */}
      <div className="space-y-12 md:space-y-16">
        {plan.plan_data.map((day: PlanDay, idx: number) => (
          <DayCard key={day.day} day={day} index={idx} />
        ))}
      </div>

      {/* Completion */}
      {plan.plan_data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center glass-card p-10 max-w-lg mx-auto"
        >
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Launch Day!</h2>
          <p className="text-muted-foreground">
            You've completed your 14-day plan. Time to go live and start building your audience.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PlanViewer;
