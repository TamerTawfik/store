"use client";

import React from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductList } from "@/components/product/ProductList";

export default function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Featured Products
        </h1>
        <p className="text-gray-600">Browse our collection of products</p>
      </div>

      <ProductList
        products={products}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}
