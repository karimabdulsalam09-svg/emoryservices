import { ArrowRight, Code, Clock, Zap, FileText, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const revenueTimeline = [
  { month: "Month 1", revenue: 500 },
  { month: "Month 2", revenue: 1200 },
  { month: "Month 3", revenue: 2800 },
  { month: "Month 4", revenue: 5400 },
  { month: "Month 5", revenue: 8000 },
  { month: "Month 6", revenue: 13500 },
];

const mobileRevenueTimeline = [
  { month: "Month 1", revenue: 500 },
  { month: "Month 3", revenue: 2800 },
  { month: "Month 6", revenue: 13500 },
];

const manualWorkflow = [
  { task: "Content", hours: 40, icon: FileText },
  { task: "Backend", hours: 20, icon: Code },
  { task: "Operations", hours: 10, icon: Clock },
  { task: "Launch Prep", hours: 8, icon: Zap },
];

const estherWorkflow = [
  { task: "Content", hours: 5, icon: FileText },
  { task: "Backend", hours: 0, icon: Code },
  { task: "Operations", hours: 1, icon: Clock },
  { task: "Launch Prep", hours: 2, icon: Zap },
];

const VisualElements = () => {
  const isMobile = useIsMobile();
  const timelineData = isMobile ? mobileRevenueTimeline : revenueTimeline;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="text-gradient-neon">Data</span> Behind Digital Products
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-20">
          {/* Revenue Growth Timeline */}
          <div className="glass-card p-4 md:p-8 animate-fade-up reactive">
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-foreground">Creator Revenue Growth</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8">Average monthly revenue trajectory after launching a digital product</p>

            {isMobile ? (
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm font-semibold text-foreground">{item.month}</span>
                    </div>
                    <span className="text-lg font-bold text-gradient-neon">
                      ${item.revenue.toLocaleString()}{index === timelineData.length - 1 ? "+" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative py-12">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />
                <div className="relative flex justify-between items-center">
                  {timelineData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
                      <div className="text-xs font-semibold text-foreground mb-2 whitespace-nowrap">{item.month.replace("Month ", "M")}</div>
                      <div className="text-lg md:text-xl font-bold text-gradient-neon">
                        ${item.revenue.toLocaleString()}{index === timelineData.length - 1 ? "+" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hours Comparison */}
          <div className="glass-card p-4 md:p-8 animate-fade-up reactive" style={{ animationDelay: "0.15s" }}>
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-foreground">Hours Saved Per Week</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8">Time investment: Manual vs. Esther-managed workflow</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-border rounded-2xl p-4 md:p-6 bg-muted/30">
                <div className="text-base md:text-lg font-bold mb-3 md:mb-4 text-muted-foreground">Manual Workflow</div>
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  {manualWorkflow.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm text-muted-foreground flex-1">{item.task}</span>
                        <span className="text-xs md:text-sm font-bold text-foreground">{item.hours}h</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 md:pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-semibold text-muted-foreground">Total:</span>
                    <span className="text-xl md:text-2xl font-bold text-foreground">78h</span>
                  </div>
                </div>
              </div>

              <div className="border border-primary/30 rounded-2xl p-4 md:p-6 bg-primary/5">
                <div className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gradient-neon">With Esther</div>
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  {estherWorkflow.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                        <span className="text-xs md:text-sm text-foreground flex-1">{item.task}</span>
                        <span className="text-xs md:text-sm font-bold text-primary">{item.hours}h</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 md:pt-3 border-t border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-semibold text-foreground">Total:</span>
                    <span className="text-xl md:text-2xl font-bold text-gradient-neon">8h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card p-4 md:p-8 lg:p-12 reactive">
            <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center text-gradient-neon">
              What This Actually Means for You
            </h3>
            <div className="space-y-6 md:space-y-10">
              <div>
                <h4 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  Followers → Revenue Multiplier Example
                </h4>
                <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                  Creators who add <span className="text-foreground font-semibold">+300 followers</span> alone…
                  <br />add <span className="text-gradient-neon font-bold">+1,000–4,000</span> with proper backend systems.
                  <br /><span className="text-foreground">Because growth compounds once a product exists.</span>
                </p>
              </div>
              <div>
                <h4 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  First Launch Outcome (Revenue Example)
                </h4>
                <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                  Creators who launch with proper backend go from <span className="text-gradient-neon font-bold">$2k–$15k</span>
                  <br /><span className="text-foreground font-semibold">on their very first product.</span>
                </p>
              </div>
              <div>
                <h4 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  Simple Scenario
                </h4>
                <div className="bg-muted/30 border border-border rounded-2xl p-4 md:p-6">
                  <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-semibold">Scenario:</span>
                    <br />– You have <span className="text-foreground font-semibold">10,000 followers</span>
                    <br />– <span className="text-foreground font-semibold">1%</span> of them buy your first <span className="text-foreground font-semibold">$29 product</span>
                    <br /><br />→ That's <span className="text-gradient-neon font-bold text-base md:text-xl">$2,900</span> on launch week
                    <br />→ And <span className="text-primary font-semibold">recurring sales every month afterwards</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card p-4 md:p-8 lg:p-12 reactive">
            <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-12 text-center text-foreground">
              The Esther Workflow
            </h3>
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 md:gap-6">
              {[
                { label: "Idea" },
                { label: "Product Blueprint" },
                { label: "Backend Build" },
                { label: "Launch" },
                { label: "Revenue" },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 md:gap-6">
                  <div className="bg-primary text-primary-foreground px-4 py-2 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-lg text-center min-w-[100px] md:min-w-[160px]">
                    {step.label}
                  </div>
                  {index < 4 && (
                    <ArrowRight className="text-primary w-5 h-5 md:w-8 md:h-8 hidden md:block flex-shrink-0" />
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

export default VisualElements;
