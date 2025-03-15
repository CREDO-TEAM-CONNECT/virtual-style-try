
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryProvider } from "./context/GalleryContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import TryOn from "./pages/TryOn";
import Gallery from "./pages/Gallery";
import Auth from "./pages/Auth";
import Models from "./pages/Models";
import UserProducts from "./pages/UserProducts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <GalleryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/try-on" element={<TryOn />} />
              <Route path="/try-on/:productId" element={<TryOn />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/models" element={<Models />} />
              <Route path="/products" element={<UserProducts />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GalleryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
