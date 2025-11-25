import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

const revenueData = [
  { month: "Month 1", revenue: 0 },
  { month: "Month 2", revenue: 2000 },
  { month: "Month 3", revenue: 5000 },
  { month: "Month 4", revenue: 8500 },
  { month: "Month 5", revenue: 12000 },
  { month: "Month 6", revenue: 18000 },
];

const timeData = [
  { task: "Content", manual: 40, optima: 35 },
  { task: "Backend", manual: 30, optima: 2 },
  { task: "Operations", manual: 20, optima: 3 },
  { task: "Launch", manual: 15, optima: 2 },
];

const VisualElements = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-red-orange">Data</span> Behind Digital Products
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Revenue Growth Graph */}
          <div className="elite-card rounded-xl p-8 animate-fade-up">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Creator Revenue Growth
            </h3>
            <p className="text-muted-foreground mb-8">
              Average monthly revenue trajectory after launching a digital product
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Time Saved Graph */}
          <div className="elite-card rounded-xl p-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Hours Saved Per Week
            </h3>
            <p className="text-muted-foreground mb-8">
              Time investment: Manual vs. Optima-managed workflow
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="task" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="manual" fill="hsl(var(--muted))" name="Manual" />
                <Bar dataKey="optima" fill="hsl(var(--primary))" name="With Optima" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="elite-card rounded-xl p-12">
            <h3 className="text-2xl font-bold mb-12 text-center text-foreground">
              The Optima Workflow
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {[
                { label: "Idea", color: "gradient-red-orange" },
                { label: "Product Blueprint", color: "gradient-orange-blue" },
                { label: "Backend Build", color: "gradient-red-blue" },
                { label: "Launch", color: "gradient-red-orange" },
                { label: "Revenue", color: "gradient-orange-blue" },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className={`${step.color} text-white px-8 py-4 rounded-lg font-bold text-lg text-center min-w-[160px] glow-orange`}>
                    {step.label}
                  </div>
                  {index < 4 && (
                    <ArrowRight className="text-primary w-8 h-8 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualElements;
