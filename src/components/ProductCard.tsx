
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div 
      className={`group relative overflow-hidden rounded-xl shadow-subtle hover-lift ${
        featured ? 'aspect-[4/5]' : 'aspect-[3/4]'
      }`}
    >
      {/* Background image with blur loading effect */}
      <div 
        className="blur-load absolute inset-0 bg-gray-100"
        style={{ backgroundImage: `url(${product.images.main})` }}
      >
        <img
          src={product.images.main}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'image-loaded' : 'image-loading'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content container */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
        {/* Badge */}
        <div className="inline-block px-2 py-1 mb-2 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
        
        {/* Title and brand */}
        <h3 className="text-lg md:text-xl font-medium mb-1">{product.name}</h3>
        <p className="text-sm text-white/80 mb-4">{product.brand}</p>
        
        {/* Price and try-on button */}
        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-medium">${product.price.toFixed(2)}</span>
          <Link
            to={`/try-on/${product.id}`}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
          >
            Try On <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
