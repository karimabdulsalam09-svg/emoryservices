const About = () => {
  return <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            About <span className="text-gradient-orange-blue">Us</span>
          </h2>
          
          <div className="elite-card rounded-2xl p-8 md:p-12 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm the founder of Esther — a creator-operations partner built for serious creators 
              who want to turn attention into revenue without drowning in backend work.
            </p>
            
            <p>Most creators know exactly what their audience wants, but don't have the time, structure, or systems to turn that demand into a scalable digital product. Zyro exists to remove that friction entirely.</p>
            
            <p>
              My work sits at the intersection of AI-accelerated execution, lean digital product systems, 
              and conversion strategy. I operate behind the scenes to build the entire monetization engine 
              a creator needs — from the product structure to the launch system — while the creator stays 
              fully focused on content.
            </p>
            
            <p>
              I bring a startup-style approach: fast iteration, data-driven decisions, clean design, and 
              systems built to scale without unnecessary complexity. And I combine it with an elite level 
              of operational detail so creators never touch the tech, the funnels, or the delivery logistics.
            </p>
            
            <p>
              There's no guesswork, no overwhelm, and no "learn this tool" burden on the creator. 
              Esther handles the full backend, while the creator brings what matters most: authenticity, 
              expertise, and an engaged audience.
            </p>
            
            <p className="text-foreground font-semibold">
              If you're a creator who wants to open a new income stream without adding more work to your day, 
              Esther builds the system that makes it happen — efficiently, intelligently, and with zero 
              operational drag.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default About;