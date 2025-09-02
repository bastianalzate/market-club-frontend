"use client";

import { useState } from "react";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";

export default function FavoriteProducts() {
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const products = [
    {
      id: 1,
      name: "Peroni Nastro Azzurro",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
      volume: "Botella 330ML",
      price: "$25.000",
      colors: ["green-400", "blue-400"],
    },
    {
      id: 2,
      name: "Bitburger 0.0",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
      volume: "Botella 330ML",
      price: "$19.000",
      colors: ["amber-400", "red-400"],
    },
    {
      id: 3,
      name: "Asahi Super Dry",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
      volume: "Botella 330ML",
      price: "$19.000",
      colors: ["amber-400", "red-400"],
    },
    {
      id: 4,
      name: "Stella Artois",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
      volume: "Botella 330ML",
      price: "$22.000",
      colors: ["amber-400", "white"],
    },
  ];

  const handleAddToCart = (productId: number) => {
    console.log("Agregar al carrito:", productId);
    // TODO: Implementar lógica del carrito
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
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Productos Favoritos
          </h2>
          <p className="text-lg text-gray-300">
            Las cervezas más populares de nuestros clientes
          </p>
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
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
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
                  {/* Botón de carrito cuadrado */}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="Agregar al carrito"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Botón principal "Añadir al carrito" */}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    <span>Añadir al carrito</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
