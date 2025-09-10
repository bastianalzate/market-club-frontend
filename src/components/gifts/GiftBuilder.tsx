"use client";

import { useState, useEffect } from "react";
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
import { useCart } from "@/hooks/useCart";
import { Product } from "@/features/products/types/product";
import { useNotification } from "@/hooks/useNotification";
import NotificationToast from "@/components/shared/NotificationToast";

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
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
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
    name: "Caja Pequeña",
    description: "Perfecta para una sorpresa especial",
    maxBeers: 4,
    price: 5000,
    image: "/images/logo/logo.png",
    dimensions: "20x15x10 cm",
    deliveryTime: "1-2 días",
  },
  {
    id: "medium",
    name: "Caja Mediana",
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
    name: "Caja Grande",
    description: "Para las ocasiones más especiales",
    maxBeers: 12,
    price: 12000,
    image: "/images/logo/logo.png",
    dimensions: "30x25x20 cm",
    deliveryTime: "2-3 días",
  },
];

const availableBeers: Beer[] = [
  {
    id: "1",
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    volume: "BOTELLA 500ML",
    category: "Wheat Beer",
    nationality: "Alemania",
    rating: 4.5,
    inStock: true,
    description: "Cerveza de trigo alemana tradicional",
  },
  {
    id: "2",
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    volume: "BOTELLA 330ML",
    category: "Wheat Beer",
    nationality: "Alemania",
    rating: 4.2,
    inStock: true,
    description: "Cerveza de trigo premium",
  },
  {
    id: "3",
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    volume: "BOTELLA 250ML",
    category: "Fruit Beer",
    nationality: "Bélgica",
    rating: 4.7,
    inStock: true,
    description: "Cerveza de frutas belga única",
  },
  {
    id: "4",
    name: "STELLA ARTOIS",
    brand: "Stella Artois",
    price: 15000,
    image: "/images/cervezas/bottella-06.png",
    volume: "BOTELLA 330ML",
    category: "Lager",
    nationality: "Bélgica",
    rating: 4.0,
    inStock: true,
    description: "Cerveza lager belga clásica",
  },
  {
    id: "5",
    name: "HEINEKEN",
    brand: "Heineken",
    price: 14000,
    image: "/images/cervezas/bottella-07.png",
    volume: "BOTELLA 330ML",
    category: "Lager",
    nationality: "Holanda",
    rating: 3.8,
    inStock: true,
    description: "Cerveza lager holandesa",
  },
  {
    id: "6",
    name: "CORONA EXTRA",
    brand: "Corona",
    price: 16000,
    image: "/images/cervezas/bottella-08.png",
    volume: "BOTELLA 355ML",
    category: "Lager",
    nationality: "México",
    rating: 4.1,
    inStock: true,
    description: "Cerveza lager mexicana refrescante",
  },
  {
    id: "7",
    name: "GUINNESS",
    brand: "Guinness",
    price: 18000,
    image: "/images/cervezas/bottella-06.png",
    volume: "BOTELLA 440ML",
    category: "Stout",
    nationality: "Irlanda",
    rating: 4.3,
    inStock: true,
    description: "Cerveza stout irlandesa clásica",
  },
  {
    id: "8",
    name: "BUDWEISER",
    brand: "Budweiser",
    price: 13000,
    image: "/images/cervezas/bottella-07.png",
    volume: "BOTELLA 330ML",
    category: "Lager",
    nationality: "Estados Unidos",
    rating: 3.5,
    inStock: true,
    description: "Cerveza lager americana",
  },
];

export default function GiftBuilder() {
  // Seleccionar la caja recomendada por defecto
  const defaultBox = giftBoxes.find((box) => box.recommended) || giftBoxes[0];

  // Hook del carrito
  const { addToCart } = useCart();

  // Hook de notificaciones
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const [giftBuilder, setGiftBuilder] = useState<GiftBuilderState>({
    selectedBox: defaultBox,
    selectedBeers: [],
    totalPrice: defaultBox.price,
    isComplete: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNationality, setSelectedNationality] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "all",
    "Wheat Beer",
    "Lager",
    "Fruit Beer",
    "IPA",
    "Stout",
  ];

  const nationalities = [
    "all",
    "Alemania",
    "Bélgica",
    "Holanda",
    "México",
    "Irlanda",
    "Estados Unidos",
  ];

  const priceRanges = [
    { value: "all", label: "Todos los precios" },
    { value: "low", label: "Menos de $15.000" },
    { value: "medium", label: "$15.000 - $20.000" },
    { value: "high", label: "Más de $20.000" },
  ];

  const filteredBeers = availableBeers.filter((beer) => {
    const matchesSearch =
      beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beer.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || beer.category === selectedCategory;
    const matchesNationality =
      selectedNationality === "all" || beer.nationality === selectedNationality;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && beer.price < 15000) ||
      (priceRange === "medium" && beer.price >= 15000 && beer.price <= 20000) ||
      (priceRange === "high" && beer.price > 20000);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesNationality &&
      matchesPrice &&
      beer.inStock
    );
  });

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

  const removeBeer = (beerId: string) => {
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

  const isBeerSelected = (beerId: string) => {
    return giftBuilder.selectedBeers.some((b) => b.id === beerId);
  };

  const canAddMore =
    giftBuilder.selectedBox &&
    giftBuilder.selectedBeers.length < giftBuilder.selectedBox.maxBeers;

  // Función para crear un producto de regalo personalizado
  const createGiftProduct = (): Product => {
    if (!giftBuilder.selectedBox || giftBuilder.selectedBeers.length === 0) {
      throw new Error("Regalo incompleto");
    }

    const beerNames = giftBuilder.selectedBeers
      .map((beer) => beer.name)
      .join(", ");
    const giftName = `Regalo Personalizado - ${giftBuilder.selectedBox.name}`;
    const giftDescription = `Caja ${giftBuilder.selectedBox.name} con ${giftBuilder.selectedBeers.length} cervezas: ${beerNames}`;

    return {
      id: `gift-${Date.now()}`, // ID único para cada regalo
      name: giftName,
      description: giftDescription,
      price: giftBuilder.totalPrice,
      image:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjQjU4RTMxIi8+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiA4djEzIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOSAxMnY3YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0ydi03IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03LjUgOGEyLjUgMi41IDAgMCAxIDAtNUE0LjggOCAwIDAgMSAxMiA4YTQuOCA4IDAgMCAxIDQuNS01IDIuNSAyLjUgMCAwIDEgMCA1IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPgo=",
      images: ["/images/logo/logo.png"],
      category: "Regalo Personalizado",
      brand: "Market Club",
      alcoholContent: 0, // No aplica para el paquete completo
      volume: 0, // No aplica para el paquete completo
      style: "Gift Box",
      origin: "Colombia",
      inStock: true,
      stockQuantity: 1,
      rating: 5.0,
      reviewCount: 0,
      tags: ["regalo", "personalizado", "cerveza", "gift-box"],
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Función para agregar el regalo al carrito
  const handleAddGiftToCart = () => {
    try {
      const giftProduct = createGiftProduct();
      addToCart(giftProduct, 1);

      // Mostrar notificación de éxito
      showSuccess(
        "¡Regalo agregado! 🎉",
        `Tu regalo personalizado "${giftBuilder.selectedBox?.name}" se agregó al carrito exitosamente.`
      );

      // Resetear el builder después de agregar para crear otro regalo
      setGiftBuilder({
        selectedBox: defaultBox,
        selectedBeers: [],
        totalPrice: defaultBox.price,
        isComplete: false,
      });
    } catch (error) {
      console.error("Error al agregar regalo al carrito:", error);
      showError(
        "Error al agregar regalo",
        "Por favor, completa tu selección antes de agregar al carrito."
      );
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Título y Descripción */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Construí tu Regalo Perfecto
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
                    Elige tu Caja
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
                        ${box.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paso 2: Selección de Cervezas */}
            {giftBuilder.selectedBox && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Elige tus Cervezas
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
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category === "all"
                                  ? "Todas las categorías"
                                  : category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nacionalidad
                          </label>
                          <select
                            value={selectedNationality}
                            onChange={(e) =>
                              setSelectedNationality(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900"
                          >
                            {nationalities.map((nationality) => (
                              <option key={nationality} value={nationality}>
                                {nationality === "all"
                                  ? "Todas las nacionalidades"
                                  : nationality}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rango de Precio
                          </label>
                          <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] text-gray-900"
                          >
                            {priceRanges.map((range) => (
                              <option key={range.value} value={range.value}>
                                {range.label}
                              </option>
                            ))}
                          </select>
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

                {/* Grid de Cervezas */}
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
                          <img
                            src={beer.image}
                            alt={beer.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
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

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(beer.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({beer.rating})
                          </span>
                        </div>

                        <p className="text-sm font-bold text-[#B58E31]">
                          ${beer.price.toLocaleString()}
                        </p>

                        {!canSelect && !isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center">
                              <div
                                className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "rgb(181, 142, 49)" }}
                              >
                                <X className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-bold text-white drop-shadow-lg">
                                {giftBuilder.selectedBeers.length >=
                                giftBuilder.selectedBox.maxBeers
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

                {filteredBeers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No se encontraron cervezas con los filtros seleccionados
                    </p>
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
                Resumen de tu Regalo
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
                        ${giftBuilder.selectedBox.price.toLocaleString()}
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
                          <img
                            src={beer.image}
                            alt={beer.name}
                            className="w-8 h-8 object-contain mr-2"
                          />
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
                            ${beer.price.toLocaleString()}
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
                    ${giftBuilder.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Botón de Acción */}
              <button
                onClick={handleAddGiftToCart}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  giftBuilder.isComplete
                    ? "bg-gradient-to-r from-[#B58E31] to-[#D4A853] text-white hover:shadow-lg transform hover:-translate-y-0.5"
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
