"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useWholesalerCart } from "../hooks/useWholesalerCart";
import {
  WholesalerCartState,
  AddToWholesalerCartPayload,
  UpdateWholesalerCartQuantityPayload,
  RemoveFromWholesalerCartPayload,
  ApplyDiscountPayload,
  AddNotesPayload,
} from "../types/wholesaler-cart";

interface WholesalerCartContextType {
  // Estado
  cart: WholesalerCartState["cart"];
  itemsCount: WholesalerCartState["itemsCount"];
  subtotal: WholesalerCartState["subtotal"];
  taxAmount: WholesalerCartState["taxAmount"];
  shippingAmount: WholesalerCartState["shippingAmount"];
  discountAmount: WholesalerCartState["discountAmount"];
  totalAmount: WholesalerCartState["totalAmount"];
  loading: WholesalerCartState["loading"];
  error: WholesalerCartState["error"];
  lastUpdated: WholesalerCartState["lastUpdated"];
  wholesalerDiscount: WholesalerCartState["wholesalerDiscount"];

  // Funciones
  loadCart: () => Promise<void>;
  addToCart: (
    payload: AddToWholesalerCartPayload
  ) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (
    payload: UpdateWholesalerCartQuantityPayload
  ) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (
    payload: RemoveFromWholesalerCartPayload
  ) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
  applyDiscount: (
    payload: ApplyDiscountPayload
  ) => Promise<{ success: boolean; message: string }>;
  addNotes: (
    payload: AddNotesPayload
  ) => Promise<{ success: boolean; message: string }>;
  syncCart: () => Promise<{ success: boolean; message: string }>;
  getProductQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

const WholesalerCartContext = createContext<WholesalerCartContextType | undefined>(undefined);

interface WholesalerCartProviderProps {
  children: ReactNode;
}

export function WholesalerCartProvider({ children }: WholesalerCartProviderProps) {
  const cartData = useWholesalerCart();

  return (
    <WholesalerCartContext.Provider value={cartData}>
      {children}
    </WholesalerCartContext.Provider>
  );
}

export function useWholesalerCartContext() {
  const context = useContext(WholesalerCartContext);
  if (context === undefined) {
    // Devolver valores por defecto en lugar de lanzar error
    return {
      cart: null,
      itemsCount: 0,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      loading: false,
      error: null,
      lastUpdated: null,
      wholesalerDiscount: 0,
      loadCart: async () => {},
      addToCart: async () => ({ success: false, message: "Not available" }),
      updateQuantity: async () => ({ success: false, message: "Not available" }),
      removeFromCart: async () => ({ success: false, message: "Not available" }),
      clearCart: async () => ({ success: false, message: "Not available" }),
      applyDiscount: async () => ({ success: false, message: "Not available" }),
      addNotes: async () => ({ success: false, message: "Not available" }),
      syncCart: async () => ({ success: false, message: "Not available" }),
      getProductQuantity: () => 0,
      isInCart: () => false,
    };
  }
  return context;
}
