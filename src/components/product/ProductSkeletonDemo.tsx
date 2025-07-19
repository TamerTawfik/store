import React, { useState } from "react";
import {
  ProductSkeleton,
  ProductSkeletonGrid,
  ProductSkeletonList,
} from "./ProductSkeleton";
import { Button } from "@/components/ui/button";

export const ProductSkeletonDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBadges, setShowBadges] = useState(true);
  const [count, setCount] = useState(8);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">ProductSkeleton Demo</h2>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
          </div>

          <Button
            variant={showBadges ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBadges(!showBadges)}
          >
            {showBadges ? "Hide Badges" : "Show Badges"}
          </Button>

          <div className="flex items-center gap-2">
            <label htmlFor="count" className="text-sm font-medium">
              Count:
            </label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Single Skeleton Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Single Skeleton</h3>
        <div className="max-w-sm">
          <ProductSkeleton viewMode={viewMode} showBadges={showBadges} />
        </div>
      </div>

      {/* Multiple Skeletons Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Skeletons</h3>
        {viewMode === "grid" ? (
          <ProductSkeletonGrid count={count} showBadges={showBadges} />
        ) : (
          <ProductSkeletonList count={count} showBadges={showBadges} />
        )}
      </div>

      {/* Responsive Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsive Behavior</h3>
        <p className="text-sm text-gray-600">
          Resize your browser window to see how the skeletons adapt to different
          screen sizes. Grid view automatically adjusts from 1 column on mobile
          to 4 columns on large screens.
        </p>
        <ProductSkeletonGrid count={6} showBadges={showBadges} />
      </div>
    </div>
  );
};
