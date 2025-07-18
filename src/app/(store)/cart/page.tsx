"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";

export default function CartPage() {
  const { cartState, updateQuantity, removeFromCart, clearCart } = useCart();
  const { items, total, itemCount } = cartState;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6 0a2 2 0 100 4 2 2 0 000-4zm-6 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Your cart is empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding some items to your cart.
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="mt-2 text-gray-600">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Clear Cart Button */}
          <div className="mt-8">
            <Button variant="outline" onClick={clearCart} className="w-full">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({itemCount})</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">Calculated at checkout</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
