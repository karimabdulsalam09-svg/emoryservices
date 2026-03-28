import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ClientPlan, PlanDay } from "@/pages/ViewMyPlan";
import { Copy, Trash2, Pencil, Loader2, Wand2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LAUNCH-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const DashboardPlans = () => {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [allPlans, setAllPlans] = useState<ClientPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Create form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [rawPlan, setRawPlan] = useState("");

  // Edit
  const [editingPlan, setEditingPlan] = useState<ClientPlan | null>(null);
  const [editInstructions, setEditInstructions] = useState("");

  useEffect(() => {
    loadAllPlans();
  }, []);

  const loadAllPlans = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_plans")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setAllPlans(
        data.map((d) => ({
          ...d,
          plan_data: (d.plan_data as unknown as PlanDay[]) || [],
          frontend_plan_data: (d.frontend_plan_data as unknown as import("@/pages/ViewMyPlan").FrontEndPlanDay[]) || [],
        }))
      );
    }
    setLoading(false);
  };

  const createPlan = async () => {
    if (!clientName.trim() || !rawPlan.trim()) {
      toast.error("Client name and plan text are required");
      return;
    }
    setAiProcessing(true);
    try {
      const { data: aiResult, error: aiError } = await supabase.functions.invoke("structure-plan", {
        body: { rawPlan, action: "create" },
      });
      if (aiError || !aiResult?.planData) throw new Error(aiError?.message || "AI failed to structure the plan");

      const code = generateCode();
      const { error } = await supabase.from("client_plans").insert({
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || null,
        access_code: code,
        raw_plan_text: rawPlan,
        plan_data: aiResult.planData,
      });
      if (error) throw error;

      toast.success(`Plan created! Code: ${code}`);
      setClientName("");
      setClientEmail("");
      setRawPlan("");
      setView("list");
      await loadAllPlans();
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
          editInstructions,
        },
      });
      if (aiError || !aiResult?.planData) throw new Error("AI edit failed");

      const { error } = await supabase
        .from("client_plans")
        .update({ plan_data: aiResult.planData, updated_at: new Date().toISOString() })
        .eq("id", editingPlan.id);
      if (error) throw error;

      toast.success("Plan updated!");
      setEditInstructions("");
      setEditingPlan({ ...editingPlan, plan_data: aiResult.planData });
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

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/view-my-plan?code=${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Plan link copied!");
  };

  if (view === "create") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </Button>
        <h2 className="text-2xl font-bold">Create New Plan</h2>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client Name *</label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Sarah Johnson" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Email</label>
            <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="optional" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Raw Plan *</label>
            <p className="text-xs text-muted-foreground mb-2">
              Paste the full plan text. AI will structure it into a 14-day workflow.
            </p>
            <Textarea
              value={rawPlan}
              onChange={(e) => setRawPlan(e.target.value)}
              rows={10}
              placeholder="Day 1: Set up your brand identity...&#10;Day 2: Create your content strategy..."
            />
          </div>
          <Button
            onClick={createPlan}
            disabled={aiProcessing || !clientName.trim() || !rawPlan.trim()}
            className="w-full"
          >
            {aiProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> AI is structuring the plan...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" /> Create Plan with AI</>
            )}
          </Button>
        </Card>
      </div>
    );
  }

  if (view === "edit" && editingPlan) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => { setView("list"); setEditingPlan(null); }} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </Button>
        <h2 className="text-2xl font-bold">Edit Plan: {editingPlan.client_name}</h2>
        <Card className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-2">
            <span className="text-sm font-medium">Code:</span>
            <code className="text-xs bg-background px-2 py-1 rounded font-mono">{editingPlan.access_code}</code>
            <span className="text-xs text-muted-foreground">• {editingPlan.plan_data.length} days</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Edit Instructions</label>
            <p className="text-xs text-muted-foreground mb-2">
              Tell the AI what to change. e.g. "Move social media setup to day 3" or "Add email list building to day 5"
            </p>
            <Textarea
              value={editInstructions}
              onChange={(e) => setEditInstructions(e.target.value)}
              rows={5}
              placeholder="Describe the changes you want..."
            />
          </div>
          <Button
            onClick={editPlanWithAi}
            disabled={aiProcessing || !editInstructions.trim()}
            className="w-full"
          >
            {aiProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> AI is editing...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" /> Apply AI Edits</>
            )}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Client Plans</h2>
        <Button onClick={() => setView("create")} className="gap-2">
          <Plus className="w-4 h-4" /> New Plan
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : allPlans.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No plans yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allPlans.map((p) => (
            <Card key={p.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-lg">{p.client_name}</span>
                  {p.client_email && (
                    <span className="text-sm text-muted-foreground ml-3">{p.client_email}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {p.plan_data.length} days • {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{p.access_code}</code>
                <Button size="sm" variant="outline" onClick={() => copyLink(p.access_code)} className="gap-1">
                  <Copy className="w-3 h-3" /> Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setEditingPlan(p); setView("edit"); }}
                  className="gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => deletePlan(p.id)} className="gap-1 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPlans;
