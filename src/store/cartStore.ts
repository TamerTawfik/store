import { create } from 'zustand';
import { Product, CartState } from '../types/product';
import { calculateCartTotal, calculateItemCount } from '../utils/helpers';

// Define the shape of cart state and actions
interface CartStore extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
}

// Zustand store
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  
  addToCart: (product, quantity = 1) => set((state) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    let updatedItems;
    if (existingItem) {
      updatedItems = state.items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...state.items, { product, quantity }];
    }
    return {
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: calculateItemCount(updatedItems)
    };
  }),

  removeFromCart: (productId) => set((state) => {
    const updatedItems = state.items.filter(item => item.product.id !== productId);
    return {
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: calculateItemCount(updatedItems)
    };
  }),

  updateQuantity: (productId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => {
      const updatedItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      return {
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      };
    });
  },

  clearCart: () => set({ items: [], total: 0, itemCount: 0 })
}));
