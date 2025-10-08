"use client";

import { useState } from "react";
import { useWholesalerCartContext } from "@/contexts/WholesalerCartContext";
import { useToast } from "@/hooks/useToast";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import LazyImage from "@/components/shared/LazyImage";
import { constants } from "@/config/constants";

interface WholesalerCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesalerCartModal({
  isOpen,
  onClose,
}: WholesalerCartModalProps) {
  const {
    cart,
    itemsCount,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    totalAmount,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    addNotes,
  } = useWholesalerCartContext();

  const { showError, showSuccess } = useToast();
  const [notes, setNotes] = useState(cart?.notes || "");

  // Función para formatear precios
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Función para construir la URL completa de la imagen
  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath || imagePath.trim() === "") {
      return null; // Devolver null para que LazyImage muestre el placeholder
    }

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Si es una ruta relativa, construir la URL completa
    const baseUrl = constants.api_url.replace("/api", "");
    return `${baseUrl}/${imagePath}`;
  };

  // Función para actualizar cantidad
  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveFromCart(productId);
      return;
    }

    try {
      const result = await updateQuantity({ productId, quantity });
      if (!result.success) {
        showError("Error", result.message);
      }
    } catch (error) {
      showError("Error", "Error al actualizar cantidad");
    }
  };

  // Función para remover producto
  const handleRemoveFromCart = async (productId: number) => {
    try {
      const result = await removeFromCart({ productId });
      if (result.success) {
        showSuccess("Éxito", "Producto removido del carrito");
      } else {
        showError("Error", result.message);
      }
    } catch (error) {
      showError("Error", "Error al remover producto");
    }
  };

  // Función para limpiar carrito
  const handleClearCart = async () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar el carrito?")) {
      try {
        const result = await clearCart();
        if (result.success) {
          showSuccess("Éxito", "Carrito limpiado");
        } else {
          showError("Error", result.message);
        }
      } catch (error) {
        showError("Error", "Error al limpiar carrito");
      }
    }
  };

  // Función para guardar notas
  const handleSaveNotes = async () => {
    try {
      const result = await addNotes({ notes });
      if (result.success) {
        showSuccess("Éxito", "Notas guardadas");
      } else {
        showError("Error", result.message);
      }
    } catch (error) {
      showError("Error", "Error al guardar notas");
    }
  };

  // Función para contactar por WhatsApp
  const handleWhatsAppContact = () => {
    if (!cart || !cart.items.length) return;

    const itemsText = cart.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.product?.name || "Producto"} - ${formatPrice(
            item.total_price
          )}`
      )
      .join("\n");

    const message = `Hola! Me interesa cotizar los siguientes productos mayoristas:\n\n${itemsText}\n\nTotal: ${formatPrice(
      totalAmount
    )}`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Carrito Mayorista ({itemsCount} productos)
              </h2>
            </div>
            <button
              onClick={onClose}
              title="Cerrar carrito"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carrito vacío
                </h3>
                <p className="text-gray-500">
                  Agrega productos para comenzar tu pedido mayorista
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <LazyImage
                        src={getImageUrl(item.product?.image)}
                        alt={item.product?.name || "Producto"}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || "Producto"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Precio unitario: {formatPrice(item.unit_price)}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Total: {formatPrice(item.total_price)}
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={loading}
                        title="Disminuir cantidad"
                        className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        disabled={loading}
                        title="Aumentar cantidad"
                        className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Botón para remover */}
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      disabled={loading}
                      title="Remover producto del carrito"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con totales y acciones */}
          {cart && cart.items.length > 0 && (
            <div className="border-t p-6">
              {/* Notas del carrito */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas del pedido:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega notas especiales para tu pedido..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Descuento mayorista (15%):</span>
                  <span className="text-green-600">
                    -{formatPrice(subtotal * 0.15)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (5%):</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span>
                    {shippingAmount === 0
                      ? "Gratis"
                      : formatPrice(shippingAmount)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento adicional:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-yellow-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClearCart}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  Limpiar Carrito
                </button>

                <button
                  onClick={handleWhatsAppContact}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotizar WhatsApp</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
