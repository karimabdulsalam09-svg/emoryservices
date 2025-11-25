const metrics = [
  {
    stat: "$250B Creator Economy by 2027",
    source: "Goldman Sachs",
  },
  {
    stat: "70% of creators struggle to monetize",
    source: "Thinkific (2024)",
  },
  {
    stat: "AI speeds up product creation by 5–20x",
    source: "McKinsey (2024)",
  },
];

const EconomicMetrics = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-red opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-orange-blue">Market</span> Opportunity
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="elite-card rounded-xl p-8 text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-red-orange mb-4 leading-tight">
                {metric.stat}
              </div>
              <div className="text-sm text-muted-foreground font-semibold">
                {metric.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EconomicMetrics;
