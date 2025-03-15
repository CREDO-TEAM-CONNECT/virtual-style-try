
import { Eye, Edit, Trash2, ShoppingBag, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SupabaseProduct } from '@/integrations/supabase/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardAdminProps {
  product: SupabaseProduct;
  onEdit: () => void;
  onDelete: () => void;
  onTryOn: () => void;
}

const ProductCardAdmin = ({ product, onEdit, onDelete, onTryOn }: ProductCardAdminProps) => {
  // Get main product image URL
  const mainImageUrl = product.images && product.images.length > 0
    ? product.images.find(img => img.type === 'main')?.url || product.images[0].url
    : 'https://placehold.co/300x400/e2e8f0/a0aec0?text=No+Image';

  return (
    <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image with Try-On Button */}
      <div className="relative aspect-[3/4] bg-gray-100">
        <img 
          src={mainImageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Visibility Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={product.is_public ? "default" : "outline"} className="flex items-center gap-1">
            {product.is_public ? (
              <>
                <Globe size={12} />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock size={12} />
                <span>Private</span>
              </>
            )}
          </Badge>
        </div>
        
        {/* Try-On Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-black"
            onClick={onTryOn}
          >
            <Eye size={16} className="mr-2" />
            Try On
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-2 truncate" title={product.brand || 'No brand'}>
          {product.brand || 'No brand'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center gap-2">
            {product.shop_link && (
              <a 
                href={product.shop_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                title="Shop Link"
              >
                <ShoppingBag size={16} />
              </a>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5ZM10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z" fill="currentColor"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onTryOn} className="cursor-pointer">
                  <Eye size={16} className="mr-2" />
                  <span>Try On</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit size={16} className="mr-2" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 size={16} className="mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Category Label */}
        <div className="mt-3">
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
