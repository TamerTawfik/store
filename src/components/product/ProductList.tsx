import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Product, ProductFilters as ProductFiltersType } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { NoResults } from "@/components/product/NoResults";
import {
  ProductSkeleton,
  ProductSkeletonGrid,
  ProductSkeletonList,
} from "@/components/product/ProductSkeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { sortProducts, filterProductsAdvanced } from "@/utils/helpers";
import { generateBreadcrumbs } from "@/utils/breadcrumbUtils";
import {
  getTrendingProducts,
  getRecommendedCategories,
} from "@/utils/recommendationUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  filters?: ProductFiltersType;
  onFiltersChange?: (filters: ProductFiltersType) => void;
}

export const ProductList: React.FC<EnhancedProductListProps> = ({
  products,
  loading = false,
  error = null,
  onRetry,
  viewMode: externalViewMode,
  onViewModeChange: externalOnViewModeChange,
  filters: externalFilters,
  onFiltersChange: externalOnFiltersChange,
}) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { categories } = useCategories();
  const searchParams = useSearchParams();

  const {
    trendingSearches,
    popularProducts,
    suggestedCategories,
    addToRecentSearches,
  } = useSearch({ products, categories });

  // Internal state for view mode and filters (used when not controlled externally)
  const [internalViewMode, setInternalViewMode] = useState<"grid" | "list">(
    "grid"
  );
  const [internalFilters, setInternalFilters] = useState<ProductFiltersType>({
    sortBy: "name",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use external props if provided, otherwise use internal state
  const viewMode = externalViewMode ?? internalViewMode;
  const filters = externalFilters ?? internalFilters;
  const onViewModeChange = externalOnViewModeChange ?? setInternalViewMode;
  const onFiltersChange = externalOnFiltersChange ?? setInternalFilters;

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Process products with advanced filtering and sorting
  const processedProducts = useMemo(() => {
    let filtered = filterProductsAdvanced(products, filters);

    if (filters.sortBy) {
      filtered = sortProducts(filtered, filters.sortBy);
    }

    return filtered;
  }, [products, filters]);

  // Handle view mode change with smooth transition
  const handleViewModeChange = useCallback(
    (newMode: "grid" | "list") => {
      if (newMode === viewMode) return;

      setIsTransitioning(true);
      setTimeout(() => {
        onViewModeChange(newMode);
        setTimeout(() => setIsTransitioning(false), 150);
      }, 150);
    },
    [viewMode, onViewModeChange]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sortBy: string) => {
      onFiltersChange({
        ...filters,
        sortBy: sortBy as ProductFiltersType["sortBy"],
      });
    },
    [filters, onFiltersChange]
  );

  // Clear all filters except sort
  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      sortBy: filters.sortBy || "name",
    });
  }, [filters.sortBy, onFiltersChange]);

  // Get active filters count for display
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.priceRange || filters.minPrice || filters.maxPrice) count++;
    if (filters.rating) count++;
    if (filters.stockStatus?.length) count += filters.stockStatus.length;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  // Generate breadcrumbs based on current filters and search
  const breadcrumbs = useMemo(() => {
    const searchQuery =
      searchParams.get("search") ||
      searchParams.get("q") ||
      filters.searchQuery;
    const category = searchParams.get("category") || filters.category;

    return generateBreadcrumbs({
      category,
      searchQuery: searchQuery || undefined,
    });
  }, [searchParams, filters.category, filters.searchQuery]);

  // Handle category selection from no results
  const handleCategoryClick = useCallback(
    (category: string) => {
      onFiltersChange({
        ...filters,
        category,
        searchQuery: undefined, // Clear search when selecting category
      });
    },
    [filters, onFiltersChange]
  );

  // Handle search from no results
  const handleSearchClick = useCallback(
    (query: string) => {
      onFiltersChange({
        ...filters,
        searchQuery: query,
        category: undefined, // Clear category when searching
      });
      addToRecentSearches(query);
    },
    [filters, onFiltersChange, addToRecentSearches]
  );

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Loading skeletons based on view mode */}
        {viewMode === "grid" ? (
          <ProductSkeletonGrid count={8} />
        ) : (
          <ProductSkeletonList count={6} />
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="px-4 sm:px-0">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* Enhanced Header with Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Results Info and Active Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Products ({processedProducts.length})
              </h2>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount} filter
                  {activeFiltersCount !== 1 ? "s" : ""} active
                </Badge>
              )}
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>

                {filters.category && (
                  <Badge variant="outline" className="gap-1">
                    {filters.category}
                    <button
                      onClick={() =>
                        onFiltersChange({ ...filters, category: undefined })
                      }
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {filters.categories?.map((category) => (
                  <Badge key={category} variant="outline" className="gap-1">
                    {category}
                    <button
                      onClick={() => {
                        const newCategories = filters.categories?.filter(
                          (c) => c !== category
                        );
                        onFiltersChange({
                          ...filters,
                          categories: newCategories?.length
                            ? newCategories
                            : undefined,
                        });
                      }}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

                {(filters.priceRange ||
                  filters.minPrice ||
                  filters.maxPrice) && (
                  <Badge variant="outline" className="gap-1">
                    $
                    {filters.priceRange?.min ||
                      filters.minPrice ||
                      priceRange.min}{" "}
                    - $
                    {filters.priceRange?.max ||
                      filters.maxPrice ||
                      priceRange.max}
                    <button
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          priceRange: undefined,
                          minPrice: undefined,
                          maxPrice: undefined,
                        })
                      }
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {filters.rating && (
                  <Badge variant="outline" className="gap-1">
                    {filters.rating}+ stars
                    <button
                      onClick={() =>
                        onFiltersChange({ ...filters, rating: undefined })
                      }
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                Sort:
              </span>
              <Select
                value={filters.sortBy || ""}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[140px] sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Layout with Filters Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div
          className={cn(
            "lg:w-80 flex-shrink-0 transition-all duration-300",
            filtersOpen ? "block" : "hidden lg:block"
          )}
        >
          <ProductFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            categories={categories}
            priceRange={priceRange}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            className="sticky top-6"
          />
        </div>

        {/* Products Content */}
        <div className="flex-1 min-w-0">
          {processedProducts.length === 0 ? (
            <NoResults
              searchQuery={
                filters.searchQuery ||
                searchParams.get("search") ||
                searchParams.get("q") ||
                undefined
              }
              suggestedCategories={suggestedCategories}
              popularProducts={popularProducts}
              trendingSearches={trendingSearches}
              onCategoryClick={handleCategoryClick}
              onSearchClick={handleSearchClick}
              onClearFilters={clearAllFilters}
            />
          ) : (
            <div
              className={cn(
                "transition-all duration-300",
                isTransitioning && "opacity-50 scale-95"
              )}
            >
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {processedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      isInCart={isInCart(product.id)}
                      cartQuantity={getItemQuantity(product.id)}
                      viewMode="grid"
                      showBadges={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {processedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      isInCart={isInCart(product.id)}
                      cartQuantity={getItemQuantity(product.id)}
                      viewMode="list"
                      showBadges={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
