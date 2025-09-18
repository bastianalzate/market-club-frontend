"use client";

import { useCartContext } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/formatters";
import { constants } from "@/config/constants";

interface CheckoutSummaryProps {
  onContinue: () => void;
}

export default function CheckoutSummary({ onContinue }: CheckoutSummaryProps) {
  const { cart, itemsCount } = useCartContext();

  // Helper function para obtener la URL de imagen del producto
  const getProductImageUrl = (product: any) => {
    if (product.image_url) {
      return product.image_url;
    }
    if (product.image) {
      // Si la imagen ya incluye la URL completa, usarla tal como está
      if (product.image.startsWith("http")) {
        return product.image;
      }
      // Si es una ruta relativa, construir la URL completa
      const baseUrl = constants.api_url.replace("/api", "");
      return `${baseUrl}/storage/${product.image}`;
    }
    return "/images/cervezas/bottella-01.png";
  };

  // Calcular subtotal manualmente para asegurar precisión
  const manualSubtotal =
    cart?.items?.reduce((sum, item) => {
      return sum + parseFloat(String(item.unit_price)) * item.quantity;
    }, 0) || 0;

  // Calcular impuestos (IVA 19% en Colombia)
  const TAX_RATE = 0.19; // 19%
  const calculatedTaxAmount = Math.round(manualSubtotal * TAX_RATE);

  // Usar impuestos calculados si el backend no los proporciona
  const finalTaxAmount =
    parseFloat(String(cart?.tax_amount || 0)) || calculatedTaxAmount;

  // Calcular total manualmente
  const manualTotal =
    manualSubtotal +
    parseFloat(String(cart?.shipping_amount || 0)) +
    finalTaxAmount;

  if (itemsCount === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500">
            Agrega algunos productos para continuar con tu compra
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Resumen del Pedido
          </h2>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="space-y-3 sm:space-y-4">
          {cart?.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                <img
                  src={getProductImageUrl(item.product)}
                  alt={item.product.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/cervezas/bottella-01.png";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
                <p className="text-xs text-gray-400">
                  Precio unitario: {formatPrice(item.unit_price)}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatPrice(
                    parseFloat(String(item.unit_price)) * item.quantity
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-100">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(manualSubtotal)}
            </span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Impuestos (IVA 19%):</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(finalTaxAmount)}
            </span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Envío:</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(cart?.shipping_amount || 0)}
            </span>
          </div>

          <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-200 pt-2 sm:pt-3">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{formatPrice(manualTotal)}</span>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
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
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">
              Entrega estimada
            </p>
            <p className="text-xs text-blue-700">3-5 días hábiles</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-100">
        <button
          onClick={onContinue}
          className="w-full text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-600 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-yellow-600 hover:bg-yellow-700"
        >
          Continuar al Checkout
        </button>
      </div>
    </div>
  );
}
