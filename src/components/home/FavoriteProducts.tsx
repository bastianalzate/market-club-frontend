"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";
import { useWishlist } from "@/hooks/useWishlist";
import {
  useFeaturedProducts,
  FeaturedProduct,
} from "@/hooks/useFeaturedProducts";
import { Product } from "@/features/products/types/product";
import Toast from "@/components/shared/Toast";
import FeaturedProductSkeleton from "@/components/shared/FeaturedProductSkeleton";
import LazyImage from "@/components/shared/LazyImage";
import ProductCarousel from "@/components/shared/ProductCarousel";

export default function FavoriteProducts() {
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [localProducts, setLocalProducts] = useState<FeaturedProduct[]>([]);

  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductQuantity,
    isInCart,
  } = useCartContext();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Función para actualizar el estado is_favorite de un producto en la lista
  const updateProductFavoriteInList = useCallback(
    (productId: number, isFavorite: boolean) => {
      console.log(
        `🔄 FavoriteProducts: Actualizando producto ${productId} a is_favorite: ${isFavorite}`
      );
      setLocalProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, is_favorite: isFavorite }
            : product
        )
      );
    },
    []
  );

  const {
    toggleWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist({
    showSuccess,
    showError,
    onProductFavoriteUpdate: updateProductFavoriteInList,
  });
  const { products: featuredProducts, loading, error } = useFeaturedProducts();

  // Sincronizar productos locales con props cuando cambien
  useEffect(() => {
    setLocalProducts(featuredProducts);
  }, [featuredProducts]);

  const handleToggleFavorite = async (productId: number) => {
    await toggleWishlist(productId);
  };

  // Las funciones getProductQuantity e isInCart ahora vienen del hook useCart

  // Convertir producto destacado del API al formato del store
  const convertToStoreProduct = (featuredProduct: FeaturedProduct): Product => {
    return {
      id: featuredProduct.id,
      name: featuredProduct.name,
      description: `Cerveza destacada - Premium`,
      price: featuredProduct.current_price,
      image: featuredProduct.image_url,
      images: [featuredProduct.image_url],
      category: "Cerveza Destacada",
      brand: featuredProduct.name.split(" ")[0], // Tomar la primera palabra como marca
      alcoholContent: 5.0,
      volume: 500, // Valor por defecto
      style: "Destacada",
      origin: "Importada",
      inStock: featuredProduct.stock_quantity > 0,
      stockQuantity: featuredProduct.stock_quantity,
      rating: 4.5,
      reviewCount: 128,
      tags: ["destacada", "cerveza"],
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  const handleAddToCart = async (featuredProduct: FeaturedProduct) => {
    // Verificar que el producto tenga stock antes de intentar agregarlo
    if (featuredProduct.stock_quantity === 0) {
      showError(
        "Producto agotado",
        `"${featuredProduct.name}" no está disponible en este momento.`
      );
      return;
    }

    setAddingToCart(featuredProduct.id);

    try {
      const result = await addToCart({
        productId: featuredProduct.id,
        quantity: 1,
      });

      // Simular una pequeña animación
      setTimeout(() => {
        setAddingToCart(null);

        // Mostrar notificación de éxito
        if (result.success) {
          showSuccess(
            "¡Producto agregado! 🍺",
            `"${featuredProduct.name}" se agregó al carrito exitosamente.`
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
  const renderProduct = (product: FeaturedProduct) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
      {/* Imagen del producto con botón de favorito */}
      <div className="relative">
        <div
          className="aspect-w-1 aspect-h-1 overflow-hidden pt-4"
          style={{ height: "400px" }}
        >
          <LazyImage
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full ${
              product.stock_quantity === 0 ? "grayscale opacity-60" : ""
            }`}
          />
        </div>

        {/* Etiqueta de Agotado */}
        {product.stock_quantity === 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            AGOTADO
          </div>
        )}

        {/* Botón de corazón (favorito) */}
        <button
          onClick={() => handleToggleFavorite(product.id)}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors disabled:opacity-50"
          aria-label={
            isInWishlist(product.id, product)
              ? "Quitar de favoritos"
              : "Agregar a favoritos"
          }
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isInWishlist(product.id, product)
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            } ${wishlistLoading ? "animate-pulse" : ""}`}
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
            {product.sale_price && product.sale_price < product.price ? (
              <div>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg font-bold text-gray-900 ml-2">
                  {formatPrice(product.sale_price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.current_price)}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">{product.name}</h3>

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
            {isInCart(product.id) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getProductQuantity(product.id)}
              </span>
            )}
          </div>

          {/* Botón principal "Añadir al carrito" */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={
              addingToCart === product.id || product.stock_quantity === 0
            }
            className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor:
                product.stock_quantity === 0 ? "#6B7280" : "#B58E31",
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
              {addingToCart === product.id
                ? "Agregando..."
                : product.stock_quantity === 0
                ? "Agotado"
                : isInCart(product.id)
                ? "Agregar más"
                : "Añadir al carrito"}
            </span>
            {addingToCart !== product.id && product.stock_quantity > 0 && (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Watermark de MARKET CLUB */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.1) 100px,
            rgba(255, 255, 255, 0.1) 200px
          )`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-6xl font-bold tracking-widest opacity-20">
              MARKET CLUB
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        {/* Header con título y botón */}
        <div className="flex items-center justify-center lg:justify-between mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Cervezas Destacadas
          </h2>

          <div className="hidden lg:flex">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center p-1 -m-1 text-sm font-bold text-gray-300 transition-all duration-200 rounded-md focus:outline-none hover:text-white"
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
            </Link>
          </div>
        </div>

        {/* Carrusel de productos destacados */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <FeaturedProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-2">
              Error al cargar productos destacados
            </div>
            <div className="text-gray-400 text-sm">{error}</div>
          </div>
        ) : localProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              No hay productos destacados disponibles
            </div>
          </div>
        ) : (
          <ProductCarousel itemsPerView={3} className="px-8">
            {localProducts.map((product) => renderProduct(product))}
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
