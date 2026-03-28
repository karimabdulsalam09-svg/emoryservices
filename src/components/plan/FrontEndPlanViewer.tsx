import { motion } from "framer-motion";
import { FrontEndPlanDay } from "@/pages/ViewMyPlan";
import { Target, Brain, Zap, CheckCircle2, Lightbulb, Video } from "lucide-react";

const FrontEndDayCard = ({ day, index }: { day: FrontEndPlanDay; index: number }) => {
  return (
    <div className="relative">
      {index > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 md:-top-16 w-0.5 h-12 md:h-16 bg-gradient-to-b from-transparent via-accent/30 to-accent/60" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -33% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Day badge */}
        <div className="flex justify-center mb-4 md:mb-5">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.15, type: "spring" }}
            className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center z-10 relative"
          >
            <span className="text-base md:text-lg font-bold text-accent-foreground">{day.day}</span>
          </motion.div>
        </div>

        <div className="glass-card p-4 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg md:text-2xl font-bold mb-2 text-center">{day.title}</h3>

          {/* Objective */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-3 md:mb-4 p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
              <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-primary">Objective</h4>
            </div>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">{day.objective}</p>
          </motion.div>

          {/* Why It Matters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-3 md:mb-4 p-3 md:p-4 rounded-xl bg-secondary/10 border border-secondary/25"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-foreground shrink-0" />
              <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-secondary-foreground">Why This Matters</h4>
            </div>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">{day.whyItMatters}</p>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-3 md:mb-4"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
              <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-primary">Action Steps</h4>
            </div>
            <div className="space-y-2">
              {day.actions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -33% 0px" }}
                  transition={{ duration: 0.3, delay: 0.25 + 0.08 * i }}
                  className="flex gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/15"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">{action}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Psychological Lever */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-3 md:mb-4 p-3 md:p-4 rounded-xl bg-accent/20 border border-accent/40"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-foreground shrink-0" />
              <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-accent-foreground">Psychological Lever</h4>
            </div>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed italic">{day.psychologicalLever}</p>
          </motion.div>

          {/* Expected Outcome */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -33% 0px" }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-3 md:mb-4 p-3 md:p-4 rounded-xl bg-primary/8 border border-primary/20"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
              <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-primary">Expected Outcome</h4>
            </div>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">{day.expectedOutcome}</p>
          </motion.div>

          {/* Content Ideas */}
          {day.contentIdeas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -33% 0px" }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="p-3 md:p-4 rounded-xl border-2 border-dashed border-secondary/40 bg-secondary/5"
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                <Video className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-foreground shrink-0" />
                <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider text-secondary-foreground">Content Ideas</h4>
              </div>
              <ul className="space-y-1.5">
                {day.contentIdeas.map((idea, i) => (
                  <li key={i} className="text-[11px] md:text-sm text-muted-foreground flex gap-2">
                    <span className="text-secondary-foreground shrink-0">•</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FrontEndPlanViewer = ({ days, clientName }: { days: FrontEndPlanDay[]; clientName: string }) => {
  return (
    <div>
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-16"
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          14-Day <span className="text-gradient-neon">Launch Plan</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto">
          Your front-end marketing and launch strategy. Follow each day to build anticipation, deliver value, and convert your audience into buyers.
        </p>
      </motion.div>

      {/* Days */}
      <div className="space-y-10 md:space-y-16">
        {days.map((day, idx) => (
          <FrontEndDayCard key={day.day} day={day} index={idx} />
        ))}
      </div>

      {/* Completion */}
      {days.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-20 text-center glass-card p-8 md:p-10 max-w-lg mx-auto"
        >
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Launch Complete!</h2>
          <p className="text-muted-foreground">
            You've executed the full 14-day launch sequence. Time to collect results and plan the next phase.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FrontEndPlanViewer;
