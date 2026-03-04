const industryData = [
  {
    stat: "70% of creators say backend work is why they fail to launch",
    source: "Thinkific 2024",
  },
  {
    stat: "Creators who outsource backend operations grow 2–5x faster",
    source: "IMH 2024",
  },
  {
    stat: "Digital product failures are usually caused by poor launch systems",
    source: "HubSpot 2023",
  },
];

const SocialProof = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Industry <span className="text-gradient-neon">Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Why backend work is the bottleneck — and why outsourcing it works
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {industryData.map((data, index) => (
            <div
              key={index}
              className="glass-card p-8 animate-fade-up reactive"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <p className="text-lg text-foreground mb-6 leading-relaxed font-semibold">
                "{data.stat}"
              </p>
              <div className="border-t border-border pt-4">
                <div className="text-sm text-primary font-bold">{data.source}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
