"use client";

import { useState } from "react";
import {
  Beer,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  Package,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  isFavorite: boolean;
}

const suggestedProducts: Product[] = [
  {
    id: 1,
    name: "Peroni Nastro Azzurro",
    brand: "Peroni",
    price: 25000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    quantity: 3,
    isFavorite: false,
  },
  {
    id: 2,
    name: "Bitburger 0.0",
    brand: "Bitburger",
    price: 19000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
    quantity: 0,
    isFavorite: false,
  },
  {
    id: 3,
    name: "Asahi",
    brand: "Asahi",
    price: 19000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
    quantity: 0,
    isFavorite: false,
  },
  // Agregar más productos para asegurar suficiente contenido para el carousel
  {
    id: 4,
    name: "Heineken Lager",
    brand: "Heineken",
    price: 22000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
    quantity: 1,
    isFavorite: false,
  },
  {
    id: 5,
    name: "Corona Extra",
    brand: "Corona",
    price: 20000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-5.png",
    quantity: 0,
    isFavorite: false,
  },
  {
    id: 6,
    name: "Stella Artois",
    brand: "Stella Artois",
    price: 23000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-6.png",
    quantity: 0,
    isFavorite: false,
  },
];

export default function SuggestedProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(suggestedProducts);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    );
  };

  const toggleFavorite = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  return (
    <section className="py-20 bg-black">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Productos sugeridos
          </h2>
        </div>

        {/* Carousel de productos */}
        <div className="relative mb-12">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {/* Card de navegación "Pack de 6 Cervezas" */}
            <div className="flex-shrink-0 w-64 h-96 bg-amber-500 rounded-xl p-6 flex flex-col justify-between relative">
              <div className="text-center">
                {/* Icono de caja más pequeño */}
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  Pack de 6 Cervezas
                </h3>
                <p className="text-amber-100 text-sm">
                  Selección especial de cervezas premium
                </p>
              </div>

              {/* Flecha de navegación */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-amber-500 w-12 h-12 rounded-l-full flex items-center justify-center shadow-lg">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Productos */}
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 h-96 bg-white rounded-xl p-6 flex flex-col relative"
              >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <span className="text-6xl font-bold text-gray-400 rotate-45">
                    MARKET CLUB
                  </span>
                </div>

                {/* Botón de favorito */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      product.isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Imagen del producto - Cambiado a icono Beer con color específico */}
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Beer className="w-12 h-12 text-amber-500" />
                  </div>
                </div>

                {/* Detalles del producto */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Botella 330ML</p>
                    <h3 className="text-lg font-semibold text-black">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-black">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 h-8 bg-white border border-gray-300 rounded flex items-center justify-center text-black font-semibold">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Botón de agregar al carrito */}
                  <button 
                    className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    style={{ backgroundColor: '#B58E31' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A07D2A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B58E31'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Añadir al carrito</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paginación */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentPage === page
                    ? "bg-gray-600"
                    : "bg-white border border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
