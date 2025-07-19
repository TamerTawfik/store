"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { ProductList } from "@/components/product/ProductList";
import { ProductFilters } from "@/types/product";

export default function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();
  const { categories } = useCategories();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: "name",
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get("search") || searchParams.get("q");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery || undefined,
      category: category || undefined,
      sortBy: (sort as ProductFilters["sortBy"]) || "name",
    }));
  }, [searchParams]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">{getPageDescription()}</p>
      </div>

      <ProductList
        products={products}
        loading={loading}
        error={error}
        onRetry={refetch}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
