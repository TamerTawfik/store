/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { Product, CartState } from '@/types/product';
import { calculateCartTotal, calculateItemCount } from '@/utils/helpers';

// Enhanced cart state with loading states and feedback
interface EnhancedCartState extends CartState {
  isLoading: boolean;
  loadingItems: Set<number>; // Track which items are being processed
  lastAddedItem: Product | null; // For visual feedback
  showConfirmation: boolean; // For add to cart confirmation
  error: string | null;
}

// Define the shape of cart state and actions
interface CartStore extends EnhancedCartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setLoading: (productId: number, loading: boolean) => void;
  clearConfirmation: () => void;
  clearError: () => void;
}

// Zustand store
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  loadingItems: new Set(),
  lastAddedItem: null,
  showConfirmation: false,
  error: null,

  setLoading: (productId, loading) => set((state) => {
    const newLoadingItems = new Set(state.loadingItems);
    if (loading) {
      newLoadingItems.add(productId);
    } else {
      newLoadingItems.delete(productId);
    }
    return {
      loadingItems: newLoadingItems,
      isLoading: newLoadingItems.size > 0
    };
  }),

  clearConfirmation: () => set({ showConfirmation: false, lastAddedItem: null }),

  clearError: () => set({ error: null }),

  addToCart: async (product, quantity = 1) => {
    const { setLoading } = get();

    try {
      // Set loading state
      setLoading(product.id, true);

      // Simulate API delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      // Optimistic update
      set((state) => {
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
          itemCount: calculateItemCount(updatedItems),
          lastAddedItem: product,
          showConfirmation: true,
          error: null
        };
      });

      // Auto-clear confirmation after 3 seconds
      setTimeout(() => {
        get().clearConfirmation();
      }, 3000);

    } catch (error) {
      set({ error: 'Failed to add item to cart. Please try again.' });
    } finally {
      setLoading(product.id, false);
    }
  },

  removeFromCart: async (productId) => {
    const { setLoading } = get();

    try {
      setLoading(productId, true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      set((state) => {
        const updatedItems = state.items.filter(item => item.product.id !== productId);
        return {
          items: updatedItems,
          total: calculateCartTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
          error: null
        };
      });
    } catch (error) {
      set({ error: 'Failed to remove item from cart. Please try again.' });
    } finally {
      setLoading(productId, false);
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await get().removeFromCart(productId);
      return;
    }

    const { setLoading } = get();

    try {
      setLoading(productId, true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      set((state) => {
        const updatedItems = state.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        return {
          items: updatedItems,
          total: calculateCartTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
          error: null
        };
      });
    } catch (error) {
      set({ error: 'Failed to update quantity. Please try again.' });
    } finally {
      setLoading(productId, false);
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      set({
        items: [],
        total: 0,
        itemCount: 0,
        error: null,
        isLoading: false,
        loadingItems: new Set(),
        lastAddedItem: null,
        showConfirmation: false
      });
    } catch (error) {
      set({ error: 'Failed to clear cart. Please try again.', isLoading: false });
    }
  }
}));
