"use client";

import { useState } from "react";
import { Heart, ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNotification } from "@/hooks/useNotification";
import { Product } from "@/features/products/types/product";
import NotificationToast from "@/components/shared/NotificationToast";

export default function FavoriteProducts() {
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { addToCart, updateQuantity, removeFromCart, items } = useCart();
  const { notification, showSuccess, hideNotification } = useNotification();

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Obtener la cantidad de un producto en el carrito
  const getProductQuantity = (productId: number) => {
    const cartItem = items.find((item) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId);
  };

  // Convertir producto de home al formato del store
  const convertToStoreProduct = (homeProduct: any): Product => {
    return {
      id: homeProduct.id,
      name: homeProduct.name,
      description: `Cerveza premium - ${homeProduct.volume}`,
      price: parseInt(homeProduct.price.replace(/[^0-9]/g, "")), // Convertir "$17.000" a 17000
      image: homeProduct.image,
      images: [homeProduct.image],
      category: "Cerveza Premium",
      brand: homeProduct.name.split(" ")[0], // Tomar la primera palabra como marca
      alcoholContent: 5.0,
      volume: parseInt(homeProduct.volume.match(/\d+/)?.[0] || "500"), // Extraer número del volumen
      style: "Premium",
      origin: "Importada",
      inStock: true,
      stockQuantity: 100,
      rating: 4.5,
      reviewCount: 128,
      tags: ["premium", "cerveza"],
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const products = [
    {
      id: 1,
      name: "PAULANER WEISSBIER",
      image: "/images/cervezas/bottella-06.png",
      volume: "BOTELLA 500ML",
      price: "$17.000",
      colors: ["green-400", "blue-400"],
    },
    {
      id: 2,
      name: "ERDINGER",
      image: "/images/cervezas/bottella-07.png",
      volume: "BOTELLA 330ML",
      price: "$19.000",
      colors: ["amber-400", "red-400"],
    },
    {
      id: 3,
      name: "LIEFMANS FRUITESSE",
      image: "/images/cervezas/bottella-08.png",
      volume: "BOTELLA 250ML",
      price: "$23.000",
      colors: ["amber-400", "red-400"],
    },
    {
      id: 4,
      name: "PAULANER WEISSBIER",
      image: "/images/cervezas/bottella-06.png",
      volume: "BOTELLA 500ML",
      price: "$17.000",
      colors: ["amber-400", "white"],
    },
  ];

  const handleAddToCart = async (homeProduct: any) => {
    setAddingToCart(homeProduct.id);

    const product = convertToStoreProduct(homeProduct);
    addToCart(product, 1);

    // Simular una pequeña animación
    setTimeout(() => {
      setAddingToCart(null);

      // Mostrar notificación de éxito
      showSuccess(
        "¡Producto agregado! 🍺",
        `"${homeProduct.name}" se agregó al carrito exitosamente.`
      );
    }, 500);
  };

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
            Cervezas Premium
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

        {/* Grid de productos favoritos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              {/* Imagen del producto con botón de favorito */}
              <div className="relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden pt-4">
                  <img
                    className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                {/* Botón de corazón (favorito) */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                  aria-label="Agregar a favoritos"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id)
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
                    {product.volume}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {product.price}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {product.name}
                </h3>

                {/* Botones de acción */}
                <div className="flex items-center space-x-3">
                  {/* Botón de carrito cuadrado con contador */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="relative p-3 rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#D0D5DD",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    aria-label="Agregar al carrito"
                  >
                    <ShoppingCart
                      className="w-5 h-5"
                      style={{ color: "#B58E31" }}
                    />
                    {/* Contador en el ícono del carrito */}
                    {isInCart(product.id) && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {getProductQuantity(product.id)}
                      </span>
                    )}
                  </button>

                  {/* Botón principal "Añadir al carrito" */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      {addingToCart === product.id
                        ? "Agregando..."
                        : isInCart(product.id)
                        ? "Agregar más"
                        : "Añadir al carrito"}
                    </span>
                    {addingToCart !== product.id && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </section>
  );
}
