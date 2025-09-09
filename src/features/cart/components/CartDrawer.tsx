"use client";

import { X, Trash2 } from "lucide-react";
import { CartItem } from "../types/cart";

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "#00000091" }}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div className="fixed inset-y-0 right-0 w-full h-full max-w-xs sm:max-w-sm z-50">
        <div className="h-full overflow-hidden bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-gray-900">
                  Shopping Cart
                </p>
                <button
                  type="button"
                  onClick={onClose}
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
                          <div className="flex-shrink-0">
                            <img
                              className="object-cover w-16 h-16 rounded-lg"
                              src={item.product.image}
                              alt={item.product.name}
                            />
                          </div>

                          <div className="flex items-stretch justify-between flex-1 ml-5 space-x-5">
                            <div className="flex flex-col justify-between flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="mt-1.5 text-sm font-medium text-gray-500">
                                Qty: {item.quantity}
                              </p>
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
                      Sub total
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
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                  >
                    Checkout
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200 focus:bg-gray-200"
                  >
                    Continue Shopping
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
