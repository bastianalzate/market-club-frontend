"use client";

import { useState, useEffect, useRef } from "react";
import { TransformedProduct } from "@/hooks/useMayoristaProducts";
import LazyImage from "@/components/shared/LazyImage";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import { MessageCircle, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useWholesalerCartContext } from "@/contexts/WholesalerCartContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";

interface Pagination {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

interface MayoristaProductGridProps {
  products: TransformedProduct[];
  loading: boolean;
  totalProducts: number;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export default function MayoristaProductGrid({
  products,
  loading,
  totalProducts,
  pagination,
  onPageChange,
  onNextPage,
  onPrevPage,
}: MayoristaProductGridProps) {
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [removingFromCart, setRemovingFromCart] = useState<number | null>(null);
  
  // Hook del carrito de mayoristas
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductQuantity,
    isInCart,
    loading: cartLoading,
  } = useWholesalerCartContext();
  
  // Hook para notificaciones
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Sincronizar el estado local con la paginación del hook
  useEffect(() => {
    setCurrentPage(pagination.currentPage);
  }, [pagination.currentPage]);

  // Función para formatear precios
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Función para contactar por WhatsApp
  const handleWhatsAppContact = (product: TransformedProduct) => {
    const message = `Hola! Me interesa obtener información sobre el producto mayorista: *${product.name}*`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Función para agregar producto al carrito
  const handleAddToCart = async (product: TransformedProduct) => {
    // Verificar que el producto tenga stock antes de intentar agregarlo
    if (!product.inStock) {
      showError(
        "Producto agotado",
        `"${product.name}" no está disponible en este momento.`
      );
      return;
    }

    setAddingToCart(product.id);
    try {
      const result = await addToCart({
        productId: product.id,
        quantity: 1,
      });
      
      if (result.success) {
        showSuccess(
          "¡Producto agregado! 🍺",
          `"${product.name}" se agregó a la cotización exitosamente.`
        );
      } else {
        showError(
          "Error al agregar producto",
          result.message || "No se pudo agregar el producto a la cotización"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError(
        "Error al agregar producto",
        "Ocurrió un error inesperado. Intenta nuevamente."
      );
    } finally {
      setAddingToCart(null);
    }
  };

  // Función para aumentar cantidad
  const handleIncreaseQuantity = async (product: TransformedProduct) => {
    const currentQuantity = getProductQuantity(product.id);
    try {
      const result = await updateQuantity({
        productId: product.id,
        quantity: currentQuantity + 1,
      });
      
      if (!result.success) {
        showError(
          "Error al actualizar cantidad",
          result.message || "No se pudo actualizar la cantidad del producto"
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showError(
        "Error al actualizar cantidad",
        "Ocurrió un error inesperado. Intenta nuevamente."
      );
    }
  };

  // Función para disminuir cantidad
  const handleDecreaseQuantity = async (product: TransformedProduct) => {
    const currentQuantity = getProductQuantity(product.id);
    if (currentQuantity <= 1) {
      // Si la cantidad es 1 o menos, remover del carrito
      await handleRemoveFromCart(product);
    } else {
      try {
        const result = await updateQuantity({
          productId: product.id,
          quantity: currentQuantity - 1,
        });
        
        if (!result.success) {
          showError(
            "Error al actualizar cantidad",
            result.message || "No se pudo actualizar la cantidad del producto"
          );
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        showError(
          "Error al actualizar cantidad",
          "Ocurrió un error inesperado. Intenta nuevamente."
        );
      }
    }
  };

  // Función para remover del carrito
  const handleRemoveFromCart = async (product: TransformedProduct) => {
    setRemovingFromCart(product.id);
    try {
      const result = await removeFromCart({
        productId: product.id,
      });
      
      if (result.success) {
        showError(
          "¡Producto removido!",
          `"${product.name}" se removió de la cotización exitosamente.`
        );
      } else {
        showError(
          "Error al remover producto",
          result.message || "No se pudo remover el producto de la cotización"
        );
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showError(
        "Error al remover producto",
        "Ocurrió un error inesperado. Intenta nuevamente."
      );
    } finally {
      setRemovingFromCart(null);
    }
  };

  // Función para ir a una página específica
  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para ir a la página siguiente
  const handleGoToNextPage = () => {
    if (currentPage < pagination.lastPage) {
      handleGoToPage(currentPage + 1);
    }
  };

  // Función para ir a la página anterior
  const handleGoToPrevPage = () => {
    if (currentPage > 1) {
      handleGoToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-1">
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading && products.length === 0 ? (
          // Mostrar skeletons mientras cargan los productos
          Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍺</div>
            <h3 
              className="text-xl font-semibold text-white mb-2"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              No se encontraron productos
            </h3>
            <p 
              className="text-gray-400"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Intenta ajustar los filtros para ver más resultados
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
            >
              {/* Imagen del producto */}
              <div className="relative">
                <div
                  className="overflow-hidden pt-4"
                  style={{ height: "354px" }}
                >
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 
                    className="text-lg font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    {product.name}
                  </h3>
                  
                </div>

                {/* Controles del carrito */}
                <div className="mt-auto">
                {isInCart(product.id) ? (
                  <button
                    onClick={() => handleRemoveFromCart(product)}
                    disabled={removingFromCart === product.id}
                    className="w-full flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      backgroundColor: "#DC2626",
                    }}
                    onMouseEnter={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#B91C1C")
                    }
                    onMouseLeave={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#DC2626")
                    }
                  >
                    <span style={{ fontFamily: "var(--font-lato)" }}>
                      {removingFromCart === product.id ? 'Removiendo...' : 'Remover de la cotización'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id || !product.inStock}
                    className="w-full flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      backgroundColor: !product.inStock ? "#6B7280" : "#B58E31",
                    }}
                    onMouseEnter={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#A07D2A")
                    }
                    onMouseLeave={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#B58E31")
                    }
                  >
                    <span style={{ fontFamily: "var(--font-lato)" }}>
                      {addingToCart === product.id ? 'Agregando...' : 'Agregar a cotización'}
                    </span>
                    {addingToCart !== product.id && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
                </div>
               </div>
             </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {!loading && products.length > 0 && pagination.lastPage > 1 && (
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            {/* Botón anterior - solo mostrar si no estamos en la página inicial */}
            {currentPage > 1 && (
              <button
                onClick={handleGoToPrevPage}
                className="p-2 rounded-lg transition-colors text-white hover:text-gray-300 hover:bg-gray-800"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(
                (page) => {
                  // Mostrar solo algunas páginas para evitar demasiados botones
                  if (
                    page === 1 ||
                    page === pagination.lastPage ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handleGoToPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "text-white"
                            : "text-white hover:text-gray-300 hover:bg-gray-800"
                        }`}
                        style={
                          page === currentPage
                            ? { backgroundColor: "#B58E31" }
                            : {}
                        }
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span 
                        key={page} 
                        className="px-2 text-white"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={handleGoToNextPage}
              disabled={currentPage === pagination.lastPage}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === pagination.lastPage
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-white hover:text-gray-300 hover:bg-gray-800"
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
