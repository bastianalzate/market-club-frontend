"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  Check,
  Plus,
  Minus,
  Star,
  Clock,
  Gift,
  ShoppingCart,
} from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useNotification } from "@/hooks/useNotification";
import { useProducts, TransformedProduct } from "@/hooks/useProducts";
import { useFilters } from "@/hooks/useFilters";
import NotificationToast from "@/components/shared/NotificationToast";
import LazyImage from "@/components/shared/LazyImage";
import { formatPrice } from "@/utils/formatters";

interface GiftBox {
  id: string;
  name: string;
  description: string;
  maxBeers: number;
  price: number;
  image: string;
  recommended?: boolean;
  dimensions: string;
  deliveryTime: string;
}

interface Beer {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  volume: string;
  category: string;
  nationality: string;
  rating: number;
  inStock: boolean;
  description: string;
}

interface GiftBuilderState {
  selectedBox: GiftBox | null;
  selectedBeers: Beer[];
  totalPrice: number;
  isComplete: boolean;
}

const giftBoxes: GiftBox[] = [
  {
    id: "small",
    name: "Caja pequeña",
    description: "Perfecta para una sorpresa especial",
    maxBeers: 4,
    price: 5000,
    image: "/images/logo/logo.png",
    dimensions: "20x15x10 cm",
    deliveryTime: "1-2 días",
  },
  {
    id: "medium",
    name: "Caja mediana",
    description: "Ideal para compartir con amigos",
    maxBeers: 8,
    price: 8000,
    image: "/images/logo/logo.png",
    recommended: true,
    dimensions: "25x20x15 cm",
    deliveryTime: "1-2 días",
  },
  {
    id: "large",
    name: "Caja grande",
    description: "Para las ocasiones más especiales",
    maxBeers: 12,
    price: 12000,
    image: "/images/logo/logo.png",
    dimensions: "30x25x20 cm",
    deliveryTime: "2-3 días",
  },
];

// Función para convertir TransformedProduct a Beer
const transformToBeer = (product: TransformedProduct): Beer => {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price:
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price,
    image: product.image,
    volume: "BOTELLA 500ML", // Valor por defecto
    category:
      typeof product.category === "string"
        ? product.category
        : product.category?.name || "Cerveza",
    nationality: "Importada", // Valor por defecto
    rating: product.rating,
    inStock: product.inStock,
    description: product.description,
  };
};

export default function GiftBuilder() {
  // Seleccionar la caja recomendada por defecto
  const defaultBox = giftBoxes.find((box) => box.recommended) || giftBoxes[0];

  // Hook del carrito
  const { addGift, loadCart } = useCartContext();

  // Hook de notificaciones
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  // Hook de productos del backend con paginación y filtros
  const {
    products: backendProducts,
    loading: productsLoading,
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
  } = useProducts();

  const [giftBuilder, setGiftBuilder] = useState<GiftBuilderState>({
    selectedBox: defaultBox,
    selectedBeers: [],
    totalPrice: defaultBox.price,
    isComplete: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Referencia para el scroll al título de cervezas
  const cervezasTitleRef = useRef<HTMLDivElement>(null);

  // Convertir productos del backend a formato Beer
  const availableBeers = backendProducts.map(transformToBeer);

  // Obtener filtros desde el backend
  const { filters, loading: filtersLoading } = useFilters();

  // Transformar datos del backend al formato esperado
  const categories = [
    { value: "", label: "Todas" },
    ...filters.beer_styles.map((style) => ({
      value: style,
      label: style.charAt(0) + style.slice(1).replace("_", " "),
    })),
  ];

  // Países desde el backend
  const countries = [
    { value: "", label: "Todos" },
    ...filters.countries.map((country) => ({
      value: country,
      label: country,
    })),
  ];

  // Rangos de precio desde el backend
  const priceRanges = [
    { value: "", label: "Todos los precios" },
    ...filters.price_ranges
      .sort((a, b) => {
        // Extraer números para ordenar correctamente
        const getMinValue = (range: string) => {
          if (range.includes("+")) {
            // Para rangos como "50k+", usar el valor base
            return parseInt(range.replace("k+", "")) * 1000;
          }
          // Para rangos como "0-10k", "10k-25k", etc.
          const match = range.match(/(\d+)k?-(\d+)k?/);
          return match ? parseInt(match[1]) * 1000 : 0;
        };
        
        return getMinValue(a) - getMinValue(b);
      })
      .map((range) => ({
        value: range,
        label: range.replace("k", "k").replace("-", " - "),
      })),
  ];

  // Los productos ya vienen filtrados del hook useProducts
  const filteredBeers = availableBeers.filter((beer) => {
    const matchesSearch =
      beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beer.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && beer.inStock;
  });

  // Funciones para manejar cambios en los filtros
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    searchProducts(term);
  };

  const handleCountryChange = (country: string) => {
    filterByCountry(country);
  };

  const handleCategoryChange = (category: string) => {
    filterByCategory(category);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    filterByPriceRange(priceRange);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    clearAllFilters();
  };

  const selectBox = (box: GiftBox) => {
    setGiftBuilder((prev) => ({
      ...prev,
      selectedBox: box,
      selectedBeers: [], // Reset beers when box changes
      totalPrice: box.price,
      isComplete: false,
    }));
  };

  const addBeer = (beer: Beer) => {
    if (!giftBuilder.selectedBox) return;
    if (giftBuilder.selectedBeers.length >= giftBuilder.selectedBox.maxBeers)
      return;
    if (giftBuilder.selectedBeers.some((b) => b.id === beer.id)) return;

    setGiftBuilder((prev) => {
      const newBeers = [...prev.selectedBeers, beer];
      const newTotalPrice =
        prev.selectedBox!.price + newBeers.reduce((sum, b) => sum + b.price, 0);

      return {
        ...prev,
        selectedBeers: newBeers,
        totalPrice: newTotalPrice,
        isComplete: newBeers.length === prev.selectedBox!.maxBeers,
      };
    });
  };

  const removeBeer = (beerId: number) => {
    setGiftBuilder((prev) => {
      const newBeers = prev.selectedBeers.filter((b) => b.id !== beerId);
      const newTotalPrice =
        prev.selectedBox!.price + newBeers.reduce((sum, b) => sum + b.price, 0);

      return {
        ...prev,
        selectedBeers: newBeers,
        totalPrice: newTotalPrice,
        isComplete: newBeers.length === prev.selectedBox!.maxBeers,
      };
    });
  };

  const isBeerSelected = (beerId: number) => {
    return giftBuilder.selectedBeers.some((b) => b.id === beerId);
  };

  const canAddMore =
    giftBuilder.selectedBox &&
    giftBuilder.selectedBeers.length < giftBuilder.selectedBox.maxBeers;

  // Funciones de paginación con scroll suave al título de cervezas
  const handleGoToPage = (page: number) => {
    goToPage(page);
    // Scroll suave al título de cervezas
    setTimeout(() => {
      cervezasTitleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleGoToNextPage = () => {
    nextPage();
    setTimeout(() => {
      cervezasTitleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleGoToPrevPage = () => {
    prevPage();
    setTimeout(() => {
      cervezasTitleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Función para agregar el regalo al carrito
  const handleAddGiftToCart = async () => {
    if (!giftBuilder.selectedBox || giftBuilder.selectedBeers.length === 0) {
      showError(
        "Regalo incompleto",
        "Por favor, selecciona una caja y al menos una cerveza para crear tu regalo."
      );
      return;
    }

    try {
      console.log("🎁 Creando regalo personalizado...");
      console.log("🎁 Caja seleccionada:", giftBuilder.selectedBox);
      console.log("🎁 Cervezas seleccionadas:", giftBuilder.selectedBeers);

      // Crear los datos del regalo para enviar al backend
      const beerNames = giftBuilder.selectedBeers
        .map((beer) => beer.name)
        .join(", ");
      const giftName = `Regalo Personalizado - ${giftBuilder.selectedBox.name}`;
      const giftDescription = `Caja ${giftBuilder.selectedBox.name} con ${giftBuilder.selectedBeers.length} cervezas: ${beerNames}`;

      const giftData = {
        name: giftName,
        description: giftDescription,
        box: {
          id: giftBuilder.selectedBox.id,
          name: giftBuilder.selectedBox.name,
          price: giftBuilder.selectedBox.price,
          description: giftBuilder.selectedBox.description,
          maxBeers: giftBuilder.selectedBox.maxBeers,
          dimensions: giftBuilder.selectedBox.dimensions,
          deliveryTime: giftBuilder.selectedBox.deliveryTime,
        },
        beers: giftBuilder.selectedBeers.map((beer) => ({
          id: beer.id,
          name: beer.name,
          brand: beer.brand,
          price: beer.price,
          volume: beer.volume,
          category: beer.category,
          nationality: beer.nationality,
        })),
        totalPrice: giftBuilder.totalPrice,
        quantity: 1,
      };

      // Crear un ID especial para el regalo usando timestamp
      const giftId = Date.now().toString();

      console.log("🎁 ID del regalo generado:", giftId);
      console.log("🎁 Datos del regalo:", giftData);

      // Preparar datos en el formato que espera el backend
      const giftPayload = {
        product_id: giftId,
        quantity: 1,
        gift_data: giftData,
        is_gift: true,
      };

      console.log("🎁 Payload a enviar:", giftPayload);

      // Usar el endpoint específico para regalos
      const result = await addGift(giftPayload);

      if (result.success) {
        // Forzar recarga del carrito para asegurar sincronización
        console.log("🎁 Forzando recarga del carrito...");
        await loadCart();

        // Mostrar notificación de éxito
        showSuccess(
          "¡Regalo agregado! 🎉",
          `Tu regalo personalizado "${giftBuilder.selectedBox.name}" con ${
            giftBuilder.selectedBeers.length
          } cerveza${
            giftBuilder.selectedBeers.length > 1 ? "s" : ""
          } se agregó al carrito exitosamente.`
        );

        // Resetear el builder después de agregar para crear otro regalo
        setGiftBuilder({
          selectedBox: defaultBox,
          selectedBeers: [],
          totalPrice: defaultBox.price,
          isComplete: false,
        });

        console.log("🎁 Regalo agregado exitosamente y builder reseteado");
      } else {
        showError(
          "Error al agregar regalo",
          result.message || "No se pudo agregar el regalo al carrito."
        );
      }
    } catch (error) {
      console.error("🎁 Error al agregar regalo al carrito:", error);
      showError(
        "Error al agregar regalo",
        error instanceof Error
          ? error.message
          : "No se pudo agregar el regalo al carrito. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Título y Descripción */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Construye tu regalo perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige tu caja favorita y personalízala con las cervezas que más te
            gusten. Crea un regalo único y especial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel Principal - Selección */}
          <div className="lg:col-span-3 space-y-8">
            {/* Paso 1: Selección de Caja */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Elige tu caja
                  </h2>
                  <p className="text-sm text-gray-600">
                    Selecciona el tamaño perfecto para tu regalo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {giftBoxes.map((box) => (
                  <div
                    key={box.id}
                    onClick={() => selectBox(box)}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group relative ${
                      giftBuilder.selectedBox?.id === box.id
                        ? "border-[#B58E31] bg-[#B58E31]/5 shadow-lg"
                        : "border-gray-200 hover:border-[#B58E31]"
                    }`}
                  >
                    {box.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-[#B58E31] to-[#D4A853] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border-2 border-white whitespace-nowrap">
                          ⭐ Recomendada
                        </span>
                      </div>
                    )}

                    {giftBuilder.selectedBox?.id === box.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-[#B58E31] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div
                        className={`w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                          giftBuilder.selectedBox?.id === box.id
                            ? "bg-gradient-to-r from-[#B58E31] to-[#D4A853] shadow-lg"
                            : "bg-gray-100 group-hover:bg-[#B58E31]"
                        }`}
                      >
                        <Gift
                          className={`w-10 h-10 transition-colors ${
                            giftBuilder.selectedBox?.id === box.id
                              ? "text-white"
                              : "text-gray-600 group-hover:text-white"
                          }`}
                        />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {box.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {box.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Hasta {box.maxBeers} cervezas
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {box.dimensions}
                      </p>
                      <div className="flex items-center justify-center text-xs text-gray-500 mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        {box.deliveryTime}
                      </div>
                      <p className="text-2xl font-bold text-[#B58E31]">
                        {formatPrice(box.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paso 2: Selección de Cervezas */}
            {giftBuilder.selectedBox && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div ref={cervezasTitleRef} className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Elige tus cervezas
                    </h2>
                    <p className="text-sm text-gray-600">
                      Personaliza tu regalo con las cervezas que más te gusten
                    </p>
                  </div>
                </div>

                {/* Barra de Búsqueda y Filtros */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar cervezas por nombre o marca..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filtros
                    </button>
                  </div>

                  {/* Panel de Filtros */}
                  {showFilters && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            País de origen
                          </label>
                          <select
                            value={selectedCountry}
                            onChange={(e) =>
                              handleCountryChange(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900"
                          >
                            {countries.map((country) => (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estilo de cerveza
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) =>
                              handleCategoryChange(e.target.value)
                            }
                            disabled={filtersLoading}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {filtersLoading ? (
                              <option value="">Cargando...</option>
                            ) : (
                              categories.map((category) => (
                                <option
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rango de precio
                          </label>
                          <select
                            value={selectedPriceRange}
                            onChange={(e) =>
                              handlePriceRangeChange(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900"
                          >
                            {priceRanges.map((range) => (
                              <option key={range.value} value={range.value}>
                                {range.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleClearFilters}
                            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                          >
                            Limpiar filtros
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contador de Progreso */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso
                    </span>
                    <span className="text-sm font-medium text-[#B58E31]">
                      {giftBuilder.selectedBeers.length} de{" "}
                      {giftBuilder.selectedBox.maxBeers} cervezas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#B58E31] to-[#D4A853] h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (giftBuilder.selectedBeers.length /
                            giftBuilder.selectedBox.maxBeers) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Información de Paginación */}
                {pagination && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        Página {pagination.currentPage} de {pagination.lastPage}{" "}
                        - {pagination.total} productos total
                      </span>
                    </div>
                  </div>
                )}

                {/* Grid de Cervezas */}
                {productsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }, (_, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 animate-pulse"
                      >
                        <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBeers.map((beer) => {
                      const isSelected = isBeerSelected(beer.id);
                      const canSelect = canAddMore && !isSelected;

                      return (
                        <div
                          key={beer.id}
                          onClick={() =>
                            canSelect
                              ? addBeer(beer)
                              : isSelected
                              ? removeBeer(beer.id)
                              : null
                          }
                          className={`border rounded-lg p-4 transition-all duration-300 cursor-pointer group relative ${
                            isSelected
                              ? "border-[#B58E31] bg-[#B58E31]/5 shadow-lg"
                              : canSelect
                              ? "border-gray-200 hover:border-[#B58E31] hover:shadow-md"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-[#B58E31] rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}

                          <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <LazyImage
                              src={beer.image}
                              alt={beer.name}
                              className="w-full h-full"
                            />
                          </div>

                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {beer.name}
                          </h4>
                          <p className="text-xs text-gray-600 mb-1">
                            {beer.brand}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {beer.volume}
                          </p>
                          <p className="text-xs text-[#B58E31] font-medium mb-2">
                            {beer.nationality}
                          </p>

                          <p className="text-sm font-bold text-[#B58E31]">
                            {formatPrice(beer.price)}
                          </p>

                          {!canSelect && !isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <div className="text-center">
                                <div
                                  className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: "rgb(181, 142, 49)",
                                  }}
                                >
                                  <X className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-bold text-white drop-shadow-lg">
                                  {giftBuilder.selectedBeers.length >=
                                  (giftBuilder.selectedBox?.maxBeers || 0)
                                    ? "Límite alcanzado"
                                    : "Agotado"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!productsLoading && filteredBeers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No se encontraron cervezas con los filtros seleccionados
                    </p>
                  </div>
                )}

                {/* Controles de Paginación */}
                {pagination && pagination.lastPage > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      {/* Botón Anterior */}
                      <button
                        onClick={handleGoToPrevPage}
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Anterior
                      </button>

                      {/* Números de página */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, pagination.lastPage) },
                          (_, i) => {
                            let pageNumber;
                            if (pagination.lastPage <= 5) {
                              pageNumber = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (
                              pagination.currentPage >=
                              pagination.lastPage - 2
                            ) {
                              pageNumber = pagination.lastPage - 4 + i;
                            } else {
                              pageNumber = pagination.currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handleGoToPage(pageNumber)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  pageNumber === pagination.currentPage
                                    ? "bg-[#B58E31] text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Botón Siguiente */}
                      <button
                        onClick={handleGoToNextPage}
                        disabled={
                          pagination.currentPage === pagination.lastPage
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pagination.currentPage === pagination.lastPage
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel Lateral - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-[#B58E31]" />
                Resumen de tu regalo
              </h3>

              {/* Caja Seleccionada */}
              {giftBuilder.selectedBox ? (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Caja</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">
                        {giftBuilder.selectedBox.name}
                      </span>
                      <span className="font-bold text-[#B58E31]">
                        {formatPrice(giftBuilder.selectedBox.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {giftBuilder.selectedBox.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Caja</h4>
                  <div className="text-sm text-gray-500">
                    Selecciona una caja para continuar
                  </div>
                </div>
              )}

              {/* Cervezas Seleccionadas */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Cervezas ({giftBuilder.selectedBeers.length}/
                  {giftBuilder.selectedBox?.maxBeers || 0})
                </h4>
                {giftBuilder.selectedBeers.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {giftBuilder.selectedBeers.map((beer) => (
                      <div
                        key={beer.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded mr-2 flex items-center justify-center overflow-hidden">
                            <LazyImage
                              src={beer.image}
                              alt={beer.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">
                              {beer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {beer.volume}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-bold text-[#B58E31] mr-2">
                            {formatPrice(beer.price)}
                          </span>
                          <button
                            onClick={() => removeBeer(beer.id)}
                            className="w-5 h-5 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Selecciona cervezas para ver el detalle
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#B58E31]">
                    {formatPrice(giftBuilder.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Botón de Acción */}
              <button
                onClick={handleAddGiftToCart}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  giftBuilder.isComplete
                    ? "bg-gradient-to-r from-[#B58E31] to-[#D4A853] text-white hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!giftBuilder.isComplete}
              >
                {giftBuilder.isComplete ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </>
                ) : (
                  <span>Completa tu selección</span>
                )}
              </button>

              {!giftBuilder.isComplete && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  {giftBuilder.selectedBox
                    ? `Faltan ${
                        giftBuilder.selectedBox.maxBeers -
                        giftBuilder.selectedBeers.length
                      } cervezas`
                    : "Selecciona una caja para comenzar"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notificación Toast */}
      <NotificationToast
        isVisible={notification.isVisible}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        duration={4000}
      />
    </div>
  );
}
