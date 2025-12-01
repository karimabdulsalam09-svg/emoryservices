import { ArrowRight, Code, Clock, Zap, FileText, CheckCircle2 } from "lucide-react";

const revenueTimeline = [
  { month: "Month 1", revenue: 500 },
  { month: "Month 2", revenue: 1200 },
  { month: "Month 3", revenue: 2800 },
  { month: "Month 4", revenue: 5400 },
  { month: "Month 5", revenue: 8000 },
  { month: "Month 6", revenue: 13500 },
];

const manualWorkflow = [
  { task: "Content", hours: 40, icon: FileText },
  { task: "Backend", hours: 20, icon: Code },
  { task: "Operations", hours: 10, icon: Clock },
  { task: "Launch Prep", hours: 8, icon: Zap },
];

const optimaWorkflow = [
  { task: "Content", hours: 5, icon: FileText },
  { task: "Backend", hours: 0, icon: Code },
  { task: "Operations", hours: 1, icon: Clock },
  { task: "Launch Prep", hours: 2, icon: Zap },
];

const VisualElements = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-red-orange">Data</span> Behind Digital Products
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Revenue Growth Timeline */}
          <div className="elite-card rounded-xl p-8 animate-fade-up">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Creator Revenue Growth
            </h3>
            <p className="text-muted-foreground mb-8">
              Average monthly revenue trajectory after launching a digital product
            </p>
            <div className="relative py-12">
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gradient-red via-gradient-orange to-gradient-blue opacity-30" />
              
              {/* Timeline nodes */}
              <div className="relative flex justify-between items-center">
                {revenueTimeline.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Node */}
                    <div className="w-4 h-4 rounded-full bg-primary glow-orange mb-4 relative z-10" />
                    
                    {/* Month label */}
                    <div className="text-xs font-semibold text-foreground mb-2 whitespace-nowrap">
                      {item.month.replace("Month ", "M")}
                    </div>
                    
                    {/* Revenue value */}
                    <div className="text-lg md:text-xl font-bold text-gradient-red-orange">
                      ${item.revenue.toLocaleString()}{index === revenueTimeline.length - 1 ? "+" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hours Comparison Cards */}
          <div className="elite-card rounded-xl p-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Hours Saved Per Week
            </h3>
            <p className="text-muted-foreground mb-8">
              Time investment: Manual vs. Optima-managed workflow
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Manual Workflow Card */}
              <div className="border border-border/50 rounded-lg p-6 bg-background/50">
                <div className="text-lg font-bold mb-4 text-muted-foreground">Manual Workflow</div>
                <div className="space-y-3 mb-4">
                  {manualWorkflow.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground flex-1">{item.task}</span>
                        <span className="text-sm font-bold text-foreground">{item.hours}h</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Total:</span>
                    <span className="text-2xl font-bold text-foreground">78h</span>
                  </div>
                </div>
              </div>

              {/* Optima Workflow Card */}
              <div className="border border-primary/30 rounded-lg p-6 bg-primary/5 glow-orange">
                <div className="text-lg font-bold mb-4 text-gradient-red-orange">With Optima</div>
                <div className="space-y-3 mb-4">
                  {optimaWorkflow.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground flex-1">{item.task}</span>
                        <span className="text-sm font-bold text-primary">{item.hours}h</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total:</span>
                    <span className="text-2xl font-bold text-gradient-red-orange">8h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What This Actually Means Section */}
        <div className="max-w-5xl mx-auto mb-20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="elite-card rounded-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-12 text-center text-gradient-red-orange">
              What This Actually Means for You
            </h3>

            <div className="space-y-10">
              {/* Followers to Revenue Multiplier */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Followers → Revenue Multiplier Example
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Creators who add <span className="text-foreground font-semibold">+300 followers</span> alone…
                  <br />
                  add <span className="text-gradient-red-orange font-bold">+1,000–4,000</span> with proper backend systems.
                  <br />
                  <span className="text-foreground">Because growth compounds once a product exists.</span>
                </p>
              </div>

              {/* First Launch Outcome */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  First Launch Outcome (Revenue Example)
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Creators who stay <span className="text-muted">"content-only"</span> go from $0 to inconsistent spikes.
                  <br />
                  Creators who launch with proper backend go from <span className="text-gradient-red-orange font-bold">$2k–$15k</span>
                  <br />
                  <span className="text-foreground font-semibold">on their very first product.</span>
                </p>
              </div>

              {/* Simple Scenario */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Simple Scenario (Very Relatable)
                </h4>
                <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-semibold">Scenario:</span>
                    <br />
                    – You have <span className="text-foreground font-semibold">10,000 followers</span>
                    <br />
                    – <span className="text-foreground font-semibold">1%</span> of them buy your first <span className="text-foreground font-semibold">$29 product</span>
                    <br />
                    <br />
                    → That's <span className="text-gradient-red-orange font-bold text-xl">$2,900</span> on launch week
                    <br />
                    → And <span className="text-primary font-semibold">recurring sales every month afterwards</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="elite-card rounded-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-12 text-center text-foreground">
              The Optima Workflow
            </h3>
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { label: "Idea", color: "gradient-red-orange" },
                { label: "Product Blueprint", color: "gradient-orange-blue" },
                { label: "Backend Build", color: "gradient-red-blue" },
                { label: "Launch", color: "gradient-red-orange" },
                { label: "Revenue", color: "gradient-orange-blue" },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4 md:gap-6">
                  <div className={`${step.color} text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-base md:text-lg text-center min-w-[140px] md:min-w-[160px] glow-orange`}>
                    {step.label}
                  </div>
                  {index < 4 && (
                    <ArrowRight className="text-primary w-6 h-6 md:w-8 md:h-8 hidden md:block flex-shrink-0" />
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
