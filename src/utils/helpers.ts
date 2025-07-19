import { Product, CartItem, ProductFilters } from '@/types/product';
import {
  formatPrice as formatPriceUtil,
  sortProductsAdvanced,
  filterProductsEnhanced,
  enhanceProducts,
  isNewProduct as isNewProductUtil,
  isOnSale as isOnSaleUtil,
  isPopularProduct as isPopularProductUtil,
  getStockStatus as getStockStatusUtil,
  generateProductBadges,
  getPrimaryBadge as getPrimaryBadgeUtil
} from '@/utils/productUtils';

// Re-export functions from productUtils for backward compatibility
export const formatPrice = formatPriceUtil;
export const isNewProduct = isNewProductUtil;
export const isOnSale = isOnSaleUtil;
export const isPopularProduct = isPopularProductUtil;
export const getStockStatus = getStockStatusUtil;

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

// Sort products by different criteria - enhanced version
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  // Convert to enhanced products and use the new sorting function
  const enhancedProducts = enhanceProducts(products);
  return sortProductsAdvanced(enhancedProducts, sortBy);
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

// Enhanced filter products with advanced criteria - use new enhanced version
export const filterProductsAdvanced = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  // Convert to enhanced products and use the new filtering function
  const enhancedProducts = enhanceProducts(products);
  return filterProductsEnhanced(enhancedProducts, filters);
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
// Legacy badge functions - use productUtils for new implementations
export const getProductBadges = generateProductBadges;
export const getPrimaryBadge = getPrimaryBadgeUtil;

// Check if a product should show any badges
export const shouldShowBadges = (product: Product): boolean => {
  return generateProductBadges(product).length > 0;
};