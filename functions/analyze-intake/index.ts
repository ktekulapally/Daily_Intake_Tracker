// Supabase Edge Function: analyze-intake
//
// Called live by a signed-in user with their JWT access token.
// Row Level Security (RLS) ensures only their own intake records are analyzed.
//
// Secret:
//   GROQ_API_KEY (from console.groq.com) OR GEMINI_API_KEY (from aistudio.google.com)
//
// Request body: { "period": "7d" | "14d" | "30d" }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const groqKey = Deno.env.get("GROQ_API_KEY");

    // Client scoped to the caller's own JWT
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      return json({ error: "Could not verify the signed-in user." }, 401);
    }

    let body: { period?: string } = {};
    try { body = await req.json(); } catch {}
    const period = body.period === "14d" || body.period === "30d" ? body.period : "7d";
    const daysBack = period === "14d" ? 14 : (period === "30d" ? 30 : 7);

    const now = new Date();
    const past = new Date(Date.now() - (daysBack - 1) * 86400000);
    const startDate = past.toISOString().split("T")[0];
    const endDate = now.toISOString().split("T")[0];

    const { data: records, error: dbErr } = await supabase
      .from("intake_records")
      .select("*")
      .gte("intake_date", startDate)
      .lte("intake_date", endDate)
      .order("intake_date", { ascending: false });

    if (dbErr) throw dbErr;

    if (!records || records.length === 0) {
      return json({
        advice: `No records logged in the past ${daysBack} days. Log your intake first to generate an AI review!`,
        macroDistribution: {}
      });
    }

    // Macro categorization
    let protein = 0, carbs = 0, veg = 0, fruits = 0, dairy = 0, bevs = 0, snacks = 0;
    const proteinItems: string[] = [];
    const carbItems: string[] = [];

    records.forEach((r: any) => {
      const name = (r.food_name || "").toLowerCase();
      const cat = (r.category || "").toLowerCase();
      
      if (['protein/meat', 'seafood', 'pulses/legumes'].includes(cat) || name.includes('egg') || name.includes('tofu') || name.includes('dal')) {
        protein++;
        proteinItems.push(r.food_name);
      } else if (['rice/grains'].includes(cat) || name.includes('rice') || name.includes('bread') || name.includes('oats')) {
        carbs++;
        carbItems.push(r.food_name);
      } else if (cat.includes('vegetable')) {
        veg++;
      } else if (cat.includes('fruit')) {
        fruits++;
      } else if (cat.includes('dairy')) {
        dairy++;
      } else if (cat.includes('beverage')) {
        bevs++;
      } else {
        snacks++;
      }
    });

    const prompt = `
You are an evidence-based clinical nutrition consultant reviewing a user's food log for the past ${daysBack} days:
- Total items logged: ${records.length}
- Protein foods count: ${protein} (${proteinItems.slice(0, 8).join(', ')})
- Carbohydrate foods count: ${carbs} (${carbItems.slice(0, 8).join(', ')})
- Vegetables count: ${veg}
- Fruits count: ${fruits}
- Dairy: ${dairy}, Beverages: ${bevs}, Snacks/Processed: ${snacks}

Please provide:
1. "Weekly Intake Review": Concise review of the foods they have consumed.
2. "Protein vs. Carbohydrate Breakdown": Analysis of whether they are eating protein-rich vs carb-rich foods and overall balance.
3. "Actionable Recommendations for Next Week": 3-4 specific suggestions.
4. "Suggested Meal Blueprint for Next Week": A practical outline.
    `;

    if (groqKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const groqData = await groqRes.json();
      return json({
        advice: groqData.choices?.[0]?.message?.content || "No advice returned.",
        macroDistribution: {
          'Protein-Rich Foods': protein,
          'Carbohydrate-Rich Foods': carbs,
          'Vegetables & Fiber': veg,
          'Fruits & Berries': fruits,
          'Dairy & Healthy Fats': dairy,
          'Beverages & Hydration': bevs,
          'Snacks & Processed': snacks
        }
      });
    }

    return json({
      advice: "GROQ_API_KEY is not configured on your Supabase edge function environment. Use the browser built-in AI mode or set the GROQ_API_KEY secret.",
      macroDistribution: {
        'Protein-Rich Foods': protein,
        'Carbohydrate-Rich Foods': carbs,
        'Vegetables & Fiber': veg
      }
    });

  } catch (err: any) {
    return json({ error: err.message || String(err) }, 500);
  }
});

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
