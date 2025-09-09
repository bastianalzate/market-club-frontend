"use client";

import { useState, useCallback } from "react";
import { CartItem, CartState } from "../types/cart";
import { Product } from "../../products/types/product";
import { mockProducts } from "../../products/data/mockProducts";

export function useCart() {
  // Crear algunos productos de muestra para el carrito
  const createSampleCartItems = (): CartItem[] => {
    return [
      {
        id: "sample-1",
        product: mockProducts[0], // Corona Extra
        quantity: 2,
        addedAt: new Date(),
      },
      {
        id: "sample-2", 
        product: mockProducts[1], // Heineken
        quantity: 1,
        addedAt: new Date(),
      },
      {
        id: "sample-3",
        product: mockProducts[4], // Guinness Draught
        quantity: 1,
        addedAt: new Date(),
      },
    ];
  };

  const [cartState, setCartState] = useState<CartState>({
    items: createSampleCartItems(), // Productos de muestra
    isOpen: false,
    isLoading: false,
    error: null,
  });

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartState((prev) => {
      const existingItem = prev.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        addedAt: new Date(),
      };

      return {
        ...prev,
        items: [...prev.items, newItem],
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCartState((prev) => ({
      ...prev,
      items: [],
    }));
  }, []);

  const openCart = useCallback(() => {
    setCartState((prev) => ({
      ...prev,
      isOpen: true,
    }));
  }, []);

  const closeCart = useCallback(() => {
    setCartState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const checkout = useCallback(() => {
    // Aquí iría la lógica de checkout
    console.log("Proceeding to checkout with items:", cartState.items);
    // Por ahora solo cerramos el carrito
    closeCart();
  }, [cartState.items, closeCart]);

  const totalItems = cartState.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    ...cartState,
    totalItems,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    checkout,
  };
}
