import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600",
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-blue-600 transition-colors"
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                item.current ? "text-gray-900 font-medium" : "text-gray-600"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
