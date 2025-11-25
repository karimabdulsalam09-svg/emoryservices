import { FileText, Video, Globe, Mail, CreditCard, Settings } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Digital Product Blueprint",
    description: "Complete product architecture and structure",
  },
  {
    icon: Video,
    title: "AI-Generated Scripts & Worksheets",
    description: "Ready-to-use content assets and materials",
  },
  {
    icon: Globe,
    title: "Modern Landing Page Creation",
    description: "High-converting, professionally designed pages",
  },
  {
    icon: Mail,
    title: "Email Launch System",
    description: "Automated sequences and nurture campaigns",
  },
  {
    icon: CreditCard,
    title: "Payment + Delivery Setup",
    description: "Seamless checkout and automated fulfillment",
  },
  {
    icon: Settings,
    title: "Full Backend Management",
    description: "End-to-end operations during launch",
  },
];

const WhatWeBuild = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-red opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What <span className="text-gradient-red-orange">Optima</span> Builds
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="elite-card rounded-xl p-6 space-y-3 group animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-orange-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
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

export default WhatWeBuild;
