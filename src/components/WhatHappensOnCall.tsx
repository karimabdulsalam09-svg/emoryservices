import { CheckCircle2 } from "lucide-react";

const callPoints = [
  "Your niche + product angle",
  "Fastest product we can build for you",
  "Your audience's buying triggers",
  "Your revenue potential",
  "Fit for the 70/30 partnership model",
];

const WhatHappensOnCall = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            What Your <span className="text-gradient-neon">15-Minute Strategy Session</span> Includes:
          </h2>

          <div className="glass-card p-8 md:p-12 space-y-6 reactive">
            {callPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 text-lg animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{point}</span>
              </div>
            ))}

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-lg text-center text-muted-foreground">
                Book your session — <span className="text-foreground font-semibold">no pressure, no obligation.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatHappensOnCall;
