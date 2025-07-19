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
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  originalPrice?: number; // For sale calculations
  badges?: ProductBadge[];
}

export interface ProductBadge {
  type: 'new' | 'sale' | 'popular' | 'low-stock' | 'trending';
  label: string;
  color: string;
  icon?: string;
}
