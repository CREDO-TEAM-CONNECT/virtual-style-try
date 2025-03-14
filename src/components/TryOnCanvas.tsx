
import { useState, useEffect } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { useTryOn } from '@/hooks/useTryOn';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Heart, ShoppingBag, RefreshCw, Camera, ExternalLink, CheckCircle } from 'lucide-react';

interface TryOnCanvasProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}

const TryOnCanvas = ({ product, selectedSize, selectedColor }: TryOnCanvasProps) => {
  const { generateTryOn, isLoading, currentResult } = useTryOn();
  const { saveItem } = useGallery();
  const [saved, setSaved] = useState(false);
  
  // Generate try-on when component mounts or when options change
  useEffect(() => {
    generateTryOn(product, {
      size: selectedSize,
      color: selectedColor
    });
    setSaved(false);
  }, [product.id, selectedSize, selectedColor]);
  
  const handleRegenerateTryOn = () => {
    generateTryOn(product, {
      size: selectedSize,
      color: selectedColor
    });
    setSaved(false);
  };
  
  const handleSaveToGallery = () => {
    if (currentResult?.success && currentResult.imageUrl) {
      saveItem(product, currentResult.imageUrl);
      setSaved(true);
      toast.success('Saved to your gallery!');
    }
  };
  
  const handleShopNow = () => {
    window.open(product.shopLink, '_blank');
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      {/* Canvas Area */}
      <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mb-6">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <RefreshCw size={32} className="text-gray-400 animate-spin mb-4" />
            <p className="text-sm text-gray-500">Generating try-on visualization...</p>
          </div>
        ) : currentResult?.success ? (
          <>
            <img 
              src={currentResult.imageUrl} 
              alt={`${product.name} try-on visualization`}
              className="w-full h-full object-cover animate-scale-in"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button 
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-subtle"
                onClick={handleRegenerateTryOn}
                title="Regenerate try-on"
              >
                <RefreshCw size={18} />
              </Button>
              <Button 
                size="icon"
                variant={saved ? "default" : "outline"}
                className={`h-10 w-10 rounded-full ${
                  saved 
                    ? 'bg-black text-white' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white'
                } shadow-subtle`}
                onClick={handleSaveToGallery}
                disabled={saved}
                title={saved ? "Saved to gallery" : "Save to gallery"}
              >
                {saved ? <CheckCircle size={18} /> : <Heart size={18} />}
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <Camera size={32} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">Failed to generate try-on visualization</p>
            <Button 
              variant="link" 
              onClick={handleRegenerateTryOn}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSaveToGallery}
          disabled={isLoading || !currentResult?.success || saved}
          className="flex-1 gap-2 py-6 border border-black bg-black text-white hover:bg-black/90 transition-colors"
        >
          {saved ? (
            <>
              <CheckCircle size={18} />
              Saved to Gallery
            </>
          ) : (
            <>
              <Heart size={18} />
              Save to Gallery
            </>
          )}
        </Button>
        <Button
          onClick={handleShopNow}
          className="flex-1 gap-2 py-6 bg-white text-black border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={18} />
          Shop Now
          <ExternalLink size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TryOnCanvas;
