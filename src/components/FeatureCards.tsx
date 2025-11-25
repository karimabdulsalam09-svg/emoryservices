import { Zap, Cpu, Handshake } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Zero Backend Work",
    description:
      "We handle all product structure, launch planning, funnels, automations, delivery, and operations. You provide the audience — we do the rest.",
  },
  {
    icon: Cpu,
    title: "AI-Accelerated Production",
    description:
      "Your product, landing page, scripts, assets, and launch system are built with advanced AI workflows — fast, consistent, and high quality.",
  },
  {
    icon: Handshake,
    title: "A Partnership, Not a Service Fee",
    description:
      "Creators keep 70%. Optima takes 30%. No upfront cost. Incentives aligned.",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-orange opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-red-orange">Optima</span> Difference
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="elite-card rounded-2xl p-8 space-y-4 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-red-orange flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
