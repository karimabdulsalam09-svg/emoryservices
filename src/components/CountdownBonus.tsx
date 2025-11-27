import { useEffect, useState } from "react";
import { Trophy, Zap, FileText, Sparkles, Clock } from "lucide-react";

interface Bonus {
  icon: typeof Trophy;
  title: string;
  description: string;
  active: boolean;
}

const CountdownBonus = () => {
  const [timeLeft, setTimeLeft] = useState(37 * 60); // 37 minutes in seconds

  useEffect(() => {
    const storedTime = localStorage.getItem("optima-countdown-start");
    const now = Date.now();
    
    if (storedTime) {
      const elapsed = Math.floor((now - parseInt(storedTime)) / 1000);
      const remaining = Math.max(0, 37 * 60 - elapsed);
      setTimeLeft(remaining);
    } else {
      localStorage.setItem("optima-countdown-start", now.toString());
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const newStartTime = Date.now();
          localStorage.setItem("optima-countdown-start", newStartTime.toString());
          return 37 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const minutesLeft = Math.floor(timeLeft / 60);
  
  const bonuses: Bonus[] = [
    {
      icon: Trophy,
      title: "75/25 Split",
      description: "Book now to win 75/25 revenue split on first $2K",
      active: minutesLeft >= 27
    },
    {
      icon: Zap,
      title: "Priority Access",
      description: "Book now to win front-of-queue priority",
      active: minutesLeft >= 22 && minutesLeft < 27
    },
    {
      icon: Sparkles,
      title: "Topic Audit",
      description: "Book now to win personalized monetizable topic audit",
      active: minutesLeft >= 17 && minutesLeft < 22
    },
    {
      icon: FileText,
      title: "Free Blueprint",
      description: "Book now to win a free product blueprint draft",
      active: minutesLeft > 0 && minutesLeft < 17
    },
    {
      icon: Clock,
      title: "Bonuses Reset",
      description: "Timer expired. Next visit resets bonuses.",
      active: minutesLeft === 0
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-3 elite-card px-8 py-4 rounded-xl">
          <Clock className="w-8 h-8 text-gradient-red-orange" />
          <div className="text-5xl md:text-6xl font-bold text-gradient-red-orange">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Bonus Segments */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {bonuses.map((bonus, index) => {
          const BonusIcon = bonus.icon;
          return (
            <div
              key={index}
              className={`elite-card p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
                bonus.active
                  ? "gradient-red-orange text-white glow-orange scale-105"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <BonusIcon className={`w-8 h-8 mb-2 ${bonus.active ? 'text-white' : 'text-muted-foreground'}`} />
              <p className="text-xs font-bold">{bonus.title}</p>
            </div>
          );
        })}
      </div>

      {/* Active Bonus Description */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          {bonuses.find(b => b.active)?.description}
        </p>
        {minutesLeft > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Exclusive bonus expires when timer reaches zero
          </p>
        )}
      </div>
    </div>
  );
};

export default CountdownBonus;
