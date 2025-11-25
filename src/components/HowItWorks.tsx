import { Search, Wrench, Video, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Identify the Creator's Monetizable Topic",
    description: "Based on audience engagement and content pillars.",
  },
  {
    icon: Wrench,
    number: "02",
    title: "Build the Product Back End",
    description: "Scripts, assets, landing page, email sequence, and system setup.",
  },
  {
    icon: Video,
    number: "03",
    title: "Creator Records Minimal Content",
    description: "1–3 short videos or posts. Optima builds the full product from it.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Launch to Their Audience",
    description: "Optima manages the full launch system and operations.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-orange opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient-orange-blue">Works</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-start animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full gradient-red-orange flex items-center justify-center flex-shrink-0 glow-orange">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-24 bg-gradient-to-b from-primary to-accent mt-4" />
                )}
              </div>
              
              {/* Content */}
              <div className="elite-card rounded-xl p-6 flex-1">
                <div className="text-primary text-sm font-bold mb-2">
                  STEP {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
