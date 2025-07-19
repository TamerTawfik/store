import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
import {
  generateAriaLabel,
  keyboardHandlers,
  screenReader,
  ariaStates,
} from "@/utils/accessibility";

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

  // Refs for accessibility
  const mainContentRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const sortSelectRef = useRef<HTMLSelectElement>(null);

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
    <main
      ref={mainContentRef}
      id="main-content"
      className="space-y-6"
      role="main"
      aria-label="Product listing"
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <nav className="px-4 sm:px-0" aria-label="Breadcrumb navigation">
          <Breadcrumb items={breadcrumbs} />
        </nav>
      )}

      {/* Enhanced Header with Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Results Info and Active Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h2
                className="text-lg font-semibold text-gray-900"
                id="products-heading"
                aria-live="polite"
                aria-atomic="true"
              >
                Products ({processedProducts.length})
              </h2>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  role="status"
                  aria-label={`${activeFiltersCount} filter${
                    activeFiltersCount !== 1 ? "s" : ""
                  } currently active`}
                >
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
          <div
            className="flex items-center gap-3"
            role="toolbar"
            aria-label="Product display controls"
          >
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-sm text-gray-600 hidden sm:block"
              >
                Sort:
              </label>
              <Select
                value={filters.sortBy || ""}
                onValueChange={(value) => {
                  handleSortChange(value);
                  screenReader.announceToScreenReader(
                    `Products sorted by ${value}`
                  );
                }}
              >
                <SelectTrigger
                  id="sort-select"
                  className="w-[140px] sm:w-[180px] focus-ring"
                  aria-label={generateAriaLabel.sortSelect(
                    filters.sortBy || "name"
                  )}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent role="listbox">
                  <SelectItem value="name" role="option">
                    Name
                  </SelectItem>
                  <SelectItem value="price-asc" role="option">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-desc" role="option">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating" role="option">
                    Rating
                  </SelectItem>
                  <SelectItem value="popularity" role="option">
                    Popularity
                  </SelectItem>
                  <SelectItem value="newest" role="option">
                    Newest
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div
              className="flex items-center border rounded-lg p-1"
              role="group"
              aria-label="View mode selection"
            >
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  handleViewModeChange("grid");
                  screenReader.announceToScreenReader("Grid view selected");
                }}
                className="h-8 w-8 p-0 focus-ring"
                aria-label={generateAriaLabel.viewModeButton(
                  "grid",
                  viewMode === "grid"
                )}
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  handleViewModeChange("list");
                  screenReader.announceToScreenReader("List view selected");
                }}
                className="h-8 w-8 p-0 focus-ring"
                aria-label={generateAriaLabel.viewModeButton(
                  "list",
                  viewMode === "list"
                )}
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => {
                const newState = !filtersOpen;
                setFiltersOpen(newState);
                screenReader.announceToScreenReader(
                  newState ? "Filters panel opened" : "Filters panel closed"
                );
              }}
              className="gap-2 focus-ring"
              aria-expanded={filtersOpen}
              aria-controls="filters-panel"
              aria-label={generateAriaLabel.filterButton(
                "main",
                filtersOpen,
                activeFiltersCount
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1" aria-hidden="true">
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
            <section
              ref={resultsRef}
              className={cn(
                "transition-all duration-300",
                isTransitioning && "opacity-50 scale-95"
              )}
              aria-labelledby="products-heading"
              aria-live="polite"
              aria-busy={isTransitioning}
            >
              {viewMode === "grid" ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                  role="grid"
                  aria-label={`Product grid with ${processedProducts.length} products`}
                >
                  {processedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      role="gridcell"
                      aria-rowindex={Math.floor(index / 4) + 1}
                      aria-colindex={(index % 4) + 1}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={addToCart}
                        isInCart={isInCart(product.id)}
                        cartQuantity={getItemQuantity(product.id)}
                        viewMode="grid"
                        showBadges={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="space-y-4"
                  role="list"
                  aria-label={`Product list with ${processedProducts.length} products`}
                >
                  {processedProducts.map((product) => (
                    <div key={product.id} role="listitem">
                      <ProductCard
                        product={product}
                        onAddToCart={addToCart}
                        isInCart={isInCart(product.id)}
                        cartQuantity={getItemQuantity(product.id)}
                        viewMode="list"
                        showBadges={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};
