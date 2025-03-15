
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Camera, Sparkles, Users, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedBrands from '@/components/FeaturedBrands';
import Testimonials from '@/components/Testimonials';

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
        className="pt-32 pb-24 px-4 md:pt-40 md:pb-32 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-black text-white rounded-full animate-fade-in">
              AI-Powered Fashion Revolution
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 animate-fade-in">
              See How Clothes <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Look on You — Before You Buy
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in">
              VIRTUFIT helps shoppers make confident purchases and brands reduce returns. <br className="hidden md:block" />
              Try on any clothing virtually and save your favorite looks instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/try-on">
                <Button className="w-full sm:w-auto px-8 py-6 bg-black text-white hover:bg-black/90 transition-colors">
                  Try On Now
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-6 border border-gray-200">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Proposition Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 opacity-0 translate-y-8 animate-on-scroll">
              Why Choose VIRTUFIT?
            </h2>
            <p className="text-gray-600 opacity-0 translate-y-8 animate-on-scroll">
              Our platform benefits both shoppers and brands with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBag size={24} />,
                title: "Shop With Confidence",
                description: "See exactly how clothes look on you before purchasing, reducing returns and buyer's remorse.",
                delay: 0,
              },
              {
                icon: <Camera size={24} />,
                title: "Create Your Fashion Gallery",
                description: "Save, download and share your favorite virtual try-on looks with friends and social media.",
                delay: 100,
              },
              {
                icon: <Sparkles size={24} />,
                title: "Discover Perfect Fits",
                description: "Find clothes that match your style and fit your body perfectly without the hassle of physical fitting rooms.",
                delay: 200,
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-start p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow opacity-0 translate-y-8 animate-on-scroll"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-black mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
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
                step: "01",
                delay: 0,
              },
              {
                title: "Virtual Try-On",
                description: "Select an item and see how it looks on you with our advanced AI visualization technology.",
                step: "02",
                delay: 100,
              },
              {
                title: "Shop With Confidence",
                description: "Purchase the items you love directly from retailers, knowing exactly how they'll look.",
                step: "03",
                delay: 200,
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 opacity-0 translate-y-8 animate-on-scroll"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white text-xl font-medium mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-medium mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For Brands Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="opacity-0 translate-y-8 animate-on-scroll">
              <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
                For Fashion Brands
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Boost Sales & Reduce Returns
              </h2>
              <p className="text-white/80 mb-8">
                Whether you're a small boutique or a large retailer, VIRTUFIT helps you showcase your products in a revolutionary way. 
                Upload your clothing inventory, allow customers to try before they buy, and watch your conversion rates soar while return rates plummet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: <Users size={18} />,
                    text: "Increase customer confidence and satisfaction"
                  },
                  {
                    icon: <ShoppingBag size={18} />,
                    text: "Reduce return rates by up to 40%"
                  },
                  {
                    icon: <Share2 size={18} />,
                    text: "Boost social sharing and word-of-mouth"
                  },
                  {
                    icon: <Sparkles size={18} />,
                    text: "No website? No problem. Use our platform"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1 text-blue-400">{benefit.icon}</div>
                    <p className="text-sm text-white/80">{benefit.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/auth">
                <Button className="px-6 py-5 bg-white text-black hover:bg-white/90 transition-colors">
                  Partner With Us
                </Button>
              </Link>
            </div>
            <div className="relative opacity-0 translate-y-8 animate-on-scroll">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Brand dashboard preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Brands */}
      <FeaturedBrands />
      
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
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 opacity-0 translate-y-8 animate-on-scroll">
              Transform Your Shopping Experience Today
            </h2>
            <p className="text-white/80 mb-8 opacity-0 translate-y-8 animate-on-scroll">
              Join thousands of satisfied users who shop with confidence using VIRTUFIT's virtual try-on technology.
            </p>
            <Link 
              to="/try-on"
              className="inline-block opacity-0 translate-y-8 animate-on-scroll"
            >
              <Button className="px-8 py-6 bg-white text-black hover:bg-white/90 transition-colors">
                Start Virtual Try-On
              </Button>
            </Link>
            <p className="mt-6 text-sm text-white/60 opacity-0 translate-y-8 animate-on-scroll">
              No credit card required. Start trying on clothes virtually in seconds.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
