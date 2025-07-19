import { Product } from '@/types/product';

export interface RecommendationOptions {
    maxResults?: number;
    excludeIds?: number[];
    minRating?: number;
}

// Get products frequently bought together (simulated based on category and rating)
export const getFrequentlyBoughtTogether = (
    product: Product,
    allProducts: Product[],
    options: RecommendationOptions = {}
): Product[] => {
    const { maxResults = 4, excludeIds = [], minRating = 3.5 } = options;

    return allProducts
        .filter(p =>
            p.id !== product.id &&
            !excludeIds.includes(p.id) &&
            p.rating.rate >= minRating &&
            (p.category === product.category ||
                Math.abs(p.price - product.price) < product.price * 0.5) // Similar price range
        )
        .sort((a, b) => {
            // Sort by rating and review count
            const scoreA = a.rating.rate * Math.log(a.rating.count + 1);
            const scoreB = b.rating.rate * Math.log(b.rating.count + 1);
            return scoreB - scoreA;
        })
        .slice(0, maxResults);
};

// Get similar products based on category and characteristics
export const getSimilarProducts = (
    product: Product,
    allProducts: Product[],
    options: RecommendationOptions = {}
): Product[] => {
    const { maxResults = 6, excludeIds = [], minRating = 3.0 } = options;

    return allProducts
        .filter(p =>
            p.id !== product.id &&
            !excludeIds.includes(p.id) &&
            p.rating.rate >= minRating &&
            p.category === product.category
        )
        .sort((a, b) => {
            // Calculate similarity score based on price and rating
            const priceSimA = 1 - Math.abs(a.price - product.price) / Math.max(a.price, product.price);
            const ratingSimA = 1 - Math.abs(a.rating.rate - product.rating.rate) / 5;
            const scoreA = (priceSimA * 0.3 + ratingSimA * 0.7) * a.rating.rate;

            const priceSimB = 1 - Math.abs(b.price - product.price) / Math.max(b.price, product.price);
            const ratingSimB = 1 - Math.abs(b.rating.rate - product.rating.rate) / 5;
            const scoreB = (priceSimB * 0.3 + ratingSimB * 0.7) * b.rating.rate;

            return scoreB - scoreA;
        })
        .slice(0, maxResults);
};

// Get trending products (high rating with recent popularity simulation)
export const getTrendingProducts = (
    allProducts: Product[],
    options: RecommendationOptions = {}
): Product[] => {
    const { maxResults = 8, excludeIds = [], minRating = 4.0 } = options;

    return allProducts
        .filter(p =>
            !excludeIds.includes(p.id) &&
            p.rating.rate >= minRating &&
            p.rating.count > 50 // Products with good review volume
        )
        .sort((a, b) => {
            // Trending score based on rating, review count, and simulated recency
            const trendScoreA = a.rating.rate * Math.log(a.rating.count + 1) * (Math.random() * 0.2 + 0.9);
            const trendScoreB = b.rating.rate * Math.log(b.rating.count + 1) * (Math.random() * 0.2 + 0.9);
            return trendScoreB - trendScoreA;
        })
        .slice(0, maxResults);
};

// Get products by category with quality filtering
export const getProductsByCategory = (
    category: string,
    allProducts: Product[],
    options: RecommendationOptions = {}
): Product[] => {
    const { maxResults = 12, excludeIds = [], minRating = 3.0 } = options;

    return allProducts
        .filter(p =>
            p.category.toLowerCase() === category.toLowerCase() &&
            !excludeIds.includes(p.id) &&
            p.rating.rate >= minRating
        )
        .sort((a, b) => {
            // Sort by popularity score
            const scoreA = a.rating.rate * Math.log(a.rating.count + 1);
            const scoreB = b.rating.rate * Math.log(b.rating.count + 1);
            return scoreB - scoreA;
        })
        .slice(0, maxResults);
};

// Get recommended categories based on user's current selection
export const getRecommendedCategories = (
    currentCategory: string | null,
    allCategories: string[],
    allProducts: Product[]
): string[] => {
    if (!currentCategory) {
        // Return categories sorted by product count and average rating
        return allCategories
            .map(category => {
                const categoryProducts = allProducts.filter(p => p.category === category);
                const avgRating = categoryProducts.reduce((sum, p) => sum + p.rating.rate, 0) / categoryProducts.length;
                return {
                    category,
                    count: categoryProducts.length,
                    avgRating: avgRating || 0
                };
            })
            .sort((a, b) => (b.avgRating * Math.log(b.count + 1)) - (a.avgRating * Math.log(a.count + 1)))
            .slice(0, 6)
            .map(item => item.category);
    }

    // Return other categories, prioritizing those with similar characteristics
    return allCategories
        .filter(cat => cat !== currentCategory)
        .slice(0, 4);
};

// Calculate product popularity score
export const calculatePopularityScore = (product: Product): number => {
    // Combine rating and review count with logarithmic scaling
    return product.rating.rate * Math.log(product.rating.count + 1);
};

// Get personalized recommendations (simulated based on category preferences)
export const getPersonalizedRecommendations = (
    viewedProducts: Product[],
    allProducts: Product[],
    options: RecommendationOptions = {}
): Product[] => {
    const { maxResults = 8, excludeIds = [], minRating = 3.5 } = options;

    if (viewedProducts.length === 0) {
        return getTrendingProducts(allProducts, options);
    }

    // Get category preferences from viewed products
    const categoryPreferences = viewedProducts.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get average price range from viewed products
    const avgPrice = viewedProducts.reduce((sum, p) => sum + p.price, 0) / viewedProducts.length;

    return allProducts
        .filter(p =>
            !excludeIds.includes(p.id) &&
            !viewedProducts.some(viewed => viewed.id === p.id) &&
            p.rating.rate >= minRating
        )
        .sort((a, b) => {
            // Calculate personalization score
            const categoryPrefA = categoryPreferences[a.category] || 0;
            const categoryPrefB = categoryPreferences[b.category] || 0;

            const priceSimA = 1 - Math.abs(a.price - avgPrice) / Math.max(a.price, avgPrice);
            const priceSimB = 1 - Math.abs(b.price - avgPrice) / Math.max(b.price, avgPrice);

            const scoreA = (categoryPrefA * 0.4 + priceSimA * 0.2 + a.rating.rate * 0.4);
            const scoreB = (categoryPrefB * 0.4 + priceSimB * 0.2 + b.rating.rate * 0.4);

            return scoreB - scoreA;
        })
        .slice(0, maxResults);
};