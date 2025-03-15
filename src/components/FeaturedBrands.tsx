
import { useEffect } from 'react';

const brands = [
  {
    name: "FashionForward",
    logo: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "UrbanThreads",
    logo: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "StyleCo",
    logo: "https://images.unsplash.com/photo-1589363460779-bb53c3c86ad6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "ModernWardrobe",
    logo: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "EcoChic",
    logo: "https://images.unsplash.com/photo-1600456899121-68eda5705257?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

const FeaturedBrands = () => {
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
    
    document.querySelectorAll('.brand-animate').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 brand-animate opacity-0 translate-y-8">
            Trusted By Leading Brands
          </h2>
          <p className="text-gray-600 brand-animate opacity-0 translate-y-8">
            Join the growing network of retailers leveraging virtual try-on technology
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {brands.map((brand, index) => (
            <div 
              key={index} 
              className="flex justify-center brand-animate opacity-0 translate-y-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-20 w-20 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-2">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`} 
                  className="max-h-full max-w-full object-cover rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
