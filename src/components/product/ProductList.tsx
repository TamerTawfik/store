import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/hooks/useProducts";
import { sortProducts, filterProducts } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  error = null,
  onRetry,
}) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { categories } = useCategories();

  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Process products with filters and sorting
  const processedProducts = useMemo(() => {
    let filtered = filterProducts(
      products,
      selectedCategory || undefined,
      priceRange.min,
      priceRange.max
    );

    if (sortBy) {
      filtered = sortProducts(filtered, sortBy);
    }

    return filtered;
  }, [products, selectedCategory, sortBy, priceRange]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setSortBy("");
    setPriceRange({ min: 0, max: 1000 });
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      min: Number(e.target.value),
                    }))
                  }
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: Number(e.target.value),
                    }))
                  }
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {processedProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {processedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              isInCart={isInCart(product.id)}
              cartQuantity={getItemQuantity(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
