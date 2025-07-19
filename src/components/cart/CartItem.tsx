import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CartItem as CartItemType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { formatPrice, truncateText } from "@/utils/helpers";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (
    productId: number,
    quantity: number
  ) => Promise<{ success: boolean; error?: string }>;
  onRemove: (
    productId: number
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
}) => {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await onUpdateQuantity(product.id, newQuantity);
  };

  const handleRemove = async () => {
    await onRemove(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border transition-all duration-200 ${
        isLoading ? "opacity-60" : "hover:shadow-md"
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <Link href={`/product/${product.id}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-20 h-20 bg-gray-100 rounded-md cursor-pointer overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2 transition-transform duration-200"
          />
        </motion.div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
            {truncateText(product.title, 40)}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          {product.category}
        </p>
        <motion.p
          key={product.price}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-gray-900 mt-2"
        >
          {formatPrice(product.price)}
        </motion.p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isLoading}
          className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </Button>

        <motion.span
          key={quantity}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.2 }}
          className="w-12 text-center font-medium bg-gray-50 py-1 px-2 rounded border"
        >
          {quantity}
        </motion.span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isLoading}
          className="w-8 h-8 p-0 hover:bg-green-50 hover:border-green-200 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="text-right">
        <motion.p
          key={totalPrice}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          className="text-lg font-bold text-gray-900"
        >
          {formatPrice(totalPrice)}
        </motion.p>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          disabled={isLoading}
          className="mt-2 hover:bg-red-600 transition-colors group"
        >
          <Trash2 className="w-4 h-4 mr-1 group-hover:animate-pulse" />
          Remove
        </Button>
      </div>
    </motion.div>
  );
};
