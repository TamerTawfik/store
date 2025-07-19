import React from "react";
import { Search, TrendingUp, Tag, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface NoResultsProps {
  searchQuery?: string;
  suggestedCategories?: string[];
  popularProducts?: Product[];
  trendingSearches?: string[];
  onCategoryClick?: (category: string) => void;
  onSearchClick?: (query: string) => void;
  onClearFilters?: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  suggestedCategories = [],
  popularProducts = [],
  trendingSearches = [],
  onCategoryClick,
  onSearchClick,
  onClearFilters,
}) => {
  return (
    <div className="text-center py-12 px-4">
      {/* Main No Results Message */}
      <div className="max-w-md mx-auto mb-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-12 w-12 text-gray-400" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No results found
        </h2>

        {searchQuery ? (
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any products matching &quot;{searchQuery}
            &quot;. Try adjusting your search or browse our suggestions below.
          </p>
        ) : (
          <p className="text-gray-600 mb-4">
            No products match your current filters. Try adjusting your criteria
            or explore our suggestions.
          </p>
        )}

        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggested Categories */}
      {suggestedCategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-center">
            <Tag className="h-5 w-5 mr-2" />
            Try these categories
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick?.(category)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors capitalize"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending searches
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingSearches.map((search) => (
              <button
                key={search}
                onClick={() => onSearchClick?.(search)}
                className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Popular products you might like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {popularProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={async () => ({ success: true })}
                isInCart={false}
                cartQuantity={0}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
