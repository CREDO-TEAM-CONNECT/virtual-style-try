
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, products, Product } from '@/lib/products';
import TryOnCanvas from '@/components/TryOnCanvas';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TryOn = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Get product data when ID changes
  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        // Set default selections
        setSelectedSize(foundProduct.size[0]);
        setSelectedColor(foundProduct.color[0]);
        
        // Get related products of the same category
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 3);
        setRelatedProducts(related);
      }
    } else {
      // If no product ID is specified, show a selection of products
      setProduct(null);
    }
  }, [productId]);
  
  // If no product ID is specified, show browsing page
  if (!productId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              Browse Collection
            </h1>
            <p className="text-gray-600 mb-12">
              Select an item to try on virtually
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="animate-scale-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 pt-32 pb-20 px-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/try-on">
            <Button variant="outline">
              Browse Collection
            </Button>
          </Link>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4">
        <div className="container mx-auto">
          {/* Back button */}
          <Link 
            to="/try-on" 
            className="inline-flex items-center text-sm font-medium mb-8 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Collection
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
            {/* Try-on Canvas */}
            <div>
              <TryOnCanvas 
                product={product} 
                selectedSize={selectedSize}
                selectedColor={selectedColor}
              />
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium text-gray-500">
                {product.brand}
              </div>
              <h1 className="text-3xl font-semibold mb-2">
                {product.name}
              </h1>
              <div className="text-xl mb-6">
                ${product.price.toFixed(2)}
              </div>
              
              <p className="text-gray-600 mb-8">
                {product.description}
              </p>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Size</span>
                  <span className="text-xs text-gray-500">
                    {selectedSize}
                  </span>
                </div>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-left"
                    onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  >
                    <span>{selectedSize}</span>
                    <ChevronDown size={16} className={`transition-transform ${sizeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {sizeDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                      {product.size.map(size => (
                        <button
                          key={size}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedSize === size ? 'bg-gray-50 font-medium' : ''
                          }`}
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeDropdownOpen(false);
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Color Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Color</span>
                  <span className="text-xs text-gray-500">
                    {selectedColor}
                  </span>
                </div>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-left"
                    onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                  >
                    <span>{selectedColor}</span>
                    <ChevronDown size={16} className={`transition-transform ${colorDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {colorDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                      {product.color.map(color => (
                        <button
                          key={color}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedColor === color ? 'bg-gray-50 font-medium' : ''
                          }`}
                          onClick={() => {
                            setSelectedColor(color);
                            setColorDropdownOpen(false);
                          }}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                You May Also Like
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(product => (
                  <div key={product.id} className="animate-scale-in">
                    <ProductCard product={product} />
                  </div>
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
