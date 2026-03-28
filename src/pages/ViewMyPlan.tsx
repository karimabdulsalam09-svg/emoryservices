import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BackgroundGlows from "@/components/BackgroundGlows";
import Footer from "@/components/Footer";
import PlanViewer from "@/components/plan/PlanViewer";
import PlanCodeEntry from "@/components/plan/PlanCodeEntry";
import PlanAdminOverlay from "@/components/plan/PlanAdminOverlay";
import { toast } from "sonner";

export interface PlanTask {
  title: string;
  description: string;
  role: "operator" | "creator";
}

export interface PlanDay {
  day: number;
  title: string;
  summary: string;
  tasks: PlanTask[];
  contentSlot?: boolean;
  tip?: string;
}

export interface FrontEndPlanDay {
  day: number;
  title: string;
  objective: string;
  whyItMatters: string;
  actions: string[];
  psychologicalLever: string;
  expectedOutcome: string;
  contentIdeas: string[];
}

export interface ClientPlan {
  id: string;
  client_name: string;
  client_email: string | null;
  access_code: string;
  raw_plan_text: string | null;
  plan_data: PlanDay[];
  frontend_plan_data: FrontEndPlanDay[];
  created_at: string;
  updated_at: string;
}

const ViewMyPlan = () => {
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState<ClientPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [codeFromUrl] = useState(searchParams.get("code") || "");

  // Shift+A to toggle admin
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "A") {
        const isAdmin = localStorage.getItem("admin_authenticated") === "true";
        if (isAdmin) {
          setShowAdmin((prev) => !prev);
        } else {
          toast.error("Admin access required");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const loadPlan = useCallback(async (code: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_plans")
      .select("*")
      .eq("access_code", code.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      toast.error("Invalid plan code. Please check and try again.");
      setLoading(false);
      return;
    }

    // Cast the plan_data from Json to PlanDay[]
    const typedPlan: ClientPlan = {
      ...data,
      plan_data: (data.plan_data as unknown as PlanDay[]) || [],
    };
    setPlan(typedPlan);
    setLoading(false);
  }, []);

  // Auto-load if code in URL
  useEffect(() => {
    if (codeFromUrl) {
      loadPlan(codeFromUrl);
    }
  }, [codeFromUrl, loadPlan]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundGlows />
      <Navbar />
      <div className="relative z-10 pt-32 pb-20">
        {!plan ? (
          <PlanCodeEntry
            onSubmit={loadPlan}
            loading={loading}
            defaultCode={codeFromUrl}
          />
        ) : (
          <PlanViewer plan={plan} />
        )}
      </div>
      <Footer />

      {showAdmin && (
        <PlanAdminOverlay
          onClose={() => setShowAdmin(false)}
          currentPlan={plan}
          onPlanUpdated={(updated) => setPlan(updated)}
        />
      )}
    </div>
  );
};

export default ViewMyPlan;
