
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    console.log("Model callback function triggered");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get tune data from request body
    const tuneData = await req.json();
    console.log("Callback received with tune data:", tuneData);
    
    if (!tuneData || !tuneData.id || !tuneData.title) {
      console.error("Invalid tune data received:", tuneData);
      return new Response(JSON.stringify({ error: "Invalid tune data" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Set status value explicitly to one of the allowed enum values
    const status = tuneData.trained_at ? "completed" : "training";
    console.log(`Setting model status to: ${status}`);
    
    // Update model status in database
    const { data, error } = await supabase
      .from("models")
      .update({
        status: status,
        token: tuneData.token,
        tune_id: tuneData.id,
        trained_at: tuneData.trained_at,
        expires_at: tuneData.expires_at,
        updated_at: new Date().toISOString()
      })
      .eq("title", tuneData.title)
      .select();
    
    if (error) {
      console.error("Error updating model:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    console.log("Model update successful:", data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in callback:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
