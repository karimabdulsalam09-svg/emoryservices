import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { rawPlan, action, existingPlan, editInstructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    if (action === "edit") {
      systemPrompt = `You are a digital product launch plan editor. You have an existing structured plan and need to apply edits based on instructions. Return ONLY valid JSON — no markdown, no code fences. The output must be a JSON array of day objects with this exact structure:
[
  {
    "day": 1,
    "title": "Short title for the day",
    "summary": "Brief 1-2 sentence overview",
    "tasks": [
      {
        "title": "Task name",
        "description": "What to do",
        "type": "task|milestone|deliverable",
        "icon": "emoji"
      }
    ],
    "tip": "Optional pro tip for the day"
  }
]
Valid types: "task" (action item), "milestone" (key achievement), "deliverable" (tangible output).
Keep the same structure. Apply only the requested changes.`;
      userPrompt = `Existing plan:\n${JSON.stringify(existingPlan)}\n\nEdit instructions: ${editInstructions}`;
    } else {
      systemPrompt = `You are a digital product launch strategist. Take raw plan text and structure it into a clear 14-day launch plan. Return ONLY valid JSON — no markdown, no code fences. The output must be a JSON array of day objects with this exact structure:
[
  {
    "day": 1,
    "title": "Short title for the day",
    "summary": "Brief 1-2 sentence overview",
    "tasks": [
      {
        "title": "Task name",
        "description": "What to do",
        "type": "task|milestone|deliverable",
        "icon": "emoji"
      }
    ],
    "tip": "Optional pro tip for the day"
  }
]
Valid types: "task" (action item), "milestone" (key achievement), "deliverable" (tangible output).
Each day should have 2-5 tasks. Use relevant emojis for icons. Make it actionable and inspiring.
If the input doesn't specify 14 days, intelligently distribute the content across 14 days.`;
      userPrompt = rawPlan;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON from the AI response
    let planData;
    try {
      // Try direct parse first
      planData = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code fences
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        planData = JSON.parse(match[1].trim());
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    return new Response(JSON.stringify({ planData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("structure-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
