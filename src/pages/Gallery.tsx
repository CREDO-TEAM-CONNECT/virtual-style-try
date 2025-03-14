
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGallery, SavedTryOn } from '@/context/GalleryContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

const Gallery = () => {
  const { savedItems, removeItem, clearGallery } = useGallery();
  const [selectedItem, setSelectedItem] = useState<SavedTryOn | null>(null);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  const handleRemoveItem = (id: string) => {
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    removeItem(id);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                Your Try-On Gallery
              </h1>
              <p className="text-gray-600">
                {savedItems.length === 0
                  ? 'Your gallery is empty.'
                  : `${savedItems.length} item${savedItems.length === 1 ? '' : 's'} saved`}
              </p>
            </div>
            {savedItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your gallery?')) {
                    clearGallery();
                    setSelectedItem(null);
                  }
                }}
                className="mt-4 md:mt-0"
              >
                Clear Gallery
              </Button>
            )}
          </div>
          
          {savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your gallery is empty</h2>
              <p className="text-gray-600 mb-6 text-center">
                Try on some clothes and save them to your gallery to see them here.
              </p>
              <Link to="/try-on">
                <Button>
                  Browse Collection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gallery Items */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {savedItems.map(item => (
                    <div 
                      key={item.id}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden shadow-subtle hover-lift transition-all ${
                        selectedItem?.id === item.id ? 'ring-2 ring-black' : ''
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="aspect-[3/4]">
                        <img 
                          src={item.imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay with info */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="text-white font-medium">{item.product.name}</h3>
                        <p className="text-white/80 text-sm">{item.product.brand}</p>
                      </div>
                      
                      {/* Remove button */}
                      <button
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        aria-label="Remove from gallery"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selected Item Details */}
              <div className="lg:col-span-1">
                {selectedItem ? (
                  <div className="p-6 border border-gray-200 rounded-xl sticky top-28 animate-fade-in">
                    <div className="mb-4 text-sm text-gray-500">
                      Saved on {formatDate(selectedItem.date)}
                    </div>
                    
                    <h3 className="text-xl font-medium mb-1">
                      {selectedItem.product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {selectedItem.product.brand}
                    </p>
                    <p className="text-lg font-medium mb-4">
                      ${selectedItem.product.price.toFixed(2)}
                    </p>
                    
                    <p className="text-gray-600 text-sm mb-6">
                      {selectedItem.product.description}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="space-y-3">
                      <a 
                        href={selectedItem.product.shopLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-black/90 transition-colors"
                      >
                        <ShoppingBag size={16} />
                        Shop Now
                      </a>
                      <Link 
                        to={`/try-on/${selectedItem.product.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Try On Again
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-gray-200 rounded-xl text-center">
                    <p className="text-gray-500 mb-2">
                      Select an item to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Gallery;
