import React from "react";
import { ProductBadge } from "./ProductBadge";

/**
 * Demo component to showcase all ProductBadge variants
 * This can be used for testing and documentation purposes
 */
export const ProductBadgeDemo: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        ProductBadge Component Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* New Badge */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">New Badge</h3>
          <div className="space-y-3">
            <ProductBadge type="new" />
            <p className="text-sm text-gray-600">
              Used for recently added products (rating count &lt; 50)
            </p>
          </div>
        </div>

        {/* Sale Badge */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sale Badge</h3>
          <div className="space-y-3">
            <ProductBadge type="sale" />
            <ProductBadge type="sale" value="25%" />
            <ProductBadge type="sale" value="50%" />
            <p className="text-sm text-gray-600">
              Used for products on sale (price &lt; $20)
            </p>
          </div>
        </div>

        {/* Popular Badge */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Popular Badge</h3>
          <div className="space-y-3">
            <ProductBadge type="popular" />
            <p className="text-sm text-gray-600">
              Used for highly rated products (rating ≥ 4.0 and count ≥ 100)
            </p>
          </div>
        </div>

        {/* Low Stock Badge */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Low Stock Badge</h3>
          <div className="space-y-3">
            <ProductBadge type="low-stock" />
            <ProductBadge type="low-stock" value={5} />
            <ProductBadge type="low-stock" value={12} />
            <p className="text-sm text-gray-600">
              Used for products with limited stock (rating count &lt; 20)
            </p>
          </div>
        </div>

        {/* Out of Stock Badge */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Out of Stock Badge</h3>
          <div className="space-y-3">
            <ProductBadge type="out-of-stock" />
            <p className="text-sm text-gray-600">
              Used for products that are unavailable (rating count = 0)
            </p>
          </div>
        </div>

        {/* Custom Styling */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Custom Styling</h3>
          <div className="space-y-3">
            <ProductBadge type="new" className="text-lg px-4 py-2" />
            <ProductBadge
              type="sale"
              value="MEGA"
              className="uppercase font-bold"
            />
            <p className="text-sm text-gray-600">
              Badges can be customized with additional CSS classes
            </p>
          </div>
        </div>
      </div>

      {/* Animation Showcase */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Animation Effects</h3>
        <div className="flex flex-wrap gap-4">
          <ProductBadge type="new" />
          <ProductBadge type="low-stock" value={3} />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          New and Low Stock badges have pulse animations to draw attention
        </p>
      </div>
    </div>
  );
};
