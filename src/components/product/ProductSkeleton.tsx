import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductSkeletonProps {
  className?: string;
  showBadges?: boolean;
  viewMode?: "grid" | "list";
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
  className,
  showBadges = true,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "bg-white rounded-lg shadow-md overflow-hidden p-4",
          className
        )}
      >
        <div className="flex gap-4">
          {/* Image skeleton */}
          <div className="relative flex-shrink-0">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32" />
            {/* Badge skeletons for list view */}
            {showBadges && (
              <>
                <Skeleton className="absolute top-1 left-1 w-8 h-4 rounded-full" />
                <Skeleton className="absolute top-1 right-1 w-6 h-4 rounded-full" />
              </>
            )}
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            {/* Category */}
            <Skeleton className="h-3 w-20" />

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Price and button */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden animate-pulse",
        className
      )}
    >
      {/* Image container skeleton */}
      <div className="relative h-48 bg-gray-100">
        <Skeleton className="w-full h-full" />

        {/* Badge skeletons */}
        {showBadges && (
          <>
            {/* Primary badge - top-left */}
            <Skeleton className="absolute top-2 left-2 w-12 h-5 rounded-full" />
            {/* Additional badges - top-right */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Skeleton className="w-8 h-4 rounded-full" />
              <Skeleton className="w-10 h-4 rounded-full" />
            </div>
          </>
        )}
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton className="h-3 w-20" />

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Price and button row */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Grid skeleton component for multiple skeletons
export const ProductSkeletonGrid: React.FC<{
  count?: number;
  className?: string;
  showBadges?: boolean;
}> = ({ count = 8, className, showBadges = true }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton
          key={`skeleton-${index}`}
          showBadges={showBadges}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

// List skeleton component for multiple skeletons
export const ProductSkeletonList: React.FC<{
  count?: number;
  className?: string;
  showBadges?: boolean;
}> = ({ count = 6, className, showBadges = true }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton
          key={`skeleton-list-${index}`}
          showBadges={showBadges}
          viewMode="list"
        />
      ))}
    </div>
  );
};
