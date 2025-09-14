"use client";

import { useCartContext } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/formatters";

interface CheckoutSummaryProps {
  onContinue: () => void;
}

export default function CheckoutSummary({ onContinue }: CheckoutSummaryProps) {
  const { cart, itemsCount } = useCartContext();

  if (itemsCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-500 text-center">
          No hay productos en el carrito
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Resumen del Pedido
        </h2>
      </div>

      {/* Items */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {cart?.items?.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={
                    item.product.image_url ||
                    item.product.image ||
                    "/images/cervezas/bottella-01.png"
                  }
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(item.total_price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium text-gray-900">
            {formatPrice(cart?.subtotal || 0)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Impuestos:</span>
          <span className="font-medium text-gray-900">
            {formatPrice(cart?.tax_amount || 0)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío:</span>
          <span className="font-medium text-gray-900">
            {formatPrice(cart?.shipping_amount || 0)}
          </span>
        </div>

        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">
            {formatPrice(cart?.total_amount || 0)}
          </span>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm text-gray-600">
            Entrega estimada: 3-5 días hábiles
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        <button
          onClick={onContinue}
          className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Continuar al Checkout
        </button>

        {/* Botón de prueba para debug */}
        <button
          onClick={async () => {
            try {
              const { CheckoutService } = await import(
                "@/services/checkoutService"
              );
              const result = await CheckoutService.calculateShipping(
                "Bogotá",
                "Cundinamarca",
                "110111"
              );
              console.log("🧪 Test Result:", result);
            } catch (error) {
              console.error("🧪 Test Error:", error);
            }
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          🧪 Probar Cálculo de Envío
        </button>
      </div>
    </div>
  );
}
