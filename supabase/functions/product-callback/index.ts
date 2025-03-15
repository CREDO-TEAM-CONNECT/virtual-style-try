
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    console.log("Product callback function triggered");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get tune data from request body
    const tuneData = await req.json();
    console.log("Callback received with product tune data:", tuneData);
    
    if (!tuneData || !tuneData.id || !tuneData.title) {
      console.error("Invalid tune data received:", tuneData);
      return new Response(JSON.stringify({ error: "Invalid tune data" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Extract product ID from the title
    const productId = tuneData.title.replace('clothing-', '');
    console.log(`Extracted product ID: ${productId}`);
    
    // Update product in database
    const { data, error } = await supabase
      .from("products")
      .update({
        tune_id: tuneData.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", productId)
      .select();
    
    if (error) {
      console.error("Error updating product:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    console.log("Product update successful:", data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in product callback:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
