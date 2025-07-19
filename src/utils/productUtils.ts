import { Product, EnhancedProduct, ProductBadge, ProductStats, ProductFilters, SortOption } from '@/types/product';

// Constants for product categorization
export const PRICE_THRESHOLDS = {
  BUDGET_MAX: 20,
  MID_RANGE_MAX: 100,
  SALE_THRESHOLD: 25, // Products under $25 considered on sale
  NEW_PRODUCT_RATING_COUNT: 50, // Products with < 50 ratings considered new
  POPULAR_RATING_MIN: 4.0,
  POPULAR_COUNT_MIN: 100,
  LOW_STOCK_THRESHOLD: 20,
  TRENDING_SCORE_MIN: 3.8,
} as const;

// Badge priority order (higher number = higher priority)
export const BADGE_PRIORITIES = {
  'out-of-stock': 10,
  'low-stock': 9,
  'sale': 8,
  'bestseller': 7,
  'popular': 6,
  'trending': 5,
  'new': 4,
} as const;

/**
 * Calculate popularity score based on rating and review count
 */
export const calculatePopularityScore = (product: Product): number => {
  const { rate, count } = product.rating;
  
  // Weighted score: rating (70%) + normalized review count (30%)
  const ratingScore = (rate / 5) * 0.7;
  const countScore = Math.min(count / 200, 1) * 0.3; // Normalize to max 200 reviews
  
  return Math.round((ratingScore + countScore) * 100) / 100;
};

/**
 * Determine if a product is considered "new"
 */
export const isNewProduct = (product: Product): boolean => {
  return product.rating.count < PRICE_THRESHOLDS.NEW_PRODUCT_RATING_COUNT;
};

/**
 * Determine if a product is on sale
 */
export const isOnSale = (product: Product): boolean => {
  return product.price < PRICE_THRESHOLDS.SALE_THRESHOLD;
};

/**
 * Calculate discount percentage for sale products
 */
export const calculateDiscountPercentage = (product: Product): number => {
  if (!isOnSale(product)) return 0;
  
  // Estimate original price based on category averages
  const categoryPriceMultipliers: Record<string, number> = {
    "men's clothing": 1.8,
    "women's clothing": 1.6,
    "jewelery": 2.5,
    "electronics": 1.4,
  };
  
  const multiplier = categoryPriceMultipliers[product.category] || 1.5;
  const estimatedOriginalPrice = product.price * multiplier;
  
  return Math.round(((estimatedOriginalPrice - product.price) / estimatedOriginalPrice) * 100);
};

/**
 * Determine if a product is popular
 */
export const isPopularProduct = (product: Product): boolean => {
  return product.rating.rate >= PRICE_THRESHOLDS.POPULAR_RATING_MIN && 
         product.rating.count >= PRICE_THRESHOLDS.POPULAR_COUNT_MIN;
};

/**
 * Determine if a product is trending
 */
export const isTrendingProduct = (product: Product): boolean => {
  const popularityScore = calculatePopularityScore(product);
  return product.rating.rate >= PRICE_THRESHOLDS.TRENDING_SCORE_MIN && 
         popularityScore > 0.75;
};

/**
 * Determine stock status based on rating count (simulating stock levels)
 */
export const getStockStatus = (product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  const stockLevel = product.rating.count; // Using rating count as stock proxy
  
  if (stockLevel === 0) return 'out-of-stock';
  if (stockLevel < PRICE_THRESHOLDS.LOW_STOCK_THRESHOLD) return 'low-stock';
  return 'in-stock';
};

/**
 * Get stock count (simulated)
 */
export const getStockCount = (product: Product): number => {
  return product.rating.count; // Using rating count as stock proxy
};

/**
 * Categorize product by price range
 */
export const getPriceCategory = (product: Product): 'budget' | 'mid-range' | 'premium' => {
  if (product.price < PRICE_THRESHOLDS.BUDGET_MAX) return 'budget';
  if (product.price < PRICE_THRESHOLDS.MID_RANGE_MAX) return 'mid-range';
  return 'premium';
};

/**
 * Categorize product by rating
 */
export const getRatingCategory = (product: Product): 'poor' | 'fair' | 'good' | 'excellent' => {
  const rating = product.rating.rate;
  if (rating < 2.5) return 'poor';
  if (rating < 3.5) return 'fair';
  if (rating < 4.5) return 'good';
  return 'excellent';
};

/**
 * Get availability status
 */
export const getAvailabilityStatus = (product: Product): 'available' | 'limited' | 'unavailable' => {
  const stockStatus = getStockStatus(product);
  switch (stockStatus) {
    case 'in-stock': return 'available';
    case 'low-stock': return 'limited';
    case 'out-of-stock': return 'unavailable';
    default: return 'available';
  }
};

/**
 * Generate all applicable badges for a product
 */
export const generateProductBadges = (product: Product): ProductBadge[] => {
  const badges: ProductBadge[] = [];
  
  // Out of stock badge (highest priority)
  if (getStockStatus(product) === 'out-of-stock') {
    badges.push({
      type: 'out-of-stock',
      label: 'Out of Stock',
      color: 'bg-red-500 text-white',
      priority: BADGE_PRIORITIES['out-of-stock'],
    });
  }
  
  // Low stock badge
  if (getStockStatus(product) === 'low-stock') {
    badges.push({
      type: 'low-stock',
      label: `Only ${getStockCount(product)} left`,
      color: 'bg-orange-500 text-white',
      priority: BADGE_PRIORITIES['low-stock'],
    });
  }
  
  // Sale badge
  if (isOnSale(product)) {
    const discount = calculateDiscountPercentage(product);
    badges.push({
      type: 'sale',
      label: discount > 0 ? `${discount}% OFF` : 'Sale',
      color: 'bg-red-600 text-white',
      priority: BADGE_PRIORITIES['sale'],
    });
  }
  
  // Bestseller badge (for highly rated products with many reviews)
  if (product.rating.rate >= 4.5 && product.rating.count >= 150) {
    badges.push({
      type: 'bestseller',
      label: 'Bestseller',
      color: 'bg-yellow-500 text-black',
      priority: BADGE_PRIORITIES['bestseller'],
    });
  }
  
  // Popular badge
  if (isPopularProduct(product)) {
    badges.push({
      type: 'popular',
      label: 'Popular',
      color: 'bg-blue-500 text-white',
      priority: BADGE_PRIORITIES['popular'],
    });
  }
  
  // Trending badge
  if (isTrendingProduct(product)) {
    badges.push({
      type: 'trending',
      label: 'Trending',
      color: 'bg-purple-500 text-white',
      priority: BADGE_PRIORITIES['trending'],
    });
  }
  
  // New product badge
  if (isNewProduct(product)) {
    badges.push({
      type: 'new',
      label: 'New',
      color: 'bg-green-500 text-white',
      priority: BADGE_PRIORITIES['new'],
    });
  }
  
  // Sort badges by priority (highest first)
  return badges.sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

/**
 * Get the primary (most important) badge for a product
 */
export const getPrimaryBadge = (product: Product): ProductBadge | null => {
  const badges = generateProductBadges(product);
  return badges.length > 0 ? badges[0] : null;
};

/**
 * Transform a regular Product into an EnhancedProduct with computed properties
 */
export const enhanceProduct = (product: Product): EnhancedProduct => {
  const enhanced: EnhancedProduct = {
    ...product,
    isNew: isNewProduct(product),
    isOnSale: isOnSale(product),
    isPopular: isPopularProduct(product),
    isTrending: isTrendingProduct(product),
    stockStatus: getStockStatus(product),
    stockCount: getStockCount(product),
    discountPercentage: calculateDiscountPercentage(product),
    popularityScore: calculatePopularityScore(product),
    badges: generateProductBadges(product),
    priceCategory: getPriceCategory(product),
    ratingCategory: getRatingCategory(product),
    availabilityStatus: getAvailabilityStatus(product),
  };
  
  // Set original price for sale items
  if (enhanced.isOnSale && enhanced.discountPercentage > 0) {
    enhanced.originalPrice = Math.round((product.price / (1 - enhanced.discountPercentage / 100)) * 100) / 100;
  }
  
  return enhanced;
};

/**
 * Transform an array of products into enhanced products
 */
export const enhanceProducts = (products: Product[]): EnhancedProduct[] => {
  return products.map(enhanceProduct);
};

/**
 * Calculate statistics for a collection of products
 */
export const calculateProductStats = (products: Product[]): ProductStats => {
  if (products.length === 0) {
    return {
      totalProducts: 0,
      averagePrice: 0,
      averageRating: 0,
      categoryDistribution: {},
      priceRanges: { budget: 0, midRange: 0, premium: 0 },
      stockDistribution: { inStock: 0, lowStock: 0, outOfStock: 0 },
    };
  }
  
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const totalRating = products.reduce((sum, p) => sum + p.rating.rate, 0);
  
  const categoryDistribution: Record<string, number> = {};
  const priceRanges = { budget: 0, midRange: 0, premium: 0 };
  const stockDistribution = { inStock: 0, lowStock: 0, outOfStock: 0 };
  
  products.forEach(product => {
    // Category distribution
    categoryDistribution[product.category] = (categoryDistribution[product.category] || 0) + 1;
    
    // Price ranges
    const priceCategory = getPriceCategory(product);
    if (priceCategory === 'budget') priceRanges.budget++;
    else if (priceCategory === 'mid-range') priceRanges.midRange++;
    else priceRanges.premium++;
    
    // Stock distribution
    const stockStatus = getStockStatus(product);
    if (stockStatus === 'in-stock') stockDistribution.inStock++;
    else if (stockStatus === 'low-stock') stockDistribution.lowStock++;
    else stockDistribution.outOfStock++;
  });
  
  return {
    totalProducts: products.length,
    averagePrice: Math.round((totalPrice / products.length) * 100) / 100,
    averageRating: Math.round((totalRating / products.length) * 100) / 100,
    categoryDistribution,
    priceRanges,
    stockDistribution,
  };
};

/**
 * Get available sort options
 */
export const getSortOptions = (): SortOption[] => [
  { value: 'popularity', label: 'Most Popular', direction: 'desc', field: 'popularity' },
  { value: 'price-asc', label: 'Price: Low to High', direction: 'asc', field: 'price' },
  { value: 'price-desc', label: 'Price: High to Low', direction: 'desc', field: 'price' },
  { value: 'rating', label: 'Highest Rated', direction: 'desc', field: 'rating' },
  { value: 'name', label: 'Name: A to Z', direction: 'asc', field: 'title' },
  { value: 'newest', label: 'Newest First', direction: 'desc', field: 'newest' },
  { value: 'trending', label: 'Trending', direction: 'desc', field: 'trending' },
];

/**
 * Advanced product sorting with multiple criteria
 */
export const sortProductsAdvanced = (products: EnhancedProduct[], sortBy: string): EnhancedProduct[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'rating':
      return sorted.sort((a, b) => {
        // Primary: rating, Secondary: review count
        if (b.rating.rate !== a.rating.rate) {
          return b.rating.rate - a.rating.rate;
        }
        return b.rating.count - a.rating.count;
      });
    
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'popularity':
      return sorted.sort((a, b) => {
        const aScore = a.popularityScore || 0;
        const bScore = b.popularityScore || 0;
        return bScore - aScore;
      });
    
    case 'newest':
      return sorted.sort((a, b) => {
        // New products first, then by rating count (lower = newer)
        if (a.isNew !== b.isNew) {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
        return a.rating.count - b.rating.count;
      });
    
    case 'trending':
      return sorted.sort((a, b) => {
        // Trending products first, then by popularity score
        if (a.isTrending !== b.isTrending) {
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        }
        const aScore = a.popularityScore || 0;
        const bScore = b.popularityScore || 0;
        return bScore - aScore;
      });
    
    default:
      return sorted;
  }
};

/**
 * Enhanced product filtering with all criteria
 */
export const filterProductsEnhanced = (
  products: EnhancedProduct[],
  filters: ProductFilters
): EnhancedProduct[] => {
  return products.filter(product => {
    // Category filtering (single or multiple)
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.categories?.length && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Price filtering
    const minPrice = filters.priceRange?.min || filters.minPrice;
    const maxPrice = filters.priceRange?.max || filters.maxPrice;
    
    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }
    
    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }
    
    // Rating filtering
    if (filters.rating && product.rating.rate < filters.rating) {
      return false;
    }
    
    // Stock status filtering
    if (filters.stockStatus?.length && !filters.stockStatus.includes(product.stockStatus!)) {
      return false;
    }
    
    // Search query filtering
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        product.title,
        product.description,
        product.category,
        ...(product.badges?.map(b => b.label) || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }
    
    // Tags filtering (if implemented)
    if (filters.tags?.length) {
      const productTags = [
        product.category,
        product.priceCategory,
        product.ratingCategory,
        ...(product.badges?.map(b => b.type) || [])
      ];
      
      const hasMatchingTag = filters.tags.some(tag => 
        productTags.includes(tag as any)
      );
      
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Get price range for a collection of products
 */
export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) {
    return { min: 0, max: 100 };
  }
  
  const prices = products.map(p => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};

/**
 * Get unique categories from products
 */
export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.sort();
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format price range
 */
export const formatPriceRange = (min: number, max: number): string => {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

/**
 * Get stock status display text
 */
export const getStockStatusText = (stockStatus: string, stockCount?: number): string => {
  switch (stockStatus) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return stockCount ? `Only ${stockCount} left` : 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};