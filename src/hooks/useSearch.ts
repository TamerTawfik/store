import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';
import { SearchSuggestion } from '@/components/ui/search';

interface UseSearchProps {
    products: Product[];
    categories: string[];
}

interface UseSearchReturn {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Product[];
    suggestions: SearchSuggestion[];
    recentSearches: string[];
    trendingSearches: string[];
    popularProducts: Product[];
    suggestedCategories: string[];
    addToRecentSearches: (query: string) => void;
    clearRecentSearches: () => void;
}

const TRENDING_SEARCHES = [
    'electronics',
    'jewelry',
    'clothing',
    'men\'s clothing',
    'women\'s clothing',
    'smartphone',
    'laptop',
    'watch',
    'shoes',
    'accessories'
];

export const useSearch = ({ products, categories }: UseSearchProps): UseSearchReturn => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    // Save recent searches to localStorage
    const addToRecentSearches = useCallback((query: string) => {
        if (!query.trim()) return;

        setRecentSearches(prev => {
            const updated = [query, ...prev.filter(item => item !== query)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    }, []);

    // Filter products based on search query
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase();
        return products.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    // Generate search suggestions
    const suggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();

        // Product title suggestions
        const productTitles = products
            .filter(product => product.title.toLowerCase().includes(query))
            .slice(0, 5)
            .map(product => ({
                id: `product-${product.id}`,
                text: product.title,
                type: 'product' as const
            }));

        // Category suggestions
        const categoryMatches = categories
            .filter(category => category.toLowerCase().includes(query))
            .map(category => ({
                id: `category-${category}`,
                text: category,
                type: 'category' as const,
                count: products.filter(p => p.category === category).length
            }));

        return [...productTitles, ...categoryMatches];
    }, [products, categories, searchQuery]);

    // Get popular products (highest rated with good review count)
    const popularProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => {
                const scoreA = a.rating.rate * Math.log(a.rating.count + 1);
                const scoreB = b.rating.rate * Math.log(b.rating.count + 1);
                return scoreB - scoreA;
            })
            .slice(0, 8);
    }, [products]);

    // Get suggested categories based on current context
    const suggestedCategories = useMemo(() => {
        if (searchQuery.trim()) {
            // If searching, suggest categories that might be related
            const query = searchQuery.toLowerCase();
            return categories.filter(category =>
                !category.toLowerCase().includes(query) // Don't suggest categories already matching
            ).slice(0, 4);
        }

        // Default suggestions
        return categories.slice(0, 4);
    }, [categories, searchQuery]);

    // Filter trending searches to exclude current query and recent searches
    const trendingSearches = useMemo(() => {
        const currentQuery = searchQuery.toLowerCase();
        const recentQueries = recentSearches.map(s => s.toLowerCase());

        return TRENDING_SEARCHES.filter(search =>
            !search.includes(currentQuery) &&
            !recentQueries.includes(search.toLowerCase())
        ).slice(0, 6);
    }, [searchQuery, recentSearches]);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        suggestions,
        recentSearches,
        trendingSearches,
        popularProducts,
        suggestedCategories,
        addToRecentSearches,
        clearRecentSearches
    };
};