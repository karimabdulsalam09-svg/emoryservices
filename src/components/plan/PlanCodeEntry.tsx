import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight } from "lucide-react";

interface PlanCodeEntryProps {
  onSubmit: (code: string) => void;
  loading: boolean;
  defaultCode: string;
}

const PlanCodeEntry = ({ onSubmit, loading, defaultCode }: PlanCodeEntryProps) => {
  const [code, setCode] = useState(defaultCode);

  return (
    <div className="max-w-lg mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <KeyRound className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your <span className="text-gradient-neon">Launch Plan</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter the access code shared by your strategist to view your personalised 14-day digital product launch plan.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onSubmit(code);
        }}
        className="glass-card p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">
            Access Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. LAUNCH-ABC123"
            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={20}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground font-bold"
          disabled={loading || !code.trim()}
        >
          {loading ? "Loading your plan..." : "View My Plan"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.form>
    </div>
  );
};

export default PlanCodeEntry;
