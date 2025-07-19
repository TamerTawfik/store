"use client";

import React, { useState, useMemo } from "react";
import { Product, ProductFilters as ProductFiltersType } from "@/types/product";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { filterProductsAdvanced, sortProducts } from "@/utils/helpers";
import { useCart } from "@/hooks/useCart";

interface ProductFiltersDemo {
  products: Product[];
  categories: string[];
}

export const ProductFiltersDemo: React.FC<ProductFiltersDemo> = ({
  products,
  categories,
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

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
            <p className="text-gray-600">
              Showing {processedProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <button
                onClick={() => setFilters({ sortBy: filters.sortBy })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};
