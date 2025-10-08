"use client";

import { X, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    itemsCount,
    subtotal,
    taxAmount,
    shippingAmount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    loadCart,
    loading,
  } = useCartContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [deletingItems, setDeletingItems] = useState<Set<number | string>>(
    new Set()
  );
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
  const getImageUrl = (
    product: { image?: string; image_url?: string } | null,
    isGift: boolean = false
  ) => {
    // Si es un regalo, usar icono de regalo
    if (isGift) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjQjU4RTMxIi8+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiA4djEzIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOSAxMnY3YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0ydi03IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03LjUgOGEyLjUgMi41IDAgMCAxIDAtNUE0LjggOCAwIDAgMSAxMiA4YTQuOCA4IDAgMCAxIDQuNS01IDIuNSAyLjUgMCAwIDEgMCA1IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPgo=";
    }

    if (!product) return "/images/cervezas/bottella-01.png";

    // Priorizar image_url si existe, sino usar image
    const imagePath = product.image_url || product.image;
    if (!imagePath) return "/images/cervezas/bottella-01.png";

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Construir URL completa con la base del backend
    return `http://localhost:8000/storage/${imagePath}`;
  };

  // Función para obtener el nombre del item (producto o regalo)
  const getItemName = (item: any) => {
    if (item.is_gift && item.gift_data) {
      return item.gift_data.name;
    }
    return item.product?.name || "Producto";
  };

  // Función para verificar si es un regalo
  const isGiftItem = (item: any) => {
    return item.is_gift === true || (item.product_id === null && item.gift_id);
  };

  // Función para obtener el ID del item (para operaciones de carrito)
  const getItemId = (item: any) => {
    if (isGiftItem(item)) {
      return item.gift_id || item.id;
    }
    return item.product_id;
  };

  // Función para manejar la eliminación con loading
  const handleRemoveFromCart = async (itemId: number | string) => {
    try {
      // Agregar el item a la lista de items siendo eliminados
      setDeletingItems((prev) => new Set(prev).add(itemId));

      // Llamar a la función de eliminación del contexto
      // Para regalos, usamos gift_id; para productos, usamos product_id
      if (typeof itemId === "string") {
        // Es un regalo
        await removeFromCart({ giftId: itemId });
      } else {
        // Es un producto normal
        await removeFromCart({ productId: itemId });
      }
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

  const handleCheckout = () => {
    handleClose();
    router.push("/checkout");
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
                      <p className="text-gray-500">Tu carrito está vacío</p>
                      <p className="text-sm text-gray-400">
                        Agrega algunas cervezas para comenzar
                      </p>
                    </div>
                  ) : (
                    <ul className="-my-5 divide-y divide-gray-200 divide-dotted">
                      {cart.items.map((item) => {
                        const isGift = isGiftItem(item);
                        const itemName = getItemName(item);
                        const itemId = getItemId(item);

                        return (
                          <li key={item.id} className="flex py-5">
                            <div
                              className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100"
                              style={{
                                backgroundColor: isGift ? "#B58E31" : undefined,
                              }}
                            >
                              <img
                                className={`object-cover ${
                                  isGift ? "w-8 h-8" : "w-16 h-16 rounded-lg"
                                }`}
                                src={getImageUrl(item.product, isGift)}
                                alt={itemName}
                                onError={(e) => {
                                  console.log(
                                    "🛒 Image failed to load:",
                                    getImageUrl(item.product, isGift)
                                  );
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/images/cervezas/bottella-01.png";
                                }}
                                onLoad={() => {
                                  console.log(
                                    "🛒 Image loaded successfully:",
                                    getImageUrl(item.product, isGift)
                                  );
                                }}
                              />
                            </div>

                            <div className="flex items-stretch justify-between flex-1 ml-5 space-x-5">
                              <div className="flex flex-col justify-between flex-1">
                                <p className="text-sm font-bold text-gray-900">
                                  {itemName}
                                </p>

                                {/* Mostrar detalles del regalo si es un regalo */}
                                {isGift && item.gift_data && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.gift_data.description ||
                                      `${item.gift_data.box?.name} con ${
                                        item.gift_data.beers?.length || 0
                                      } cervezas`}
                                  </p>
                                )}

                                {/* Controles de cantidad - Solo para productos, no para regalos */}
                                {!isGift && (
                                  <div className="mt-2 flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (item.quantity > 1) {
                                          await updateQuantity({
                                            productId: itemId,
                                            quantity: item.quantity - 1,
                                          });
                                        } else {
                                          await handleRemoveFromCart(itemId);
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
                                          productId: itemId,
                                          quantity: item.quantity + 1,
                                        })
                                      }
                                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end justify-between">
                                <p className="flex-shrink-0 w-20 text-sm font-bold text-right text-gray-600">
                                  {formatPrice(item.total_price)}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromCart(itemId)}
                                  disabled={deletingItems.has(itemId)}
                                  className={`inline-flex p-2 -m-2 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                                    deletingItems.has(itemId)
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-400 hover:text-gray-900 cursor-pointer"
                                  }`}
                                >
                                  {deletingItems.has(itemId) ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
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
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(
                        cart?.items?.reduce(
                          (sum, item) =>
                            sum +
                            parseFloat(String(item.unit_price)) * item.quantity,
                          0
                        ) || 0
                      )}
                    </p>
                  </li>
                </ul>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white transition-all duration-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "#B58E31" }}
                  >
                    Ir a Pagar
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
