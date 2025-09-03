"use client";

import { useState } from "react";
import {
  Package,
  ShoppingBag,
  Store,
  Plane,
  Barrel,
  Box,
  Tag,
} from "lucide-react";

export default function CategoryIcons() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 0,
      name: "Cervezas",
      icon: Package,
      description: "Variedad de cervezas",
    },
    {
      id: 1,
      name: "Snacks",
      icon: ShoppingBag,
      description: "Aperitivos y snacks",
    },
    {
      id: 2,
      name: "Tienda",
      icon: Store,
      description: "Productos de la tienda",
    },
    {
      id: 3,
      name: "Importados",
      icon: Plane,
      description: "Productos internacionales",
    },
    {
      id: 4,
      name: "Barriles",
      icon: Barrel,
      description: "Cerveza de barril",
    },
    {
      id: 5,
      name: "Cajas",
      icon: Box,
      description: "Packs y cajas especiales",
    },
    {
      id: 6,
      name: "Ofertas",
      icon: Tag,
      description: "Descuentos especiales",
    },
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explora por Categorías
          </h2>
          <p className="text-gray-600">
            Encuentra lo que buscas de manera rápida y fácil
          </p>
        </div>

        {/* Iconos de categorías */}
        <div className="flex justify-center">
          <div className="flex space-x-3 bg-white rounded-xl p-3 shadow-sm">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative p-4 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-amber-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }
                  `}
                  title={category.description}
                >
                  <IconComponent className="w-8 h-8" />

                  {/* Tooltip */}
                  <div
                    className={`
                    absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10
                  `}
                  >
                    {category.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categoría activa */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-500">
            Categoría seleccionada:{" "}
            <span className="font-medium text-amber-600">
              {categories[activeCategory].name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
