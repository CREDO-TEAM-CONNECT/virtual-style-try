
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products';

export const useDynamicProducts = () => {
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchDynamicProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch all public products
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match the Product interface
      const transformedProducts: Product[] = data.map(product => {
        // Find main image and additional images for gallery
        const mainImage = product.product_images.find((img: any) => img.type === 'main')?.url || '';
        const galleryImages = product.product_images
          .filter((img: any) => img.type !== 'main')
          .map((img: any) => img.url);
        
        // Map database category to the expected enum values in Product interface
        let mappedCategory: "tops" | "bottoms" | "dresses" | "outerwear" | "accessories" = "accessories";
        if (product.category === "shirts") mappedCategory = "tops";
        else if (product.category === "pants") mappedCategory = "bottoms";
        else if (product.category === "dresses") mappedCategory = "dresses";
        else if (product.category === "coats") mappedCategory = "outerwear";
        
        return {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          description: product.description,
          category: mappedCategory,
          size: product.size,
          color: product.color,
          shopLink: product.shop_link || '',
          images: {
            main: mainImage,
            gallery: galleryImages,
            model: undefined
          }
        };
      });
      
      setDynamicProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching dynamic products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDynamicProducts();
  }, []);
  
  return {
    dynamicProducts,
    isLoading,
    refreshProducts: fetchDynamicProducts
  };
};
