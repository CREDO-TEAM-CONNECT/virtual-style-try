
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  type: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  size: string[];
  color: string[];
  is_public: boolean;
  shop_link?: string;
  tune_id?: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export const useProducts = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  const fetchProducts = async (includePublic = true) => {
    setIsLoading(true);
    try {
      // Build query - include public products if requested
      let query = supabase
        .from('products')
        .select('*, product_images(*)');
      
      if (user) {
        if (includePublic) {
          // If user is logged in, get their products and public products
          query = query.or(`user_id.eq.${user.id},is_public.eq.true`);
        } else {
          // If only user's products are needed
          query = query.eq('user_id', user.id);
        }
      } else if (includePublic) {
        // If user is not logged in, only get public products
        query = query.eq('is_public', true);
      } else {
        // If user is not logged in and public products are not requested, return empty array
        setProducts([]);
        setIsLoading(false);
        return [];
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match Product interface
      const transformedProducts = data.map(product => ({
        ...product,
        images: product.product_images
      })) as Product[];
      
      setProducts(transformedProducts);
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createProduct = async (
    productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    files: File[]
  ): Promise<Product | null> => {
    if (!user) {
      toast.error('You must be logged in to create a product');
      return null;
    }
    
    if (!files.length) {
      toast.error('You must upload at least one image');
      return null;
    }
    
    setIsLoading(true);
    try {
      // Validate category to ensure it matches the database constraints
      if (!['shirts', 'pants', 'coats', 'dresses', 'shoes', 'hats', 'accessories', 'swimwear'].includes(productData.category)) {
        throw new Error('Invalid category selected');
      }
      
      // Create product record first
      const productId = uuidv4();
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          id: productId,
          user_id: user.id,
          ...productData,
          is_public: productData.is_public || false
        })
        .select()
        .single();
      
      if (productError) throw productError;
      
      // Upload images to storage and create records
      const imageUrls = await Promise.all(
        files.map(async (file, index) => {
          // Create a clean filename
          const fileName = `${productId}_${index}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          
          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('product_images')
            .getPublicUrl(fileName);
          
          const imageUrl = publicUrlData.publicUrl;
          
          // Determine image type (main for first image, additional for others)
          const imageType = index === 0 ? 'main' : 'additional';
          
          // Create image record
          const { error: imageRecordError } = await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              url: imageUrl,
              type: imageType
            });
          
          if (imageRecordError) throw imageRecordError;
          
          return imageUrl;
        })
      );
      
      // If it's a clothing item, create a tune using Astria API
      if (['shirts', 'pants', 'coats', 'dresses', 'swimwear'].includes(productData.category)) {
        // Call edge function to create product tune
        const response = await fetch('/api/create-product-tune', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            productData: product,
            imageUrls
          })
        });
        
        if (!response.ok) {
          console.warn('Warning: Fine-tuning may not have initiated properly', await response.text());
        }
      }
      
      // Fetch updated product with images
      const { data: updatedProduct, error: fetchError } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', productId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newProduct = {
        ...updatedProduct,
        images: updatedProduct.product_images
      } as Product;
      
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product created successfully');
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProduct = async (
    productId: string, 
    updates: Partial<Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<Product | null> => {
    if (!user) {
      toast.error('You must be logged in to update a product');
      return null;
    }
    
    setIsLoading(true);
    try {
      // Validate category if it's being updated
      if (updates.category && !['shirts', 'pants', 'coats', 'dresses', 'shoes', 'hats', 'accessories', 'swimwear'].includes(updates.category)) {
        throw new Error('Invalid category selected');
      }
      
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select('*, product_images(*)')
        .single();
      
      if (error) throw error;
      
      const updatedProduct = {
        ...data,
        images: data.product_images
      } as Product;
      
      setProducts(prev => 
        prev.map(p => p.id === productId ? updatedProduct : p)
      );
      
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProduct = async (productId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete a product');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Get product images first
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId);
      
      // Delete product (this will cascade delete the image records)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Delete storage files
      if (images && images.length > 0) {
        const fileNames = images.map((image, index) => 
          `${productId}_${index}_${image.url.split('/').pop()?.replace(/[^a-zA-Z0-9.]/g, '_')}`
        );
        
        await supabase.storage
          .from('product_images')
          .remove(fileNames);
      }
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
