
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts'; 
import { useDynamicProducts } from '@/hooks/useDynamicProducts';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/products';
import { useTryOn } from '@/hooks/useTryOn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TryOnCanvas from '@/components/TryOnCanvas';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);
  
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
  
  const relatedProducts = products
    .filter(p => p.id !== productId && p.category === selectedProduct?.category)
    .slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4">
        <div className="container mx-auto">
          {!productId && (
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 animate-fade-in">
                Virtual Try-On Experience
              </h1>
              <p className="text-gray-600 mb-8 animate-fade-in">
                Select from our curated collection or upload your own products to see how they look on you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
                <Link to="/products">
                  <Button className="w-full sm:w-auto px-6 py-5 gap-2">
                    <ShoppingBag size={18} />
                    Browse Products
                  </Button>
                </Link>
                <Link to="/models">
                  <Button variant="outline" className="w-full sm:w-auto px-6 py-5 gap-2">
                    <Sparkles size={18} />
                    Create Your Model
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {selectedProduct ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* TryOnCanvas or Result */}
              <div className="relative order-2 lg:order-1">
                {currentResult && currentResult.success && currentResult.imageUrl ? (
                  <div className="relative">
                    <img 
                      src={currentResult.imageUrl} 
                      alt="Try On Result" 
                      className="w-full rounded-xl shadow-lg animate-scale-in" 
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button 
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-subtle"
                        onClick={() => {
                          // Copy to clipboard functionality
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied to clipboard!');
                        }}
                        title="Share"
                      >
                        <Share2 size={18} />
                      </Button>
                      <Button 
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-subtle"
                        onClick={() => handleTryOn()}
                        title="Regenerate"
                      >
                        <Sparkles size={18} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <TryOnCanvas 
                    product={selectedProduct} 
                  />
                )}
              </div>
              
              {/* Product Details */}
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      {selectedProduct.brand}
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xl font-semibold">${selectedProduct.price}</p>
                      <div className="flex gap-2">
                        {selectedProduct.shopLink && (
                          <a 
                            href={selectedProduct.shopLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          >
                            View in Shop <ArrowRight size={14} className="ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center justify-between w-full text-left text-sm font-medium border-t border-b border-gray-100 py-3"
                      >
                        Product Details
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      {showDetails && (
                        <div className="py-3 text-sm text-gray-600 animate-fade-in">
                          <p className="mb-2">{selectedProduct.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                              <p className="capitalize">{selectedProduct.category}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Available Sizes</p>
                              <div className="flex flex-wrap gap-1">
                                {selectedProduct.size.map((size, index) => (
                                  <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Colors</p>
                              <div className="flex flex-wrap gap-1">
                                {selectedProduct.color.map((color, index) => (
                                  <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                                    {color}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Tabs defaultValue="models">
                      <TabsList className="w-full mb-6">
                        <TabsTrigger value="models" className="flex-1">Select Model</TabsTrigger>
                        <TabsTrigger value="options" className="flex-1">Try-On Options</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="models">
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-medium">Choose a model</h3>
                            <Link to="/models" className="text-xs text-blue-600 hover:underline">
                              Create your own
                            </Link>
                          </div>
                          
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            <button 
                              onClick={() => handleModelSelect("https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png")}
                              className={`aspect-[3/4] rounded-lg overflow-hidden border-2 hover:shadow-md transition-shadow ${
                                modelImage === "https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png" 
                                  ? 'border-blue-500 shadow-sm' 
                                  : 'border-transparent'
                              }`}
                            >
                              <img 
                                src="https://pbxt.replicate.delivery/urn:ads:replicate:9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64@https://replicate.delivery/pbxt/9yd4r-4z4efl-44z7lnrz3fehfu77xm7rbq7odjrbgt4wb2ora64/output.png" 
                                alt="Model 1" 
                                className="w-full h-full object-cover" 
                              />
                            </button>
                            <button 
                              onClick={() => handleModelSelect("https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png")}
                              className={`aspect-[3/4] rounded-lg overflow-hidden border-2 hover:shadow-md transition-shadow ${
                                modelImage === "https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png" 
                                  ? 'border-blue-500 shadow-sm' 
                                  : 'border-transparent'
                              }`}
                            >
                              <img 
                                src="https://pbxt.replicate.delivery/urn:ads:replicate:5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4@https://replicate.delivery/pbxt/5xl4x-5v4vd7-4dg7ln6v6vb44y5qczauf7dt3cz47w46dtm4/output.png" 
                                alt="Model 2" 
                                className="w-full h-full object-cover" 
                              />
                            </button>
                            {/* Placeholder for "Create your own" button */}
                            <Link 
                              to="/models"
                              className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-2 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Sparkles size={24} className="mb-2 text-gray-400" />
                              <span className="text-xs text-center">Create your model</span>
                            </Link>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="options">
                        <div className="mb-6 space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                            <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-blue-800">
                                Advanced options allow you to adjust lighting, pose, and background settings for the most accurate virtual try-on.
                              </p>
                              <Link to="#" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                                Learn more about try-on options
                              </Link>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    {/* Try On Button */}
                    <Button 
                      onClick={handleTryOn}
                      disabled={isLoading || !modelImage}
                      className="w-full py-6"
                    >
                      {isLoading ? 'Generating...' : 'Try On Now'}
                    </Button>
                    
                    {!modelImage && (
                      <p className="text-xs text-red-500 mt-2 text-center">Please select a model to continue</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No product selected</h3>
              <p className="text-gray-500 mb-6">
                Select a product to see it on a model.
              </p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
          
          {/* Related Products */}
          {selectedProduct && relatedProducts.length > 0 && (
            <div className="mt-20">
              <h3 className="text-xl font-semibold mb-6">You might also like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/try-on/${product.id}`}
                    className="group block"
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3 group-hover:shadow-md transition-shadow">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h4 className="font-medium group-hover:text-blue-600 transition-colors">{product.name}</h4>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TryOn;
