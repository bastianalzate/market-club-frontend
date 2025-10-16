"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CategoryIcons from "./CategoryIcons";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import ServicesBanner from "@/components/home/ServicesBanner";
import CountriesBanner from "./CountriesBanner";
import { useProducts, TransformedProduct } from "@/hooks/useProducts";
import TiendaSEOText from "./TiendaSEOText";

function TiendaContentInner() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  // Hook para obtener productos desde la API
  const {
    products,
    loading,
    error,
    pagination,
    selectedCountry,
    selectedCategory,
    selectedPriceRange,
    selectedPackaging,
    searchProducts,
    filterByCountry,
    filterByCategory,
    filterByPriceRange,
    filterByPackaging,
    clearAllFilters,
    goToPage,
    nextPage,
    prevPage,
  } = useProducts();

  // Inicializar el término de búsqueda desde la URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchTerm(searchFromUrl);
  }, [searchParams]);

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      searchProducts(term);
    },
    [searchProducts]
  );

  // Función para manejar cambios en el filtro de país
  const handleCountryChange = useCallback(
    (country: string) => {
      filterByCountry(country);
    },
    [filterByCountry]
  );

  // Función para manejar cambios en el filtro de categoría
  const handleCategoryChange = useCallback(
    (category: string) => {
      filterByCategory(category);
    },
    [filterByCategory]
  );

  // Función para manejar cambios en el filtro de rango de precios
  const handlePriceRangeChange = useCallback(
    (priceRange: string) => {
      filterByPriceRange(priceRange);
    },
    [filterByPriceRange]
  );

  // Función para manejar cambios en el filtro de empaque
  const handlePackagingChange = useCallback(
    (packaging: string) => {
      filterByPackaging(packaging);
    },
    [filterByPackaging]
  );

  // Función para limpiar todos los filtros
  const handleClearFilters = useCallback(() => {
    setSearchTerm(""); // Limpiar también la búsqueda
    clearAllFilters();
  }, [clearAllFilters]);

  // Mostrar loading o error si es necesario
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Página {pagination.currentPage} de {pagination.lastPage} -{" "}
              {pagination.total} productos total
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar productos
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sección con fondo negro hasta el MarketClubBanner */}
      <div className="bg-black">
        {/* Iconos de categorías */}
        <CategoryIcons />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros */}
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedPackaging={selectedPackaging}
              onPackagingChange={handlePackagingChange}
              onClearFilters={handleClearFilters}
            />

            {/* Contenido principal */}
            <ProductGrid
              products={products}
              loading={loading}
              totalProducts={pagination.total}
              pagination={pagination}
              onPageChange={goToPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </div>
        </div>

        {/* Market Club Banner */}
        <MarketClubBanner />
      </div>

      {/* Sección con fondo gris después del MarketClubBanner */}
      <div className="bg-gray-50">
        <TiendaSEOText />
      </div>
    </div>
  );
}

export default function TiendaContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tienda...</p>
          </div>
        </div>
      }
    >
      <TiendaContentInner />
    </Suspense>
  );
}
