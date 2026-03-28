import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ClientPlan, PlanDay, PlanTask } from "@/pages/ViewMyPlan";
import { Settings, Palette, FileText, Rocket } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FrontEndPlanViewer from "./FrontEndPlanViewer";

const OperatorTasks = ({ tasks }: { tasks: PlanTask[] }) => (
  <div className="flex-1 space-y-3">
    <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
        <Settings className="w-3 h-3 md:w-4 md:h-4 text-primary" />
      </div>
      <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-primary">Operator Side</h4>
    </div>
    {tasks.map((task, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -33% 0px" }}
        transition={{ duration: 0.4, delay: 0.1 * i }}
        className="p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/20"
      >
        <p className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{task.title}</p>
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{task.description}</p>
      </motion.div>
    ))}
  </div>
);

const CreatorTasks = ({ tasks }: { tasks: PlanTask[] }) => (
  <div className="flex-1 space-y-3">
    <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center">
        <Palette className="w-3 h-3 md:w-4 md:h-4 text-secondary-foreground" />
      </div>
      <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-secondary-foreground">Creator Side</h4>
    </div>
    {tasks.map((task, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -33% 0px" }}
        transition={{ duration: 0.4, delay: 0.1 * i }}
        className="p-2.5 md:p-3 rounded-xl bg-secondary/10 border border-secondary/25"
      >
        <p className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{task.title}</p>
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{task.description}</p>
      </motion.div>
    ))}
  </div>
);

const ContentSlot = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "0px 0px -33% 0px" }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="mt-3 md:mt-4 p-3 md:p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center gap-2 md:gap-3"
  >
    <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
    <div>
      <p className="font-semibold text-xs md:text-sm text-primary">Content Board — Coming Soon</p>
      <p className="text-[11px] md:text-xs text-muted-foreground">A full board including scripts, video ideas, and structure will be prepared and sent to Aaron.</p>
    </div>
  </motion.div>
);

const DayCard = ({ day, index }: { day: PlanDay; index: number }) => {
  const operatorTasks = day.tasks.filter((t) => t.role === "operator");
  const creatorTasks = day.tasks.filter((t) => t.role === "creator");

  return (
    <div className="relative">
      {/* Connecting line */}
      {index > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-0.5 h-16 bg-gradient-to-b from-transparent via-primary/20 to-primary/40" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -33% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Day badge */}
        <div className="flex justify-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.15, type: "spring" }}
            className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center z-10 relative"
          >
            <span className="text-base md:text-lg font-bold text-primary">{day.day}</span>
          </motion.div>
        </div>

        <div className="glass-card p-4 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg md:text-2xl font-bold mb-1 text-center">{day.title}</h3>
          <p className="text-muted-foreground text-center mb-4 md:mb-6 text-xs md:text-sm">{day.summary}</p>

          {/* Two-column split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {operatorTasks.length > 0 && <OperatorTasks tasks={operatorTasks} />}
            {creatorTasks.length > 0 && <CreatorTasks tasks={creatorTasks} />}
          </div>

          {/* Content slot for days 3-9 */}
          {day.contentSlot && <ContentSlot />}

          {day.tip && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4 p-3 rounded-xl bg-accent/30 border border-accent text-xs text-muted-foreground italic"
            >
              💡 {day.tip}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const PlanViewer = ({ plan }: { plan: ClientPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showFrontEnd, setShowFrontEnd] = useState(false);
  const hasFrontEndPlan = plan.frontend_plan_data && plan.frontend_plan_data.length > 0;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4 md:px-6">
      {/* Show side-by-side on desktop when front-end plan is active */}
      {showFrontEnd && !isMobile ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Build Plan */}
          <div className="max-h-[80vh] overflow-y-auto pr-3 scrollbar-thin">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-2xl font-bold mb-2">
                Build Plan — <span className="text-gradient-neon">{plan.client_name}</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Your 14-day product build roadmap.
              </p>
              <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Settings className="w-3 h-3 text-primary" /> Operator
                </span>
                <span className="flex items-center gap-1">
                  <Palette className="w-3 h-3 text-secondary-foreground" /> Creator
                </span>
              </div>
            </motion.div>
            <div className="space-y-12">
              {plan.plan_data.map((day: PlanDay, idx: number) => (
                <DayCard key={day.day} day={day} index={idx} />
              ))}
            </div>
          </div>

          {/* Right: Launch Plan */}
          <div className="max-h-[80vh] overflow-y-auto pl-3 scrollbar-thin">
            <FrontEndPlanViewer days={plan.frontend_plan_data} clientName={plan.client_name} />
          </div>
        </div>
      ) : (
        <>
          {/* Standard single-column view */}
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
            <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-primary" /> Operator
              </span>
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-secondary-foreground" /> Creator
              </span>
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
              viewport={{ once: true, margin: "0px 0px -33% 0px" }}
              transition={{ duration: 0.6 }}
              className="mt-20 text-center glass-card p-10 max-w-lg mx-auto"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready for Launch!</h2>
              <p className="text-muted-foreground">
                You've completed your 14-day plan. Time to go live and start building your audience.
              </p>
            </motion.div>
          )}

          {/* Day 15 Transition — Start Launch Plan */}
          {hasFrontEndPlan && (
            <div className="relative mt-16">
              <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-0.5 h-16 bg-gradient-to-b from-transparent via-primary/20 to-primary/40" />
              
              <div className="flex justify-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -33% 0px" }}
                  transition={{ duration: 0.4, delay: 0.15, type: "spring" }}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/30 border-2 border-accent/50 flex items-center justify-center z-10 relative"
                >
                  <span className="text-lg md:text-xl font-bold text-accent-foreground">15</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -33% 0px" }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 md:p-8 max-w-md mx-auto text-center cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setShowFrontEnd(true)}
              >
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg md:text-xl font-bold mb-2">Start 14-Day Launch Plan</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4">
                  Your product is built. Now it's time to launch it to the world with a proven front-end marketing sequence.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                  <Rocket className="w-4 h-4" />
                  View Launch Plan
                </div>
              </motion.div>
            </div>
          )}

          {/* Mobile: Show front-end plan below when activated */}
          {showFrontEnd && isMobile && hasFrontEndPlan && (
            <div className="mt-16">
              <FrontEndPlanViewer days={plan.frontend_plan_data} clientName={plan.client_name} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlanViewer;
