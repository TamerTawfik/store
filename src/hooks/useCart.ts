/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const isItemLoading = useCallback(
    (productId: number) => cartStore.loadingItems.has(productId),
    [cartStore.loadingItems]
  );

  const addToCartWithFeedback = useCallback(
    async (product: any, quantity?: number) => {
      try {
        await cartStore.addToCart(product, quantity);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to add item to cart' };
      }
    },
    [cartStore.addToCart]
  );

  const removeFromCartWithFeedback = useCallback(
    async (productId: number) => {
      try {
        await cartStore.removeFromCart(productId);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to remove item from cart' };
      }
    },
    [cartStore.removeFromCart]
  );

  const updateQuantityWithFeedback = useCallback(
    async (productId: number, newQuantity: number) => {
      try {
        await cartStore.updateQuantity(productId, newQuantity);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to update quantity' };
      }
    },
    [cartStore.updateQuantity]
  );

  return {
    cartState: cartStore,
    addToCart: addToCartWithFeedback,
    removeFromCart: removeFromCartWithFeedback,
    updateQuantity: updateQuantityWithFeedback,
    clearCart: cartStore.clearCart,
    clearConfirmation: cartStore.clearConfirmation,
    clearError: cartStore.clearError,
    isInCart,
    getItemQuantity,
    isItemLoading,
    // Enhanced state access
    isLoading: cartStore.isLoading,
    showConfirmation: cartStore.showConfirmation,
    lastAddedItem: cartStore.lastAddedItem,
    error: cartStore.error,
  };
};
