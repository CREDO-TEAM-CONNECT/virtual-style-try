
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { GalleryProvider } from '@/context/GalleryContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Gallery from '@/pages/Gallery';
import Models from '@/pages/Models';
import NotFound from '@/pages/NotFound';
import TryOn from '@/pages/TryOn';
import UserProducts from '@/pages/UserProducts';

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        <GalleryProvider>
          <Toaster position="top-center" richColors />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/models" element={<Models />} />
              <Route path="/products" element={<UserProducts />} />
              <Route path="/try-on/:productId?" element={<TryOn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </GalleryProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
