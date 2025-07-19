import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";
import {
  ShoppingCart,
  X,
  ShoppingBag,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    cartState,
    updateQuantity,
    removeFromCart,
    clearCart,
    isItemLoading,
    error,
    clearError,
  } = useCart();
  const { items, total, itemCount, isLoading } = cartState;

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shopping Cart
                    </h2>
                    <p className="text-sm text-gray-600">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0 hover:bg-white/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="w-6 h-6 p-0 hover:bg-red-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add some products to get started
                    </p>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <CartItem
                          key={item.product.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                          isLoading={isItemLoading(item.product.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t bg-gray-50 p-6"
                >
                  {/* Total */}
                  <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg border">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold text-blue-600"
                    >
                      {formatPrice(total)}
                    </motion.span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/cart" className="block">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        View Full Cart
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                      onClick={handleClearCart}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Cart
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Item Count Summary */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      {itemCount} {itemCount === 1 ? "item" : "items"} •
                      <span className="ml-1 font-medium">
                        {formatPrice(total / itemCount)} avg
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
