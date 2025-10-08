"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";
import {
  CartState,
  AddToCartPayload,
  UpdateQuantityPayload,
  RemoveFromCartPayload,
} from "../types/cart";

interface CartContextType {
  // Estado
  cart: CartState["cart"];
  itemsCount: CartState["itemsCount"];
  subtotal: CartState["subtotal"];
  taxAmount: CartState["taxAmount"];
  shippingAmount: CartState["shippingAmount"];
  totalAmount: CartState["totalAmount"];
  loading: CartState["loading"];
  error: CartState["error"];
  lastUpdated: CartState["lastUpdated"];

  // Funciones
  loadCart: () => Promise<void>;
  addToCart: (
    payload: AddToCartPayload
  ) => Promise<{ success: boolean; message: string }>;
  addGift: (giftData: any) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (
    payload: UpdateQuantityPayload
  ) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (
    payload: RemoveFromCartPayload
  ) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
  syncCart: () => Promise<{ success: boolean; message: string }>;
  getProductQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const cartData = useCart();

  return (
    <CartContext.Provider value={cartData}>{children}</CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
