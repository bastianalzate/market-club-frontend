"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Country {
  id: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  {
    id: "alemania",
    name: "Alemania",
    flag: "/images/countries/ALEMANIA.png",
  },
  {
    id: "belgica",
    name: "Bélgica",
    flag: "/images/countries/BELGICA.png",
  },
  {
    id: "colombia",
    name: "Colombia",
    flag: "/images/countries/COLOMBIA.png",
  },
  {
    id: "espana",
    name: "España",
    flag: "/images/countries/ESPAÑA.png",
  },
  {
    id: "escocia",
    name: "Escocia",
    flag: "/images/countries/ESCOCIA.png",
  },
  {
    id: "reino unido",
    name: "Reino Unido",
    flag: "/images/countries/REINO_UNIDO.png",
  },
  {
    id: "italia",
    name: "Italia",
    flag: "/images/countries/ITALIA.png",
  },
  {
    id: "japon",
    name: "Japón",
    flag: "/images/countries/JAPÓN.png",
  },
  {
    id: "mexico",
    name: "México",
    flag: "/images/countries/MEXICO.png",
  },
  {
    id: "paises bajos",
    name: "Países Bajos",
    flag: "/images/countries/PAISES_BAJOS.png",
  },
  {
    id: "peru",
    name: "Perú",
    flag: "/images/countries/PERU.png",
  },
  {
    id: "republica checa",
    name: "República Checa",
    flag: "/images/countries/REPUBLICA_CHECA.png",
  },
  {
    id: "tailandia",
    name: "Tailandia",
    flag: "/images/countries/TAILANDIA.png",
  },
  {
    id: "estados unidos",
    name: "Estados Unidos",
    flag: "/images/countries/ESTADOS_UNIDOS.png",
  },
];

export default function CountriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Configuración del carrusel infinito
  const itemsPerView = 6; // Mostrar 6 banderas a la vez
  const totalItems = countries.length;

  // Calcular el ancho de cada elemento (100% dividido entre 6 elementos)
  const itemWidth = 74 / itemsPerView;

  // Calcular el índice máximo para que se vean todas las banderas
  // Con 11 países y 6 por vista: 0,1,2,3,4,5 (6 páginas total)
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  // Auto-play del carrusel
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= maxIndex) {
            return 0; // Volver al inicio cuando llegue al final
          }
          return prevIndex + 1;
        });
      }, 3000); // Cambiar cada 3 segundos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, maxIndex]);

  // Pausar auto-play al hacer hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return maxIndex; // Ir al final si está en el inicio
      }
      return prevIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0; // Volver al inicio si está en el final
      }
      return prevIndex + 1;
    });
  };

  // Función para navegar a la tienda con filtro de país
  const handleCountryClick = (countryId: string) => {
    // Navegar a la tienda con el filtro de país aplicado
    router.push(`/tienda?country=${encodeURIComponent(countryId)}`);
  };

  // Función para navegar a la tienda mayorista con filtro de país
  const handleMayoristaCountryClick = (countryId: string) => {
    // Navegar a la tienda mayorista con el filtro de país aplicado
    router.push(`/mayorista?country=${encodeURIComponent(countryId)}`);
  };

  return (
    <section className="py-8 bg-white border-t border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Carrusel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Botón anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all duration-200 shadow-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all duration-200 shadow-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Contenedor del carrusel */}
          <div ref={sliderRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * itemWidth}%)`,
                width: `${totalItems * itemWidth}%`,
              }}
            >
              {countries.map((country, index) => (
                <div
                  key={country.id}
                  className="flex-shrink-0 px-2 py-2"
                  style={{ width: `${itemWidth}%` }}
                >
                  <button
                    onClick={() => handleCountryClick(country.id)}
                    className="hover:scale-110 transition-transform duration-300 focus:outline-none rounded-lg"
                    aria-label={`Ver cervezas de ${country.name}`}
                  >
                    {/* Solo la imagen de la bandera */}
                    <div className="aspect-square w-40 h-40 mx-auto p-2">
                      <img
                        src={country.flag}
                        alt={`Bandera de ${country.name}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    {/* Nombre del país */}
                    <p className="text-center mt-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200">
                      {country.name}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de paginación */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-gray-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir a la página ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
