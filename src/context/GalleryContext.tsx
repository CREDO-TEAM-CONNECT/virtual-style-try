
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/products';

export interface SavedTryOn {
  id: string;
  date: string;
  product: Product;
  imageUrl: string;
}

interface GalleryContextType {
  savedItems: SavedTryOn[];
  saveItem: (product: Product, imageUrl: string) => void;
  removeItem: (id: string) => void;
  clearGallery: () => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedItems, setSavedItems] = useState<SavedTryOn[]>([]);
  
  // Load saved items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem('galleryItems');
    if (storedItems) {
      try {
        setSavedItems(JSON.parse(storedItems));
      } catch (e) {
        console.error('Failed to parse gallery items from localStorage:', e);
      }
    }
  }, []);
  
  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('galleryItems', JSON.stringify(savedItems));
  }, [savedItems]);
  
  const saveItem = (product: Product, imageUrl: string) => {
    const newItem: SavedTryOn = {
      id: `saved-${Date.now()}`,
      date: new Date().toISOString(),
      product,
      imageUrl
    };
    
    setSavedItems(prev => [newItem, ...prev]);
  };
  
  const removeItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearGallery = () => {
    setSavedItems([]);
  };
  
  return (
    <GalleryContext.Provider value={{ savedItems, saveItem, removeItem, clearGallery }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
