import { useCartStore } from '@/store/cartStore';
import { useCallback } from 'react';

export const useCart = () => {
  const cartStore = useCartStore();

  const isInCart = useCallback(
    (productId: number) => cartStore.items.some((item) => item.product.id === productId),
    [cartStore.items]
  );

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = cartStore.items.find((item) => item.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cartStore.items]
  );

  return {
    cartState: cartStore,
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    isInCart,
    getItemQuantity,
  };
};
