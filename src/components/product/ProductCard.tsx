import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "./ProductBadge";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  truncateText,
  getProductBadges,
  getPrimaryBadge,
} from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
  cartQuantity: number;
  viewMode?: "grid" | "list";
  showBadges?: boolean;
  className?: string;
}

// Enhanced star rating component with filled/outlined stars
const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-1">({count})</span>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isInCart,
  cartQuantity,
  viewMode = "grid",
  showBadges = true,
  className,
}) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const result = await onAddToCart(product);
      if (!result.success) {
        // Handle error case if needed
        console.error("Failed to add to cart:", result.error);
      }
    } finally {
      // Add a small delay for better UX feedback
      setTimeout(() => setIsAddingToCart(false), 300);
    }
  };

  const primaryBadge = getPrimaryBadge(product);
  const allBadges = getProductBadges(product);

  const isListView = viewMode === "list";

  return (
    <div
      className={cn(
        "group bg-card text-card-foreground rounded-xl border overflow-hidden transition-smooth hover-lift focus-ring",
        "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        isListView && "flex flex-row",
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="block">
        <div
          className={cn(
            "relative bg-white cursor-pointer overflow-hidden",
            isListView ? "w-48 h-32 flex-shrink-0" : "h-64 sm:h-56 md:h-64"
          )}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={cn(
              "object-contain p-4 transition-smooth",
              isImageHovered && "scale-110"
            )}
            sizes={
              isListView
                ? "192px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />

          {/* Badges */}
          {showBadges && (
            <>
              {/* Primary Badge - top-left */}
              {primaryBadge && (
                <div className="absolute top-3 left-3 z-10 animate-scale-in">
                  <ProductBadge
                    type={primaryBadge.type}
                    value={primaryBadge.value}
                  />
                </div>
              )}
              {/* Additional badges - top-right */}
              {allBadges.length > 1 && (
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                  {allBadges
                    .filter((badge) => badge.type !== primaryBadge?.type)
                    .slice(0, 2)
                    .map((badge, index) => (
                      <ProductBadge
                        key={`${badge.type}-${index}`}
                        type={badge.type}
                        value={badge.value}
                        className="text-xs animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                    ))}
                </div>
              )}
            </>
          )}

          {/* Hover overlay for better image zoom effect */}
          <div
            className={cn(
              "absolute inset-0 bg-black/5 transition-opacity duration-300",
              isImageHovered ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </Link>

      {/* Content Container */}
      <div className={cn("p-4 flex flex-col", isListView && "flex-1")}>
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block mb-3">
          <h3
            className={cn(
              "font-semibold text-foreground transition-colors hover:text-primary cursor-pointer line-clamp-2",
              isListView ? "text-lg" : "text-base"
            )}
          >
            {truncateText(product.title, isListView ? 80 : 60)}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-4">
          <StarRating
            rating={product.rating.rate}
            count={product.rating.count}
          />
        </div>

        {/* Price and Actions */}
        <div
          className={cn(
            "flex items-center justify-between mt-auto",
            isListView &&
              "flex-col items-start gap-3 sm:flex-row sm:items-center"
          )}
        >
          <div className="flex flex-col">
            <span
              className={cn(
                "font-bold text-foreground",
                isListView ? "text-2xl" : "text-xl"
              )}
            >
              {formatPrice(product.price)}
            </span>
            {isInCart && (
              <span className="text-sm text-green-600 font-medium">
                In cart: {cartQuantity}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            size={isListView ? "default" : "sm"}
            className={cn(
              "transition-smooth hover-scale focus-ring",
              isAddingToCart && "animate-pulse",
              isListView ? "min-w-[120px]" : "min-w-[100px]"
            )}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Adding...
              </div>
            ) : isInCart ? (
              "Add More"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
