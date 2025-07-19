"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { formatPrice, generateStars } from "@/utils/helpers";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const { product, loading, error, refetch } = useProduct(productId);
  const { addToCart, getItemQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(product, quantity);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner message="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage
          message={error || "Product not found"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex space-x-2 text-sm text-gray-500">
          <li>
            <button
              onClick={() => router.push("/")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Home
            </button>
          </li>
          <li>
            <span className="mx-2">/</span>
            <button
              onClick={() => router.push("/")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Products
            </button>
          </li>
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.category}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="bg-white object-contain p-8"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          <div>
            <span className="text-sm text-blue-600 uppercase tracking-wide font-medium">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-lg">
              {generateStars(product.rating.rate)}
            </span>
            <span className="text-gray-600">
              ({product.rating.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-700">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Cart Status */}
          {cartQuantity > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Already in cart: {cartQuantity} items
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Details
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Category:</dt>
                <dd className="text-gray-900 font-medium">
                  {product.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Rating:</dt>
                <dd className="text-gray-900 font-medium">
                  {product.rating.rate}/5 ({product.rating.count} reviews)
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
