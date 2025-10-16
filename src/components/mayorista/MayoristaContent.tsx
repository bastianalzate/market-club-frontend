"use client";

import { useState, useCallback, Suspense } from "react";
import CategoryIcons from "@/components/tienda/CategoryIcons";
import ProductFilters from "@/components/tienda/ProductFilters";
import MayoristaProductGrid from "./MayoristaProductGrid";
import WholesalerCartDrawer from "./WholesalerCartDrawer";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import ServicesBanner from "@/components/home/ServicesBanner";
import { useMayoristaProducts } from "@/hooks/useMayoristaProducts";
import { WholesalerCartProvider, useWholesalerCartContext } from "@/contexts/WholesalerCartContext";
import { MessageCircle } from "lucide-react";

function MayoristaContentInner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hook para obtener productos desde la API
  const {
    products,
    loading,
    error,
    pagination,
    selectedCountry,
    selectedCategory,
    selectedPriceRange,
    searchProducts,
    filterByCountry,
    filterByCategory,
    filterByPriceRange,
    clearAllFilters,
    goToPage,
    nextPage,
    prevPage,
  } = useMayoristaProducts();

  // Hook del carrito de mayoristas
  const { itemsCount } = useWholesalerCartContext();

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
          <p className="text-gray-600">Cargando productos mayoristas...</p>
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
          {/* Header con título y botón del carrito */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-[30px] sm:text-2xl font-bold text-white mb-2">
                Productos mayoristas
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {loading
                  ? "Cargando productos..."
                  : `${pagination.total} productos disponibles`}
              </p>
            </div>
            
            {/* Botón del carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-1 sm:space-x-2 text-white px-2 py-2 sm:px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer text-xs sm:text-base"
              style={{
                backgroundColor: "#B58E31",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#A07D2A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#B58E31")
              }
            >
              <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Cotizar WhatsApp</span>
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>

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
              selectedPackaging=""
              onPackagingChange={() => {}}
              onClearFilters={handleClearFilters}
              hidePriceFilter={true}
            />

            {/* Contenido principal */}
            <MayoristaProductGrid
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
      <div className="bg-gray-50"></div>

      {/* Cart Drawer */}
      <WholesalerCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton onOpenCart={() => setIsCartOpen(true)} />
    </div>
  );
}

export default function MayoristaContent() {
  return (
    <WholesalerCartProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando tienda mayorista...</p>
            </div>
          </div>
        }
      >
        <MayoristaContentInner />
      </Suspense>
    </WholesalerCartProvider>
  );
}
