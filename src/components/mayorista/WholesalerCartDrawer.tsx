"use client";

import { X, Trash2, Plus, Minus, Loader2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWholesalerCartContext } from "@/contexts/WholesalerCartContext";
import LazyImage from "@/components/shared/LazyImage";
import { constants } from "@/config/constants";

interface WholesalerCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesalerCartDrawer({ isOpen, onClose }: WholesalerCartDrawerProps) {
  const {
    cart,
    itemsCount,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    addNotes,
    loading,
  } = useWholesalerCartContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set());
  const router = useRouter();

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Función para construir la URL completa de la imagen
  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath || imagePath.trim() === "") {
      return null; // Devolver null para que LazyImage muestre el placeholder
    }

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Construir URL completa con la base del backend
    return `http://localhost:8000/storage/${imagePath}`;
  };

  // Función para manejar la eliminación con loading
  const handleRemoveFromCart = async (itemId: number) => {
    try {
      // Agregar el item a la lista de items siendo eliminados
      setDeletingItems((prev) => new Set(prev).add(itemId));

      // Llamar a la función de eliminación del contexto
      await removeFromCart({ productId: itemId });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      // Remover el item de la lista de items siendo eliminados
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Función para contactar por WhatsApp
  const handleWhatsAppContact = () => {
    if (!cart || !cart.items.length) return;

    const itemsText = cart.items
      .map((item, index) => `${index + 1}. ${item.product?.name || 'Producto'} - ${formatPrice(item.total_price)}`)
      .join('\n');

    const message = `Hola! Me interesa cotizar los siguientes productos mayoristas:\n\n${itemsText}\n\nTotal: ${formatPrice(totalAmount)}`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

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
                  Carrito Mayorista
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 -m-2 text-gray-500 transition-all duration-200 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 sm:px-6">
                <div className="flow-root">
                  {!cart || cart.items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Tu carrito mayorista está vacío</p>
                      <p className="text-sm text-gray-400">
                        Agrega algunos productos para cotizar
                      </p>
                    </div>
                  ) : (
                    <ul className="-my-5 divide-y divide-gray-200 divide-dotted">
                      {cart.items.map((item) => (
                        <li key={item.id} className="flex py-5">
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100">
                            <LazyImage
                              src={getImageUrl(item.product?.image || item.product_snapshot?.image || null)}
                              alt={item.product?.name || item.product_snapshot?.name || 'Producto'}
                              className="w-12 h-12 rounded-lg"
                            />
                          </div>

                          <div className="flex items-stretch justify-between flex-1 ml-5 space-x-5">
                            <div className="flex flex-col justify-between flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                {item.product?.name || item.product_snapshot?.name || 'Producto'}
                              </p>

                              {/* Controles de cantidad */}
                              <div className="mt-2 flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (item.quantity > 1) {
                                      await updateQuantity({
                                        productId: item.product_id,
                                        quantity: item.quantity - 1,
                                      });
                                    } else {
                                      await handleRemoveFromCart(item.product_id);
                                    }
                                  }}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>

                                <span className="text-sm font-bold text-gray-800 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={async () =>
                                    await updateQuantity({
                                      productId: item.product_id,
                                      quantity: item.quantity + 1,
                                    })
                                  }
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <p className="flex-shrink-0 w-20 text-sm font-bold text-right text-gray-600">
                                {formatPrice(item.total_price)}
                              </p>

                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(item.product_id)}
                                disabled={deletingItems.has(item.product_id)}
                                className={`inline-flex p-2 -m-2 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                                  deletingItems.has(item.product_id)
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-400 hover:text-gray-900 cursor-pointer"
                                }`}
                              >
                                {deletingItems.has(item.product_id) ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-5 h-5" />
                                )}
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
            {itemsCount > 0 && (
              <div className="px-4 py-5 border-t border-gray-200 sm:p-6">
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Subtotal</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(subtotal)}
                    </p>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Impuestos</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(taxAmount)}
                    </p>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Envío</p>
                    <p className="text-sm font-bold text-gray-900">
                      {shippingAmount === 0 ? "Gratis" : formatPrice(shippingAmount)}
                    </p>
                  </li>
                  <li className="flex items-center justify-between border-t pt-2">
                    <p className="text-base font-bold text-gray-900">Total</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(totalAmount)}
                    </p>
                  </li>
                </ul>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppContact}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white transition-all duration-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "#B58E31" }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Cotizar WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer"
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
