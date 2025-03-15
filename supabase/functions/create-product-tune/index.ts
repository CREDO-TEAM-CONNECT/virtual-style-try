
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const ASTRIA_API_KEY = Deno.env.get("ASTRIA_API_KEY");
    if (!ASTRIA_API_KEY) {
      throw new Error("ASTRIA_API_KEY is not set");
    }

    // Get request data
    const { productData, imageUrls } = await req.json();
    
    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    // Create Supabase client with auth token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    // Main product image to use for the tune
    const mainImageUrl = imageUrls[0];
    if (!mainImageUrl) {
      throw new Error("No product image provided");
    }
    
    console.log("Creating product tune with image:", mainImageUrl);
    
    // Create a title for the tune that includes the product name and ID
    const tuneTitle = `clothing_product_${productData.id.replace(/-/g, "_")}`;
    
    // For clothing items, use a different base tune ID (for clothes)
    const response = await fetch("https://api.astria.ai/tunes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "title": tuneTitle,
        "image_urls": [mainImageUrl],
        "base_tune_id": 1504944,
        "model_type": "lora"
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astria API error:", errorText);
      throw new Error(`Failed to create product tune: ${errorText}`);
    }
    
    const tuneData = await response.json();
    console.log("Tune created:", tuneData);
    
    // Update the product with the tune ID
    const { error: updateError } = await supabase
      .from("products")
      .update({ tune_id: tuneData.id })
      .eq("id", productData.id);
      
    if (updateError) {
      console.error("Error updating product with tune ID:", updateError);
      throw new Error(`Failed to update product with tune ID: ${updateError.message}`);
    }
    
    // Set up a callback URL for when the tuning is complete
    const callbackEndpoint = `${supabaseUrl}/functions/v1/product-callback`;
    console.log("Setting callback URL:", callbackEndpoint);
    
    const callbackResponse = await fetch(`https://api.astria.ai/tunes/${tuneData.id}/callback`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": callbackEndpoint,
        "method": "POST"
      }),
    });
    
    if (!callbackResponse.ok) {
      const callbackErrorText = await callbackResponse.text();
      console.error("Failed to set callback:", callbackErrorText);
      // This is not critical, so we'll just log the error and continue
    }
    
    return new Response(JSON.stringify(tuneData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-product-tune function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
