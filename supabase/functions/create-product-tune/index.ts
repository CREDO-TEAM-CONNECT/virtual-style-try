
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

    console.log("Product tune function started with URL:", supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { productData, imageUrls } = await req.json();
    
    console.log("Request payload:", {
      productId: productData.id,
      name: productData.name,
      category: productData.category,
      imageCount: imageUrls.length
    });
    
    // Log image URLs for debugging
    console.log("Image URLs:", imageUrls);
    
    // Determine the clothing type name based on category
    let clothingName = "clothing";
    if (productData.category === "shirts") clothingName = "shirt";
    else if (productData.category === "pants") clothingName = "pants";
    else if (productData.category === "coats") clothingName = "coat";
    else if (productData.category === "swimwear") clothingName = "swimming suit";
    
    // Make request to Astria API with clothing-specific parameters
    const astriaPayload = {
      tune: {
        title: `clothing-${productData.id}`,
        name: clothingName,
        branch: "fast",
        model_type: "lora",
        base_tune_id: 1504944,  // Special clothing fine-tune base ID
        image_urls: imageUrls,
        callback: `${supabaseUrl}/functions/v1/product-callback`,
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

    // Update product in database with initial response data
    if (data && data.id) {
      console.log("Updating product in database with tune ID:", data.id);
      
      await supabase
        .from("products")
        .update({
          tune_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productData.id);
        
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
    console.error("Error creating product tune:", error);
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
