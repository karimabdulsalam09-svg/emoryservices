import { X } from "lucide-react";

const obstacles = [
  "No backend system",
  "No structured launch plan",
  "No product blueprint",
  "No follow-up automation",
  "No timeline",
];

const WhyCreatorsFail = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Why Most Creators <span className="text-gradient-red-orange">Never Launch</span>
          </h2>
          
          <div className="elite-card rounded-2xl p-8 md:p-12 space-y-6">
            {obstacles.map((obstacle, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-lg animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-muted-foreground">{obstacle}</span>
              </div>
            ))}
            
            <div className="border-t border-border pt-8 mt-8">
              <p className="text-xl font-bold text-center text-gradient-red-orange">
                Esther removes all five obstacles instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCreatorsFail;
