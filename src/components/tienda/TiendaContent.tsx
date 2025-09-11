"use client";

import { useState, useCallback } from "react";
import CategoryIcons from "./CategoryIcons";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import ServicesBanner from "@/components/home/ServicesBanner";
import CountriesBanner from "./CountriesBanner";
import { useProducts } from "@/hooks/useProducts";

export default function TiendaContent() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hook para obtener productos desde la API
  const { products, loading, error, searchProducts } = useProducts();

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      searchProducts(term);
    },
    [searchProducts]
  );

  // Mostrar loading o error si es necesario
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
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
            />

            {/* Contenido principal */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>

        {/* Market Club Banner */}
        <MarketClubBanner />
      </div>

      {/* Sección con fondo gris después del MarketClubBanner */}
      <div className="bg-gray-50">
        {/* Countries Banner */}
        <CountriesBanner />

        {/* Services Banner */}
        <ServicesBanner />
      </div>
    </div>
  );
}
