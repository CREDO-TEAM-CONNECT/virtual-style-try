
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryProvider } from "./context/GalleryContext";
import Index from "./pages/Index";
import TryOn from "./pages/TryOn";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GalleryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/try-on" element={<TryOn />} />
            <Route path="/try-on/:productId" element={<TryOn />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GalleryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
