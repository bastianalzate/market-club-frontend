"use client";

import { useState } from "react";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Configuración de paginación
  const productsPerPage = 9;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Obtener productos de la página actual
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll hacia arriba para ver los productos
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-1">
      {/* Controles de vista y paginación */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-amber-100 text-amber-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-amber-100 text-amber-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Mostrando {startIndex + 1}-{Math.min(endIndex, products.length)} de{" "}
          {products.length} productos
        </div>
      </div>

      {/* Grid de productos */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg overflow-hidden shadow-lg ${
              viewMode === "list" ? "flex" : ""
            }`}
          >
            {/* Imagen del producto */}
            <div
              className={`relative ${
                viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
              }`}
            >
              <div className="aspect-w-1 aspect-h-1 overflow-hidden pt-4">
                <img
                  className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                  src={product.image}
                  alt={product.name}
                />
              </div>
            </div>

            {/* Información del producto */}
            <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 font-medium">
                  {product.category}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {product.name}
              </h3>

              {/* Botones de acción */}
              <div className="flex items-center space-x-3">
                {/* Botón de carrito cuadrado */}
                <button
                  disabled={!product.inStock}
                  className={`p-3 rounded-lg transition-colors ${
                    product.inStock
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Agregar al carrito"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
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
                </button>

                {/* Botón principal "Añadir al carrito" */}
                <button
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    product.inStock
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  style={product.inStock ? { backgroundColor: "#B58E31" } : {}}
                  onMouseEnter={
                    product.inStock
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#A07D2A")
                      : undefined
                  }
                  onMouseLeave={
                    product.inStock
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#B58E31")
                      : undefined
                  }
                >
                  <span>Añadir al carrito</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            {/* Botón anterior */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Mostrar solo algunas páginas para evitar demasiados botones
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-amber-600 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
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
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
