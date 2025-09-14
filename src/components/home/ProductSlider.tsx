"use client";

import { useState, useRef, useEffect } from "react";
import { useLatestBeers, LatestBeer } from "@/hooks/useLatestBeers";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";
import { Product } from "@/features/products/types/product";
import Toast from "@/components/shared/Toast";
import ProductCarousel from "@/components/shared/ProductCarousel";
import FeaturedProductSkeleton from "@/components/shared/FeaturedProductSkeleton";
import LazyImage from "@/components/shared/LazyImage";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";

export default function ProductSlider() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductQuantity,
    isInCart,
  } = useCartContext();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { beers: latestBeers, loading, error } = useLatestBeers();

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Las funciones getProductQuantity e isInCart ahora vienen del hook useCart

  // Convertir producto del API al formato del store
  const convertToStoreProduct = (latestBeer: LatestBeer): Product => {
    return {
      id: latestBeer.id,
      name: latestBeer.name,
      description: `Cerveza reciente - Premium`,
      price: latestBeer.current_price,
      image: latestBeer.image_url,
      images: [latestBeer.image_url],
      category: "Cerveza Reciente",
      brand: latestBeer.name.split(" ")[0],
      alcoholContent: 5.0,
      volume: 500,
      style: "Reciente",
      origin: "Importada",
      inStock: true,
      stockQuantity: 100,
      rating: 4.5,
      reviewCount: 128,
      tags: ["reciente", "cerveza"],
      featured: true,
      createdAt: latestBeer.created_at,
      updatedAt: latestBeer.created_at,
    };
  };

  // Función para formatear precio en pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (latestBeer: LatestBeer) => {
    setAddingToCart(latestBeer.id);

    try {
      const result = await addToCart({ productId: latestBeer.id, quantity: 1 });

      // Simular una pequeña animación
      setTimeout(() => {
        setAddingToCart(null);

        // Mostrar notificación de éxito
        if (result.success) {
          showSuccess(
            "¡Producto agregado! 🍺",
            `"${latestBeer.name}" se agregó al carrito exitosamente.`
          );
        } else {
          showError("Error", result.message || "Error al agregar producto");
        }
      }, 500);
    } catch (error) {
      setAddingToCart(null);
      showError("Error", "Error al agregar producto al carrito");
    }
  };

  // Función para renderizar cada producto del carrusel
  const renderProduct = (beer: LatestBeer) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
      {/* Imagen del producto con botón de favorito */}
      <div className="relative">
        <div
          className="aspect-w-1 aspect-h-1 overflow-hidden pt-4"
          style={{ height: "400px" }}
        >
          <LazyImage
            src={beer.image_url}
            alt={beer.name}
            className="w-full h-full"
          />
        </div>
        {/* Botón de corazón (favorito) */}
        <button
          onClick={() => toggleFavorite(beer.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          aria-label="Agregar a favoritos"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.includes(beer.id)
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">
            BOTELLA 500ML
          </span>
          <div className="text-right">
            {beer.sale_price && beer.sale_price < beer.price ? (
              <div>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(beer.price)}
                </span>
                <span className="text-lg font-bold text-gray-900 ml-2">
                  {formatPrice(beer.sale_price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(beer.current_price)}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">{beer.name}</h3>

        {/* Botones de acción */}
        <div className="flex items-center space-x-3">
          {/* Ícono de carrito cuadrado con contador - Solo visual */}
          <div
            className="relative p-3 rounded-lg"
            style={{
              backgroundColor: "transparent",
              borderColor: "#D0D5DD",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
            aria-label="Contador del carrito"
          >
            <ShoppingCart className="w-5 h-5" style={{ color: "#B58E31" }} />
            {/* Contador en el ícono del carrito */}
            {isInCart(beer.id) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getProductQuantity(beer.id)}
              </span>
            )}
          </div>

          {/* Botón principal "Añadir al carrito" */}
          <button
            onClick={() => handleAddToCart(beer)}
            disabled={addingToCart === beer.id}
            className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: "#B58E31" }}
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
              {addingToCart === beer.id
                ? "Agregando..."
                : isInCart(beer.id)
                ? "Agregar más"
                : "Añadir al carrito"}
            </span>
            {addingToCart !== beer.id && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-black sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Header con título y botón */}
        <div className="flex items-center justify-center lg:justify-between mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Últimas Cervezas
          </h2>

          <div className="hidden lg:flex">
            <a
              href="/tienda"
              title=""
              className="inline-flex items-center justify-center p-1 -m-1 text-sm font-bold text-gray-300 transition-all duration-200 rounded-md focus:text-white focus:ring-white focus:ring-2 focus:ring-offset-2 focus:outline-none hover:text-white"
            >
              Ver todas las cervezas
              <svg
                className="w-5 h-5 ml-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Carrusel de últimas cervezas */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <FeaturedProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-2">
              Error al cargar últimas cervezas
            </div>
            <div className="text-gray-400 text-sm">{error}</div>
          </div>
        ) : latestBeers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              No hay cervezas recientes disponibles
            </div>
          </div>
        ) : (
          <ProductCarousel itemsPerView={3} className="px-8">
            {latestBeers.map((beer) => renderProduct(beer))}
          </ProductCarousel>
        )}
      </div>

      {/* Notificación Toast */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </section>
  );
}
