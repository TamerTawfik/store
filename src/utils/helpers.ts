import { Product, CartItem } from '@/types/product';
import { BadgeType } from '@/components/product/ProductBadge';

// Format price with currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Calculate total cart value
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Calculate total item count in cart
export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Sort products by different criteria
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

// Enhanced filter products with multiple criteria
export const filterProducts = (
  products: Product[],
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  return products.filter(product => {
    const matchesCategory = !category || product.category === category;
    const matchesMinPrice = !minPrice || product.price >= minPrice;
    const matchesMaxPrice = !maxPrice || product.price <= maxPrice;
    
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
};

// Enhanced filter products with advanced criteria
export const filterProductsAdvanced = (
  products: Product[],
  filters: {
    category?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    priceRange?: { min: number; max: number };
    rating?: number;
    stockStatus?: ('in-stock' | 'low-stock' | 'out-of-stock')[];
    searchQuery?: string;
  }
): Product[] => {
  return products.filter(product => {
    // Category filtering (single or multiple)
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesCategories = !filters.categories?.length || 
      filters.categories.includes(product.category);
    
    // Price filtering
    const minPrice = filters.priceRange?.min || filters.minPrice;
    const maxPrice = filters.priceRange?.max || filters.maxPrice;
    const matchesMinPrice = !minPrice || product.price >= minPrice;
    const matchesMaxPrice = !maxPrice || product.price <= maxPrice;
    
    // Rating filtering
    const matchesRating = !filters.rating || product.rating.rate >= filters.rating;
    
    // Stock status filtering
    const productStockStatus = getStockStatus(product);
    const matchesStockStatus = !filters.stockStatus?.length || 
      filters.stockStatus.includes(productStockStatus);
    
    // Search query filtering
    const matchesSearch = !filters.searchQuery || 
      product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return matchesCategory && matchesCategories && matchesMinPrice && 
           matchesMaxPrice && matchesRating && matchesStockStatus && matchesSearch;
  });
};

// Generate star rating display (legacy function for backward compatibility)
export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};

// Enhanced star rating data for component use
export const getStarRatingData = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    rating
  };
};

// Debounce function for search input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
// Product badge utility functions

// Determine if a product is considered "new" (for demo purposes, using rating count as a proxy)
export const isNewProduct = (product: Product): boolean => {
  // Consider products with low rating count as "new" (less than 50 ratings)
  return product.rating.count < 50;
};

// Determine if a product is on sale (for demo purposes, using price thresholds)
export const isOnSale = (product: Product): boolean => {
  // Consider products under $20 as on sale for demo purposes
  return product.price < 20;
};

// Determine if a product is popular (high rating and high rating count)
export const isPopularProduct = (product: Product): boolean => {
  return product.rating.rate >= 4.0 && product.rating.count >= 100;
};

// Determine stock status based on rating count (simulating stock levels)
export const getStockStatus = (product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  const stockLevel = product.rating.count; // Using rating count as stock proxy
  
  if (stockLevel === 0) return 'out-of-stock';
  if (stockLevel < 20) return 'low-stock';
  return 'in-stock';
};

// Get all applicable badges for a product
export const getProductBadges = (product: Product): Array<{ type: BadgeType; value?: string | number }> => {
  const badges: Array<{ type: BadgeType; value?: string | number }> = [];
  
  // Check for new product badge
  if (isNewProduct(product)) {
    badges.push({ type: 'new' });
  }
  
  // Check for sale badge
  if (isOnSale(product)) {
    const discount = Math.round((1 - product.price / 50) * 100); // Assuming $50 as original price
    badges.push({ type: 'sale', value: `${discount}%` });
  }
  
  // Check for popular badge
  if (isPopularProduct(product)) {
    badges.push({ type: 'popular' });
  }
  
  // Check for stock status badges
  const stockStatus = getStockStatus(product);
  if (stockStatus === 'low-stock') {
    badges.push({ type: 'low-stock', value: product.rating.count });
  } else if (stockStatus === 'out-of-stock') {
    badges.push({ type: 'out-of-stock' });
  }
  
  return badges;
};

// Check if a product should show any badges
export const shouldShowBadges = (product: Product): boolean => {
  return getProductBadges(product).length > 0;
};

// Get the most important badge for a product (priority order)
export const getPrimaryBadge = (product: Product): { type: BadgeType; value?: string | number } | null => {
  const badges = getProductBadges(product);
  
  if (badges.length === 0) return null;
  
  // Priority order: out-of-stock > low-stock > sale > popular > new
  const priorityOrder: BadgeType[] = ['out-of-stock', 'low-stock', 'sale', 'popular', 'new'];
  
  for (const priority of priorityOrder) {
    const badge = badges.find(b => b.type === priority);
    if (badge) return badge;
  }
  
  return badges[0];
};