"use client";

import { useState } from "react";
import bottella01 from "@/assets/images/home/cervezas/bottella-01.png";
import bottella02 from "@/assets/images/home/cervezas/bottella-02.png";
import bottella03 from "@/assets/images/home/cervezas/bottella-03.png";
import bottella04 from "@/assets/images/home/cervezas/bottella-04.png";
import bottella05 from "@/assets/images/home/cervezas/bottella-05.png";

export default function BeerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const beers = [
    {
      id: 1,
      image: bottella01,
    },
    {
      id: 2,
      image: bottella02,
    },
    {
      id: 3,
      image: bottella03,
    },
    {
      id: 4,
      image: bottella04,
    },
    {
      id: 5,
      image: bottella05,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.ceil(beers.length / 3) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(beers.length / 3) - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Crear grupos de 3 cervezas
  const beerGroups = [];
  for (let i = 0; i < beers.length; i += 3) {
    beerGroups.push(beers.slice(i, i + 3));
  }

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cervezas Internacionales
          </h2>
          <p className="text-lg text-gray-600">
            Descubre sabores únicos de diferentes países
          </p>
        </div>

        {/* Carrusel de cervezas */}
        <div className="relative">
          {/* Botón de navegación izquierdo */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg"
            aria-label="Grupo anterior"
          >
            ←
          </button>

          {/* Botón de navegación derecho */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg"
            aria-label="Siguiente grupo"
          >
            →
          </button>

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {beerGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="w-full flex-shrink-0 px-4">
                  <div className="grid grid-cols-3 gap-16">
                    {group.map((beer) => (
                      <div key={beer.id} className="flex flex-col items-center">
                        {/* Imagen de la cerveza */}
                        <div className="relative">
                          <img
                            src={beer.image.src}
                            alt={`Cerveza ${beer.id}`}
                            className="w-64 h-auto object-contain drop-shadow-lg"
                            style={{
                              width: "256px",
                              height: "400px",
                              maxHeight: "400px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de navegación */}
          <div className="flex justify-center mt-8 space-x-2">
            {beerGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? "bg-black"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir al grupo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
