
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
        // Find main image and additional images
        const mainImage = product.product_images.find((img: any) => img.type === 'main')?.url || '';
        const additionalImages = product.product_images
          .filter((img: any) => img.type !== 'main')
          .map((img: any) => img.url);
        
        return {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          description: product.description,
          category: product.category,
          size: product.size,
          color: product.color,
          shopLink: product.shop_link || '',
          images: {
            main: mainImage,
            additional: additionalImages
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
