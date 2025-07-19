import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Tag,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Flame,
  Award,
} from "lucide-react";
import { generateAriaLabel, motionPreferences } from "@/utils/accessibility";

export type BadgeType =
  | "new"
  | "sale"
  | "popular"
  | "low-stock"
  | "out-of-stock"
  | "trending"
  | "bestseller";

interface ProductBadgeProps {
  type: BadgeType;
  value?: string | number;
  className?: string;
  style?: React.CSSProperties;
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
  trending: {
    label: "Trending",
    icon: Flame,
    className: "bg-purple-500 text-white border-purple-500 animate-pulse",
    iconClassName: "text-white",
  },
  bestseller: {
    label: "Bestseller",
    icon: Award,
    className: "bg-yellow-500 text-black border-yellow-500",
    iconClassName: "text-black",
  },
};

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  type,
  value,
  className,
  ...props
}) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const displayLabel = value ? `${config.label} ${value}` : config.label;
  const ariaLabel = generateAriaLabel.badge(type, value);

  // Disable animations for users who prefer reduced motion
  const animationClass = motionPreferences.prefersReducedMotion()
    ? config.className.replace(/animate-\w+/g, "").trim()
    : config.className;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold focus-ring",
        motionPreferences.prefersReducedMotion()
          ? "transition-none"
          : "transition-all duration-300 hover:scale-105",
        animationClass,
        className
      )}
      role="status"
      aria-label={ariaLabel}
      {...props}
    >
      <Icon
        className={cn("w-3 h-3", config.iconClassName)}
        aria-hidden="true"
      />
      <span aria-hidden="true">{displayLabel}</span>
      <span className="sr-only">{ariaLabel}</span>
    </Badge>
  );
};
