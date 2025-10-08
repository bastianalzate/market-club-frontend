"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Store, Plane, Barrel, Box, Tag } from "lucide-react";
import beerIcon from "@/assets/images/icons/beer.svg";

export default function CategoryIcons() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 0,
      name: "Cervezas",
      icon: "beer", // Usar icono personalizado
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
      name: "Importados",
      icon: Plane,
      description: "Productos internacionales",
    },
    {
      id: 3,
      name: "Cajas",
      icon: Box,
      description: "Packs y cajas especiales",
    },
    {
      id: 4,
      name: "Ofertas",
      icon: Tag,
      description: "Descuentos especiales",
    },
  ];

  return (
    <div className="bg-gray-50 py-6 sm:py-8">
      <div className="px-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Explora por Categorías
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Encuentra lo que buscas de manera rápida y fácil
          </p>
        </div>

        {/* Iconos de categorías */}
        <div className="flex justify-center px-2 sm:px-2">
          <div className="flex justify-center gap-2 sm:gap-3 bg-white rounded-xl p-3 sm:p-3 shadow-sm">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative p-3 sm:p-4 rounded-xl transition-all duration-200 group flex-shrink-0 cursor-pointer
                    ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }
                  `}
                  style={isActive ? { backgroundColor: "#B58E31" } : {}}
                  title={category.description}
                >
                  {/* Renderizar icono personalizado o de Lucide */}
                  {category.icon === "beer" ? (
                    <Image
                      src={beerIcon}
                      alt="Cerveza"
                      width={32}
                      height={32}
                      className={`w-8 h-8 ${
                        isActive ? "brightness-0 invert" : ""
                      }`}
                    />
                  ) : (
                    (() => {
                      const IconComponent =
                        category.icon as React.ComponentType<{
                          className: string;
                        }>;
                      return <IconComponent className="w-8 h-8" />;
                    })()
                  )}

                  {/* Tooltip - Solo visible en pantallas grandes */}
                  <div
                    className={`
                    hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10
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
        <div className="text-center mt-4 sm:mt-6">
          <span className="text-sm sm:text-base text-gray-500">
            Categoría seleccionada:{" "}
            <span className="font-medium" style={{ color: "#B58E31" }}>
              {categories[activeCategory].name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
