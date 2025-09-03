"use client";

import { useState } from "react";
import { Grid, List } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex-1">
      {/* Controles de vista */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-amber-100 text-amber-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-amber-100 text-amber-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Mostrando {products.length} productos
        </div>
      </div>

      {/* Grid de productos */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
              viewMode === "list" ? "flex" : ""
            }`}
          >
            {/* Imagen del producto */}
            <div
              className={`${
                viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Información del producto */}
            <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "En stock" : "Agotado"}
                </span>
                <button
                  disabled={!product.inStock}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    product.inStock
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
