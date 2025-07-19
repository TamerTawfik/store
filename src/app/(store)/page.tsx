"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductList } from "@/components/product/ProductList";
import { ProductFilters } from "@/types/product";

function SearchParamsHandler({
  onFiltersChange,
}: {
  onFiltersChange: (filters: ProductFilters) => void;
}) {
  const searchParams = useSearchParams();

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get("search") || searchParams.get("q");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    onFiltersChange({
      searchQuery: searchQuery || undefined,
      category: category || undefined,
      sortBy: (sort as ProductFilters["sortBy"]) || "name",
    });
  }, [searchParams, onFiltersChange]);

  return null;
}

function ProductsContent() {
  const { products, loading, error, refetch } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: "name",
  });

  // Determine page title based on current filters
  const getPageTitle = () => {
    const searchQuery = filters.searchQuery;
    const category = filters.category;

    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }

    if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }

    return "Featured Products";
  };

  const getPageDescription = () => {
    const searchQuery = filters.searchQuery;
    const category = filters.category;

    if (searchQuery) {
      return `Find products matching "${searchQuery}"`;
    }

    if (category) {
      return `Browse our ${category} collection`;
    }

    return "Browse our collection of products";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={null}>
        <SearchParamsHandler onFiltersChange={setFilters} />
      </Suspense>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">{getPageDescription()}</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        }
      >
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Suspense>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
