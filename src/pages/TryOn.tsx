
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts'; 
import { useDynamicProducts } from '@/hooks/useDynamicProducts';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/products';
import { useTryOn } from '@/hooks/useTryOn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TryOnCanvas from '@/components/TryOnCanvas';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';

const TryOn = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, fetchProducts } = useProducts();
  const { dynamicProducts } = useDynamicProducts();
  const { isLoading, generateTryOn, currentResult } = useTryOn();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);
  
  // Fetch products on mount
  useEffect(() => {
    if (user) {
      fetchProducts(true); // Get both user's products and public products
    }
  }, [user]);
  
  // Set selected product when productId changes or products load
  useEffect(() => {
    if (productId) {
      // Find in user's products
      const product = products.find(p => p.id === productId);
      if (product) {
        // Map from database product to Product interface
        const mainImage = product.images?.find(img => img.type === 'main')?.url || '';
        const galleryImages = product.images
          ?.filter(img => img.type !== 'main')
          .map(img => img.url) || [];
          
        // Map database category to the expected enum values in Product interface
        let mappedCategory: "tops" | "bottoms" | "dresses" | "outerwear" | "accessories" = "accessories";
        if (product.category === "shirts") mappedCategory = "tops";
        else if (product.category === "pants") mappedCategory = "bottoms";
        else if (product.category === "dresses") mappedCategory = "dresses";
        else if (product.category === "coats") mappedCategory = "outerwear";
        
        setSelectedProduct({
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
        });
        return;
      }
      
      // If not found in user's products, check dynamic products
      const dynamicProduct = dynamicProducts.find(p => p.id === productId);
      if (dynamicProduct) {
        setSelectedProduct(dynamicProduct);
        return;
      }
      
      // If product not found, redirect to home
      navigate('/');
    }
  }, [productId, products, dynamicProducts, navigate]);
  
  const handleTryOn = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    if (!modelImage) {
      toast.error('Please select a model');
      return;
    }
    
    await generateTryOn(selectedProduct, {});
  };
  
  const handleModelSelect = (modelUrl: string) => {
    setModelImage(modelUrl);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8">
            Try On
          </h1>
          
          {selectedProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  <p className="text-xl font-semibold mt-2">${selectedProduct.price}</p>
                  <a 
                    href={selectedProduct.shopLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-500 hover:underline"
                  >
                    View in Shop
                  </a>
                </div>
                
                {/* Model Selection */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Select a Model</h3>
                  <div className="flex gap-4 overflow-x-auto">
                    <button 
                      onClick={() => handleModelSelect("https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png")}
                      className={`w-24 h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${modelImage === "https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png" ? 'ring-2 ring-primary' : ''}`}
                    >
                      <img 
                        src="https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png" 
                        alt="Model 1" 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                    <button 
                      onClick={() => handleModelSelect("https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png")}
                      className={`w-24 h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${modelImage === "https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png" ? 'ring-2 ring-primary' : ''}`}
                    >
                      <img 
                        src="https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png" 
                        alt="Model 2" 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                    {/* Add more models here */}
                  </div>
                </div>
                
                {/* Try On Button */}
                <Button 
                  onClick={handleTryOn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Trying On...' : 'Try On'}
                </Button>
              </div>
              
              {/* TryOnCanvas or Result */}
              <div className="relative">
                {currentResult && currentResult.success && currentResult.imageUrl ? (
                  <img 
                    src={currentResult.imageUrl} 
                    alt="Try On Result" 
                    className="w-full rounded-lg shadow-lg" 
                  />
                ) : (
                  <TryOnCanvas 
                    product={selectedProduct} 
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No product selected</h3>
              <p className="text-gray-500 mb-6">
                Select a product to see it on a model.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TryOn;
