"use client";

import React, { useState, useMemo } from "react";
import { Product, ProductFilters as ProductFiltersType } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { useCart } from "@/hooks/useCart";
import { filterProductsAdvanced, sortProducts } from "@/utils/helpers";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { GridIcon, ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  categories: string[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export const EnhancedProductList: React.FC<EnhancedProductListProps> = ({
  products,
  loading = false,
  error = null,
  onRetry,
  categories,
  viewMode = "grid",
  onViewModeChange,
}) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFiltersType>({
    sortBy: "name",
  });

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };

    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = filterProductsAdvanced(products, filters);

    if (filters.sortBy) {
      filtered = sortProducts(filtered, filters.sortBy);
    }

    return filtered;
  }, [products, filters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Products Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              priceRange={priceRange}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header with Results and View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Products
              </h2>
              <p className="text-gray-600">
                Showing {processedProducts.length} of {products.length} products
              </p>
            </div>

            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => onViewModeChange("grid")}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors",
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <GridIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange("list")}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors",
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={filters.sortBy || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {processedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters({ sortBy: filters.sortBy })}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "transition-all duration-300",
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              )}
            >
              {processedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  isInCart={isInCart(product.id)}
                  cartQuantity={getItemQuantity(product.id)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
