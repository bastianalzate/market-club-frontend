"use client";

import { useState, useEffect, useRef } from "react";
import { TransformedProduct } from "@/hooks/useMayoristaProducts";
import LazyImage from "@/components/shared/LazyImage";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import { MessageCircle, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useWholesalerCartContext } from "@/contexts/WholesalerCartContext";
import { useToast } from "@/hooks/useToast";

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
  const { showToast } = useToast();

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
    try {
      const result = await addToCart({
        productId: product.id,
        quantity: 1,
      });
      
      if (result.success) {
        showToast({
          type: 'success',
          message: 'Producto agregado al carrito mayorista',
        });
      } else {
        showToast({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al agregar producto al carrito',
      });
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
        showToast({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al actualizar cantidad',
      });
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
          showToast({
            type: 'error',
            message: result.message,
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Error al actualizar cantidad',
        });
      }
    }
  };

  // Función para remover del carrito
  const handleRemoveFromCart = async (product: TransformedProduct) => {
    try {
      const result = await removeFromCart({
        productId: product.id,
      });
      
      if (result.success) {
        showToast({
          type: 'success',
          message: 'Producto removido del carrito',
        });
      } else {
        showToast({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al remover producto del carrito',
      });
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-400">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Precios */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Precio regular:</span>
                      <span className="text-sm text-gray-600 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">Precio mayorista:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(parseFloat(product.price) * 0.85)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Ahorro:</span>
                      <span className="text-xs font-medium text-green-600">
                        {formatPrice(parseFloat(product.price) * 0.15)} (15%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controles del carrito */}
                <div className="mt-auto">
                {isInCart(product.id) ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Botón de basura cuadrado - Solo visual */}
                    <div
                      className="relative p-2 sm:p-3 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#D0D5DD",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                      aria-label="Remover del carrito"
                    >
                      <Trash2
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        style={{ color: "#DC2626" }}
                      />
                    </div>

                    {/* Botón principal "Remover del carrito" */}
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      disabled={cartLoading}
                      className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      <span>Remover del carrito</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Botón de carrito cuadrado con contador - Solo visual */}
                    <div
                      className="relative p-2 sm:p-3 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#D0D5DD",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                      aria-label="Contador del carrito"
                    >
                      <ShoppingCart
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        style={{ color: "#B58E31" }}
                      />
                      {/* Contador en el ícono del carrito */}
                      {isInCart(product.id) && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                          {getProductQuantity(product.id)}
                        </span>
                      )}
                    </div>

                    {/* Botón principal "Añadir al carrito" */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={cartLoading || !product.inStock}
                      className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      <span>
                        {cartLoading ? 'Agregando...' : 'Añadir al carrito'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                   </div>
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
                      <span key={page} className="px-2 text-white">
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
    </div>
  );
}
