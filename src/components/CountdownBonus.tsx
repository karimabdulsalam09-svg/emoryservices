import { useEffect, useState } from "react";
import { Trophy, Zap, FileText, Sparkles, Clock } from "lucide-react";

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
  
  // Determine current bonus based on time remaining
  const getCurrentBonus = () => {
    if (minutesLeft >= 27) {
      return {
        icon: Trophy,
        title: "PREMIUM BONUS",
        description: "Book now to win 75/25 revenue split on your first $2K",
        color: "text-gradient-red-orange"
      };
    } else if (minutesLeft >= 22) {
      return {
        icon: Zap,
        title: "PRIORITY BONUS",
        description: "Book now to win front-of-queue priority access",
        color: "text-gradient-red-orange"
      };
    } else if (minutesLeft >= 17) {
      return {
        icon: Sparkles,
        title: "STRATEGY BONUS",
        description: "Book now to win a personalized monetizable topic audit",
        color: "text-gradient-orange-blue"
      };
    } else if (minutesLeft > 0) {
      return {
        icon: FileText,
        title: "BLUEPRINT BONUS",
        description: "Book now to win a free product blueprint draft",
        color: "text-gradient-orange-blue"
      };
    } else {
      return {
        icon: Clock,
        title: "BONUSES RESET",
        description: "Timer expired. Bonuses will reset on next visit.",
        color: "text-muted-foreground"
      };
    }
  };

  const currentBonus = getCurrentBonus();
  const BonusIcon = currentBonus.icon;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <div className="elite-card p-8 text-center space-y-6">
        {/* Timer Display */}
        <div className="inline-flex items-center justify-center gap-3">
          <Clock className="w-8 h-8 text-gradient-red-orange" />
          <div className="text-5xl md:text-6xl font-bold text-gradient-red-orange">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Bonus Icon */}
        <div className="flex justify-center">
          <div className={`p-6 rounded-full ${minutesLeft > 0 ? 'gradient-red-orange glow-orange' : 'bg-muted/50'} transition-all duration-500`}>
            <BonusIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Bonus Title */}
        <div>
          <h3 className={`text-2xl font-bold mb-2 ${currentBonus.color}`}>
            {currentBonus.title}
          </h3>
          <p className="text-lg text-foreground font-semibold">
            {currentBonus.description}
          </p>
        </div>

        {/* Helper Text */}
        {minutesLeft > 0 && (
          <p className="text-sm text-muted-foreground pt-2">
            Exclusive bonus expires when timer reaches zero
          </p>
        )}
      </div>
    </div>
  );
};

export default CountdownBonus;
