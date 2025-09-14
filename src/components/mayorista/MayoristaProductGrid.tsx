"use client";

import { useState, useEffect, useRef } from "react";
import { TransformedProduct } from "@/hooks/useMayoristaProducts";
import LazyImage from "@/components/shared/LazyImage";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { MessageCircle } from "lucide-react";

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
      {/* Header con información de productos */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Productos Mayoristas
        </h2>
        <p className="text-gray-300">
          {loading
            ? "Cargando productos..."
            : `${totalProducts} productos disponibles`}
        </p>
      </div>

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
              className="bg-white rounded-lg overflow-hidden shadow-lg"
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
              <div className="p-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {product.name}
                  </h3>
                </div>

                {/* Botón de cotizar */}
                <button
                  onClick={() => handleWhatsAppContact(product)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotizar WhatsApp</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {!loading && products.length > 0 && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-white"
              }`}
            >
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handleGoToPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleGoToNextPage}
              disabled={currentPage === pagination.lastPage}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === pagination.lastPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-white"
              }`}
            >
              Siguiente
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Página {currentPage} de {pagination.lastPage}
          </div>
        </div>
      )}
    </div>
  );
}
