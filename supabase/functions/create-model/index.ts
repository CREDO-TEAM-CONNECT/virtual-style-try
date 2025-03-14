
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const astriaApiKey = Deno.env.get("ASTRIA_API_KEY") as string;
    const astriaApiDomain = "https://api.astria.ai";

    console.log("Function started with URL:", supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { modelData, imageUrls } = await req.json();
    
    console.log("Request payload:", {
      modelId: modelData.id,
      title: modelData.title,
      name: modelData.name,
      imageCount: imageUrls.length
    });
    
    // Log image URLs for debugging
    console.log("Image URLs:", imageUrls);
    
    // Make request to Astria API
    const astriaPayload = {
      tune: {
        title: modelData.title,
        name: modelData.name,
        branch: "fast",
        model_type: "lora",
        image_urls: imageUrls,
        callback: `${supabaseUrl}/functions/v1/model-callback`,
      },
    };
    
    console.log("Sending request to Astria API:", astriaPayload);
    
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${astriaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(astriaPayload),
    };

    console.log("Making request to:", `${astriaApiDomain}/tunes`);
    
    const response = await fetch(`${astriaApiDomain}/tunes`, options);
    console.log("Response status:", response.status);
    
    const data = await response.json();
    console.log("Response data:", data);

    // Update model in database with initial response data - ensure status is one of the valid enum values
    if (data && data.id) {
      console.log("Updating model in database with tune ID:", data.id);
      
      await supabase
        .from("models")
        .update({
          tune_id: data.id,
          token: data.token,
          status: "training", // Explicitly set as string literal
          updated_at: new Date().toISOString(),
        })
        .eq("id", modelData.id);
        
      console.log("Database update completed");
    } else {
      console.log("No ID in response data, skipping database update");
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error creating model:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
