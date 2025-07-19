import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShoppingCart, X } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";
import Image from "next/image";

interface CartConfirmationProps {
  isVisible: boolean;
  product: Product | null;
  onClose: () => void;
  onViewCart?: () => void;
}

export const CartConfirmation: React.FC<CartConfirmationProps> = ({
  isVisible,
  product,
  onClose,
  onViewCart,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-green-200 p-4 max-w-sm w-full mx-4"
        >
          {/* Success Header */}
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Check className="w-5 h-5 text-green-600" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Added to Cart!</h3>
              <p className="text-sm text-gray-600">Item successfully added</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="relative w-12 h-12 bg-white rounded-md overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {product.title}
              </p>
              <p className="text-sm text-gray-600">
                {formatPrice(product.price)}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              size="sm"
              onClick={onViewCart}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              View Cart
            </Button>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
