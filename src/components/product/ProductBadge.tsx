import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Tag,
  TrendingUp,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export type BadgeType =
  | "new"
  | "sale"
  | "popular"
  | "low-stock"
  | "out-of-stock";

interface ProductBadgeProps {
  type: BadgeType;
  value?: string | number;
  className?: string;
}

const badgeConfig = {
  new: {
    label: "New",
    icon: Sparkles,
    className: "bg-blue-500 text-white border-blue-500 animate-pulse",
    iconClassName: "text-white",
  },
  sale: {
    label: "Sale",
    icon: Tag,
    className: "bg-red-500 text-white border-red-500",
    iconClassName: "text-white",
  },
  popular: {
    label: "Popular",
    icon: TrendingUp,
    className: "bg-green-500 text-white border-green-500",
    iconClassName: "text-white",
  },
  "low-stock": {
    label: "Low Stock",
    icon: AlertTriangle,
    className: "bg-orange-500 text-white border-orange-500 animate-pulse",
    iconClassName: "text-white",
  },
  "out-of-stock": {
    label: "Out of Stock",
    icon: XCircle,
    className: "bg-gray-500 text-white border-gray-500",
    iconClassName: "text-white",
  },
};

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  type,
  value,
  className,
}) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const displayLabel = value ? `${config.label} ${value}` : config.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold transition-all duration-300 hover:scale-105",
        config.className,
        className
      )}
    >
      <Icon className={cn("w-3 h-3", config.iconClassName)} />
      {displayLabel}
    </Badge>
  );
};
