import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ClientPlan, PlanDay } from "@/pages/ViewMyPlan";
import { X, Plus, Wand2, Copy, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PlanAdminOverlayProps {
  onClose: () => void;
  currentPlan: ClientPlan | null;
  onPlanUpdated: (plan: ClientPlan) => void;
}

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LAUNCH-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const PlanAdminOverlay = ({ onClose, currentPlan, onPlanUpdated }: PlanAdminOverlayProps) => {
  const [tab, setTab] = useState<"create" | "manage" | "edit">("manage");
  const [allPlans, setAllPlans] = useState<ClientPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // Create form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [rawPlan, setRawPlan] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);

  // Edit form
  const [editInstructions, setEditInstructions] = useState("");
  const [editingPlan, setEditingPlan] = useState<ClientPlan | null>(currentPlan);

  useEffect(() => {
    loadAllPlans();
  }, []);

  const loadAllPlans = async () => {
    const { data } = await supabase
      .from("client_plans")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setAllPlans(data.map(d => ({
        ...d,
        plan_data: (d.plan_data as unknown as PlanDay[]) || [],
        frontend_plan_data: (d.frontend_plan_data as unknown as import("@/pages/ViewMyPlan").FrontEndPlanDay[]) || [],
      })));
    }
  };

  const createPlan = async () => {
    if (!clientName.trim() || !rawPlan.trim()) {
      toast.error("Client name and plan text are required");
      return;
    }

    setAiProcessing(true);
    try {
      // Call AI to structure the plan
      const { data: aiResult, error: aiError } = await supabase.functions.invoke("structure-plan", {
        body: { rawPlan, action: "create" },
      });

      if (aiError || !aiResult?.planData) {
        throw new Error(aiError?.message || "AI failed to structure the plan");
      }

      const code = generateCode();
      const { data, error } = await supabase
        .from("client_plans")
        .insert({
          client_name: clientName.trim(),
          client_email: clientEmail.trim() || null,
          access_code: code,
          raw_plan_text: rawPlan,
          plan_data: aiResult.planData,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Plan created! Code: ${code}`);
      await loadAllPlans();
      setClientName("");
      setClientEmail("");
      setRawPlan("");
      setTab("manage");
    } catch (err: any) {
      toast.error(err.message || "Failed to create plan");
    } finally {
      setAiProcessing(false);
    }
  };

  const editPlanWithAi = async () => {
    if (!editingPlan || !editInstructions.trim()) return;

    setAiProcessing(true);
    try {
      const { data: aiResult, error: aiError } = await supabase.functions.invoke("structure-plan", {
        body: {
          action: "edit",
          existingPlan: editingPlan.plan_data,
          editInstructions: editInstructions,
        },
      });

      if (aiError || !aiResult?.planData) throw new Error("AI edit failed");

      const { error } = await supabase
        .from("client_plans")
        .update({
          plan_data: aiResult.planData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPlan.id);

      if (error) throw error;

      const updated = { ...editingPlan, plan_data: aiResult.planData };
      onPlanUpdated(updated);
      setEditingPlan(updated);
      toast.success("Plan updated with AI edits!");
      setEditInstructions("");
      await loadAllPlans();
    } catch (err: any) {
      toast.error(err.message || "Failed to edit plan");
    } finally {
      setAiProcessing(false);
    }
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase.from("client_plans").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Plan deleted");
    await loadAllPlans();
  };

  const copyCode = (code: string) => {
    const url = `${window.location.origin}/view-my-plan?code=${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Plan link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-xl font-bold">Plan Admin</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["manage", "create", "edit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "create" ? "New Plan" : t === "edit" ? "AI Edit" : "All Plans"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "manage" && (
            <>
              {allPlans.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No plans yet. Create one!</p>
              ) : (
                allPlans.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{p.client_name}</span>
                        {p.client_email && (
                          <span className="text-xs text-muted-foreground ml-2">{p.client_email}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {p.plan_data.length} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                        {p.access_code}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyCode(p.access_code)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingPlan(p);
                          setTab("edit");
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePlan(p.id)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === "create" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
                  placeholder="optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raw Plan *</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Paste the full plan text. AI will structure it into a 14-day workflow.
                </p>
                <textarea
                  value={rawPlan}
                  onChange={(e) => setRawPlan(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm resize-y"
                  placeholder="Day 1: Set up your brand identity...&#10;Day 2: Create your content strategy..."
                />
              </div>
              <Button
                onClick={createPlan}
                disabled={aiProcessing || !clientName.trim() || !rawPlan.trim()}
                className="w-full bg-primary text-primary-foreground font-bold"
              >
                {aiProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    AI is structuring the plan...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Create Plan with AI
                  </>
                )}
              </Button>
            </>
          )}

          {tab === "edit" && (
            <>
              {editingPlan ? (
                <>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <span className="text-sm font-medium">Editing: </span>
                    <span className="text-sm text-primary">{editingPlan.client_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({editingPlan.access_code})</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Edit Instructions</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tell the AI what to change. e.g. "Move the social media setup to day 3" or "Add a task about email list building to day 5"
                    </p>
                    <textarea
                      value={editInstructions}
                      onChange={(e) => setEditInstructions(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm resize-y"
                      placeholder="Describe the changes you want..."
                    />
                  </div>
                  <Button
                    onClick={editPlanWithAi}
                    disabled={aiProcessing || !editInstructions.trim()}
                    className="w-full bg-primary text-primary-foreground font-bold"
                  >
                    {aiProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        AI is editing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Apply AI Edits
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a plan from "All Plans" tab to edit it.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanAdminOverlay;
