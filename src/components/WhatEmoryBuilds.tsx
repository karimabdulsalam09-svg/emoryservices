import { FileText, Video, FileCheck, Mail, Globe, CreditCard, Megaphone, Settings } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: FileText, title: "Product Blueprint", description: "Structured plan for your offer" },
  { icon: Video, title: "Script Writing", description: "Lesson outlines + video scripts" },
  { icon: FileCheck, title: "Worksheet Pack", description: "Professional PDFs" },
  { icon: Globe, title: "Landing Page Copy", description: "High-converting text" },
  { icon: CreditCard, title: "Sales Page Build", description: "Complete product page" },
  { icon: Mail, title: "Email Launch Sequence", description: "5–7 launch emails" },
  { icon: Settings, title: "Payment Setup", description: "Creator split configured" },
  { icon: Megaphone, title: "Launch Content", description: "Scripts & posts for launch day" },
];

const WhatEmoryBuilds = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -33% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Emory Builds <span className="text-gradient-neon">For You</span>
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* SVG connecting lines between items on desktop */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            preserveAspectRatio="none"
            viewBox="0 0 1200 600"
          >
            {/* Row 1 horizontal connections */}
            <path d="M200,100 C250,100 250,100 350,100" className="curve-line" strokeDasharray="4 4" />
            <path d="M500,100 C550,100 550,100 650,100" className="curve-line" strokeDasharray="4 4" />
            <path d="M800,100 C850,100 850,100 950,100" className="curve-line" strokeDasharray="4 4" />
            {/* Row 1→2 vertical connections */}
            <path d="M150,180 C150,220 150,250 150,300" className="curve-line" strokeDasharray="4 4" />
            <path d="M450,180 C450,220 450,250 450,300" className="curve-line" strokeDasharray="4 4" />
            <path d="M750,180 C750,220 750,250 750,300" className="curve-line" strokeDasharray="4 4" />
            <path d="M1050,180 C1050,220 1050,250 1050,300" className="curve-line" strokeDasharray="4 4" />
          </svg>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 space-y-3 reactive"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -33% 0px" }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatEmoryBuilds;
