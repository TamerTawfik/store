import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "./ProductBadge";
import {
  formatPrice,
  truncateText,
  generateStars,
  getProductBadges,
  getPrimaryBadge,
} from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isInCart,
  cartQuantity,
}) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const primaryBadge = getPrimaryBadge(product);
  const allBadges = getProductBadges(product);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 bg-gray-100 cursor-pointer">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="bg-white object-contain p-4 hover:scale-105 transition-transform duration-300"
          />
          {/* Primary Badge - positioned at top-left */}
          {primaryBadge && (
            <div className="absolute top-2 left-2 z-10">
              <ProductBadge
                type={primaryBadge.type}
                value={primaryBadge.value}
              />
            </div>
          )}
          {/* Additional badges - positioned at top-right if there are multiple */}
          {allBadges.length > 1 && (
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
              {allBadges
                .filter((badge) => badge.type !== primaryBadge?.type)
                .slice(0, 2) // Show max 2 additional badges
                .map((badge, index) => (
                  <ProductBadge
                    key={`${badge.type}-${index}`}
                    type={badge.type}
                    value={badge.value}
                    className="text-xs"
                  />
                ))}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
            {truncateText(product.title, 60)}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <span className="text-yellow-400 text-sm mr-1">
            {generateStars(product.rating.rate)}
          </span>
          <span className="text-gray-500 text-sm">
            ({product.rating.count})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>

          <div className="flex items-center gap-2">
            {isInCart && (
              <span className="text-sm text-green-600 font-medium">
                In cart: {cartQuantity}
              </span>
            )}
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="min-w-[100px]"
            >
              {isInCart ? "Add More" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
