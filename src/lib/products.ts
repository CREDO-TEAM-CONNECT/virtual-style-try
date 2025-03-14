
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'accessories';
  price: number;
  description: string;
  size: string[];
  color: string[];
  images: {
    main: string;
    gallery: string[];
    model?: string;
  };
  shopLink: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Essential Cotton T-Shirt",
    brand: "Essentials",
    category: "tops",
    price: 29.99,
    description: "Premium cotton t-shirt with a minimalist design. Perfect for everyday wear and layering.",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["White", "Black", "Gray", "Navy"],
    images: {
      main: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/essential-tshirt"
  },
  {
    id: "p2",
    name: "Slim Fit Chino Pants",
    brand: "Modern Basics",
    category: "bottoms",
    price: 59.99,
    description: "Classic slim fit chino pants made from stretch cotton for all-day comfort.",
    size: ["28", "30", "32", "34", "36"],
    color: ["Khaki", "Navy", "Olive", "Black"],
    images: {
      main: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/slim-chinos"
  },
  {
    id: "p3",
    name: "Cashmere Blend Sweater",
    brand: "Luxe Collection",
    category: "tops",
    price: 129.99,
    description: "Luxurious cashmere blend sweater with ribbed details. Exceptionally soft and warm.",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["Camel", "Charcoal", "Burgundy", "Forest Green"],
    images: {
      main: "https://images.unsplash.com/photo-1591047139829-d80066667b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1591047139829-d80066667b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/cashmere-sweater"
  },
  {
    id: "p4",
    name: "Midi Wrap Dress",
    brand: "Urban Elegance",
    category: "dresses",
    price: 89.99,
    description: "Versatile midi wrap dress that flatters all body types. Perfect for both casual and formal occasions.",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["Black", "Navy", "Burgundy", "Emerald"],
    images: {
      main: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/wrap-dress"
  },
  {
    id: "p5",
    name: "Wool Blend Overcoat",
    brand: "Winter Essentials",
    category: "outerwear",
    price: 199.99,
    description: "Timeless wool blend overcoat with a streamlined silhouette. Provides exceptional warmth without bulk.",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["Camel", "Black", "Gray", "Navy"],
    images: {
      main: "https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592878849122-5c8e97cb3a32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1592878849122-5c8e97cb3a32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/wool-overcoat"
  },
  {
    id: "p6",
    name: "Tailored Blazer",
    brand: "Business Collection",
    category: "outerwear",
    price: 149.99,
    description: "Structured blazer with modern tailoring. Versatile enough for both work and evening events.",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["Black", "Navy", "Gray", "Burgundy"],
    images: {
      main: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1555069519-127aadedf1ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497339100210-9e87df79c218?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      model: "https://images.unsplash.com/photo-1497339100210-9e87df79c218?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    shopLink: "https://example.com/shop/tailored-blazer"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 3);
};
