"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  children: React.ReactNode[];
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}

export default function ProductCarousel({
  children,
  itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  className = "",
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.desktop || 3);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Hook para detectar el tamaño de pantalla
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) { // Cambio a 640px para coincidir con CountriesCarousel
        setCurrentItemsPerView(itemsPerView.mobile || 1);
      } else if (width < 1024) {
        setCurrentItemsPerView(itemsPerView.tablet || 2);
      } else {
        setCurrentItemsPerView(itemsPerView.desktop || 3);
      }
    };

    // Actualizar al montar
    updateItemsPerView();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  // Calcular el índice máximo basado en el número de elementos
  useEffect(() => {
    const totalItems = children.length;
    const max = Math.max(0, totalItems - currentItemsPerView);
    setMaxIndex(max);

    // Resetear índice si está fuera de rango
    if (currentIndex > max) {
      setCurrentIndex(0);
    }
  }, [children.length, currentItemsPerView, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className={`relative ${className}`}>
      {/* Botones de navegación - Solo mostrar en pantallas medianas y grandes */}
      <div className="hidden md:block">
        {/* Botón anterior */}
        {canGoPrevious && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Productos anteriores"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Botón siguiente */}
        {canGoNext && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Productos siguientes"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Contenedor del carrusel */}
      <div ref={carouselRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-1 sm:px-2"
              style={{ width: `${100 / currentItemsPerView}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de página */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-yellow-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Botones de navegación para móvil - Solo mostrar en pantallas pequeñas */}
      <div className="flex justify-center mt-4 space-x-4 md:hidden">
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Productos anteriores"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Productos siguientes"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
