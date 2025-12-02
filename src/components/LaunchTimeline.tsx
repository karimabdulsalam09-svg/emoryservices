import { Lightbulb, FileText, Wrench, Rocket, DollarSign } from "lucide-react";

const timelineSteps = [
  { day: "Week 1", title: "Topic Selection", icon: Lightbulb },
  { day: "Week 1", title: "Blueprint", icon: FileText },
  { day: "Week 2", title: "Backend Build", icon: Wrench },
  { day: "Week 3", title: "Launch", icon: Rocket },
  { day: "Week 4", title: "Revenue Flows", icon: DollarSign },
];

const LaunchTimeline = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-orange opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From Idea to <span className="text-gradient-red-orange">Revenue</span> in Days
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A clear, structured timeline from concept to cash flow
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 rounded-full gradient-red-orange flex items-center justify-center mb-4 glow-orange relative z-10">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-primary mb-2">{step.day}</div>
                  <div className="text-lg font-semibold text-foreground">{step.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-8">
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-6 animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 rounded-full gradient-red-orange flex items-center justify-center flex-shrink-0 glow-orange">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">{step.day}</div>
                  <div className="text-xl font-semibold text-foreground">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchTimeline;
