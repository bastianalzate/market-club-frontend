"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ItemsPerViewResponsive = {
  mobile: number; // <640px
  tablet: number; // >=640px
  desktop: number; // >=1024px
};

interface ProductCarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number | ItemsPerViewResponsive;
  className?: string;
}

export default function ProductCarousel({
  children,
  itemsPerView = 4,
  className = "",
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [perView, setPerView] = useState<number>(
    typeof itemsPerView === "number" ? itemsPerView : itemsPerView.desktop
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Resolver items por vista de forma responsive
  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolvePerView = () => {
      if (typeof itemsPerView === "number") return itemsPerView;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const isTablet = window.matchMedia("(min-width: 640px)").matches;
      if (isDesktop) return itemsPerView.desktop;
      if (isTablet) return itemsPerView.tablet;
      return itemsPerView.mobile;
    };

    const update = () => {
      setPerView(resolvePerView());
      setIsMobile(window.matchMedia("(max-width: 639px)").matches);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [itemsPerView]);

  // Calcular el índice máximo basado en el número de elementos
  useEffect(() => {
    const totalItems = children.length;
    const max = Math.max(0, totalItems - perView);
    setMaxIndex(max);

    // Resetear índice si está fuera de rango
    if (currentIndex > max) {
      setCurrentIndex(0);
    }
  }, [children.length, perView, currentIndex]);

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
      {/* Botón anterior (solo desktop/tablet) */}
      {!isMobile && canGoPrevious && (
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Productos anteriores"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Contenedor del carrusel */}
      <div ref={carouselRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / perView)}%)`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                flex: `0 0 ${100 / perView}%`,
                paddingLeft: 8,
                paddingRight: 8,
                boxSizing: "border-box",
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Botón siguiente (solo desktop/tablet) */}
      {!isMobile && canGoNext && (
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Productos siguientes"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Indicadores de página (opcional) */}
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

      {/* Controles inferiores para mobile */}
      {isMobile && (
        <div className="flex items-center justify-center gap-6 mt-4 sm:hidden">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`p-2 rounded-full shadow ${
              canGoPrevious ? "bg-white" : "bg-gray-200 opacity-60"
            }`}
            aria-label="Productos anteriores"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`p-2 rounded-full shadow ${
              canGoNext ? "bg-white" : "bg-gray-200 opacity-60"
            }`}
            aria-label="Productos siguientes"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
