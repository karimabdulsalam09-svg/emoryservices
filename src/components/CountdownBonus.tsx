import { useEffect, useState } from "react";
import { Trophy, Zap, FileText, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Bonus {
  icon: typeof Trophy;
  title: string;
  description: string;
  active: boolean;
}

const CountdownBonus = () => {
  const [timeLeft, setTimeLeft] = useState(37 * 60); // 37 minutes in seconds
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedTime = localStorage.getItem("esther-countdown-start");
    const now = Date.now();
    
    if (storedTime) {
      const elapsed = Math.floor((now - parseInt(storedTime)) / 1000);
      const remaining = Math.max(0, 37 * 60 - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setIsExpired(true);
      }
    } else {
      localStorage.setItem("esther-countdown-start", now.toString());
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(interval);
          
          // Update cookie to "none" when expired
          document.cookie = `esther_bonus_tier=none; path=/; max-age=${60 * 60 * 24 * 7}`;
          return 0;
        }
        
        const newTime = prev - 1;
        
        // Update cookie on each tick based on remaining time
        let tier = 'none';
        if (newTime > 27 * 60) tier = '0-10';
        else if (newTime > 22 * 60) tier = '10-15';
        else if (newTime > 17 * 60) tier = '15-20';
        else if (newTime > 0) tier = '20-37';
        
        document.cookie = `esther_bonus_tier=${tier}; path=/; max-age=${60 * 60 * 24 * 7}`;
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Admin panel keyboard shortcut (Press Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') {
        setShowAdminPanel(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const skipTime = (minutes: number) => {
    const storedTime = localStorage.getItem("esther-countdown-start");
    if (storedTime) {
      // Subtract time to make countdown lose time (go down faster)
      const newStartTime = parseInt(storedTime) - (minutes * 60 * 1000);
      localStorage.setItem("esther-countdown-start", newStartTime.toString());
      
      const elapsed = Math.floor((Date.now() - newStartTime) / 1000);
      const remaining = Math.max(0, 37 * 60 - elapsed);
      setTimeLeft(remaining);
    }
  };

  const resetTimer = () => {
    localStorage.setItem("esther-countdown-start", Date.now().toString());
    setTimeLeft(37 * 60);
    setIsExpired(false);
  };

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
      active: !isExpired && timeLeft > 27 * 60
    },
    {
      icon: Zap,
      title: "Priority Access",
      description: "Book now to win front-of-queue priority",
      active: !isExpired && timeLeft > 22 * 60 && timeLeft <= 27 * 60
    },
    {
      icon: Sparkles,
      title: "Topic Audit",
      description: "Book now to win personalized monetizable topic audit",
      active: !isExpired && timeLeft > 17 * 60 && timeLeft <= 22 * 60
    },
    {
      icon: FileText,
      title: "Free Blueprint",
      description: "Book now to win a free product blueprint draft",
      active: !isExpired && timeLeft > 0 && timeLeft <= 17 * 60
    }
  ];

  const currentBonus = bonuses.find(b => b.active);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 md:mt-12 animate-fade-up px-2 md:px-0" style={{ animationDelay: "0.4s" }}>
      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="elite-card p-3 md:p-4 mb-4 md:mb-6 bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-red-400 mb-2 md:mb-3 font-bold">ADMIN TIMER CONTROLS</p>
          <div className="flex flex-wrap gap-1 md:gap-2">
            <Button onClick={() => skipTime(1)} size="sm" variant="outline" className="text-xs px-2 md:px-3">-1 min</Button>
            <Button onClick={() => skipTime(5)} size="sm" variant="outline" className="text-xs px-2 md:px-3">-5 min</Button>
            <Button onClick={() => skipTime(10)} size="sm" variant="outline" className="text-xs px-2 md:px-3">-10 min</Button>
            <Button onClick={() => skipTime(30)} size="sm" variant="outline" className="text-xs px-2 md:px-3">-30 min</Button>
            <Button onClick={() => resetTimer()} size="sm" variant="destructive" className="text-xs px-2 md:px-3">Reset</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Shift+A to hide this panel</p>
        </div>
      )}
      
      {/* Timer Display */}
      <div className="text-center mb-4 md:mb-6">
        <div className="relative inline-block">
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 elite-card px-4 md:px-8 py-3 md:py-4 rounded-xl">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-gradient-red-orange" />
            <div className="text-3xl md:text-6xl font-bold text-gradient-red-orange">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Expired Overlay */}
          {isExpired && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-xl border-2 border-destructive">
              <div className="text-center px-2 md:px-4">
                <p className="text-lg md:text-2xl font-bold text-destructive">EXPIRED</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Bonuses no longer available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bonus Segments - Only show if not expired */}
      {!isExpired && (
        <>
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 mb-3 md:mb-4 max-w-2xl mx-auto">
            {bonuses.map((bonus, index) => {
              const BonusIcon = bonus.icon;
              return (
                <div
                  key={index}
                  className={`elite-card p-2 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
                    bonus.active
                      ? "gradient-red-orange text-white glow-orange scale-105"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <BonusIcon className={`w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 ${bonus.active ? 'text-white' : 'text-muted-foreground'}`} />
                  <p className="text-[10px] md:text-xs font-bold">{bonus.title}</p>
                </div>
              );
            })}
          </div>

          {/* Active Bonus Description */}
          <div className="text-center px-2 md:px-0">
            <p className="text-sm md:text-lg font-semibold text-foreground">
              {currentBonus?.description}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
              Exclusive bonus expires when timer reaches zero
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CountdownBonus;
