
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Add scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-32 pb-20 px-4 md:pt-40 md:pb-32"
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-gray-100 rounded-full animate-fade-in">
              AI-Powered Fashion
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 animate-fade-in">
              Try Before You Buy, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
                Virtually Perfect Fit
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in">
              Experience clothes virtually with our AI technology. <br className="hidden md:block" />
              See how they look on you before making a purchase.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/try-on">
                <Button className="w-full sm:w-auto px-8 py-6 bg-black text-white hover:bg-black/90 transition-colors">
                  Try On Now
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-6 border border-gray-200">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 opacity-0 translate-y-8 animate-on-scroll">
              How Virtual Try-On Works
            </h2>
            <p className="text-gray-600 opacity-0 translate-y-8 animate-on-scroll">
              Our AI-powered technology makes it easy to visualize how clothes will look on you,
              helping you make confident purchasing decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Browse Products",
                description: "Explore our curated collection of clothing items from various brands and retailers.",
                delay: 0,
              },
              {
                title: "Virtual Try-On",
                description: "Select an item and see how it looks on you with our advanced AI visualization technology.",
                delay: 100,
              },
              {
                title: "Shop With Confidence",
                description: "Purchase the items you love directly from retailers, knowing exactly how they'll look.",
                delay: 200,
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 opacity-0 translate-y-8 animate-on-scroll"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="mb-2 text-sm font-medium text-gray-500 opacity-0 translate-y-8 animate-on-scroll">
                Featured Collection
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold opacity-0 translate-y-8 animate-on-scroll">
                Trending Now
              </h2>
            </div>
            <Link 
              to="/try-on" 
              className="group inline-flex items-center mt-4 md:mt-0 text-sm font-medium opacity-0 translate-y-8 animate-on-scroll"
            >
              View All Products
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="opacity-0 translate-y-8 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} featured />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 opacity-0 translate-y-8 animate-on-scroll">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-white/80 mb-8 opacity-0 translate-y-8 animate-on-scroll">
              Try on clothes virtually, save your favorites, and shop with confidence.
            </p>
            <Link 
              to="/try-on"
              className="inline-block opacity-0 translate-y-8 animate-on-scroll"
            >
              <Button className="px-8 py-6 bg-white text-black hover:bg-white/90 transition-colors">
                Start Virtual Try-On
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
