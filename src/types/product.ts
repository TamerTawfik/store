export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface ProductFilters {
  category?: string;
  categories?: string[]; // Multiple category selection
  minPrice?: number;
  maxPrice?: number;
  priceRange?: { min: number; max: number };
  rating?: number; // Minimum rating
  stockStatus?: ('in-stock' | 'low-stock' | 'out-of-stock')[];
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name' | 'popularity' | 'newest';
  searchQuery?: string;
  tags?: string[];
}

export interface EnhancedProduct extends Product {
  // Computed properties for UI
  isNew?: boolean;
  isOnSale?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  originalPrice?: number; // For sale calculations
  discountPercentage?: number;
  popularityScore?: number;
  badges?: ProductBadge[];
  // Additional computed properties
  priceCategory?: 'budget' | 'mid-range' | 'premium';
  ratingCategory?: 'poor' | 'fair' | 'good' | 'excellent';
  availabilityStatus?: 'available' | 'limited' | 'unavailable';
}

export interface ProductBadge {
  value: string | number | undefined;
  type: 'new' | 'sale' | 'popular' | 'low-stock' | 'trending' | 'out-of-stock' | 'bestseller';
  label: string;
  color: string;
  icon?: string;
  priority?: number; // For badge ordering
}

export interface ProductStats {
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  categoryDistribution: Record<string, number>;
  priceRanges: {
    budget: number; // < $20
    midRange: number; // $20-$100
    premium: number; // > $100
  };
  stockDistribution: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
  field: keyof Product | 'popularity' | 'newest' | 'trending';
}
