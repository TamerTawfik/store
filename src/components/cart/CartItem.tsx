import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { formatPrice, truncateText } from "@/utils/helpers";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(product.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-20 h-20 bg-gray-100 rounded-md cursor-pointer">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
            {truncateText(product.title, 40)}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <p className="text-lg font-semibold text-gray-900 mt-2">
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(totalPrice)}
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          className="mt-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
