"use client";

import { useState } from "react";
import { Product } from "../../products/types/product";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  children,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simular una pequeña animación
    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart({ productId: product.id, quantity });
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || !product.inStock}
      className={`px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding
        ? "Agregando..."
        : children || (product.inStock ? "Agregar al Carrito" : "Sin Stock")}
    </button>
  );
}
