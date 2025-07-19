import React, { createContext, useContext, useState } from "react";
import { CartConfirmation } from "./CartConfirmation";
import { CartSidebar } from "./CartSidebar";
import { useCart } from "@/hooks/useCart";

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartUI = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartUI must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showConfirmation, lastAddedItem, clearConfirmation } = useCart();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleViewCart = () => {
    clearConfirmation();
    openCart();
  };

  return (
    <CartContext.Provider
      value={{ isCartOpen, openCart, closeCart, toggleCart }}
    >
      {children}

      {/* Cart Confirmation Toast */}
      <CartConfirmation
        isVisible={showConfirmation}
        product={lastAddedItem}
        onClose={clearConfirmation}
        onViewCart={handleViewCart}
      />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </CartContext.Provider>
  );
};
