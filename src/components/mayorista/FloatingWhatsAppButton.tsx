"use client";

import { MessageCircle } from "lucide-react";
import { useWholesalerCartContext } from "@/contexts/WholesalerCartContext";

interface FloatingWhatsAppButtonProps {
  onOpenCart: () => void;
}

export default function FloatingWhatsAppButton({ onOpenCart }: FloatingWhatsAppButtonProps) {
  const { cart, itemsCount } = useWholesalerCartContext();

  // Solo mostrar el botón si hay productos en el carrito
  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <button
      onClick={onOpenCart}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      title="Ver carrito de cotización"
    >
      <MessageCircle className="w-5 h-5" />
      
      {/* Badge con cantidad de productos */}
      {itemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemsCount}
        </span>
      )}
    </button>
  );
}
