
import { useEffect } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Fashion Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    quote: "VIRTUFIT has revolutionized how I shop online. Now I can actually see how clothes look on me before buying, which has saved me countless returns!",
    stars: 5
  },
  {
    name: "Marcus Chen",
    role: "Boutique Owner",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    quote: "As a small business owner, VIRTUFIT has helped us compete with larger retailers. Our customers love trying clothes virtually, and our return rate has dropped by 35%.",
    stars: 5
  },
  {
    name: "Sarah Williams",
    role: "Digital Content Creator",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    quote: "The gallery feature is amazing! I can create and share different outfits with my followers without having to actually buy all the clothes first. Game changer!",
    stars: 4
  }
];

const Testimonials = () => {
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
    
    document.querySelectorAll('.testimonial-animate').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 testimonial-animate opacity-0 translate-y-8">
            What Our Users Say
          </h2>
          <p className="text-gray-600 testimonial-animate opacity-0 translate-y-8">
            Join thousands of satisfied users who trust VIRTUFIT for their shopping decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow testimonial-animate opacity-0 translate-y-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < testimonial.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                  />
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
