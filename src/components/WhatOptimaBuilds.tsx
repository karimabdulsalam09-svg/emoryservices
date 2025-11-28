import { FileText, Video, FileCheck, Mail, Globe, CreditCard, Megaphone, Settings } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Product Blueprint",
    description: "Structured plan for your offer",
  },
  {
    icon: Video,
    title: "Script Writing",
    description: "Lesson outlines + video scripts",
  },
  {
    icon: FileCheck,
    title: "Worksheet Pack",
    description: "Professional PDFs",
  },
  {
    icon: Globe,
    title: "Landing Page Copy",
    description: "High-converting text",
  },
  {
    icon: CreditCard,
    title: "Sales Page Build",
    description: "Complete product page",
  },
  {
    icon: Mail,
    title: "Email Launch Sequence",
    description: "5–7 launch emails",
  },
  {
    icon: Settings,
    title: "Payment Setup",
    description: "Creator split configured",
  },
  {
    icon: Megaphone,
    title: "Launch Content",
    description: "Scripts & posts for launch day",
  },
];

const WhatOptimaBuilds = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-red opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Optima Builds <span className="text-gradient-red-orange">For You</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="elite-card rounded-xl p-6 space-y-3 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-orange-blue flex items-center justify-center">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatOptimaBuilds;
