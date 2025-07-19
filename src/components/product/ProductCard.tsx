/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from "react";
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
import {
  generateAriaLabel,
  keyboardHandlers,
  screenReader,
  motionPreferences,
  ariaStates,
} from "@/utils/accessibility";

interface ProductCardProps {
  product: Product;
  onAddToCart: (
    product: Product
  ) => Promise<{ success: boolean; error?: string }>;
  isInCart: boolean;
  cartQuantity: number;
  viewMode?: "grid" | "list";
  showBadges?: boolean;
  className?: string;
}

// Enhanced star rating component with filled/outlined stars and accessibility
const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const ratingId = `rating-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-labelledby={ratingId}
    >
      <div className="flex items-center" aria-hidden="true">
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
      <span id={ratingId} className="text-sm text-muted-foreground ml-1">
        {generateAriaLabel.rating(rating, count)}
      </span>
      <span className="sr-only">{generateAriaLabel.rating(rating, count)}</span>
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
  const [lastAction, setLastAction] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);

  // Generate unique IDs for accessibility
  const cardId = `product-card-${product.id}`;
  const titleId = `product-title-${product.id}`;
  const priceId = `product-price-${product.id}`;
  const ratingId = `product-rating-${product.id}`;
  const descriptionId = `product-description-${product.id}`;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const actionText = isInCart ? "Adding another item" : "Adding to cart";
    setLastAction(actionText);

    // Announce to screen readers
    screenReader.announceToScreenReader(`${actionText}: ${product.title}`);

    try {
      const result = await onAddToCart(product);
      if (result.success) {
        const successMessage = isInCart
          ? `Added another ${product.title} to cart`
          : `Added ${product.title} to cart`;
        screenReader.announceToScreenReader(successMessage);
        setLastAction(successMessage);
      } else {
        const errorMessage = `Failed to add ${product.title} to cart`;
        screenReader.announceUrgent(errorMessage);
        setLastAction(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Error adding ${product.title} to cart`;
      screenReader.announceUrgent(errorMessage);
      setLastAction(errorMessage);
    } finally {
      // Add a small delay for better UX feedback
      setTimeout(() => {
        setIsAddingToCart(false);
        setLastAction("");
      }, 300);
    }
  };

  // Keyboard navigation for the card
  const handleCardKeyDown = keyboardHandlers.onEnterOrSpace(() => {
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`;
  });

  // Keyboard navigation for add to cart button
  const handleAddToCartKeyDown =
    keyboardHandlers.onEnterOrSpace(handleAddToCart);

  const primaryBadge = getPrimaryBadge(product);
  const allBadges = getProductBadges(product);
  const isListView = viewMode === "list";

  // Generate comprehensive aria label for the entire card
  const cardAriaLabel = generateAriaLabel.productCard(
    product.title,
    product.price,
    product.rating.rate,
    isInCart
  );

  // Generate aria label for add to cart button
  const addToCartAriaLabel = generateAriaLabel.addToCartButton(
    product.title,
    isInCart,
    isAddingToCart
  );

  return (
    <article
      ref={cardRef}
      id={cardId}
      className={cn(
        "group bg-card text-card-foreground rounded-xl border overflow-hidden transition-smooth hover-lift focus-ring",
        "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        isListView ? "flex flex-row" : "flex flex-col h-full",
        className
      )}
      role="article"
      aria-labelledby={titleId}
      aria-describedby={`${descriptionId} ${ratingId} ${priceId}`}
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      {/* Image Container */}
      <Link
        href={`/product/${product.id}`}
        className="block focus-ring"
        aria-label={`View details for ${product.title}`}
        tabIndex={-1} // Remove from tab order since card is focusable
      >
        <div
          className={cn(
            "relative bg-white cursor-pointer overflow-hidden",
            isListView ? "w-48 h-32 flex-shrink-0" : "h-64 sm:h-56 md:h-64"
          )}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          role="img"
          aria-label={`Product image for ${product.title}`}
        >
          <Image
            src={product.image}
            alt={`${product.title} - Product image`}
            fill
            className={cn(
              "object-contain p-4",
              motionPreferences.prefersReducedMotion()
                ? "transition-none"
                : "transition-smooth",
              !motionPreferences.prefersReducedMotion() &&
                isImageHovered &&
                "scale-110"
            )}
            sizes={
              isListView
                ? "192px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            loading="lazy"
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
      <div className={cn("p-4 flex flex-col flex-1", isListView && "flex-1")}>
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="block mb-3 focus-ring"
          tabIndex={-1} // Remove from tab order since card is focusable
        >
          <h3
            id={titleId}
            className={cn(
              "font-semibold text-foreground transition-colors hover:text-primary cursor-pointer line-clamp-2",
              isListView ? "text-lg" : "text-base"
            )}
          >
            {truncateText(product.title, isListView ? 80 : 60)}
          </h3>
        </Link>

        {/* Rating */}
        <div id={ratingId} className="mb-4 flex-grow-0">
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
              id={priceId}
              className={cn(
                "font-bold text-foreground",
                isListView ? "text-2xl" : "text-xl"
              )}
              aria-label={`Price: ${formatPrice(product.price)}`}
            >
              {formatPrice(product.price)}
            </span>
            {isInCart && (
              <span
                className="text-sm text-green-600 font-medium"
                aria-label={`Currently ${cartQuantity} items in cart`}
              >
                In cart: {cartQuantity}
              </span>
            )}
          </div>

          <Button
            ref={addToCartButtonRef}
            onClick={handleAddToCart}
            onKeyDown={handleAddToCartKeyDown}
            disabled={isAddingToCart}
            size={isListView ? "default" : "sm"}
            className={cn(
              "transition-smooth hover-scale focus-ring",
              isAddingToCart && "animate-pulse",
              isListView ? "min-w-[120px]" : "min-w-[100px]"
            )}
            aria-label={addToCartAriaLabel}
            aria-describedby={lastAction ? `${cardId}-status` : undefined}
            {...ariaStates.disabled(isAddingToCart)}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Adding...</span>
              </div>
            ) : isInCart ? (
              "Add More"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>

        {/* Hidden description for screen readers */}
        <div id={descriptionId} className="sr-only">
          {`${product.title} in ${product.category} category. ${formatPrice(
            product.price
          )}. ${generateAriaLabel.rating(
            product.rating.rate,
            product.rating.count
          )}.`}
        </div>

        {/* Status announcements for screen readers */}
        {lastAction && (
          <div
            id={`${cardId}-status`}
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {lastAction}
          </div>
        )}
      </div>
    </article>
  );
};
