import { useEffect, useState } from "react";

interface Bonus {
  timeRange: string;
  title: string;
  active: boolean;
}

const CountdownBonus = () => {
  const [timeLeft, setTimeLeft] = useState(37 * 60); // 37 minutes in seconds
  const [bonuses, setBonuses] = useState<Bonus[]>([
    { timeRange: "0-10", title: "75/25 Split on First $2K", active: false },
    { timeRange: "10-15", title: "Front-of-Queue Priority", active: false },
    { timeRange: "15-20", title: "Personalized Topic Audit", active: false },
    { timeRange: "20-37", title: "Free Product Blueprint", active: false },
    { timeRange: "37+", title: "Bonuses Reset", active: false },
  ]);

  useEffect(() => {
    // Check if timer exists in localStorage
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
          // Reset timer and set new start time
          const newStartTime = Date.now();
          localStorage.setItem("optima-countdown-start", newStartTime.toString());
          return 37 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const minutesLeft = Math.floor(timeLeft / 60);
    const updatedBonuses = bonuses.map((bonus) => {
      if (bonus.timeRange === "0-10") return { ...bonus, active: minutesLeft >= 27 };
      if (bonus.timeRange === "10-15") return { ...bonus, active: minutesLeft >= 22 && minutesLeft < 27 };
      if (bonus.timeRange === "15-20") return { ...bonus, active: minutesLeft >= 17 && minutesLeft < 22 };
      if (bonus.timeRange === "20-37") return { ...bonus, active: minutesLeft > 0 && minutesLeft < 17 };
      if (bonus.timeRange === "37+") return { ...bonus, active: minutesLeft === 0 };
      return bonus;
    });
    setBonuses(updatedBonuses);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
      {/* Digital Timer */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gradient-red-orange inline-block px-6 py-3 elite-card rounded-lg">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* 5-Segment Bonus Bar */}
      <div className="flex gap-1 mb-4">
        {bonuses.map((bonus, index) => (
          <div
            key={index}
            className={`flex-1 h-16 rounded-lg flex items-center justify-center text-xs font-semibold text-center px-2 transition-all duration-300 ${
              bonus.active
                ? "gradient-red-orange text-white glow-orange scale-105"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {bonus.title}
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <p className="text-sm text-muted-foreground text-center">
        Book a call before the timer ends to unlock exclusive bonuses.
      </p>
    </div>
  );
};

export default CountdownBonus;
