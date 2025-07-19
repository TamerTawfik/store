/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ProductFilters as ProductFiltersType } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  FilterIcon,
  StarIcon,
  PackageIcon,
  TagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  categories: string[];
  priceRange: { min: number; max: number };
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  isOpen,
  onToggle,
  className,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (updates: Partial<ProductFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sortBy: filters.sortBy, // Keep sort order
    });
  };

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "category":
        updateFilters({ category: undefined });
        break;
      case "categories":
        if (value && filters.categories) {
          const newCategories = filters.categories.filter(
            (cat) => cat !== value
          );
          updateFilters({
            categories: newCategories.length > 0 ? newCategories : undefined,
          });
        }
        break;
      case "priceRange":
        updateFilters({
          priceRange: undefined,
          minPrice: undefined,
          maxPrice: undefined,
        });
        break;
      case "rating":
        updateFilters({ rating: undefined });
        break;
      case "stockStatus":
        if (value && filters.stockStatus) {
          const newStatus = filters.stockStatus.filter(
            (status) => status !== value
          );
          updateFilters({
            stockStatus: newStatus.length > 0 ? newStatus : undefined,
          });
        }
        break;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.priceRange || filters.minPrice || filters.maxPrice) count++;
    if (filters.rating) count++;
    if (filters.stockStatus?.length) count += filters.stockStatus.length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={onToggle}
        className="w-full justify-between lg:hidden"
      >
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </Button>

      {/* Active Filters Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="outline" className="gap-1">
              <TagIcon className="h-3 w-3" />
              {filters.category}
              <button
                onClick={() => removeFilter("category")}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.categories?.map((category) => (
            <Badge key={category} variant="outline" className="gap-1">
              <TagIcon className="h-3 w-3" />
              {category}
              <button
                onClick={() => removeFilter("categories", category)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {(filters.priceRange || filters.minPrice || filters.maxPrice) && (
            <Badge variant="outline" className="gap-1">
              ${filters.priceRange?.min || filters.minPrice || 0} - $
              {filters.priceRange?.max || filters.maxPrice || priceRange.max}
              <button
                onClick={() => removeFilter("priceRange")}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.rating && (
            <Badge variant="outline" className="gap-1">
              <StarIcon className="h-3 w-3 fill-current" />
              {filters.rating}+ stars
              <button
                onClick={() => removeFilter("rating")}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.stockStatus?.map((status) => (
            <Badge key={status} variant="outline" className="gap-1">
              <PackageIcon className="h-3 w-3" />
              {status.replace("-", " ")}
              <button
                onClick={() => removeFilter("stockStatus", status)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      <div
        className={cn(
          "space-y-4 transition-all duration-300",
          !isOpen && "hidden lg:block"
        )}
      >
        {/* Category Filter */}
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("categories")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              {expandedSections.categories ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {expandedSections.categories && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        filters.categories?.includes(category) ||
                        filters.category === category
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newCategories = filters.categories
                            ? [...filters.categories, category]
                            : [category];
                          updateFilters({
                            categories: newCategories,
                            category: undefined, // Clear single category when using multiple
                          });
                        } else {
                          if (filters.categories) {
                            const newCategories = filters.categories.filter(
                              (cat) => cat !== category
                            );
                            updateFilters({
                              categories:
                                newCategories.length > 0
                                  ? newCategories
                                  : undefined,
                            });
                          }
                          if (filters.category === category) {
                            updateFilters({ category: undefined });
                          }
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Price Range Filter */}
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-sm font-medium">Price Range</CardTitle>
              {expandedSections.price ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {expandedSections.price && (
            <CardContent className="pt-0 space-y-4">
              <div className="px-2">
                <Slider
                  value={[
                    filters.priceRange?.min ||
                      filters.minPrice ||
                      priceRange.min,
                    filters.priceRange?.max ||
                      filters.maxPrice ||
                      priceRange.max,
                  ]}
                  onValueChange={([min, max]) => {
                    updateFilters({
                      priceRange: { min, max },
                      minPrice: min,
                      maxPrice: max,
                    });
                  }}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  $
                  {filters.priceRange?.min ||
                    filters.minPrice ||
                    priceRange.min}
                </span>
                <span>
                  $
                  {filters.priceRange?.max ||
                    filters.maxPrice ||
                    priceRange.max}
                </span>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Rating Filter */}
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("rating")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-sm font-medium">
                Minimum Rating
              </CardTitle>
              {expandedSections.rating ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {expandedSections.rating && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => updateFilters({ rating })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                      <span className="text-sm text-gray-600">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={!filters.rating}
                    onChange={() => updateFilters({ rating: undefined })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">All ratings</span>
                </label>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stock Status Filter */}
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("stock")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-sm font-medium">
                Availability
              </CardTitle>
              {expandedSections.stock ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {expandedSections.stock && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {[
                  {
                    value: "in-stock",
                    label: "In Stock",
                    color: "text-green-600",
                  },
                  {
                    value: "low-stock",
                    label: "Low Stock",
                    color: "text-yellow-600",
                  },
                  {
                    value: "out-of-stock",
                    label: "Out of Stock",
                    color: "text-red-600",
                  },
                ].map(({ value, label, color }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        filters.stockStatus?.includes(value as any) || false
                      }
                      onChange={(e) => {
                        const currentStatus = filters.stockStatus || [];
                        if (e.target.checked) {
                          updateFilters({
                            stockStatus: [...currentStatus, value as any],
                          });
                        } else {
                          const newStatus = currentStatus.filter(
                            (status) => status !== value
                          );
                          updateFilters({
                            stockStatus:
                              newStatus.length > 0 ? newStatus : undefined,
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <PackageIcon className={cn("h-4 w-4", color)} />
                      <span className="text-sm">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Clear All Filters Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            Clear All Filters ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};
