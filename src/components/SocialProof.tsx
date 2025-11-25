import { Quote, TrendingUp, DollarSign, Download } from "lucide-react";

const testimonials = [
  {
    quote: "Optima built everything — I only had to record 2 short videos.",
    author: "Creator Name",
  },
  {
    quote: "The fastest, cleanest system I've ever launched.",
    author: "Creator Name",
  },
  {
    quote: "I added a new income stream without adding work.",
    author: "Creator Name",
  },
];

const metrics = [
  { icon: Download, value: "+X", label: "Downloads" },
  { icon: TrendingUp, value: "+X%", label: "Conversion Lift" },
  { icon: DollarSign, value: "+$X", label: "Launch Revenue" },
];

const SocialProof = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="elite-card rounded-xl p-8 space-y-4 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-10 h-10 text-primary" />
              <p className="text-lg text-foreground leading-relaxed">
                "{testimonial.quote}"
              </p>
              <p className="text-muted-foreground">— {testimonial.author}</p>
            </div>
          ))}
        </div>
        
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="elite-card rounded-xl p-8 text-center space-y-4 animate-scale-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full gradient-red-blue flex items-center justify-center mx-auto">
                <metric.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-bold text-gradient-orange-blue">
                {metric.value}
              </div>
              <div className="text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
