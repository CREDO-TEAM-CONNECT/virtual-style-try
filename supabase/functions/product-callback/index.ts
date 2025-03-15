
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

serve(async (req) => {
  try {
    // Parse the callback data from Astria
    const tuneData = await req.json();
    console.log("Received product tune callback:", tuneData);
    
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract the product ID from the tune title
    // The title format is "clothing_product_{product_id}"
    const titleParts = tuneData.title.split("clothing_product_");
    if (titleParts.length < 2) {
      throw new Error(`Invalid tune title format: ${tuneData.title}`);
    }
    
    const productId = titleParts[1].replace(/_/g, "-");
    console.log("Extracted product ID:", productId);
    
    // Update the product with the tune data
    const { error } = await supabase
      .from("products")
      .update({
        tune_id: tuneData.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", productId);
      
    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in product-callback function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
