"use client";

import { useState } from "react";

export default function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      id: 1,
      name: "PAULANER WEISSBIER",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
      price: "$17.000",
      badge: "Oferta",
      colors: ["amber-400", "orange-400", "yellow-400"],
    },
    {
      id: 2,
      name: "ERDINGER",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
      price: "$19.000",
      colors: ["blue-400", "amber-400"],
    },
    {
      id: 3,
      name: "LIEFMANS FRUITESSE",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
      price: "$23.000",
      badge: "Nuevo",
      colors: ["red-400", "pink-400"],
    },
    {
      id: 4,
      name: "STELLA ARTOIS",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
      price: "$15.000",
      colors: ["amber-400", "orange-200", "white"],
    },
    {
      id: 5,
      name: "HEINEKEN",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
      price: "$18.000",
      colors: ["green-400", "red-400"],
    },
    {
      id: 6,
      name: "CORONA EXTRA",
      image:
        "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
      price: "$16.000",
      colors: ["yellow-400", "blue-400"],
    },
  ];

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (products.length - 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + (products.length - 3)) % (products.length - 3)
    );
  };

  return (
    <section className="py-12 bg-black sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Cervezas Destacadas
          </h2>
          <p className="mt-4 text-base font-normal leading-7 text-gray-300">
            Descubre nuestra selección premium de cervezas artesanales e
            importadas
          </p>
        </div>

        {/* Carrusel de productos */}
        <div className="relative mt-12 sm:mt-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {products.map((product, index) => (
                <div key={product.id} className="w-1/4 flex-shrink-0 px-2">
                  <div className="bg-[#F5F5F5] overflow-hidden rounded-lg h-full">
                    <div className="relative">
                      {product.badge && (
                        <div className="absolute top-3 right-3">
                          <p className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-bold tracking-wide text-white uppercase bg-gray-600 rounded">
                            {product.badge}
                          </p>
                        </div>
                      )}
                      <div className="relative group">
                        <div className="overflow-hidden aspect-w-1 aspect-h-1">
                          <img
                            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 p-4 pb-2">
                          <a href="#" title="">
                            {product.name}
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </h3>
                      </div>
                    </div>
                    <p className="px-4 text-sm font-bold text-gray-500">
                      {product.price}
                    </p>
                    <div className="flex items-center justify-center mt-5 space-x-2 px-4">
                      {product.colors.map((color, colorIndex) => {
                        // Mapear colores a clases específicas de Tailwind
                        const colorMap: { [key: string]: string } = {
                          "amber-400": "bg-amber-400 border-amber-600",
                          "orange-400": "bg-orange-400 border-orange-600",
                          "yellow-400": "bg-yellow-400 border-yellow-600",
                          "blue-400": "bg-blue-400 border-blue-600",
                          "red-400": "bg-red-400 border-red-600",
                          "pink-400": "bg-pink-400 border-pink-600",
                          "orange-200": "bg-orange-200 border-orange-400",
                          white: "bg-white border-gray-300",
                          "green-400": "bg-green-400 border-green-600",
                        };

                        const colorClass =
                          colorMap[color] || "bg-gray-400 border-gray-600";

                        return (
                          <div
                            key={colorIndex}
                            className={`w-3 h-3 ${colorClass} rounded-full`}
                          ></div>
                        );
                      })}
                    </div>
                    {/* Espacio adicional en la parte inferior */}
                    <div className="pb-6"></div>
                    {/* Botón de agregar al carrito oculto */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Anterior"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Siguiente"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicadores de paginación */}
        <div className="flex justify-center items-center mt-12 space-x-3">
          {Array.from({ length: products.length - 3 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-gray-400"
                  : "bg-transparent border-2 border-white"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
