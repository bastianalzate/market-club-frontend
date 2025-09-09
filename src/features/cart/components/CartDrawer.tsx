"use client";

import { X, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { CartItem } from "@/store/slices/cartSlice";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal;

  // Manejar la animación de entrada
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Manejar la animación de salida
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300); // Duración de la animación
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>

      {/* Backdrop/Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: "#00000091",
          animation: isAnimating
            ? "fadeIn 0.3s ease-in-out"
            : "fadeOut 0.3s ease-in-out",
        }}
        onClick={handleClose}
      />

      {/* Cart Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full h-full max-w-xs sm:max-w-sm z-50"
        style={{
          animation: isAnimating
            ? "slideInFromRight 0.3s ease-in-out"
            : "slideOutToRight 0.3s ease-in-out",
        }}
      >
        <div className="h-full overflow-hidden bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-gray-900">
                  Carrito de Compras
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 -m-2 text-gray-500 transition-all duration-200 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 sm:px-6">
                <div className="flow-root">
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Tu carrito está vacío</p>
                      <p className="text-sm text-gray-400">
                        Agrega algunas cervezas para comenzar
                      </p>
                    </div>
                  ) : (
                    <ul className="-my-5 divide-y divide-gray-200 divide-dotted">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-5">
                          <div 
                            className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
                              item.product.category === "Regalo Personalizado" 
                                ? "" 
                                : "bg-gray-100"
                            }`}
                            style={item.product.category === "Regalo Personalizado" ? { backgroundColor: '#B58E31' } : {}}
                          >
                            <img
                              className={`object-cover ${
                                item.product.category === "Regalo Personalizado" 
                                  ? "w-8 h-8" 
                                  : "w-16 h-16 rounded-lg"
                              }`}
                              src={item.product.image}
                              alt={item.product.name}
                            />
                          </div>

                          <div className="flex items-stretch justify-between flex-1 ml-5 space-x-5">
                            <div className="flex flex-col justify-between flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                {item.product.name}
                              </p>

                              {/* Controles de cantidad */}
                              <div className="mt-2 flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      onUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      );
                                    } else {
                                      onRemoveItem(item.id);
                                    }
                                  }}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>

                                <span className="text-sm font-bold text-gray-800 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <p className="flex-shrink-0 w-20 text-sm font-bold text-right text-gray-600">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </p>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="inline-flex p-2 -m-2 text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-gray-900"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-5 border-t border-gray-200 sm:p-6">
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">
                      Subtotal
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      {formatPrice(subtotal)}
                    </p>
                  </li>

                  <li className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(total)}
                    </p>
                  </li>
                </ul>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={onCheckout}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white transition-all duration-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 hover:opacity-90"
                    style={{ backgroundColor: '#B58E31' }}
                  >
                    Ir a Pagar
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200 focus:bg-gray-200"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
